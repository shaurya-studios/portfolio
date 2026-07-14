import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  try {
    // We use the provided key, or fallback to an environment variable if set later
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6I4LzpxnOcb7d5qJWHbj4A0NjPHF7Bby49T0H6lTwFkeA";
    
    // Load the dynamic Knowledge Base from the src directory
    const kbPath = path.join(process.cwd(), 'src', 'knowledge_base.md');
    const systemInstruction = fs.readFileSync(kbPath, 'utf8');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`, {
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

    const data = await response.json();
    
    if (data.error) {
      console.error(data.error);
      return res.status(500).json({ error: data.error.message || 'Failed to generate response from Gemini API' });
    }

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(500).json({ error: 'Gemini API returned empty candidates (possibly blocked by safety settings).' });
    }

    const reply = data.candidates[0].content?.parts?.[0]?.text;
    res.status(200).json({ reply: reply || 'Buggie generated an empty response.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
