import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Readable } from 'stream';

let ratelimit = null;

// Generate unique request IDs for tracking
function generateRequestId() {
  // Simple ID generation compatible with Vercel runtime
  return `req_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

// Sanitize headers for logging (remove sensitive data)
function sanitizeHeaders(headers) {
  const sanitized = {};
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];

  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveHeaders.includes(lowerKey)) {
      sanitized[key] = maskValue(Array.isArray(value) ? value[0] : value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Validate environment variable format and constraints
function validateEnvironmentVariables() {
  const validationResults = {
    valid: true,
    errors: [],
    warnings: [],
    variables: {}
  };

  // Check required variables
  const required = [
    { key: 'SALESFORCE_CONSUMER_KEY', minLength: 10, pattern: /^[a-zA-Z0-9._]+$/ },
    { key: 'SALESFORCE_CONSUMER_SECRET', minLength: 20 },
    { key: 'SALESFORCE_SCRT_URL', pattern: /^https?:\/\/.+/, type: 'url' },
    { key: 'SALESFORCE_ORG_ID', pattern: /^00D[a-zA-Z0-9]+$/, minLength: 14 },
    { key: 'SALESFORCE_ES_DEVELOPER_NAME', minLength: 1 }
  ];

  for (const config of required) {
    const value = process.env[config.key];

    if (!value) {
      validationResults.valid = false;
      validationResults.errors.push(`${config.key} is missing`);
      validationResults.variables[config.key] = { status: 'missing' };
      continue;
    }

    validationResults.variables[config.key] = {
      status: 'present',
      masked: maskValue(value),
      length: value.length
    };

    // Validate URL format
    if (config.type === 'url' || config.pattern?.source.includes('https')) {
      try {
        new URL(value);
        validationResults.variables[config.key].validUrl = true;
      } catch {
        validationResults.errors.push(`${config.key} is not a valid URL: ${maskValue(value)}`);
        validationResults.valid = false;
        validationResults.variables[config.key].validUrl = false;
      }
    }

    // Validate pattern
    if (config.pattern && !config.pattern.test(value)) {
      validationResults.errors.push(`${config.key} does not match expected format: ${maskValue(value)}`);
      validationResults.valid = false;
    }

    // Validate length
    if (config.length && value.length !== config.length) {
      validationResults.errors.push(`${config.key} should be exactly ${config.length} characters, got ${value.length}`);
      validationResults.valid = false;
    }

    // Validate minimum length
    if (config.minLength && value.length < config.minLength) {
      validationResults.errors.push(`${config.key} should be at least ${config.minLength} characters, got ${value.length}`);
      validationResults.valid = false;
    }
  }

  // Check optional variables
  const optional = [
    'SALESFORCE_CAPABILITIES_VERSION',
    'SALESFORCE_MIAW_PLATFORM',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN'
  ];

  for (const key of optional) {
    const value = process.env[key];
    if (value) {
      validationResults.variables[key] = {
        status: 'present',
        masked: maskValue(value),
        length: value.length
      };
    } else {
      validationResults.variables[key] = { status: 'not set' };
      if (key.startsWith('UPSTASH')) {
        validationResults.warnings.push(`${key} not set - rate limiting disabled`);
      }
    }
  }

  return validationResults;
}

// Log environment validation at startup
const startupValidation = validateEnvironmentVariables();
console.log('MIAW API Handler Startup:', {
  event: 'startup_validation',
  timestamp: new Date().toISOString(),
  environment: {
    valid: startupValidation.valid,
    errors: startupValidation.errors,
    warnings: startupValidation.warnings,
    variables: startupValidation.variables
  },
  nodeVersion: process.version,
  platform: process.platform
});

if (!startupValidation.valid) {
  console.error('CRITICAL: Environment validation failed at startup', {
    errors: startupValidation.errors,
    suggestion: 'Check your environment variables in Vercel dashboard or .env file'
  });
}

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
// GitHub integration reconnection test: 2025-01-20 18:41

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

function ensureEnv(requestId) {
  const validation = validateEnvironmentVariables();

  if (!validation.valid) {
    console.error(`[${requestId}] Environment validation failed:`, {
      errors: validation.errors,
      variables: validation.variables,
      timestamp: new Date().toISOString()
    });

    const error = new Error(`MIAW configuration invalid`);
    error.validation = validation;
    throw error;
  }

  return validation;
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

async function handleCreateSession(body, res, rateLimitRemaining, requestId) {
  const envValidation = ensureEnv(requestId);

  console.log(`[${requestId}] Creating session:`, {
    event: 'create_session_start',
    timestamp: new Date().toISOString(),
    envValid: envValidation.valid,
    hasContext: !!body.context,
    capabilitiesVersion: body.capabilitiesVersion || DEFAULT_CAPABILITIES_VERSION,
    platform: body.platform || DEFAULT_PLATFORM
  });

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

    console.log(`[${requestId}] Session created successfully:`, {
      event: 'miaw_session_created',
      requestId,
      capabilitiesVersion,
      platform,
      timestamp: new Date().toISOString(),
      accessToken: maskValue(data?.accessToken),
      expiresIn: data?.expiresIn,
      responseTime: 0
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
    console.error(`[${requestId}] MIAW createSession error:`, {
      message: error?.message || error,
      status: error?.status,
      details: error?.details,
      timestamp: new Date().toISOString(),
      requestDuration: 0
    });

    const status = error?.status || 502;
    const payload = {
      success: false,
      error: 'Unable to create a Salesforce messaging session. Please try again shortly.',
      requestId,
      diagnostics: {
        timestamp: new Date().toISOString(),
        environmentValid: !error.validation || error.validation.valid,
        scrtUrl: maskValue(process.env.SALESFORCE_SCRT_URL),
        orgId: maskValue(process.env.SALESFORCE_ORG_ID),
        errorType: error.name || 'Unknown',
        suggestion: status === 401
          ? 'Check SALESFORCE_CONSUMER_KEY and SALESFORCE_CONSUMER_SECRET in environment'
          : status >= 500
          ? 'Salesforce service may be temporarily unavailable'
          : 'Verify all Salesforce configuration settings'
      }
    };

    if (status === 401) {
      payload.error = 'Salesforce rejected the client credentials. Obtain a new session and try again.';
    }

    if (error?.details) {
      payload.details = error.details;
    }

    if (error?.validation) {
      payload.diagnostics.validationErrors = error.validation.errors;
    }

    return res.status(status).json(payload);
  }
}

async function handleCreateConversation(body, res, rateLimitRemaining, requestId) {
  const envValidation = ensureEnv(requestId);

  console.log(`[${requestId}] Creating conversation:`, {
    event: 'create_conversation_start',
    timestamp: new Date().toISOString(),
    envValid: envValidation.valid,
    hasMetadata: !!body.metadata,
    hasChannelMetadata: !!body.channelMetadata
  });

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
    esDeveloperName: process.env.SALESFORCE_ES_DEVELOPER_NAME,
    // Add orgId to the payload as well
    orgId: process.env.SALESFORCE_ORG_ID
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

    console.log(`[${requestId}] Conversation created successfully:`, {
      event: 'miaw_conversation_created',
      requestId,
      timestamp: new Date().toISOString(),
      conversationId: upstreamConversationId ? maskValue(upstreamConversationId) : null,
      responseTime: 0
    });

    return res.status(200).json({
      success: true,
      data,
      rateLimitRemaining: rateLimitRemaining ?? null
    });
  } catch (error) {
    console.error(`[${requestId}] MIAW createConversation error:`, {
      message: error?.message || error,
      status: error?.status,
      details: error?.details,
      esDeveloperName: maskValue(process.env.SALESFORCE_ES_DEVELOPER_NAME),
      url: createUrl,
      timestamp: new Date().toISOString(),
      requestDuration: 0
    });

    const status = error?.status || 502;

    // Handle 404 - conversation API not available, use session-based approach
    if (status === 404) {
      console.log(`[${requestId}] Conversation API not available, using session-based approach`);

      // Parse the JWT token to get session information
      const tokenParts = accessToken.split('.');
      let tokenPayload = {};
      try {
        tokenPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      } catch (e) {
        console.error('Failed to parse JWT token');
      }

      // Create a mock conversation response using session data
      const sessionBasedResponse = {
        conversationId: tokenPayload.clientSessionId || `session_${Date.now()}`,
        routingKey: tokenPayload.evtKey || tokenPayload.clientSessionId || `routing_${Date.now()}`,
        conversationSupported: false,
        sessionBased: true
      };

      return res.status(200).json({
        success: true,
        data: sessionBasedResponse,
        rateLimitRemaining: rateLimitRemaining ?? null
      });
    }

    const payloadResponse = {
      success: false,
      error: 'Failed to create conversation with Salesforce. Please retry.',
      requestId,
      diagnostics: {
        timestamp: new Date().toISOString(),
        environmentValid: !error.validation || error.validation.valid,
        suggestion: status === 401
          ? 'Access token may be expired or invalid'
          : 'Check conversation endpoint configuration'
      }
    };

    if (error?.status === 401) {
      payloadResponse.error = 'Salesforce rejected the access token. Obtain a new session and try again.';
    }

    if (error?.details) {
      payloadResponse.details = error.details;
    }

    if (error?.validation) {
      payloadResponse.diagnostics.validationErrors = error.validation.errors;
    }

    return res.status(status).json(payloadResponse);
  }
}

async function handleSendMessage(body, res, rateLimitRemaining, requestId) {
  const envValidation = ensureEnv(requestId);

  console.log(`[${requestId}] Sending message:`, {
    event: 'send_message_start',
    timestamp: new Date().toISOString(),
    envValid: envValidation.valid,
    messageLength: body.message?.length,
    messageType: body.messageType || 'Text',
    hasAttachments: !!body.attachments
  });

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

    console.log(`[${requestId}] Message sent successfully:`, {
      event: 'miaw_message_sent',
      requestId,
      conversationId: maskValue(conversationId),
      timestamp: new Date().toISOString(),
      clientMessageId: clientMessageId ? maskValue(clientMessageId) : null,
      messageType: resolvedMessageType,
      responseTime: 0
    });

    return res.status(200).json({
      success: true,
      data,
      rateLimitRemaining: rateLimitRemaining ?? null
    });
  } catch (error) {
    console.error(`[${requestId}] MIAW sendMessage error:`, {
      message: error?.message || error,
      status: error?.status,
      details: error?.details,
      conversationId: maskValue(conversationId),
      timestamp: new Date().toISOString(),
      requestDuration: 0
    });

    const status = error?.status || 502;
    const payloadResponse = {
      success: false,
      error: 'Failed to deliver message to Salesforce. Please retry.',
      requestId,
      diagnostics: {
        timestamp: new Date().toISOString(),
        environmentValid: !error.validation || error.validation.valid,
        conversationId: maskValue(conversationId),
        suggestion: status === 401
          ? 'Access token may be expired or invalid'
          : status === 404
          ? 'Conversation may not exist or has expired'
          : 'Check message payload and Salesforce service status'
      }
    };

    if (status === 401) {
      payloadResponse.error = 'Salesforce rejected the access token. Obtain a new session and try again.';
    }

    if (error?.details) {
      payloadResponse.details = error.details;
    }

    if (error?.validation) {
      payloadResponse.diagnostics.validationErrors = error.validation.errors;
    }

    return res.status(status).json(payloadResponse);
  }
}

async function handleSse(req, res, requestId) {
  const envValidation = ensureEnv(requestId);

  console.log(`[${requestId}] SSE connection request:`, {
    event: 'sse_connection_start',
    timestamp: new Date().toISOString(),
    envValid: envValidation.valid,
    hasRoutingKey: !!getQueryParam(req, 'routingKey') || !!getQueryParam(req, 'routingId'),
    hasRetry: !!getQueryParam(req, 'retry')
  });

  const accessToken = getQueryParam(req, 'accessToken') || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  // Accept legacy routingId while standardizing on routingKey for Salesforce SSE endpoint.
  const routingKey = getQueryParam(req, 'routingKey') || getQueryParam(req, 'routingId');
  const retry = getQueryParam(req, 'retry');

  if (!accessToken) {
    return res.status(400).json({ success: false, error: 'Missing accessToken' });
  }

  const scrtUrl = getBaseScrtUrl();
  const sseUrl = new URL(`${scrtUrl}/eventrouter/v1/sse`);

  // Note: According to Salesforce docs, routingKey should be passed as Last-Event-Id header
  // not as a query parameter

  let upstream;

  try {
    const headers = {
      'Accept': 'text/event-stream',
      'Authorization': `Bearer ${accessToken}`,
      'Cache-Control': 'no-cache',
      // Add X-Org-Id header as required by SSE endpoint
      'X-Org-Id': process.env.SALESFORCE_ORG_ID
    };

    // Add Last-Event-Id header if routingKey is provided
    // NOTE: Commenting out for now as it's causing 400 errors
    // The lastEventId might not be the correct value for Last-Event-Id header
    // if (routingKey) {
    //   headers['Last-Event-Id'] = routingKey;
    // }

    console.log(`[${requestId}] Connecting to SSE with headers:`, {
      hasLastEventId: !!routingKey,
      lastEventId: routingKey ? maskValue(routingKey) : null,
      url: sseUrl.toString(),
      orgId: maskValue(process.env.SALESFORCE_ORG_ID)
    });

    upstream = await fetch(sseUrl, {
      method: 'GET',
      headers
    });
  } catch (error) {
    console.error(`[${requestId}] MIAW SSE connection error:`, {
      message: error?.message || error,
      timestamp: new Date().toISOString(),
      sseUrl: sseUrl.toString(),
      requestDuration: 0
    });
    return res.status(502).json({
      success: false,
      error: 'Unable to connect to Salesforce event stream.',
      requestId,
      diagnostics: {
        timestamp: new Date().toISOString(),
        suggestion: 'Check Salesforce SSE endpoint availability and access token validity'
      }
    });
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

    console.error(`[${requestId}] SSE upstream error:`, {
      status: upstream.status,
      statusText: upstream.statusText,
      details,
      url: sseUrl.toString(),
      hasLastEventId: !!routingKey,
      lastEventId: routingKey ? maskValue(routingKey) : null
    });

    return res.status(upstream.status).json({
      success: false,
      error: 'Salesforce SSE endpoint rejected the request.',
      details,
      requestId,
      diagnostics: {
        timestamp: new Date().toISOString(),
        upstreamStatus: upstream.status,
        lastEventIdProvided: !!routingKey,
        url: sseUrl.toString(),
        suggestion: upstream.status === 401
          ? 'Access token is invalid or expired'
          : upstream.status === 403
          ? 'Check OrgId and permissions'
          : upstream.status === 400
          ? 'Check Last-Event-Id format or SSE configuration'
          : 'Verify SSE endpoint configuration'
      }
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
    console.error(`[${requestId}] MIAW SSE stream error:`, {
      message: error?.message || error,
      timestamp: new Date().toISOString(),
      routingKey: routingKey ? maskValue(routingKey) : null
    });
    if (!res.headersSent) {
      res.write('event: error\n');
      res.write(`data: ${JSON.stringify({ error: 'Stream error', requestId })}\n\n`);
    }
    res.end();
  });

  req.on('close', () => {
    console.log(`[${requestId}] SSE client disconnected:`, {
      event: 'miaw_sse_client_disconnected',
      requestId,
      timestamp: new Date().toISOString(),
      duration: 0
    });
    closeStream();
  });

  console.log(`[${requestId}] SSE connected successfully:`, {
    event: 'miaw_sse_connected',
    requestId,
    routingKey: routingKey ? maskValue(routingKey) : null,
    timestamp: new Date().toISOString(),
    connectionTime: 0
  });
}

export default async function handler(req, res) {
  const requestId = generateRequestId();
  const origin = req.headers.origin;

  // Comprehensive request logging
  console.log(`[${requestId}] Incoming request:`, {
    event: 'request_received',
    requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    query: req.query,
    headers: sanitizeHeaders(req.headers),
    origin,
    clientIp: getClientIp(req),
    bodySize: req.body ? JSON.stringify(req.body).length : 0,
    bodyType: typeof req.body,
    hasBody: !!req.body,
    vercelRegion: process.env.VERCEL_REGION,
    functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION
  });

  if (origin && !allowedOrigins.includes(origin)) {
    console.log(`[${requestId}] CORS rejection:`, {
      event: 'cors_forbidden',
      requestId,
      origin,
      allowedOrigins,
      timestamp: new Date().toISOString()
    });
    applyCorsHeaders(res, origin);
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      requestId,
      diagnostics: {
        origin,
        allowedOrigins,
        suggestion: 'Add origin to allowedOrigins list if this should be permitted'
      }
    });
  }

  applyCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] OPTIONS preflight:`, {
      event: 'preflight_request',
      requestId,
      origin,
      timestamp: new Date().toISOString()
    });
    return res.status(204).end();
  }

  const action = getQueryParam(req, 'action');

  console.log(`[${requestId}] Action requested:`, {
    event: 'action_processing',
    requestId,
    action,
    method: req.method,
    expectedMethod: action === 'sse' ? 'GET' : ['createSession', 'sendMessage', 'createConversation'].includes(action) ? 'POST' : 'ANY',
    hasBody: !!req.body,
    bodyKeys: req.body ? Object.keys(req.body) : [],
    timestamp: new Date().toISOString()
  });

  if (!action) {
    console.log(`[${requestId}] Missing action parameter:`, {
      event: 'missing_action',
      requestId,
      url: req.url,
      query: req.query,
      timestamp: new Date().toISOString()
    });
    return res.status(400).json({
      success: false,
      error: 'Missing action parameter',
      requestId,
      diagnostics: {
        receivedUrl: req.url,
        receivedQuery: req.query,
        suggestion: 'Include ?action=createSession, ?action=sendMessage, ?action=createConversation, or ?action=sse in the URL'
      }
    });
  }

  if (action === 'sse' && req.method !== 'GET') {
    console.log(`[${requestId}] Method mismatch for SSE:`, {
      event: 'method_mismatch',
      requestId,
      action: 'sse',
      expectedMethod: 'GET',
      receivedMethod: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    });
    return res.status(405).json({
      success: false,
      error: 'SSE action only supports GET',
      requestId,
      diagnostics: {
        action: 'sse',
        expectedMethod: 'GET',
        receivedMethod: req.method,
        receivedUrl: req.url,
        suggestion: 'Use GET method for SSE endpoint'
      }
    });
  }

  if ((action === 'createSession' || action === 'sendMessage' || action === 'createConversation') && req.method !== 'POST') {
    console.log(`[${requestId}] Method mismatch for ${action}:`, {
      event: 'method_mismatch',
      requestId,
      action,
      expectedMethod: 'POST',
      receivedMethod: req.method,
      url: req.url,
      headers: sanitizeHeaders(req.headers),
      timestamp: new Date().toISOString(),
      routingInfo: {
        vercelUrl: req.headers['x-vercel-deployment-url'],
        forwarded: req.headers['x-forwarded-proto'],
        host: req.headers.host
      }
    });
    return res.status(405).json({
      success: false,
      error: `${action} action only supports POST`,
      requestId,
      diagnostics: {
        action,
        expectedMethod: 'POST',
        receivedMethod: req.method,
        receivedUrl: req.url,
        receivedHeaders: {
          'content-type': req.headers['content-type'],
          'x-vercel-deployment-url': req.headers['x-vercel-deployment-url'],
          'host': req.headers.host
        },
        suggestion: `Use POST method for ${action} action. Check if your request is being redirected or proxied incorrectly.`,
        possibleCauses: [
          'Request method is incorrect in frontend code',
          'Vercel routing configuration may be modifying the request',
          'Proxy or CDN may be altering the request method',
          'Browser may be sending preflight OPTIONS request'
        ]
      }
    });
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

    console.log(`[${requestId}] Rate limit exceeded:`, {
      event: 'rate_limit_exceeded',
      requestId,
      action,
      clientIp: ip,
      retryAfter: retryAfterSeconds,
      timestamp: new Date().toISOString()
    });

    res.setHeader('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: retryAfterSeconds,
      requestId
    });

  }

  const body = req.method === 'POST' ? parseBody(req.body) : {};

  console.log(`[${requestId}] Processing action:`, {
    event: 'action_dispatch',
    requestId,
    action,
    method: req.method,
    bodyKeys: Object.keys(body),
    timestamp: new Date().toISOString()
  });

  if (action === 'createSession') {
    return handleCreateSession(body, res, rateLimitResult.remaining, requestId);
  }

  if (action === 'sendMessage') {
    return handleSendMessage(body, res, rateLimitResult.remaining, requestId);
  }

  if (action === 'createConversation') {
    return handleCreateConversation(body, res, rateLimitResult.remaining, requestId);
  }

  if (action === 'sse') {
    return handleSse(req, res, requestId);
  }

  console.log(`[${requestId}] Unsupported action:`, {
    event: 'unsupported_action',
    requestId,
    action,
    validActions: ['createSession', 'sendMessage', 'createConversation', 'sse'],
    timestamp: new Date().toISOString()
  });

  return res.status(400).json({
    success: false,
    error: `Unsupported action: ${action}`,
    requestId,
    diagnostics: {
      receivedAction: action,
      validActions: ['createSession', 'sendMessage', 'createConversation', 'sse'],
      suggestion: 'Use one of the valid actions: createSession, sendMessage, createConversation, or sse'
    }
  });
}
