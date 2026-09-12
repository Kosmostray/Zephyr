import tariffsData from './data/tariffs.json';

export { tariffsData };

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

const normalizeKey = (str: any) => {
  if (typeof str !== 'string') return '';
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

const fixedSpecialRoutesRaw: any = {
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
  for (const type in rawPrices) pricesWithVat[type] = rawPrices[type] * VAT_MULTIPLIER;

  const primaryKeyNormalized = normalizeKey(route);
  const parts = primaryKeyNormalized.split('-');
  const inverseKeyNormalized = parts.slice(parts.length / 2).join('-') + '-' + parts.slice(0, parts.length / 2).join('-');
  fixedSpecialRoutes[primaryKeyNormalized] = pricesWithVat;
  fixedSpecialRoutes[inverseKeyNormalized] = pricesWithVat;
}

const rates: any = { Standard: 0.7, Business: 0.8, Luxury: 1.5, "Standard Van": 0.8, "Business Van": 0.9, "Business Van Plus": 1.0, "Minibus 10 pax": 1.2 };

const specialPlaces = ["tasch", "zermatt", "st moritz", "bellagio", "mennagio", "sankt moritz", "pontresina", "cervinia", "chervinia", "cortina", "courmayeur", "cormajor", "cormayeur", "campiglio", "sestriere", "gardena", "ortisei", "alpbach", "ischgl", "kitzbuhel", "mayrhofen", "obergurgl", "saalbach", "solden", "soll", "anton", "champery", "tonale"];

const surchargedPlaces: any = {
  "como": { Standard: 80, Business: 100, "Business Van": 110, "Standard Van": 80, "Business Van Plus": 130, Luxury: 100, "Minibus 10 pax": 100 },
  "villa d'este": { Standard: 90, Business: 120, "Business Van": 130, "Standard Van": 90, "Business Van Plus": 150, Luxury: 120, "Minibus 10 pax": 120 }
};

/**
 * Robust detection of origin hub (Milan city center, Malpensa, Linate, Bergamo).
 * Supports any casing, accents, Cyrillic, typos, extra whitespace.
 */
export const detectOrigin = (raw: any): "milan" | "malpensa" | "linate" | "bergamo" | null => {
  if (typeof raw !== 'string') return null;
  const s = raw.toLowerCase().trim();
  if (!s) return null;

  if (s.includes("malpensa") || s.includes("mxp") || s.includes("мальпенса")) return "malpensa";
  if (s.includes("linate") || s.includes("lin") || s.includes("лінате") || s.includes("ленате")) return "linate";
  if (s.includes("bergamo") || s.includes("bgy") || s.includes("orio") || s.includes("caravaggio") || s.includes("бергамо") || s.includes("оріо")) return "bergamo";
  if (s.includes("milan") || s.includes("milano") || s.includes("мілан") || s.includes("милан")) return "milan";
  return null;
};

/**
 * Robust detection of all 19 ski / resort destinations:
 * Italy, Austria, and Switzerland.
 * Supports any casing, accents, Cyrillic, transliterations, typos, extra whitespace.
 */
export const detectDestination = (raw: any): string | null => {
  if (typeof raw !== 'string') return null;
  const s = raw.toLowerCase().trim();
  if (!s) return null;

  // 1. Italian Ski Resorts
  if (s.includes("cervinia") || s.includes("chervinia") || s.includes("червінія") || s.includes("червиния") || s.includes("breuil")) return "cervinia";
  if (s.includes("cortina") || s.includes("ampezzo") || s.includes("кортіна") || s.includes("кортина")) return "cortina_dampezzo";
  if (s.includes("courmayeur") || s.includes("cormajor") || s.includes("cormayeur") || s.includes("curmayeur") || s.includes("кормайор") || s.includes("курмайор")) return "courmayeur";
  if (s.includes("campiglio") || s.includes("madonna") || s.includes("кампільйо") || s.includes("мадонна")) return "madonna_di_campiglio";
  if (s.includes("sestriere") || s.includes("sestrieres") || s.includes("сестрієре") || s.includes("сестриере")) return "sestriere";
  if (s.includes("gardena") || s.includes("ortisei") || s.includes("selva") || s.includes("гардена") || s.includes("ортізеї")) return "val_gardena";
  if (s.includes("tonale") || s.includes("passo tonale") || s.includes("тонале")) return "passo_tonale";

  // 2. Austria Ski Resorts
  if (s.includes("alpbach") || s.includes("альпбах")) return "alpbach";
  if (s.includes("ischgl") || s.includes("ішгль") || s.includes("ишгль")) return "ischgl";
  if (s.includes("kitzbuhel") || s.includes("kitzbühel") || s.includes("kitzbuehel") || s.includes("кіцбюель") || s.includes("кицбюэль")) return "kitzbuhel";
  if (s.includes("mayrhofen") || s.includes("майрхофен")) return "mayrhofen";
  if (s.includes("obergurgl") || s.includes("gurgl") || s.includes("обергургль")) return "obergurgl";
  if (s.includes("saalbach") || s.includes("hinterglemm") || s.includes("заальбах")) return "saalbach";
  if (s.includes("solden") || s.includes("sölden") || s.includes("soelden") || s.includes("зельден") || s.includes("зьольден")) return "solden";
  if (s.includes("soll") || s.includes("söll") || s.includes("soell") || s.includes("зьолль") || s.includes("зель")) return "soll";
  if (s.includes("anton") || s.includes("st. anton") || s.includes("st anton") || s.includes("sankt anton") || s.includes("антон")) return "st_anton";

  // 3. Switzerland / Alps Resorts
  if (s.includes("champery") || s.includes("champéry") || s.includes("шампері") || s.includes("шампери")) return "champery";
  if (s.includes("moritz") || s.includes("st. moritz") || s.includes("st moritz") || s.includes("sankt moritz") || s.includes("моріц") || s.includes("мориц")) return "st_moritz";
  if (s.includes("zermatt") || s.includes("tasch") || s.includes("täsch") || s.includes("церматт") || s.includes("таш") || s.includes("теш")) return "zermatt";

  return null;
};

/**
 * Static distance & duration info for all 76 fixed ski route pairings (4 origins x 19 destinations)
 */
export const skiRoutesDistanceDuration: Record<string, Record<string, { distanceText: string; distanceKm: number; durationText: string; durationSec: number }>> = {
  milan: {
    cervinia: { distanceText: "190 km", distanceKm: 190, durationText: "2 hr 30 mins", durationSec: 9000 },
    cortina_dampezzo: { distanceText: "410 km", distanceKm: 410, durationText: "4 hr 30 mins", durationSec: 16200 },
    courmayeur: { distanceText: "220 km", distanceKm: 220, durationText: "2 hr 40 mins", durationSec: 9600 },
    madonna_di_campiglio: { distanceText: "230 km", distanceKm: 230, durationText: "3 hr 30 mins", durationSec: 12600 },
    sestriere: { distanceText: "235 km", distanceKm: 235, durationText: "2 hr 50 mins", durationSec: 10200 },
    val_gardena: { distanceText: "325 km", distanceKm: 325, durationText: "3 hr 45 mins", durationSec: 13500 },
    alpbach: { distanceText: "410 km", distanceKm: 410, durationText: "4 hr 30 mins", durationSec: 16200 },
    ischgl: { distanceText: "320 km", distanceKm: 320, durationText: "4 hr 00 mins", durationSec: 14400 },
    kitzbuhel: { distanceText: "440 km", distanceKm: 440, durationText: "4 hr 50 mins", durationSec: 17400 },
    mayrhofen: { distanceText: "420 km", distanceKm: 420, durationText: "4 hr 35 mins", durationSec: 16500 },
    obergurgl: { distanceText: "330 km", distanceKm: 330, durationText: "4 hr 10 mins", durationSec: 15000 },
    saalbach: { distanceText: "490 km", distanceKm: 490, durationText: "5 hr 20 mins", durationSec: 19200 },
    solden: { distanceText: "320 km", distanceKm: 320, durationText: "4 hr 00 mins", durationSec: 14400 },
    soll: { distanceText: "420 km", distanceKm: 420, durationText: "4 hr 35 mins", durationSec: 16500 },
    st_anton: { distanceText: "300 km", distanceKm: 300, durationText: "3 hr 45 mins", durationSec: 13500 },
    champery: { distanceText: "260 km", distanceKm: 260, durationText: "3 hr 10 mins", durationSec: 11400 },
    st_moritz: { distanceText: "160 km", distanceKm: 160, durationText: "2 hr 45 mins", durationSec: 9900 },
    zermatt: { distanceText: "195 km", distanceKm: 195, durationText: "2 hr 45 mins", durationSec: 9900 },
    passo_tonale: { distanceText: "170 km", distanceKm: 170, durationText: "2 hr 40 mins", durationSec: 9600 }
  },
  malpensa: {
    cervinia: { distanceText: "180 km", distanceKm: 180, durationText: "2 hr 15 mins", durationSec: 8100 },
    cortina_dampezzo: { distanceText: "450 km", distanceKm: 450, durationText: "4 hr 50 mins", durationSec: 17400 },
    courmayeur: { distanceText: "210 km", distanceKm: 210, durationText: "2 hr 20 mins", durationSec: 8400 },
    madonna_di_campiglio: { distanceText: "270 km", distanceKm: 270, durationText: "3 hr 50 mins", durationSec: 13800 },
    sestriere: { distanceText: "240 km", distanceKm: 240, durationText: "2 hr 45 mins", durationSec: 9900 },
    val_gardena: { distanceText: "365 km", distanceKm: 365, durationText: "4 hr 00 mins", durationSec: 14400 },
    alpbach: { distanceText: "440 km", distanceKm: 440, durationText: "4 hr 45 mins", durationSec: 17100 },
    ischgl: { distanceText: "350 km", distanceKm: 350, durationText: "4 hr 15 mins", durationSec: 15300 },
    kitzbuhel: { distanceText: "470 km", distanceKm: 470, durationText: "5 hr 05 mins", durationSec: 18300 },
    mayrhofen: { distanceText: "450 km", distanceKm: 450, durationText: "4 hr 50 mins", durationSec: 17400 },
    obergurgl: { distanceText: "360 km", distanceKm: 360, durationText: "4 hr 25 mins", durationSec: 15900 },
    saalbach: { distanceText: "520 km", distanceKm: 520, durationText: "5 hr 35 mins", durationSec: 20100 },
    solden: { distanceText: "350 km", distanceKm: 350, durationText: "4 hr 15 mins", durationSec: 15300 },
    soll: { distanceText: "450 km", distanceKm: 450, durationText: "4 hr 50 mins", durationSec: 17400 },
    st_anton: { distanceText: "330 km", distanceKm: 330, durationText: "4 hr 00 mins", durationSec: 14400 },
    champery: { distanceText: "250 km", distanceKm: 250, durationText: "2 hr 55 mins", durationSec: 10500 },
    st_moritz: { distanceText: "185 km", distanceKm: 185, durationText: "2 hr 55 mins", durationSec: 10500 },
    zermatt: { distanceText: "175 km", distanceKm: 175, durationText: "2 hr 25 mins", durationSec: 8700 },
    passo_tonale: { distanceText: "200 km", distanceKm: 200, durationText: "3 hr 00 mins", durationSec: 10800 }
  },
  linate: {
    cervinia: { distanceText: "200 km", distanceKm: 200, durationText: "2 hr 40 mins", durationSec: 9600 },
    cortina_dampezzo: { distanceText: "410 km", distanceKm: 410, durationText: "4 hr 30 mins", durationSec: 16200 },
    courmayeur: { distanceText: "230 km", distanceKm: 230, durationText: "2 hr 50 mins", durationSec: 10200 },
    madonna_di_campiglio: { distanceText: "230 km", distanceKm: 230, durationText: "3 hr 30 mins", durationSec: 12600 },
    sestriere: { distanceText: "245 km", distanceKm: 245, durationText: "3 hr 00 mins", durationSec: 10800 },
    val_gardena: { distanceText: "325 km", distanceKm: 325, durationText: "3 hr 45 mins", durationSec: 13500 },
    alpbach: { distanceText: "410 km", distanceKm: 410, durationText: "4 hr 30 mins", durationSec: 16200 },
    ischgl: { distanceText: "320 km", distanceKm: 320, durationText: "4 hr 00 mins", durationSec: 14400 },
    kitzbuhel: { distanceText: "440 km", distanceKm: 440, durationText: "4 hr 50 mins", durationSec: 17400 },
    mayrhofen: { distanceText: "420 km", distanceKm: 420, durationText: "4 hr 35 mins", durationSec: 16500 },
    obergurgl: { distanceText: "330 km", distanceKm: 330, durationText: "4 hr 10 mins", durationSec: 15000 },
    saalbach: { distanceText: "490 km", distanceKm: 490, durationText: "5 hr 20 mins", durationSec: 19200 },
    solden: { distanceText: "320 km", distanceKm: 320, durationText: "4 hr 00 mins", durationSec: 14400 },
    soll: { distanceText: "420 km", distanceKm: 420, durationText: "4 hr 35 mins", durationSec: 16500 },
    st_anton: { distanceText: "300 km", distanceKm: 300, durationText: "3 hr 45 mins", durationSec: 13500 },
    champery: { distanceText: "270 km", distanceKm: 270, durationText: "3 hr 20 mins", durationSec: 12000 },
    st_moritz: { distanceText: "165 km", distanceKm: 165, durationText: "2 hr 45 mins", durationSec: 9900 },
    zermatt: { distanceText: "205 km", distanceKm: 205, durationText: "2 hr 55 mins", durationSec: 10500 },
    passo_tonale: { distanceText: "170 km", distanceKm: 170, durationText: "2 hr 40 mins", durationSec: 9600 }
  },
  bergamo: {
    cervinia: { distanceText: "235 km", distanceKm: 235, durationText: "3 hr 00 mins", durationSec: 10800 },
    cortina_dampezzo: { distanceText: "370 km", distanceKm: 370, durationText: "4 hr 00 mins", durationSec: 14400 },
    courmayeur: { distanceText: "265 km", distanceKm: 265, durationText: "3 hr 10 mins", durationSec: 11400 },
    madonna_di_campiglio: { distanceText: "180 km", distanceKm: 180, durationText: "2 hr 45 mins", durationSec: 9900 },
    sestriere: { distanceText: "280 km", distanceKm: 280, durationText: "3 hr 20 mins", durationSec: 12000 },
    val_gardena: { distanceText: "280 km", distanceKm: 280, durationText: "3 hr 15 mins", durationSec: 11700 },
    alpbach: { distanceText: "370 km", distanceKm: 370, durationText: "4 hr 00 mins", durationSec: 14400 },
    ischgl: { distanceText: "290 km", distanceKm: 290, durationText: "3 hr 40 mins", durationSec: 13200 },
    kitzbuhel: { distanceText: "400 km", distanceKm: 400, durationText: "4 hr 20 mins", durationSec: 15600 },
    mayrhofen: { distanceText: "380 km", distanceKm: 380, durationText: "4 hr 05 mins", durationSec: 14700 },
    obergurgl: { distanceText: "300 km", distanceKm: 300, durationText: "3 hr 45 mins", durationSec: 13500 },
    saalbach: { distanceText: "450 km", distanceKm: 450, durationText: "4 hr 50 mins", durationSec: 17400 },
    solden: { distanceText: "290 km", distanceKm: 290, durationText: "3 hr 35 mins", durationSec: 12900 },
    soll: { distanceText: "380 km", distanceKm: 380, durationText: "4 hr 05 mins", durationSec: 14700 },
    st_anton: { distanceText: "270 km", distanceKm: 270, durationText: "3 hr 25 mins", durationSec: 12300 },
    champery: { distanceText: "305 km", distanceKm: 305, durationText: "3 hr 40 mins", durationSec: 13200 },
    st_moritz: { distanceText: "155 km", distanceKm: 155, durationText: "2 hr 35 mins", durationSec: 9300 },
    zermatt: { distanceText: "240 km", distanceKm: 240, durationText: "3 hr 15 mins", durationSec: 11700 },
    passo_tonale: { distanceText: "120 km", distanceKm: 120, durationText: "2 hr 00 mins", durationSec: 7200 }
  }
};

/**
 * Match fixed ski destinations table (Milan, Malpensa, Linate, Bergamo <-> 19 resort destinations)
 * Returns the higher (+15% / calc) prices directly for calculation.
 */
export const matchSkiFixedRoute = (fromStr: any, toStr: any) => {
  if (!fromStr || !toStr) return null;

  let origin = detectOrigin(fromStr);
  let dest = detectDestination(toStr);

  // If not matched directly, check reverse direction (e.g. Ischgl -> Malpensa)
  if (!origin || !dest) {
    origin = detectOrigin(toStr);
    dest = detectDestination(fromStr);
  }

  if (origin && dest && (tariffsData.tables as any)[origin]?.destinations?.[dest]) {
    const pricesObj = (tariffsData.tables as any)[origin].destinations[dest].prices;
    const displayPrices: Record<string, number> = {};
    for (const carType in pricesObj) {
      displayPrices[carType] = pricesObj[carType].calc;
    }
    return displayPrices;
  }

  return null;
};

const matchPredefinedRoute = (fromStr: any, toStr: any) => {
  if (typeof fromStr !== 'string' || typeof toStr !== 'string') return null;
  const f = fromStr.toLowerCase();
  const t = toStr.toLowerCase();

  const isMilan = (s: string) => s.includes("milan") && !s.includes("malpensa") && !s.includes("linate") && !s.includes("bergamo");
  const isMalpensa = (s: string) => s.includes("malpensa");
  const isLinate = (s: string) => s.includes("linate");
  const isBergamo = (s: string) => s.includes("bergamo") || s.includes("caravaggio") || s.includes("orio");

  if ((isMilan(f) && isMalpensa(t)) || (isMalpensa(f) && isMilan(t))) return predefinedRoutes["milan-malpensa"];
  if ((isMilan(f) && isBergamo(t)) || (isBergamo(f) && isMilan(t))) return predefinedRoutes["milan-bergamo"];
  if ((isMilan(f) && isLinate(t)) || (isLinate(f) && isMilan(t))) return predefinedRoutes["milan-linate"];
  if ((isMalpensa(f) && isLinate(t)) || (isLinate(f) && isMilan(t))) return predefinedRoutes["malpensa-linate"];
  if ((isMalpensa(f) && isBergamo(t)) || (isBergamo(f) && isMilan(t))) return predefinedRoutes["malpensa-bergamo"];
  if ((isLinate(f) && isBergamo(t)) || (isBergamo(f) && isLinate(t))) return predefinedRoutes["linate-bergamo"];

  return null;
};

// Pricing calculation logic
export const calculateTransferPrices = (from: any, to: any, distance: number) => {
  const safeFrom = typeof from === 'string' ? from.trim() : '';
  const safeTo = typeof to === 'string' ? to.trim() : '';

  // 1. Check Fixed Ski Resort Routes from the official PDF and Excel tables (uses +15% calc price directly)
  const skiPrices = matchSkiFixedRoute(safeFrom, safeTo);
  if (skiPrices) {
    return { prices: skiPrices, formatSpecial: true };
  }

  const routeKey = `${normalizeKey(safeFrom)}-${normalizeKey(safeTo)}`;

  // 2. Check Fixed Special Alpine Routes (e.g. Pontresina)
  if (fixedSpecialRoutes[routeKey]) {
    return { prices: fixedSpecialRoutes[routeKey], formatSpecial: true };
  }

  const fromLower = safeFrom.toLowerCase();
  const toLower = safeTo.toLowerCase();
  const isSpecial = specialPlaces.some((place) => fromLower.includes(place) || toLower.includes(place));

  // 3. Check Predefined Italian Airport Routes from Table
  const predefined = matchPredefinedRoute(safeFrom, safeTo);
  if (predefined) {
    return { prices: predefined, formatSpecial: isSpecial };
  }

  const routeKey1 = `${normalizeKey(safeFrom)}-${normalizeKey(safeTo)}`;
  const routeKey2 = `${normalizeKey(safeTo)}-${normalizeKey(safeFrom)}`;
  if (predefinedRoutes[routeKey1]) return { prices: predefinedRoutes[routeKey1], formatSpecial: isSpecial };
  if (predefinedRoutes[routeKey2]) return { prices: predefinedRoutes[routeKey2], formatSpecial: isSpecial };

  // 4. General Distance-Based Calculation
  const airportList = ["malpensa", "bergamo", "linate", "caravaggio"];
  let finalDistance: number;

  const isSurcharged = Object.keys(surchargedPlaces).some(place => fromLower.includes(place) || toLower.includes(place));

  if (isSurcharged) {
    finalDistance = (Number(distance) || 45) * 2 + 20;
  } else {
    const doubledDistance = (Number(distance) || 45) * 2;
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
    calculatedPrices[key] = Math.round(priceWithVat);
  }

  return { prices: calculatedPrices, formatSpecial: isSpecial };
};
