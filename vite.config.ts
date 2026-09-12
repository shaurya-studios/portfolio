import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// @ts-ignore
import { knowledgeBase } from './src/knowledgeBase.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      tailwindcss(),
      react(),
      {
        name: 'api-chat-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method === 'POST') {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', async () => {
                try {
                  const { message } = JSON.parse(bodyStr || '{}');
                  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
                  
                  const gRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-goog-api-key': apiKey
                    },
                    body: JSON.stringify({
                      system_instruction: { parts: [{ text: knowledgeBase }] },
                      contents: [{ role: 'user', parts: [{ text: message }] }]
                    })
                  });

                  const gData = (await gRes.json()) as any;
                  const reply = gData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ reply }));
                } catch (e: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        }
      }
    ],
  };
});
