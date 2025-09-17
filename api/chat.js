import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const allowedOrigins = [
  'https://debtconsultantsgroup.com',
  'https://dcg-chatbot-demo.vercel.app',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:3000'
];

let ratelimit = null;

try {
  const hasUpstashConfig = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );

  if (hasUpstashConfig) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 h'),
    });
  } else {
    console.warn('Chat handler: Upstash credentials missing, disabling rate limiting.');
  }
} catch (error) {
  console.warn('Chat handler: Unable to initialize Upstash rate limiting.', error);
  ratelimit = null;
}

function applyCorsHeaders(res, origin) {
  if (!res || typeof res.setHeader !== 'function') {
    return;
  }

  const allowOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
      console.warn('Chat handler: Unable to parse request body', error);
      return {};
    }
  }

  return body;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (origin && !allowedOrigins.includes(origin)) {
    applyCorsHeaders(res, origin);
    return res.status(403).json({ error: 'Forbidden' });
  }

  applyCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : (forwardedFor ? forwardedFor.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown');

  let rateLimitRemaining = null;

  if (ratelimit) {
    try {
      const result = await ratelimit.limit(ip);
      rateLimitRemaining = result.remaining ?? null;

      if (!result.success) {
        return res.status(429).json({
          error: 'Too many requests. Please try again later.',
          retryAfter: result.reset
        });
      }
    } catch (error) {
      console.warn('Chat handler: Rate limit check failed', error);
    }
  }

  const { message = '' } = parseBody(req.body);
  const trimmed = typeof message === 'string' ? message.trim() : '';

  if (!trimmed || trimmed.length > 500) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const bannedPatterns = [
    /ignore previous instructions/i,
    /system prompt/i,
    /api key/i,
    /unlimited/i,
    /jailbreak/i
  ];

  if (bannedPatterns.some(pattern => pattern.test(trimmed))) {
    return res.status(400).json({ error: 'Invalid input detected' });
  }

  const response = getFallbackResponse(trimmed);

  return res.status(200).json({
    response,
    fallback: true,
    rateLimitRemaining
  });
}

function getFallbackResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('qualify')) {
    return 'To see if you qualify for DCG debt relief, share your business contact details and a specialist will walk you through the next steps.';
  }

  if (lower.includes('save') || lower.includes('how much')) {
    return 'Most clients reduce their balances by 40-60%. Drop your contact info and we\'ll provide a personalized savings review.';
  }

  if (lower.includes('help') || lower.includes('support')) {
    return 'We can pause collections, negotiate down balances, and protect your business fast. Let a DCG specialist reach out with options.';
  }

  return 'Thanks for reaching out to DCG! Share the best number and email, and our debt relief team will follow up with a custom plan.';
}

export const config = {
  api: {
    bodyParser: true,
  },
};
