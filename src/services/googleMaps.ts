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
