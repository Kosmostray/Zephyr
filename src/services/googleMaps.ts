export const GOOGLE_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAcA0FhiO6gvQf_jyXXFvAYh03EnyIPln0";

let googleMapsScriptPromise: Promise<void> | null = null;

export const loadGoogleMaps = (apiKey: string): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).google?.maps) return Promise.resolve();
  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }
  return googleMapsScriptPromise;
};

export const formatLocationQuery = (loc: string): string => {
  if (!loc) return "";
  const s = loc.trim();
  const lower = s.toLowerCase();

  const translations: Record<string, string> = {
    // Italy Primary Hubs & Cities
    'мілан': 'Milan, Italy',
    'милан': 'Milan, Italy',
    'milan': 'Milan, Italy',
    'milano': 'Milan, Italy',
    'венеція': 'Venice, Italy',
    'венеция': 'Venice, Italy',
    'venice': 'Venice, Italy',
    'venezia': 'Venice, Italy',
    'рим': 'Rome, Italy',
    'rome': 'Rome, Italy',
    'roma': 'Rome, Italy',
    'флоренція': 'Florence, Italy',
    'флоренция': 'Florence, Italy',
    'florence': 'Florence, Italy',
    'firenze': 'Florence, Italy',
    'генуя': 'Genoa, Italy',
    'genoa': 'Genoa, Italy',
    'genova': 'Genoa, Italy',
    'турин': 'Turin, Italy',
    'turin': 'Turin, Italy',
    'torino': 'Turin, Italy',
    'болонья': 'Bologna, Italy',
    'bologna': 'Bologna, Italy',
    'верона': 'Verona, Italy',
    'verona': 'Verona, Italy',
    'неаполь': 'Naples, Italy',
    'naples': 'Naples, Italy',
    'napoli': 'Naples, Italy',
    'піза': 'Pisa, Italy',
    'пиза': 'Pisa, Italy',
    'pisa': 'Pisa, Italy',
    'сієна': 'Siena, Italy',
    'сиена': 'Siena, Italy',
    'siena': 'Siena, Italy',
    'мальпенса': 'Milan Malpensa Airport (MXP), Italy',
    'лінате': 'Milan Linate Airport (LIN), Italy',
    'ленате': 'Milan Linate Airport (LIN), Italy',
    'бергамо': 'Bergamo Airport (BGY), Italy',

    // Ambiguous Italian Spots (Prevents Google Maps picking wrong continents or centers)
    'bellagio': 'Bellagio, Lake Como, Italy',
    'белладжо': 'Bellagio, Lake Como, Italy',
    'белладжіо': 'Bellagio, Lake Como, Italy',
    'como': 'Lake Como, Italy',
    'комо': 'Lake Como, Italy',
    'озеро комо': 'Lake Como, Italy',
    'portofino': 'Portofino, Italy',
    'портофіно': 'Portofino, Italy',
    'портофино': 'Portofino, Italy',
    'sanremo': 'Sanremo, Italy',
    'san remo': 'Sanremo, Italy',
    'санремо': 'Sanremo, Italy',
    'сан-ремо': 'Sanremo, Italy',
    'сан ремо': 'Sanremo, Italy',
    'sirmione': 'Sirmione, Lake Garda, Italy',
    'сірміоне': 'Sirmione, Lake Garda, Italy',
    'сирмионе': 'Sirmione, Lake Garda, Italy',
    'amalfi': 'Amalfi, Italy',
    'амальфі': 'Amalfi, Italy',
    'positano': 'Positano, Italy',
    'позітано': 'Positano, Italy',
    'bormio': 'Bormio, Italy',
    'livigno': 'Livigno, Italy',

    // France & French Riviera (Nice, Cannes, etc. - stops 589 km fallback)
    'nice': 'Nice, France',
    'ніцца': 'Nice, France',
    'ницца': 'Nice, France',
    'nizza': 'Nice, France',
    'cannes': 'Cannes, France',
    'канни': 'Cannes, France',
    'канны': 'Cannes, France',
    'antibes': 'Antibes, France',
    'антіб': 'Antibes, France',
    'антиб': 'Antibes, France',
    'menton': 'Menton, France',
    'ментон': 'Menton, France',
    'ментона': 'Menton, France',
    'saint-tropez': 'Saint-Tropez, France',
    'saint tropez': 'Saint-Tropez, France',
    'st tropez': 'Saint-Tropez, France',
    'st. tropez': 'Saint-Tropez, France',
    'сен-тропе': 'Saint-Tropez, France',
    'сен тропе': 'Saint-Tropez, France',
    'chamonix': 'Chamonix, France',
    'шамоні': 'Chamonix, France',
    'шамони': 'Chamonix, France',
    'courchevel': 'Courchevel, France',
    'куршевель': 'Courchevel, France',
    'val d\'isere': 'Val-d\'Isère, France',
    'валь д\'ізер': 'Val-d\'Isère, France',
    'megeve': 'Megève, France',
    'межев': 'Megève, France',
    'paris': 'Paris, France',
    'париж': 'Paris, France',
    'lyon': 'Lyon, France',
    'ліон': 'Lyon, France',

    // Monaco & Monte Carlo
    'монако': 'Monaco',
    'monaco': 'Monaco',
    'монте карло': 'Monaco, Monte-Carlo',
    'монте-карло': 'Monaco, Monte-Carlo',
    'monte carlo': 'Monaco, Monte-Carlo',
    'monte-carlo': 'Monaco, Monte-Carlo',
    'principality of monaco': 'Monaco',

    // Switzerland
    'geneva': 'Geneva, Switzerland',
    'genève': 'Geneva, Switzerland',
    'genf': 'Geneva, Switzerland',
    'женева': 'Geneva, Switzerland',
    'zurich': 'Zurich, Switzerland',
    'zürich': 'Zurich, Switzerland',
    'цюрих': 'Zurich, Switzerland',
    'цюріх': 'Zurich, Switzerland',
    'lugano': 'Lugano, Switzerland',
    'лугано': 'Lugano, Switzerland',
    'basel': 'Basel, Switzerland',
    'базель': 'Basel, Switzerland',
    'bern': 'Bern, Switzerland',
    'берн': 'Bern, Switzerland',
    'lucerne': 'Lucerne, Switzerland',
    'luzern': 'Lucerne, Switzerland',
    'люцерн': 'Lucerne, Switzerland',
    'lausanne': 'Lausanne, Switzerland',
    'лозанна': 'Lausanne, Switzerland',
    'montreux': 'Montreux, Switzerland',
    'монтре': 'Montreux, Switzerland',
    'interlaken': 'Interlaken, Switzerland',
    'інтерлакен': 'Interlaken, Switzerland',
    'st moritz': 'St. Moritz, Switzerland',
    'st. moritz': 'St. Moritz, Switzerland',
    'sankt moritz': 'St. Moritz, Switzerland',
    'моріц': 'St. Moritz, Switzerland',
    'zermatt': 'Zermatt, Switzerland',
    'церматт': 'Zermatt, Switzerland',
    'champery': 'Champéry, Switzerland',
    'шампері': 'Champéry, Switzerland',

    // Austria
    'innsbruck': 'Innsbruck, Austria',
    'інсбрук': 'Innsbruck, Austria',
    'инсбрук': 'Innsbruck, Austria',
    'salzburg': 'Salzburg, Austria',
    'зальцбург': 'Salzburg, Austria',
    'vienna': 'Vienna, Austria',
    'wien': 'Vienna, Austria',
    'відень': 'Vienna, Austria',
    'kitzbuhel': 'Kitzbühel, Austria',
    'kitzbühel': 'Kitzbühel, Austria',
    'ischgl': 'Ischgl, Austria',
    'st anton': 'St. Anton am Arlberg, Austria',
    'solden': 'Sölden, Austria',
    'sölden': 'Sölden, Austria',

    // Germany
    'munich': 'Munich, Germany',
    'münchen': 'Munich, Germany',
    'мюнхен': 'Munich, Germany',
    'monaco di baviera': 'Munich, Germany',
    'frankfurt': 'Frankfurt, Germany',
    'stuttgart': 'Stuttgart, Germany'
  };

  if (translations[lower]) return translations[lower];

  // Pattern detection for Riviera / French destinations
  if (lower.includes('nice') || lower.includes('ніцц') || lower.includes('ницц') || lower.includes('nizza')) {
    return 'Nice, France';
  }
  if (lower.includes('cannes') || lower.includes('канн')) {
    return 'Cannes, France';
  }
  if (lower.includes('antibes') || lower.includes('антіб') || lower.includes('антиб')) {
    return 'Antibes, France';
  }
  if (lower.includes('menton') || lower.includes('ментон')) {
    return 'Menton, France';
  }
  if (lower.includes('tropez') || lower.includes('тропе')) {
    return 'Saint-Tropez, France';
  }
  if (lower.includes('monaco') || lower.includes('монако') || lower.includes('monte carlo') || lower.includes('монте-карло') || lower.includes('монте карло')) {
    return 'Monaco';
  }
  if (lower.includes('geneva') || lower.includes('женев') || lower.includes('genève')) {
    return 'Geneva, Switzerland';
  }
  if (lower.includes('zurich') || lower.includes('zürich') || lower.includes('цюрих') || lower.includes('цюріх')) {
    return 'Zurich, Switzerland';
  }
  if (lower.includes('bellagio') || lower.includes('белладж')) {
    return 'Bellagio, Lake Como, Italy';
  }

  const countries = ['italy', 'switzerland', 'austria', 'france', 'germany', 'monaco', 'італія', 'италия', 'франція', 'франция', 'швейцарія', 'швейцария', 'австрія', 'австрия'];
  if (!s.includes(',') && !countries.some(c => lower.includes(c))) {
    return `${s}, Italy`;
  }
  return s;
};

