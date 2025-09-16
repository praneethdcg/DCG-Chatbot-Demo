// Vercel Edge Function with Multiple Security Layers
import { OpenAI } from 'openai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour per IP
});

// Initialize OpenAI with spending safeguards
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cost tracking
let monthlySpend = 0;
const MONTHLY_LIMIT = 20; // $20 hard limit
const COST_PER_REQUEST = 0.002; // Approximate

export default async function handler(req, res) {
  // LAYER 1: Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // LAYER 2: Origin validation (only your domain)
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://debtconsultantsgroup.com',
    'http://localhost:8000',
    'https://your-vercel-domain.vercel.app'
  ];

  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // LAYER 3: Rate limiting by IP
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: reset
    });
  }

  // LAYER 4: Monthly spend check
  if (monthlySpend >= MONTHLY_LIMIT) {
    return res.status(503).json({
      error: 'Monthly limit reached. The chat service will resume next month.',
      fallback: true // Signal to use rule-based fallback
    });
  }

  // LAYER 5: Input validation
  const { message, context, sessionId } = req.body;

  if (!message || typeof message !== 'string' || message.length > 500) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  // LAYER 6: Content filtering (block harmful inputs)
  const bannedPatterns = [
    /ignore previous instructions/i,
    /system prompt/i,
    /api key/i,
    /unlimited/i,
    /jailbreak/i
  ];

  if (bannedPatterns.some(pattern => pattern.test(message))) {
    return res.status(400).json({ error: 'Invalid input detected' });
  }

  try {
    // LAYER 7: Use cheaper model with token limits
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Cheaper than GPT-4
      messages: [
        {
          role: "system",
          content: `You are DCG's debt relief assistant. Be helpful but concise.

          IMPORTANT RULES:
          1. Keep responses under 100 words
          2. Always stay on topic (debt relief)
          3. Qualify leads at $25,000+ debt
          4. Direct to human agent for complex questions
          5. NEVER discuss anything except debt relief

          Context: ${JSON.stringify(context || {})}`
        },
        {
          role: "user",
          content: message.substring(0, 200) // Truncate long inputs
        }
      ],
      max_tokens: 150, // Hard limit on response length
      temperature: 0.7,
      n: 1,
      stream: false
    });

    // Update spend tracking
    monthlySpend += COST_PER_REQUEST;

    // Log for monitoring
    console.log({
      timestamp: new Date().toISOString(),
      ip: ip.substring(0, 10) + '***', // Partial IP for privacy
      messageLength: message.length,
      monthlySpend,
      remaining
    });

    return res.status(200).json({
      response: completion.choices[0].message.content,
      remaining: Math.max(0, (MONTHLY_LIMIT - monthlySpend) / COST_PER_REQUEST),
      rateLimitRemaining: remaining
    });

  } catch (error) {
    console.error('OpenAI Error:', error);

    // LAYER 8: Graceful fallback
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'AI service temporarily unavailable',
        fallback: true,
        fallbackResponse: getFallbackResponse(message)
      });
    }

    return res.status(500).json({
      error: 'Service error. Please try again.',
      fallback: true
    });
  }
}

// Fallback responses when AI is unavailable
function getFallbackResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('qualify')) {
    return "To qualify for our debt relief program, you need $25,000+ in unsecured business debt. Would you like to speak with a specialist?";
  }

  if (lower.includes('save') || lower.includes('how much')) {
    return "Most clients save 40-60% on their debt. For exact savings, please provide your contact info for a free consultation.";
  }

  return "I'd be happy to help with that. Please contact our specialist at 1-800-XXX-XXXX or leave your contact info for personalized assistance.";
}