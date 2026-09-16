import { knowledgeBase } from '../src/knowledgeBase.js';

// Extremely lightweight in-memory rate limiter for Vercel Serverless (warm invocations)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 7; // Max 7 messages per minute per IP

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // IP-based Rate Limiting
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  
  const record = rateLimit.get(ip);
  if (record) {
    if (now - record.startTime < RATE_LIMIT_WINDOW) {
      if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({ error: 'Too many requests. Please slow down and try again in a minute.' });
      }
      record.count += 1;
    } else {
      rateLimit.set(ip, { count: 1, startTime: now });
    }
  } else {
    rateLimit.set(ip, { count: 1, startTime: now });
  }

  // Cleanup map occasionally to prevent memory leaks in the container
  if (Math.random() < 0.05) {
    for (const [key, val] of rateLimit.entries()) {
      if (now - val.startTime > RATE_LIMIT_WINDOW) rateLimit.delete(key);
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      // Ignored
    }
  }

  const message = body?.message;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured.' });
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: knowledgeBase }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return res.status(response.status).json({ error: `Gemini API error: ${response.status}` });
    }

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Failed to generate response' });
    }

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(500).json({ error: 'Gemini API returned empty candidates.' });
    }

    const reply = data.candidates[0].content?.parts?.[0]?.text;
    return res.status(200).json({ reply: reply || 'Buggie generated an empty response.' });
  } catch (error) {
    console.error("Chat API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
}
