const predefinedRoutes: any = {
  // Milan <-> Malpensa (Minibus 10 pax: 240)
  "milan-malpensa": { Standard: 91, Business: 112, Luxury: 258, "Standard Van": 112, "Business Van": 123, "Business Van Plus": 140, "Minibus 10 pax": 240 },
  "malpensa-milan": { Standard: 91, Business: 112, Luxury: 258, "Standard Van": 112, "Business Van": 123, "Business Van Plus": 140, "Minibus 10 pax": 240 },

  // Milan <-> Bergamo (Business: 120, Standard Van: 120, Business Van: 145, Business Van Plus: 160, Minibus 10 pax: 300)
  "milan-bergamo": { Standard: 101, Business: 120, Luxury: 258, "Standard Van": 120, "Business Van": 145, "Business Van Plus": 160, "Minibus 10 pax": 300 },
  "bergamo-milan": { Standard: 101, Business: 120, Luxury: 258, "Standard Van": 120, "Business Van": 145, "Business Van Plus": 160, "Minibus 10 pax": 300 },

  // Milan <-> Linate (Standard: 60, Business: 70, Luxury: 175, Standard Van: 70, Business Van: 90, Business Van Plus: 100, Minibus 10 pax: 175)
  "milan-linate": { Standard: 60, Business: 70, Luxury: 175, "Standard Van": 70, "Business Van": 90, "Business Van Plus": 100, "Minibus 10 pax": 175 },
  "linate-milan": { Standard: 60, Business: 70, Luxury: 175, "Standard Van": 70, "Business Van": 90, "Business Van Plus": 100, "Minibus 10 pax": 175 },

  // Malpensa <-> Linate (Standard: 120, Business: 150, Luxury: 240, Standard Van: 140, Business Van: 170, Business Van Plus: 180, Minibus 10 pax: 275)
  "malpensa-linate": { Standard: 120, Business: 150, Luxury: 240, "Standard Van": 140, "Business Van": 170, "Business Van Plus": 180, "Minibus 10 pax": 275 },
  "linate-malpensa": { Standard: 120, Business: 150, Luxury: 240, "Standard Van": 140, "Business Van": 170, "Business Van Plus": 180, "Minibus 10 pax": 275 },

  // Malpensa <-> Bergamo (Standard: 140, Business: 168, Luxury: 358, Standard Van: 160, Business Van: 200, Business Van Plus: 190, Minibus 10 pax: 300)
  "malpensa-bergamo": { Standard: 140, Business: 168, Luxury: 358, "Standard Van": 160, "Business Van": 200, "Business Van Plus": 190, "Minibus 10 pax": 300 },
  "bergamo-malpensa": { Standard: 140, Business: 168, Luxury: 358, "Standard Van": 160, "Business Van": 200, "Business Van Plus": 190, "Minibus 10 pax": 300 },

  // Linate <-> Bergamo (Standard: 110, Business: 130, Luxury: 220, Standard Van: 130, Business Van: 145, Business Van Plus: 150, Minibus 10 pax: 270)
  "bergamo-linate": { Standard: 110, Business: 130, Luxury: 220, "Standard Van": 130, "Business Van": 145, "Business Van Plus": 150, "Minibus 10 pax": 270 },
  "linate-bergamo": { Standard: 110, Business: 130, Luxury: 220, "Standard Van": 130, "Business Van": 145, "Business Van Plus": 150, "Minibus 10 pax": 270 }
};

const normalizeKey = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const fixedSpecialRoutesRaw: any = {
  "malpensa-tasch": { Business: 450, "Business Van": 450, "Business Van Plus": 450, Luxury: 600, "Minibus 10 pax": 600 },
  "milan-tasch": { Business: 500, "Business Van": 500, "Business Van Plus": 500, Luxury: 700, "Minibus 10 pax": 700 },
  "linate-tasch": { Business: 530, "Business Van": 530, "Business Van Plus": 530, Luxury: 750, "Minibus 10 pax": 750 },
  "bergamo-tasch": { Business: 560, "Business Van": 560, "Business Van Plus": 560, Luxury: 800, "Minibus 10 pax": 800 },
  "malpensa-st moritz": { Business: 450, "Business Van": 450, "Business Van Plus": 450, Luxury: 650, "Minibus 10 pax": 650 },
  "milan-st moritz": { Business: 450, "Business Van": 450, "Business Van Plus": 450, Luxury: 600, "Minibus 10 pax": 600 },
  "linate-st moritz": { Business: 480, "Business Van": 480, "Business Van Plus": 480, Luxury: 650, "Minibus 10 pax": 650 },
  "bergamo-st moritz": { Business: 500, "Business Van": 500, "Business Van Plus": 500, Luxury: 650, "Minibus 10 pax": 650 },
  "malpensa-pontresina": { Business: 480, "Business Van": 480, "Business Van Plus": 480, Luxury: 700, "Minibus 10 pax": 700 },
  "milan-pontresina": { Business: 480, "Business Van": 480, "Business Van Plus": 480, Luxury: 650, "Minibus 10 pax": 650 },
  "linate-pontresina": { Business: 530, "Business Van": 530, "Business Van Plus": 530, Luxury: 700, "Minibus 10 pax": 700 },
  "bergamo-pontresina": { Business: 550, "Business Van": 550, "Business Van Plus": 550, Luxury: 700, "Minibus 10 pax": 700 }
};

