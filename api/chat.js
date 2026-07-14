import { knowledgeBase } from '../src/knowledgeBase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6KuZ6LhsRosn9EkRcMQWUSdibhApc35DoZgc7gSANw1JA";
    const systemInstruction = knowledgeBase;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
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
      return res.status(500).json({ error: `Gemini API returned ${response.status}` });
    }

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Failed to generate response' });
    }

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(500).json({ error: 'Gemini API returned empty candidates.' });
    }

    const reply = data.candidates[0].content?.parts?.[0]?.text;
    res.status(200).json({ reply: reply || 'Buggie generated an empty response.' });
  } catch (error) {
    console.error("Vercel Function Error:", error);
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
}
