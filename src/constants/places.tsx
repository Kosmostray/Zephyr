import React from 'react';
import { Plane, Anchor, Home, Building2, MapPin } from 'lucide-react';

export const popularPlaces = [
  "Milan Malpensa Airport (MXP)",
  "Milan Linate Airport (LIN)",
  "Bergamo Airport (BGY)",
  "Milan City Center",
  "Courmayeur",
  "Cervinia",
  "Cortina d'Ampezzo",
  "Madonna di Campiglio",
  "Sestriere",
  "Val Gardena",
  "Passo Tonale",
  "Champéry, Switzerland",
  "St. Moritz, Switzerland",
  "Zermatt / Täsch",
  "Ischgl, Austria",
  "Kitzbühel, Austria",
  "St. Anton, Austria",
  "Sölden, Austria",
  "Mayrhofen, Austria",
  "Saalbach, Austria",
  "Alpbach, Austria",
  "Obergurgl, Austria",
  "Söll, Austria",
  "Lake Como (Bellagio)",
  "Lake Como (Tremezzo)",
  "Florence Airport (FLR)",
  "Tuscany Boutique Villa",
  "Rome Fiumicino Airport (FCO)",
  "Genoa Port"
];

export const getPlaceIcon = (place: string) => {
  const s = place.toLowerCase();
  if (s.includes('airport') || s.includes('(mxp)') || s.includes('(lin)') || s.includes('(bgy)') || s.includes('(flr)') || s.includes('(fco)')) {
    return <Plane size={16} className="text-[#f0a500] shrink-0 transition-transform group-hover:scale-110" />;
  }
  if (s.includes('port') || s.includes('genoa port')) {
    return <Anchor size={16} className="text-[#f0a500] shrink-0 transition-transform group-hover:scale-110" />;
  }
  if (
    s.includes('villa') || s.includes('resort') || s.includes('chalet') ||
    s.includes('cervinia') || s.includes('cortina') || s.includes('courmayeur') ||
    s.includes('campiglio') || s.includes('sestriere') || s.includes('gardena') ||
    s.includes('tonale') || s.includes('champery') || s.includes('moritz') ||
    s.includes('zermatt') || s.includes('ischgl') || s.includes('kitzbühel') ||
    s.includes('kitzbuhel') || s.includes('anton') || s.includes('sölden') ||
    s.includes('solden') || s.includes('mayrhofen') || s.includes('saalbach') ||
    s.includes('alpbach') || s.includes('obergurgl') || s.includes('söll') ||
    s.includes('soll') || s.includes('como') || s.includes('bellagio') ||
    s.includes('tremezzo')
  ) {
    return <Home size={16} className="text-[#f0a500] shrink-0 transition-transform group-hover:scale-110" />;
  }
  if (s.includes('city') || s.includes('center')) {
    return <Building2 size={16} className="text-[#f0a500] shrink-0 transition-transform group-hover:scale-110" />;
  }
  return <MapPin size={16} className="text-[#f0a500] shrink-0 transition-transform group-hover:scale-110" />;
};
