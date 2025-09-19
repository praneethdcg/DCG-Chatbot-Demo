import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Readable } from 'stream';

let ratelimit = null;

try {
  const hasUpstashConfig = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  if (hasUpstashConfig) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 h'),
    });
  } else {
    console.warn('MIAW handler: Upstash credentials missing, disabling rate limiting.');
  }
} catch (error) {
  console.warn('MIAW handler: Unable to initialize Upstash rate limiting.', error);
  ratelimit = null;
}

const allowedOrigins = [
  'https://debtconsultantsgroup.com',
  'https://dcg-chatbot-demo.vercel.app',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:3000'
];

const DEFAULT_CAPABILITIES_VERSION = process.env.SALESFORCE_CAPABILITIES_VERSION || '60';
const DEFAULT_PLATFORM = process.env.SALESFORCE_MIAW_PLATFORM || 'Web';

function applyCorsHeaders(res, origin) {
  const allowOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Retry-After');
  res.setHeader('Vary', 'Origin');
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }

  return body;
}

function getQueryParam(req, key) {
  const value = req.query?.[key];
  return Array.isArray(value) ? value[0] : value;
}

function maskValue(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  if (value.length <= 6) {
    return `${value.slice(0, 2)}***`;
  }

  return `${value.slice(0, 4)}***${value.slice(-2)}`;
}

function ensureEnv() {
  const required = [
    'SALESFORCE_CONSUMER_KEY',
    'SALESFORCE_CONSUMER_SECRET',
    'SALESFORCE_SCRT_URL',
    'SALESFORCE_ORG_ID',
    'SALESFORCE_ES_DEVELOPER_NAME'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length) {
    throw new Error(`MIAW configuration missing: ${missing.join(', ')}`);
  }
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let json = null;

  if (text) {
    try {
      json = JSON.parse(text);
    } catch (error) {
      json = { raw: text };
    }
  }

  if (!response.ok) {
    const message = json?.message || json?.error || response.statusText || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.details = json;
    throw error;
  }

  return json || {};
}

function getBaseScrtUrl() {
  const base = process.env.SALESFORCE_SCRT_URL;
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function toNodeReadable(stream) {
  if (!stream) {
    return null;
  }

  if (typeof stream.getReader === 'function') {
    return Readable.fromWeb(stream);
  }

  return stream;
}

function getClientIp(req) {
  const ipHeader = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(ipHeader)
    ? ipHeader[0]
    : (ipHeader || req.connection?.remoteAddress || 'unknown');
  return typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : 'unknown';
}

async function handleCreateSession(body, res, rateLimitRemaining) {
  ensureEnv();

  const {
    context = {},
    capabilitiesVersion = DEFAULT_CAPABILITIES_VERSION,
    platform = DEFAULT_PLATFORM
  } = body;

  if (context && typeof context !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid context payload' });
  }

  const scrtUrl = getBaseScrtUrl();
  const authUrl = `${scrtUrl}/iamessage/api/v2/authorization/unauthenticated/access-token`;
  const basicAuth = Buffer.from(`${process.env.SALESFORCE_CONSUMER_KEY}:${process.env.SALESFORCE_CONSUMER_SECRET}`).toString('base64');

  try {
    const data = await fetchJson(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
        'Sforce-Call-Options': 'client=service-cloud-demo'
      },
      body: JSON.stringify({
        orgId: process.env.SALESFORCE_ORG_ID,
        esDeveloperName: process.env.SALESFORCE_ES_DEVELOPER_NAME,
        capabilitiesVersion,
        platform
        // Note: context is not included for unauthenticated access token
      })
    });

    console.log({
      event: 'miaw_session_created',
      capabilitiesVersion,
      platform,
      timestamp: new Date().toISOString(),
      accessToken: maskValue(data?.accessToken)
    });

    const expiresIn = typeof data?.expiresIn === 'number' ? data.expiresIn : null;
    const issuedAt = data?.issuedAt ?? null;

    return res.status(200).json({
      success: true,
      data,
      expiresIn,
      issuedAt,
      rateLimitRemaining: rateLimitRemaining ?? null
    });
  } catch (error) {
    console.error('MIAW createSession error:', error?.message || error);

    const status = error?.status || 502;
    const payload = {
      success: false,
      error: 'Unable to create a Salesforce messaging session. Please try again shortly.'
    };

    if (status === 401) {
      payload.error = 'Salesforce rejected the client credentials. Obtain a new session and try again.';
    }

    if (error?.details) {
      payload.details = error.details;
    }

    return res.status(status).json(payload);
  }
}

