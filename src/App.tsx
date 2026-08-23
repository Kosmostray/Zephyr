/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Users, 
  Calculator, 
  Loader2, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Clock,
  Car,
  Briefcase,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);

  const vehicleImages: Record<string, string> = {
    "Standard": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/dfyj5emyiaisjgou1fxmedvu?v=1759389843093",
    "Business": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/k9xjbij03csxlt5orlu7veka?v=1759390357228",
    "Luxury": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/a4qhtccckpqtot4p49c2sr42?v=1759390176281",
    "Standard Van": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/ad46vgkfw6cu7e5zgd1c0fj1?v=1759392152829",
    "Business Van": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/bdlnqmk2bpzp7sx7k5qpa3ca?v=1759390205057",
    "Business Van Plus": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/i2yvneq3xe9t2h7865rb0emv?v=1759390217493",
    "Minibus 10 pax": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/ajv5hkm578ixo66moc0mkcvi?v=1759390229893"
  };

  const vehicleSpecs: Record<string, { model: string; capacity: string; luggage: string; desc: string }> = {
    "Standard": { model: "Mercedes-Benz CLA / C-Class", capacity: "3 Guests", luggage: "2 Bags", desc: "Sleek and efficient for city hops." },
    "Business": { model: "Mercedes-Benz E-Class", capacity: "3 Guests", luggage: "2 Bags", desc: "The executive benchmark of discretion and luxury." },
    "Luxury": { model: "Mercedes-Benz S-Class", capacity: "3 Guests", luggage: "3 Bags", desc: "First-class travel with extended legroom and privacy." },
    "Standard Van": { model: "Mercedes-Benz Vito", capacity: "6 Guests", luggage: "6 Bags", desc: "Spacious group travel with pristine comfort." },
    "Business Van": { model: "Mercedes-Benz V-Class", capacity: "7 Guests", luggage: "7 Bags", desc: "The ultimate lounge on wheels for families & teams." },
    "Business Van Plus": { model: "Mercedes-Benz V-Class Extra Long", capacity: "8 Guests", luggage: "8 Bags", desc: "Maximum luggage space and supreme seating." },
    "Minibus 10 pax": { model: "Mercedes-Benz Sprinter VIP", capacity: "10 Guests", luggage: "10 Bags", desc: "Exclusive private transporter for delegations." }
  };

  const popularPlaces = [
    "Milan Malpensa Airport (MXP)",
    "Milan Linate Airport (LIN)",
    "Bergamo Airport (BGY)",
    "Milan City Center",
    "Lake Como (Bellagio)",
    "Lake Como (Tremezzo)",
    "St. Moritz, Switzerland",
    "Zermatt / Täsch",
    "Florence Airport (FLR)",
    "Tuscany Boutique Villa",
    "Rome Fiumicino Airport (FCO)",
    "Genoa Port"
  ];

  const handleCalculate = async () => {
    if (!from || !to) return;
    setLoading(true);
    setBookingConfirmed(null);

    try {
      const fromLower = from.toLowerCase();
      const toLower = to.toLowerCase();

      let element: any = null;
      let distanceValue = 0;

      // Static estimates for popular airport & city pairings
      if ((fromLower.includes('milan') && toLower.includes('malpensa')) || (fromLower.includes('malpensa') && toLower.includes('milan'))) {
        element = { distance: { text: "45.1 km", value: 45100 }, duration: { text: "42 mins", value: 2520 } };
        distanceValue = 45.1;
      } else if ((fromLower.includes('milan') && toLower.includes('linate')) || (fromLower.includes('linate') && toLower.includes('milan'))) {
        element = { distance: { text: "11.8 km", value: 11800 }, duration: { text: "25 mins", value: 1500 } };
        distanceValue = 11.8;
      } else if ((fromLower.includes('milan') && toLower.includes('bergamo')) || (fromLower.includes('bergamo') && toLower.includes('milan'))) {
        element = { distance: { text: "52.4 km", value: 52400 }, duration: { text: "50 mins", value: 3000 } };
        distanceValue = 52.4;
      } else if ((fromLower.includes('malpensa') && toLower.includes('linate')) || (fromLower.includes('linate') && toLower.includes('malpensa'))) {
        element = { distance: { text: "58.0 km", value: 58000 }, duration: { text: "50 mins", value: 3000 } };
        distanceValue = 58.0;
      } else if ((fromLower.includes('malpensa') && toLower.includes('bergamo')) || (fromLower.includes('bergamo') && toLower.includes('malpensa'))) {
        element = { distance: { text: "91.2 km", value: 91200 }, duration: { text: "1 hr 15 mins", value: 4500 } };
        distanceValue = 91.2;
      } else if ((fromLower.includes('linate') && toLower.includes('bergamo')) || (fromLower.includes('bergamo') && toLower.includes('linate'))) {
        element = { distance: { text: "48.5 km", value: 48500 }, duration: { text: "45 mins", value: 2700 } };
        distanceValue = 48.5;
      } else if ((fromLower.includes('milan') && toLower.includes('como')) || (fromLower.includes('como') && toLower.includes('milan'))) {
        element = { distance: { text: "51.0 km", value: 51000 }, duration: { text: "55 mins", value: 3300 } };
        distanceValue = 51.0;
      } else if ((fromLower.includes('florence') && toLower.includes('tuscany')) || (fromLower.includes('tuscany') && toLower.includes('florence'))) {
        element = { distance: { text: "68.2 km", value: 68200 }, duration: { text: "1 hr 10 mins", value: 4200 } };
        distanceValue = 68.2;
      } else if (fromLower.includes('rome') && toLower.includes('rome')) {
        element = { distance: { text: "32.0 km", value: 32000 }, duration: { text: "35 mins", value: 2100 } };
        distanceValue = 32.0;
      } else {
        // Try backend proxy if available
        try {
          const improve = (loc: string) => {
            if (loc.toLowerCase().trim() === 'milan') return 'Milan, Metropolitan City of Milan, Italy';
            if (['rome', 'venice', 'florence', 'naples'].includes(loc.toLowerCase().trim())) return `${loc}, Italy`;
            return loc;
          };
          const response = await fetch("/api/distance", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origin: improve(from), destination: improve(to) })
          });
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'OK' && data.rows?.[0]?.elements?.[0]?.status === 'OK') {
              element = data.rows[0].elements[0];
              distanceValue = element.distance.value / 1000;
            }
          }
        } catch {
          // Backend not reachable (e.g. static GitHub Pages demo)
        }

        // Graceful fallback estimate for demo testing
        if (!element) {
          element = {
            distance: { text: "45.0 km", value: 45000 },
            duration: { text: "45 mins", value: 2700 }
          };
          distanceValue = 45.0;
        }
      }
      
      // Calculate prices using local logic
      const { calculateTransferPrices } = await import('./pricing');
      const priceResult = calculateTransferPrices(from, to, distanceValue);
      
      setResult({
        distance: element.distance.text,
        duration: element.duration.text,
        prices: priceResult.prices,
        formatSpecial: priceResult.formatSpecial
      });
    } catch (e) {
      alert("Error calculating quote: " + e);
    } finally {
      setLoading(false);
    }
  };

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1] flex flex-col font-sans selection:bg-[#f0a500] selection:text-[#131313]">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/70 nav-blur border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center px-6 md:px-16 py-5 max-w-[1440px] mx-auto">
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-widest text-[#f0a500] transition-transform group-hover:scale-105">
              ZEPHYR
            </span>
            <span className="text-[10px] tracking-[0.25em] text-white/50 uppercase font-mono hidden sm:inline-block">
              CHAUFFEUR
            </span>
          </a>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <a href="#hero" className="text-[#f0a500] border-b-2 border-[#f0a500] pb-1 transition-all">
              Home
            </a>
            <a href="#experience" className="text-[#e4e2e1]/70 hover:text-[#f0a500] transition-colors">
              Experience
            </a>
            <a href="#destinations" className="text-[#e4e2e1]/70 hover:text-[#f0a500] transition-colors">
              Destinations
            </a>
            <a href="#fleet" className="text-[#e4e2e1]/70 hover:text-[#f0a500] transition-colors">
              Fleet
            </a>
          </div>

          <button 
            onClick={scrollToCalculator}
            className="bg-[#f0a500] text-[#131313] px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider amber-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>Book Now</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
          {/* Hero Cinematic Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#131313] z-10"></div>
            <img 
              className="w-full h-full object-cover object-center scale-105 animate-pulse"
              style={{ animationDuration: '8s' }}
              alt="Zephyr luxury chauffeur vehicle on Italian coast at golden hour"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTZ65tOqc5_xyijzljfjlFSPkuHAnQ49MpXm819BQCCCrxoOK5r9UuhcBojjD_5Uu8-yKNWLQUFCwW9VO1AsUoZdzf1iFqtfI0Uz7pHsn45RzwvsrYyc1SAx4_qb3cxMz8zL_f2ZN5GC8LVL1z-JQykAoaC6v_aM6Sf4gf3_hXXwLJWx9mB9JE3eFaoGEu50a_i0vFIToeWFXB7yf1ic6qCFjCA2F4qtRlKMvmlrDaW-bBJgGRjsnaskQ2Da9gzxI6OOXJa2UUFWs"
            />
          </div>

          <div className="relative z-20 w-full max-w-[1440px] px-6 md:px-16 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-xs uppercase tracking-widest text-[#f0a500]">
                <ShieldCheck size={14} /> Premier Chauffeur Services in Italy
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-glow max-w-5xl tracking-tight text-white">
                Excellence in Every Kilometre
              </h1>
              <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-light">
                Discreet, punctual, and tailor-made luxury transfers across Milan, Lake Como, Tuscany, Rome, and the Swiss Alps.
              </p>
            </motion.div>

            {/* Travel Calculator Card */}
            <div ref={calculatorRef} className="w-full max-w-5xl">
              <div className="liquid-glass p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl border border-white/15">
                <AnimatePresence mode="wait">
                  {!result ? (
                    <motion.div
                      key="calculator-form"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end"
                    >
                      {/* Starting Point Input */}
                      <div className="flex flex-col gap-2 text-left">
                        <label className="text-[11px] font-semibold tracking-wider text-[#c4c7c7] uppercase">
                          Starting Point
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0a500]" size={18} />
                          <input
                            list="places-from"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] text-sm text-white placeholder-white/40 transition-all"
                            placeholder="Florence Airport (FLR)"
                            type="text"
                          />
                          <datalist id="places-from">
                            {popularPlaces.map((place) => (
                              <option key={place} value={place} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* Destination Input */}
                      <div className="flex flex-col gap-2 text-left">
                        <label className="text-[11px] font-semibold tracking-wider text-[#c4c7c7] uppercase">
                          Destination
                        </label>
                        <div className="relative">
                          <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0a500]" size={18} />
                          <input
                            list="places-to"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] text-sm text-white placeholder-white/40 transition-all"
                            placeholder="Tuscany Boutique Villa"
                            type="text"
                          />
                          <datalist id="places-to">
                            {popularPlaces.map((place) => (
                              <option key={place} value={place} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* Passengers Selector */}
                      <div className="flex flex-col gap-2 text-left">
                        <label className="text-[11px] font-semibold tracking-wider text-[#c4c7c7] uppercase">
                          Passengers
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0a500]" size={18} />
                          <select
                            value={passengers}
                            onChange={(e) => setPassengers(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] text-sm text-white transition-all appearance-none cursor-pointer [&>option]:bg-[#1b1c1c] [&>option]:text-white"
                          >
                            <option value={1}>1-2 Guests (Sedan / Coupe)</option>
                            <option value={3}>3-4 Guests (Executive Sedan)</option>
                            <option value={5}>5-7 Guests (Luxury Van)</option>
                            <option value={8}>8-9 Guests (Extra Long Van)</option>
                            <option value={10}>10+ Guests (VIP Delegation)</option>
                          </select>
                        </div>
                      </div>

                      {/* Submit CTA Button */}
                      <button
                        onClick={handleCalculate}
                        disabled={!from || !to || loading}
                        className="bg-[#f0a500] hover:bg-[#d99400] text-[#131313] h-[48px] md:h-[50px] rounded-xl font-bold text-xs uppercase tracking-wider amber-glow transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#f0a500]/20"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>Calculating...</span>
                          </>
                        ) : (
                          <>
                            <Calculator size={16} />
                            <span>Find My Chauffeur</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  ) : (
                    /* Quote Results View */
                    <motion.div
                      key="calculator-result"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="text-left space-y-6"
                    >
                      {/* Top Bar: Back Button & 3x Larger Route Details */}
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border-b border-white/10 pb-5">
                        <button
                          type="button"
                          onClick={() => setResult(null)}
                          className="text-[#f0a500] hover:text-white flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider bg-white/5 py-2.5 px-4 md:px-5 rounded-xl hover:bg-white/10 transition-all cursor-pointer border border-[#f0a500]/30 hover:border-[#f0a500] shadow-sm"
                        >
                          <ArrowLeft size={18} /> Modify Route
                        </button>
                        
                        {/* 3x Larger Distance & Duration Badges */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                          <div className="flex-1 sm:flex-initial bg-black/50 border border-white/15 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center gap-3 sm:gap-4 shadow-xl">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f0a500]/15 flex items-center justify-center text-[#f0a500] flex-shrink-0">
                              <MapPin size={22} />
                            </div>
                            <div>
                              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-white/50 block font-semibold">Distance</span>
                              <span className="font-mono text-xl sm:text-2xl md:text-3xl text-[#f0a500] font-bold leading-tight block">{result.distance}</span>
                            </div>
                          </div>

                          <div className="flex-1 sm:flex-initial bg-black/50 border border-white/15 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center gap-3 sm:gap-4 shadow-xl">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f0a500]/15 flex items-center justify-center text-[#f0a500] flex-shrink-0">
                              <Clock size={22} />
                            </div>
                            <div>
                              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-white/50 block font-semibold">Duration</span>
                              <span className="font-mono text-xl sm:text-2xl md:text-3xl text-[#f0a500] font-bold leading-tight block">{result.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Route Path summary */}
                      <div className="flex items-center gap-3 text-base sm:text-lg font-medium px-1">
                        <span className="text-white font-bold">{from}</span>
                        <span className="text-[#f0a500] font-bold text-xl">➔</span>
                        <span className="text-white font-bold">{to}</span>
                      </div>

                      {/* Group Workflow if >= 10 Guests */}
                      {passengers >= 10 ? (
                        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#f0a500]/10 to-transparent border border-[#f0a500]/40 text-center space-y-4">
                          <div className="w-12 h-12 mx-auto rounded-full bg-[#f0a500]/20 flex items-center justify-center text-[#f0a500]">
                            <Users size={24} />
                          </div>
                          <h3 className="font-serif text-xl font-bold text-white">VIP Delegation & Group Transfer</h3>
                          <p className="text-white/80 max-w-lg mx-auto text-sm leading-relaxed">
                            Your request for 10+ guests requires customized convoy coordination and specialized logistics. Our concierge team will prepare a bespoke itinerary within 30 minutes.
                          </p>
                          <div className="pt-2 flex flex-wrap justify-center gap-4">
                            <a
                              href="mailto:concierge@zephyrtransfer.com?subject=Custom%20VIP%20Group%20Quote"
                              className="bg-[#f0a500] text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider amber-glow hover:scale-105 transition-all inline-flex items-center gap-2"
                            >
                              <Mail size={16} /> Contact Concierge
                            </a>
                            <a
                              href="tel:+390212345678"
                              className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all inline-flex items-center gap-2"
                            >
                              <Phone size={16} /> +39 02 1234 5678
                            </a>
                          </div>
                        </div>
                      ) : (
                        /* Vehicles Cards Horizontal Slider (Fixed Height & Width) */
                        <div className="relative group/slider">
                          {/* Left Navigation Arrow */}
                          <button
                            type="button"
                            onClick={() => listRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 bg-[#131313]/95 border border-white/20 hover:border-[#f0a500] p-2.5 md:p-3 rounded-full text-[#f0a500] z-30 hover:bg-[#f0a500] hover:text-black transition-all shadow-xl shadow-black/60 cursor-pointer active:scale-95"
                            aria-label="Scroll left"
                          >
                            <ChevronLeft size={22} />
                          </button>

                          {/* Horizontal Track */}
                          <div 
                            ref={listRef}
                            className="flex flex-row gap-5 overflow-x-auto py-2 px-1 snap-x snap-mandatory scroll-smooth custom-scrollbar"
                            style={{ scrollbarWidth: 'thin' }}
                          >
                            {Object.entries(result.prices)
                              .filter(([type]) => {
                                if (passengers >= 5) {
                                  return ["Standard Van", "Business Van", "Business Van Plus", "Minibus 10 pax"].includes(type);
                                }
                                return true;
                              })
                              .map(([type, price]: any) => {
                                const spec = vehicleSpecs[type] || { model: type, capacity: `${passengers} Guests`, luggage: "Bags", desc: "Premium chauffeur service." };
                                const isBooked = bookingConfirmed === type;

                                return (
                                  <div
                                    key={type}
                                    className={`glass-card p-5 md:p-6 rounded-2xl flex flex-col justify-between transition-all group flex-shrink-0 w-[290px] sm:w-[310px] md:w-[330px] snap-start select-none ${
                                      isBooked ? 'border-[#f0a500] bg-[#f0a500]/10 shadow-[0_0_25px_rgba(240,165,0,0.25)] ring-2 ring-[#f0a500]' : ''
                                    }`}
                                  >
                                    <div>
                                      {/* Vehicle Image */}
                                      <div className="relative w-full h-[145px] overflow-hidden rounded-xl mb-4 bg-black/60 border border-white/10 shadow-inner">
                                        <img
                                          src={vehicleImages[type]}
                                          alt={type}
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Enlarged Photo Badge */}
                                        <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold font-mono text-[#f0a500] uppercase border border-[#f0a500]/40 tracking-wider shadow-lg">
                                          {type}
                                        </div>
                                      </div>

                                      {/* Title & Model */}
                                      <div className="mb-2">
                                        <h4 className="font-serif font-bold text-xl md:text-2xl text-white group-hover:text-[#f0a500] transition-colors truncate">
                                          {type}
                                        </h4>
                                        <p className="text-xs md:text-sm text-white/70 truncate mt-0.5">{spec.model}</p>
                                      </div>

                                      {/* Capacity Spec Badges (Enlarged) */}
                                      <div className="flex items-center gap-2.5 mt-3 mb-2">
                                        <span className="flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1 rounded-lg text-xs md:text-sm font-medium text-white/90">
                                          <Users size={15} className="text-[#f0a500]" /> {spec.capacity}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1 rounded-lg text-xs md:text-sm font-medium text-white/90">
                                          <Briefcase size={15} className="text-[#f0a500]" /> {spec.luggage}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Price & Action Section */}
                                    <div className="pt-2">
                                      {/* Fixed Rate (ABOVE the horizontal separator) */}
                                      <div className="flex items-baseline justify-between pt-2">
                                        <span className="text-xs uppercase font-mono tracking-widest text-white/50 font-semibold">Fixed Rate</span>
                                        <span className="text-2xl md:text-3xl font-mono font-bold text-[#f0a500]">
                                          €{Math.round(price)}
                                        </span>
                                      </div>

                                      {/* Horizontal Separator */}
                                      <div className="w-full h-px bg-white/15 my-3.5 group-hover:bg-white/25 transition-colors"></div>

                                      {/* Select Button (BELOW separator, full-width and centered) */}
                                      <button
                                        type="button"
                                        onClick={() => setBookingConfirmed(type)}
                                        className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-md ${
                                          isBooked
                                            ? 'bg-[#f0a500] text-black shadow-lg shadow-[#f0a500]/40 font-extrabold ring-2 ring-[#f0a500]'
                                            : 'bg-white/10 hover:bg-[#f0a500] hover:text-black text-white hover:shadow-lg hover:shadow-[#f0a500]/20'
                                        }`}
                                      >
                                        {isBooked ? (
                                          <>
                                            <CheckCircle2 size={18} /> Selected
                                          </>
                                        ) : (
                                          'Select'
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          {/* Right Navigation Arrow */}
                          <button
                            type="button"
                            onClick={() => listRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 bg-[#131313]/95 border border-white/20 hover:border-[#f0a500] p-2.5 md:p-3 rounded-full text-[#f0a500] z-30 hover:bg-[#f0a500] hover:text-black transition-all shadow-xl shadow-black/60 cursor-pointer active:scale-95"
                            aria-label="Scroll right"
                          >
                            <ChevronRight size={22} />
                          </button>
                        </div>
                      )}

                      {/* Confirmation Banner */}
                      {bookingConfirmed && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-[#f0a500]/15 border border-[#f0a500] flex flex-col sm:flex-row items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-[#f0a500] flex-shrink-0" size={20} />
                            <span className="text-xs sm:text-sm text-white">
                              You selected <strong className="text-[#f0a500]">{bookingConfirmed}</strong> for your journey from {from} to {to}.
                            </span>
                          </div>
                          <button 
                            onClick={() => alert(`Thank you! Your booking request for ${bookingConfirmed} has been registered. Our concierge will contact you shortly.`)}
                            className="bg-[#f0a500] hover:bg-[#d99400] text-black px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider amber-glow cursor-pointer whitespace-nowrap"
                          >
                            Complete Reservation
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* The Zephyr Experience Section */}
        <section id="experience" className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f0a500] mb-2 block">
              Distinctive Heritage
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-white">
              The Zephyr Experience
            </h2>
            <div className="w-16 h-1 bg-[#f0a500] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Punctuality Card */}
            <div className="liquid-glass p-8 md:p-10 rounded-2xl group hover:-translate-y-2 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#f0a500]/10 border border-[#f0a500]/30 flex items-center justify-center text-[#f0a500] mb-6 group-hover:scale-110 transition-transform">
                <Clock size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-white">Absolute Punctuality</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Precision is our heritage. We monitor flights and real-time traffic to guarantee your chauffeur is staged 15 minutes prior to your arrival.
              </p>
            </div>

            {/* Local Expertise Card */}
            <div className="liquid-glass p-8 md:p-10 rounded-2xl group hover:-translate-y-2 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#f0a500]/10 border border-[#f0a500]/30 flex items-center justify-center text-[#f0a500] mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-white">Local Mastery</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Our chauffeurs are certified multilingual ambassadors, navigating Milan's restricted zones and winding coastal cliffs with effortless grace.
              </p>
            </div>

            {/* Premium Fleet Card */}
            <div className="liquid-glass p-8 md:p-10 rounded-2xl group hover:-translate-y-2 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#f0a500]/10 border border-[#f0a500]/30 flex items-center justify-center text-[#f0a500] mb-6 group-hover:scale-110 transition-transform">
                <Car size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-white">Pristine Fleet</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                From executive S-Class sedans to luxury V-Class transporters, every vehicle offers high-speed Wi-Fi, chilled mineral water, and sanitization.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Destinations Bento Grid */}
        <section id="destinations" className="py-24 bg-[#1b1c1c]/50 px-6 md:px-16 border-y border-white/5">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#f0a500] mb-2 block">
                  Curated Itineraries
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Popular Destinations</h2>
                <p className="text-white/60 text-sm mt-1">Exclusive transfers across the crown jewels of Italy and the Alps.</p>
              </div>
              <button 
                onClick={scrollToCalculator}
                className="text-[#f0a500] font-semibold text-xs uppercase tracking-wider border-b border-[#f0a500]/40 hover:border-[#f0a500] pb-1 transition-all cursor-pointer"
              >
                Explore All Routes ➔
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[580px]">
              {/* Rome */}
              <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-2xl min-h-[300px]">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Rome Colosseum at twilight"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPO8TWwTeEV74cmmkeIqV4Vxo1V1bGQz0W5smwhCxDnrZarD32O3W_4OefVoy5lI73eN7Sp4dht1AMvLRZT0OugEeEO2rd2TgnJmc9wEOaA_W0iiR9EkwZdbCJA3eRL3fJhY21yMHeJc2PBlt9Imn13nqzEfhOy57lQSYPwPaygQsZ2ayr58PCc_u-tXnunaFERclsJAmvnYKddVR7yg90rNhsgqabzsh7PTaIBSJ17mATXzee8CyFo4hgoSZRZ9-v0HNqpgAH77w"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <span className="text-[#f0a500] text-xs font-mono uppercase tracking-widest block mb-1">The Eternal City</span>
                    <h4 className="font-serif text-2xl md:text-3xl font-bold text-white">Rome</h4>
                  </div>
                  <button 
                    onClick={() => { setFrom("Rome Fiumicino Airport (FCO)"); setTo("Rome City Center"); scrollToCalculator(); }}
                    className="bg-white/20 hover:bg-[#f0a500] hover:text-black text-white text-xs uppercase font-bold py-2 px-4 rounded-lg backdrop-blur-md transition-all cursor-pointer"
                  >
                    Quote Route
                  </button>
                </div>
              </div>

              {/* Milan */}
              <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-2xl min-h-[220px]">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Milan Duomo at night"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFAUAOAackK-HWC2hBpUPAdn1JMY8j8P1s1Dn7ZnapfuLsT2R3LocULu1O30OX8RgczsYpFoTpqNb8gBAGfS7o3Xgf_4as8BXm-UlGFTCIkO-LPvasnMSW68mqpz6z0uggR8ZLrf0qynjoCasJ9yOYGaXlwKayh8TcyWxBQvPsP0NNOh08hH4NFub13yRWV3yl2D0PeLjWj3KsJ4wOydFtsNbsWhQKNdQIa57FF0fu2_MIpfzaDp-hc3m-mI27NAx8nTT8mfmbGjU"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <span className="text-[#f0a500] text-[10px] font-mono uppercase tracking-widest block">Fashion & Finance</span>
                    <h4 className="font-serif text-xl font-bold text-white">Milan</h4>
                  </div>
                  <button 
                    onClick={() => { setFrom("Milan Malpensa Airport (MXP)"); setTo("Milan City Center"); scrollToCalculator(); }}
                    className="text-xs text-[#f0a500] hover:underline cursor-pointer"
                  >
                    Select ➔
                  </button>
                </div>
              </div>

              {/* Florence */}
              <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-2xl min-h-[220px]">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Florence romantic view"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIF54_HqViyECfVeeBmhJotfnJC5vvRAih9PkmTLl1wURfgDE9DmsTPEJRxO_tHFrTFCNc0pFd1DEvJeei4nlHUtQNr5yF2TFrDUawQvMQwBNdzPn68LjHSR4dt5ElqJ3wl5eUNNV390EFsSrruJHQuPNJNPbfp6_ohfLHU7ppnqwfz89AU7VBJ1gICxX1UjeskvwTpU3ns1o_ivcT8M-D6B5b3vz0gx89gB6msWE1awiOVaCtOw_MrMpzgV3lybvvVB8zJaSJ4ig"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <span className="text-[#f0a500] text-[10px] font-mono uppercase tracking-widest block">Renaissance Heart</span>
                    <h4 className="font-serif text-xl font-bold text-white">Florence</h4>
                  </div>
                  <button 
                    onClick={() => { setFrom("Florence Airport (FLR)"); setTo("Tuscany Boutique Villa"); scrollToCalculator(); }}
                    className="text-xs text-[#f0a500] hover:underline cursor-pointer"
                  >
                    Select ➔
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Showcase Bento */}
        <section id="fleet" className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f0a500] mb-2 block">
              The Flagship Collection
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-white">Our Fleet Classes</h2>
            <p className="text-white/60 text-sm max-w-xl mx-auto">
              Every vehicle is maintained to obsessive European safety standards with complimentary amenities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-black/40">
                <img src={vehicleImages["Business"]} alt="Executive Sedan" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#f0a500] uppercase block mb-1">Executive Class</span>
                <h3 className="font-serif text-xl font-bold text-white mb-2">Mercedes-Benz E-Class</h3>
                <p className="text-xs text-white/60 mb-4">Quiet luxury tailored for seamless corporate commutes and airport transfers.</p>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
                <span>3 Passengers · 2 Bags</span>
                <span className="text-[#f0a500] font-semibold">Leather Interior</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-[#f0a500]/30 shadow-[0_0_30px_rgba(240,165,0,0.06)]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-black/40">
                <img src={vehicleImages["Luxury"]} alt="First Class Sedan" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#f0a500] uppercase block mb-1">First Class</span>
                <h3 className="font-serif text-xl font-bold text-white mb-2">Mercedes-Benz S-Class</h3>
                <p className="text-xs text-white/60 mb-4">Uncompromising elegance with reclining seats, acoustic glass, and privacy curtains.</p>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
                <span>3 Passengers · 3 Bags</span>
                <span className="text-[#f0a500] font-semibold">Ultimate Comfort</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-black/40">
                <img src={vehicleImages["Business Van"]} alt="Luxury Transporter" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#f0a500] uppercase block mb-1">Luxury Transporter</span>
                <h3 className="font-serif text-xl font-bold text-white mb-2">Mercedes-Benz V-Class</h3>
                <p className="text-xs text-white/60 mb-4">Face-to-face conference seating and spacious capacity for executive teams or families.</p>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
                <span>7 Passengers · 7 Bags</span>
                <span className="text-[#f0a500] font-semibold">Mobile Office</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] border-t border-white/5 pt-16 pb-12 px-6 md:px-16 text-xs text-white/60">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="font-serif text-2xl font-bold tracking-widest text-[#f0a500]">ZEPHYR</div>
            <p className="text-white/50 text-xs leading-relaxed max-w-xs">
              Crafting elite chauffeur-driven transportation experiences across Italy's and Europe's most prestigious routes.
            </p>
          </div>

          <div>
            <div className="text-white font-semibold uppercase tracking-wider mb-4">Fleet Categories</div>
            <ul className="space-y-2.5">
              <li><a href="#fleet" className="hover:text-[#f0a500] transition-colors">Executive Sedan (E-Class)</a></li>
              <li><a href="#fleet" className="hover:text-[#f0a500] transition-colors">First Class (S-Class)</a></li>
              <li><a href="#fleet" className="hover:text-[#f0a500] transition-colors">Luxury Van (V-Class)</a></li>
              <li><a href="#fleet" className="hover:text-[#f0a500] transition-colors">VIP Sprinter Minibus</a></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold uppercase tracking-wider mb-4">Direct Contact</div>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <MapPin size={13} className="text-[#f0a500]" /> Milan Central Office, Via Montenapoleone
              </li>
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[#f0a500]" /> +39 02 1234 5678 (24/7 Dispatch)
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-[#f0a500]" /> bookings@zephyrtransfer.com
              </li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold uppercase tracking-wider mb-4">Service Standards</div>
            <p className="text-white/50 text-xs leading-relaxed mb-3">
              Complimentary 60-minute wait time for airport arrivals and 15-minute wait time for hotel departures.
            </p>
            <div className="inline-flex items-center gap-2 text-[#f0a500] font-mono text-[11px]">
              <ShieldCheck size={14} /> Full Liability & Luxury Insurance
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© 2026 Zephyr Transfer. Excellence in Motion. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Chauffeur Agreement</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