const fixedSpecialRoutes: any = {};
for (const route in fixedSpecialRoutesRaw) {
    const rawPrices = fixedSpecialRoutesRaw[route];
    const VAT_MULTIPLIER = 1.12;
    const pricesWithVat: any = {};
    for(const type in rawPrices) pricesWithVat[type] = rawPrices[type] * VAT_MULTIPLIER;
    
    const primaryKeyNormalized = normalizeKey(route);
    const parts = primaryKeyNormalized.split('-');
    const inverseKeyNormalized = parts.slice(parts.length / 2).join('-') + '-' + parts.slice(0, parts.length / 2).join('-');
    fixedSpecialRoutes[primaryKeyNormalized] = pricesWithVat;
    fixedSpecialRoutes[inverseKeyNormalized] = pricesWithVat;
    if (primaryKeyNormalized.includes('st-moritz')) {
        const sanktKey = primaryKeyNormalized.replace('st-moritz', 'sankt-moritz');
        const inverseSanktKey = inverseKeyNormalized.replace('st-moritz', 'sankt-moritz');
        fixedSpecialRoutes[sanktKey] = pricesWithVat;
        fixedSpecialRoutes[inverseSanktKey] = pricesWithVat;
    }
}

const rates: any = { Standard: 0.6, Business: 0.8, Luxury: 1.5, "Standard Van": 0.8, "Business Van": 0.9, "Business Van Plus": 1.0, "Minibus 10 pax": 1.2 };

const specialPlaces = ["tasch", "zermatt", "st moritz", "bellagio", "mennagio", "sankt moritz", "pontresina"];

const surchargedPlaces: any = {
  "como": { Standard: 80, Business: 100, "Business Van": 110, "Standard Van": 80, "Business Van Plus": 130, Luxury: 100, "Minibus 10 pax": 100 },
  "villa d'este": { Standard: 90, Business: 120, "Business Van": 130, "Standard Van": 90, "Business Van Plus": 150, Luxury: 120, "Minibus 10 pax": 120 }
};

const matchPredefinedRoute = (fromStr: string, toStr: string) => {
  const f = fromStr.toLowerCase();
  const t = toStr.toLowerCase();

  const isMilan = (s: string) => s.includes("milan") && !s.includes("malpensa") && !s.includes("linate") && !s.includes("bergamo");
  const isMalpensa = (s: string) => s.includes("malpensa");
  const isLinate = (s: string) => s.includes("linate");
  const isBergamo = (s: string) => s.includes("bergamo") || s.includes("caravaggio") || s.includes("orio");

  if ((isMilan(f) && isMalpensa(t)) || (isMalpensa(f) && isMilan(t))) return predefinedRoutes["milan-malpensa"];
  if ((isMilan(f) && isBergamo(t)) || (isBergamo(f) && isMilan(t))) return predefinedRoutes["milan-bergamo"];
  if ((isMilan(f) && isLinate(t)) || (isLinate(f) && isMilan(t))) return predefinedRoutes["milan-linate"];
  if ((isMalpensa(f) && isLinate(t)) || (isLinate(f) && isMalpensa(t))) return predefinedRoutes["malpensa-linate"];
  if ((isMalpensa(f) && isBergamo(t)) || (isBergamo(f) && isMalpensa(t))) return predefinedRoutes["malpensa-bergamo"];
  if ((isLinate(f) && isBergamo(t)) || (isBergamo(f) && isLinate(t))) return predefinedRoutes["linate-bergamo"];

  return null;
};

// Pricing calculation logic
export const calculateTransferPrices = (from: string, to: string, distance: number) => {
    const routeKey = `${normalizeKey(from)}-${normalizeKey(to)}`;
    
    // 1. Check Fixed Special Alpine Routes
    if (fixedSpecialRoutes[routeKey]) {
        return { prices: fixedSpecialRoutes[routeKey], formatSpecial: true };
    }

    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();
    const isSpecial = specialPlaces.some((place) => fromLower.includes(place) || toLower.includes(place));
    
    // 2. Check Predefined Italian Airport Routes from Table
    const predefined = matchPredefinedRoute(from, to);
    if (predefined) {
        return { prices: predefined, formatSpecial: isSpecial };
    }

    const routeKey1 = `${normalizeKey(from)}-${normalizeKey(to)}`;
    const routeKey2 = `${normalizeKey(to)}-${normalizeKey(from)}`;
    if (predefinedRoutes[routeKey1]) return { prices: predefinedRoutes[routeKey1], formatSpecial: isSpecial };
    if (predefinedRoutes[routeKey2]) return { prices: predefinedRoutes[routeKey2], formatSpecial: isSpecial };

    // 3. General Distance-Based Calculation
    const airportList = ["malpensa", "bergamo", "linate", "caravaggio"];
    let finalDistance: number;
    
    const isSurcharged = Object.keys(surchargedPlaces).some(place => fromLower.includes(place) || toLower.includes(place));
    
    if (isSurcharged) {
      finalDistance = distance * 2 + 20;
    } else {
      const doubledDistance = distance * 2;
      if (fromLower.includes("linate") || toLower.includes("linate")) {
        finalDistance = doubledDistance + 10;
      } else if (airportList.some((airport) => fromLower.includes(airport) || toLower.includes(airport))) {
        finalDistance = doubledDistance + 50;
      } else {
        finalDistance = doubledDistance + 20;
      }
    }
    
    const calculatedPrices: any = {};
    for (const key in rates) {
      let basePrice = finalDistance * rates[key];
      if (isSpecial && !isSurcharged) {
        basePrice *= 1.1;
      }
      let priceWithVat = basePrice * 1.12;
      calculatedPrices[key] = priceWithVat;
    }
    
    return { prices: calculatedPrices, formatSpecial: isSpecial };
};
