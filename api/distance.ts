export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { origin, destination } = req.body || {};
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: 'Missing API Key' });
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

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(o)}&destinations=${encodeURIComponent(d)}&language=en&units=metric&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