async function handleCreateConversation(body, res, rateLimitRemaining) {
  ensureEnv();

  const { accessToken, metadata, channelMetadata } = body;

  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing accessToken' });
  }

  if (metadata && typeof metadata !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid metadata payload' });
  }

  if (channelMetadata && typeof channelMetadata !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid channelMetadata payload' });
  }

  const scrtUrl = getBaseScrtUrl();
  const createUrl = `${scrtUrl}/iamessage/api/v2/conversations`;

  const payload = {
    esDeveloperName: process.env.SALESFORCE_ES_DEVELOPER_NAME
  };

  if (metadata) {
    payload.metadata = metadata;
  }

  if (channelMetadata) {
    payload.channelMetadata = channelMetadata;
  }

  try {
    const data = await fetchJson(createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'OrgId': process.env.SALESFORCE_ORG_ID
      },
      body: JSON.stringify(payload)
    });

    const upstreamConversationId = data?.id || data?.conversationId || null;

    console.log({
      event: 'miaw_conversation_created',
      timestamp: new Date().toISOString(),
      conversationId: upstreamConversationId ? maskValue(upstreamConversationId) : null
    });

    return res.status(200).json({
      success: true,
      data,
      rateLimitRemaining: rateLimitRemaining ?? null
    });
  } catch (error) {
    console.error('MIAW createConversation error:', error?.message || error);
    console.error('Error details:', {
      status: error?.status,
      details: error?.details,
      esDeveloperName: process.env.SALESFORCE_ES_DEVELOPER_NAME,
      url: createUrl
    });

    const status = error?.status || 502;
    const payloadResponse = {
      success: false,
      error: 'Failed to create conversation with Salesforce. Please retry.'
    };

    if (error?.status === 401) {
      payloadResponse.error = 'Salesforce rejected the access token. Obtain a new session and try again.';
    }

    if (error?.details) {
      payloadResponse.details = error.details;
    }

    return res.status(status).json(payloadResponse);
  }
}

async function handleSendMessage(body, res, rateLimitRemaining) {
  ensureEnv();

  const {
    accessToken,
    conversationId,
    message,
    messageType = 'Text',
    clientMessageId,
    attachments,
    metadata,
    channelMetadata
  } = body;

  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing accessToken' });
  }

  if (!conversationId || typeof conversationId !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing conversationId' });
  }

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing message content' });
  }

  const allowedTypes = new Map([
    ['text', 'Text'],
    ['file', 'File']
  ]);

  const proposedType = typeof messageType === 'string' ? messageType.trim() : '';
  const normalizedType = proposedType.toLowerCase();
  const resolvedMessageType = allowedTypes.get(normalizedType) || 'Text';

  if (!allowedTypes.has(normalizedType) && proposedType) {
    console.warn('MIAW sendMessage: Unsupported message type, falling back to Text', {
      requestedType: proposedType
    });
  }

  const scrtUrl = getBaseScrtUrl();
  const sendUrl = `${scrtUrl}/iamessage/api/v2/conversations/${encodeURIComponent(conversationId)}/messages`;

  const payload = {
    message: {
      text: message,
      type: resolvedMessageType
    }
  };

  if (clientMessageId) {
    payload.clientMessageId = clientMessageId;
  }

  if (attachments) {
    payload.attachments = attachments;
  }

  if (metadata) {
    payload.metadata = metadata;
  }

  if (channelMetadata) {
    payload.channelMetadata = channelMetadata;
  }

  try {
    const data = await fetchJson(sendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'OrgId': process.env.SALESFORCE_ORG_ID,
      },
      body: JSON.stringify(payload)
    });

    console.log({
      event: 'miaw_message_sent',
      conversationId: maskValue(conversationId),
      timestamp: new Date().toISOString(),
      clientMessageId: clientMessageId ? maskValue(clientMessageId) : null
    });

    return res.status(200).json({
      success: true,
      data,
      rateLimitRemaining: rateLimitRemaining ?? null
    });
  } catch (error) {
    console.error('MIAW sendMessage error:', error?.message || error);

    const status = error?.status || 502;
    const payloadResponse = {
      success: false,
      error: 'Failed to deliver message to Salesforce. Please retry.'
    };

    if (status === 401) {
      payloadResponse.error = 'Salesforce rejected the access token. Obtain a new session and try again.';
    }

    if (error?.details) {
      payloadResponse.details = error.details;
    }

    return res.status(status).json(payloadResponse);
  }
}

