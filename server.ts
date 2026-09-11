import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route to proxy Google Maps Distance Matrix API
  app.post("/api/distance", async (req, res) => {
    const { origin, destination, apiKey } = req.body;
    
    // The key should ideally be in process.env, but the user passed it in their request.
    // Given the architecture, I'll allow it passed but log a warning if it is not secure.
    // The prompt says "I'll put the API key in the UI" - I should move it to a server env var.
    
    const usedApiKey = process.env.GOOGLE_MAPS_API_KEY || apiKey;
    
    if (!usedApiKey) {
      return res.status(400).json({ error: "Missing API Key" });
    }

    const formatLocationQuery = (loc: string) => {
      if (!loc) return "";
      let s = loc.trim();
      const lower = s.toLowerCase();

      const translations: Record<string, string> = {
        'мілан': 'Milan, Italy',
        'милан': 'Milan, Italy',
        'венеція': 'Venice, Italy',
        'венеция': 'Venice, Italy',
        'рим': 'Rome, Italy',
        'флоренція': 'Florence, Italy',
        'флоренция': 'Florence, Italy',
        'генуя': 'Genoa, Italy',
        'турин': 'Turin, Italy',
        'болонья': 'Bologna, Italy',
        'верона': 'Verona, Italy',
        'комо': 'Lake Como, Italy',
        'лугано': 'Lugano, Switzerland',
        'мальпенса': 'Milan Malpensa Airport (MXP), Italy',
        'лінате': 'Milan Linate Airport (LIN), Italy',
        'ленате': 'Milan Linate Airport (LIN), Italy',
        'бергамо': 'Bergamo Airport (BGY), Italy',
        'монако': 'Monaco',
        'monaco': 'Monaco',
        'монте карло': 'Monaco, Monte-Carlo',
        'монте-карло': 'Monaco, Monte-Carlo',
        'monte carlo': 'Monaco, Monte-Carlo',
        'monte-carlo': 'Monaco, Monte-Carlo',
        'principality of monaco': 'Monaco'
      };

      if (translations[lower]) return translations[lower];

      if (lower.includes('monaco') || lower.includes('монако') || lower.includes('monte carlo') || lower.includes('монте-карло') || lower.includes('монте карло')) {
        return 'Monaco';
      }

      if (!s.includes(',') && !lower.includes('italy') && !lower.includes('switzerland') && !lower.includes('austria') && !lower.includes('france') && !lower.includes('monaco')) {
        return `${s}, Italy`;
      }
      return s;
    };

    const o = formatLocationQuery(origin);
    const d = formatLocationQuery(destination);

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(o)}&destinations=${encodeURIComponent(d)}&language=en&units=metric&key=${usedApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
