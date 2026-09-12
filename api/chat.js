import { knowledgeBase } from '../src/knowledgeBase.js';

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
