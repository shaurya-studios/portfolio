export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  try {
    // We use the provided key, or fallback to an environment variable if set later
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6I4LzpxnOcb7d5qJWHbj4A0NjPHF7Bby49T0H6lTwFkeA";
    
    // Construct the context prompt for Buggie
    const systemInstruction = `You are "Buggie", the official AI assistant for Shaurya's web development studio.
Your job is to answer client questions, fix their problems, and ultimately convince them to hire Shaurya.

Context about Shaurya & The Studio:
- Shaurya builds world-class, lightning-fast, custom websites and web applications.
- Services include Full-Stack Development, UI/UX Engineering, and Performance Optimization.
- Pricing Tiers: Starter ($80), Professional ($140), E-Commerce ($300), and Bespoke (Custom pricing).
- Payment Methods accepted: PayPal, UPI.
- Shaurya's email: shaurya.studios.dev@gmail.com
- Shaurya's Discord: https://discord.com/users/1338926430679076925
- Fiverr: https://www.fiverr.com/s/6Yl5a2r
- Past Work: Editify Studios, Thumbpilot.
- Tone: Professional, slightly tech-savvy, helpful, and confident. You are "Buggie to fix your problems".

Keep your answers concise, direct, and formatted cleanly. If you don't know the answer, tell them to email Shaurya directly.`;

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