export const resolveClientGoogleDistance = async (origin: string, destination: string, apiKey: string): Promise<any> => {
  try {
    await loadGoogleMaps(apiKey);
    if (!(window as any).google?.maps) return null;

    // 1. Try DistanceMatrixService
    const matrixResult = await new Promise<any>((res) => {
      const service = new (window as any).google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: (window as any).google.maps.TravelMode.DRIVING,
          unitSystem: (window as any).google.maps.UnitSystem.METRIC,
        },
        (response: any, status: any) => {
          if (status === 'OK' && response?.rows?.[0]?.elements?.[0]?.status === 'OK') {
            res(response.rows[0].elements[0]);
          } else {
            res(null);
          }
        }
      );
    });

    if (matrixResult) return matrixResult;

    // 2. Fallback to DirectionsService
    const directionsResult = await new Promise<any>((res) => {
      const dirService = new (window as any).google.maps.DirectionsService();
      dirService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: (window as any).google.maps.TravelMode.DRIVING,
        },
        (dirRes: any, dirStatus: any) => {
          if (dirStatus === 'OK' && dirRes?.routes?.[0]?.legs?.[0]) {
            res(dirRes.routes[0].legs[0]);
          } else {
            res(null);
          }
        }
      );
    });

    return directionsResult;
  } catch {
    return null;
  }
};