async function handleSse(req, res) {
  ensureEnv();

  const accessToken = getQueryParam(req, 'accessToken') || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  // Accept legacy routingId while standardizing on routingKey for Salesforce SSE endpoint.
  const routingKey = getQueryParam(req, 'routingKey') || getQueryParam(req, 'routingId');
  const retry = getQueryParam(req, 'retry');

  if (!accessToken) {
    return res.status(400).json({ success: false, error: 'Missing accessToken' });
  }

  const scrtUrl = getBaseScrtUrl();
  const sseUrl = new URL(`${scrtUrl}/eventrouter/v1/sse`);

  if (routingKey) {
    sseUrl.searchParams.set('routingKey', routingKey);
  }

  if (retry) {
    sseUrl.searchParams.set('retry', retry);
  }

  let upstream;

  try {
    upstream = await fetch(sseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Authorization': `Bearer ${accessToken}`,
        'OrgId': process.env.SALESFORCE_ORG_ID,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('MIAW SSE connection error:', error?.message || error);
    return res.status(502).json({ success: false, error: 'Unable to connect to Salesforce event stream.' });
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    let details = null;

    if (text) {
      try {
        details = JSON.parse(text);
      } catch (error) {
        details = { raw: text };
      }
    }

    return res.status(upstream.status).json({
      success: false,
      error: 'Salesforce SSE endpoint rejected the request.',
      details
    });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Transfer-Encoding': 'chunked',
    'X-Accel-Buffering': 'no'
  });

  const stream = toNodeReadable(upstream.body);

  if (!stream) {
    res.end();
    return;
  }

  const closeStream = () => {
    try {
      stream.destroy();
    } catch (error) {
      // ignore
    }
  };

  stream.on('data', chunk => {
    res.write(chunk);
  });

  stream.on('end', () => {
    res.end();
  });

  stream.on('error', error => {
    console.error('MIAW SSE stream error:', error?.message || error);
    if (!res.headersSent) {
      res.write('event: error\n');
      res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
    }
    res.end();
  });

  req.on('close', () => {
    console.log({
      event: 'miaw_sse_client_disconnected',
      timestamp: new Date().toISOString()
    });
    closeStream();
  });

  console.log({
    event: 'miaw_sse_connected',
    routingKey: routingKey ? maskValue(routingKey) : null,
    timestamp: new Date().toISOString()
  });
}

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (origin && !allowedOrigins.includes(origin)) {
    applyCorsHeaders(res, origin);
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  applyCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const action = getQueryParam(req, 'action');

  console.log('MIAW API Request:', {
    action,
    method: req.method,
    hasBody: !!req.body,
    bodyType: typeof req.body,
    timestamp: new Date().toISOString()
  });

  if (!action) {
    return res.status(400).json({ success: false, error: 'Missing action parameter' });
  }

  if (action === 'sse' && req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'SSE action only supports GET' });
  }

  if ((action === 'createSession' || action === 'sendMessage' || action === 'createConversation') && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: `${action} action only supports POST` });
  }

  const ip = getClientIp(req);
  let rateLimitResult = { success: true };

  if (ratelimit && action !== 'sse') {
    try {
      rateLimitResult = await ratelimit.limit(`miaw:${ip}:${action}`);
    } catch (error) {
      console.warn('MIAW handler: Rate limit check failed', error);
      rateLimitResult = { success: true };
    }
  }

  if (ratelimit && action !== 'sse' && !rateLimitResult.success) {
    const resetSeconds = Number(rateLimitResult.reset);
    let retryAfterSeconds = 60;

    if (Number.isFinite(resetSeconds)) {
      const diffSeconds = Math.max(1, Math.ceil(((resetSeconds * 1000) - Date.now()) / 1000));
      retryAfterSeconds = diffSeconds > 0 ? diffSeconds : 1;
    }

    res.setHeader('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: retryAfterSeconds
    });
  }

  const body = req.method === 'POST' ? parseBody(req.body) : {};

  if (action === 'createSession') {
    return handleCreateSession(body, res, rateLimitResult.remaining);
  }

  if (action === 'sendMessage') {
    return handleSendMessage(body, res, rateLimitResult.remaining);
  }

  if (action === 'createConversation') {
    return handleCreateConversation(body, res, rateLimitResult.remaining);
  }

  if (action === 'sse') {
    return handleSse(req, res);
  }

  return res.status(400).json({ success: false, error: `Unsupported action: ${action}` });
}
