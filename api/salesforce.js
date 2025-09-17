import jsforce from 'jsforce';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit = null;

try {
  const hasUpstashConfig = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  if (hasUpstashConfig) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 h'),
    });
  } else {
    console.warn('Salesforce handler: Upstash credentials missing, disabling rate limiting.');
  }
} catch (error) {
  console.warn('Salesforce handler: Unable to initialize Upstash rate limiting.', error);
  ratelimit = null;
}

const allowedOrigins = [
  'https://debtconsultantsgroup.com',
  'https://dcg-chatbot-demo.vercel.app',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:3000'
];

function applyCorsHeaders(res, origin) {
  const allowOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

const bannedPatterns = [
  /ignore previous instructions/i,
  /system prompt/i,
  /api key/i,
  /unlimited/i,
  /jailbreak/i
];

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

function extractNameParts(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return { firstName: '', lastName: 'Website Lead' };
  }

  if (parts.length === 1) {
    return { firstName: '', lastName: parts[0] };
  }

  const [firstName, ...rest] = parts;
  return { firstName, lastName: rest.join(' ') };
}

function validateFields({ name, email, businessName, phone }) {
  const payload = { name, email, businessName, phone };
  const missing = ['name', 'email', 'businessName'].filter(field => {
    const value = payload[field];
    return !value || typeof value !== 'string' || !value.trim();
  });

  if (missing.length) {
    return `Missing or invalid fields: ${missing.join(', ')}`;
  }

  const fieldEntries = Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '');
  for (const [key, value] of fieldEntries) {
    if (typeof value !== 'string') {
      return `Invalid field type for ${key}`;
    }

    if (value.length > 250) {
      return `${key} exceeds maximum length`;
    }

    if (bannedPatterns.some(pattern => pattern.test(value))) {
      return `Invalid content detected in ${key}`;
    }
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Invalid email address';
  }

  if (phone && phone.replace(/[^0-9]/g, '').length < 7) {
    return 'Invalid phone number';
  }

  return null;
}

function ensureEnv() {
  const required = [
    'SALESFORCE_CONSUMER_KEY',
    'SALESFORCE_CONSUMER_SECRET',
    'SALESFORCE_USERNAME',
    'SALESFORCE_PASSWORD',
    'SALESFORCE_SECURITY_TOKEN',
    'SALESFORCE_LOGIN_URL'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length) {
    throw new Error(`Salesforce configuration missing: ${missing.join(', ')}`);
  }
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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const ipHeader = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(ipHeader)
    ? ipHeader[0]
    : (ipHeader || req.connection?.remoteAddress || 'unknown');
  const ip = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : 'unknown';
  let rateLimitResult = { success: true };

  if (ratelimit) {
    try {
      rateLimitResult = await ratelimit.limit(ip);
    } catch (error) {
      console.warn('Salesforce handler: Rate limit check failed', error);
      rateLimitResult = { success: true };
    }
  }

  if (ratelimit && !rateLimitResult.success) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: rateLimitResult.reset
    });
  }

  const { name, email, businessName, phone } = parseBody(req.body);
  const validationError = validateFields({ name, email, businessName, phone });

  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  try {
    ensureEnv();

    const { firstName, lastName } = extractNameParts(name);
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL,
      clientId: process.env.SALESFORCE_CONSUMER_KEY,
      clientSecret: process.env.SALESFORCE_CONSUMER_SECRET
    });

    await conn.login(
      process.env.SALESFORCE_USERNAME,
      `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`
    );

    const repQuery = await conn.query(
      "SELECT Id, Username FROM User WHERE Username LIKE '%@qrmca.com' AND IsActive = true"
    );

    const reps = repQuery.records || [];
    const chosenRep = reps.length
      ? reps[Math.floor(Math.random() * reps.length)]
      : null;

    const leadPayload = {
      LastName: lastName,
      Company: businessName.trim(),
      Email: email.trim(),
      Phone: phone?.trim() || undefined,
      LeadSource: 'Website Chatbot',
    };

    if (firstName) {
      leadPayload.FirstName = firstName;
    }

    if (chosenRep) {
      leadPayload.OwnerId = chosenRep.Id;
    }

    const leadResult = await conn.sobject('Lead').create(leadPayload);

    if (!leadResult.success) {
      const errorMessage = Array.isArray(leadResult.errors) && leadResult.errors.length
        ? leadResult.errors.join(', ')
        : 'Lead creation failed';
      throw new Error(errorMessage);
    }

    console.log({
      event: 'salesforce_lead_created',
      leadId: leadResult.id,
      ownerId: chosenRep ? chosenRep.Id : 'unassigned',
      timestamp: new Date().toISOString(),
      ip: typeof ip === 'string' ? `${ip.slice(0, 7)}***` : 'unknown',
    });

    return res.status(200).json({
      success: true,
      leadId: leadResult.id,
      message: 'Lead created successfully',
      rateLimitRemaining: rateLimitResult.remaining ?? null
    });
  } catch (error) {
    console.error('Salesforce Error:', error?.message || error);

    const fallback = {
      success: false,
      error: 'Unable to create lead at this time. Please try again later.',
      fallback: true
    };

    if (error?.message?.includes('configuration missing')) {
      fallback.error = 'Salesforce configuration error. Please contact support.';
    }

    return res.status(500).json(fallback);
  }
}
