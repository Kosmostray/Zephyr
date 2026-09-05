/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { PriceResult, SelectedVehicle, BookingStep, ClientFormData } from './types';
import {
  detectOrigin,
  detectDestination,
  skiRoutesDistanceDuration,
  calculateTransferPrices
} from './pricing';
import {
  GOOGLE_API_KEY,
  loadGoogleMaps,
  formatLocationQuery,
  resolveClientGoogleDistance
} from './services/googleMaps';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { FaqSection } from './components/sections/FaqSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { DestinationsSection } from './components/sections/DestinationsSection';
import { FleetSection } from './components/sections/FleetSection';
import { ContactSection } from './components/sections/ContactSection';

export default function App() {
  // Transfer route & passengers state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PriceResult | null>(null);

  // Booking process state
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);
  const [bookingStep, setBookingStep] = useState<BookingStep>('vehicles');
  const [bookingSending, setBookingSending] = useState(false);
  const [bookingRefCode, setBookingRefCode] = useState('');

  // Active navigation section state
  const [activeSection, setActiveSection] = useState('hero');

  // DOM references
  const calculatorRef = useRef<HTMLDivElement>(null);

  // Preload Google Maps API
  useEffect(() => {
    if (GOOGLE_API_KEY) {
      loadGoogleMaps(GOOGLE_API_KEY).catch(() => {});
    }
  }, []);

  // Handle route calculation
  const handleCalculate = async (overrideFrom?: any, overrideTo?: any) => {
    const originLocation = (typeof overrideFrom === 'string' && overrideFrom.trim())
      ? overrideFrom.trim() 
      : (typeof from === 'string' ? from.trim() : '');
      
    const destLocation = (typeof overrideTo === 'string' && overrideTo.trim())
      ? overrideTo.trim() 
      : (typeof to === 'string' ? to.trim() : '');

    if (!originLocation || !destLocation) return;
    setLoading(true);

    try {
      let element: any = null;
      let distanceValue = 0;

      // 1. Check fixed ski resort routes (casing, typo, Cyrillic insensitive)
      const orig = detectOrigin(originLocation) || detectOrigin(destLocation);
      const dest = detectDestination(destLocation) || detectDestination(originLocation);

      if (orig && dest && skiRoutesDistanceDuration[orig]?.[dest]) {
        const routeInfo = skiRoutesDistanceDuration[orig][dest];
        element = {
          distance: { text: routeInfo.distanceText, value: routeInfo.distanceKm * 1000 },
          duration: { text: routeInfo.durationText, value: routeInfo.durationSec }
        };
        distanceValue = routeInfo.distanceKm;
      } else {
        const fromLower = originLocation.toLowerCase();
        const toLower = destLocation.toLowerCase();
        const matches = (a: string, b: string) => 
          (fromLower.includes(a) && toLower.includes(b)) || (fromLower.includes(b) && toLower.includes(a));

        // 2. Static estimates for popular airport & city pairings
        if (matches('milan', 'malpensa')) {
          element = { distance: { text: "45.1 km", value: 45100 }, duration: { text: "42 mins", value: 2520 } };
          distanceValue = 45.1;
        } else if (matches('milan', 'linate')) {
          element = { distance: { text: "11.8 km", value: 11800 }, duration: { text: "25 mins", value: 1500 } };
          distanceValue = 11.8;
        } else if (matches('milan', 'bergamo')) {
          element = { distance: { text: "52.4 km", value: 52400 }, duration: { text: "50 mins", value: 3000 } };
          distanceValue = 52.4;
        } else if (matches('malpensa', 'linate')) {
          element = { distance: { text: "58.0 km", value: 58000 }, duration: { text: "50 mins", value: 3000 } };
          distanceValue = 58.0;
        } else if (matches('malpensa', 'bergamo')) {
          element = { distance: { text: "91.2 km", value: 91200 }, duration: { text: "1 hr 15 mins", value: 4500 } };
          distanceValue = 91.2;
        } else if (matches('linate', 'bergamo')) {
          element = { distance: { text: "48.5 km", value: 48500 }, duration: { text: "45 mins", value: 2700 } };
          distanceValue = 48.5;
        } else if (matches('milan', 'como')) {
          element = { distance: { text: "51.0 km", value: 51000 }, duration: { text: "55 mins", value: 3300 } };
          distanceValue = 51.0;
        } else if (matches('florence', 'tuscany')) {
          element = { distance: { text: "68.2 km", value: 68200 }, duration: { text: "1 hr 10 mins", value: 4200 } };
          distanceValue = 68.2;
        } else if (fromLower.includes('rome') && toLower.includes('rome')) {
          element = { distance: { text: "32.0 km", value: 32000 }, duration: { text: "35 mins", value: 2100 } };
          distanceValue = 32.0;
        } else {
          // 3. Try backend proxy if available
          try {
            const response = await fetch("/api/distance", {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                origin: formatLocationQuery(originLocation),
                destination: formatLocationQuery(destLocation)
              })
            });
            if (response.ok) {
              const data = await response.json();
              if (data.status === 'OK' && data.rows?.[0]?.elements?.[0]?.status === 'OK') {
                element = data.rows[0].elements[0];
                distanceValue = element.distance.value / 1000;
              }
            }
          } catch {
            // Backend not reachable
          }

          // 4. Fallback directly in browser via Google Maps JS API
          if (!element && GOOGLE_API_KEY) {
            try {
              const clientElement = await resolveClientGoogleDistance(
                formatLocationQuery(originLocation),
                formatLocationQuery(destLocation),
                GOOGLE_API_KEY
              );
              if (clientElement?.distance && clientElement?.duration) {
                element = clientElement;
                distanceValue = (typeof clientElement.distance.value === 'number')
                  ? clientElement.distance.value / 1000
                  : parseFloat(String(clientElement.distance.text).replace(/[^0-9.]/g, '')) || 45.0;
              }
            } catch (clientErr) {
              console.warn("Client Google Maps lookup failed:", clientErr);
            }
          }

          // 5. Graceful fallback estimate
          if (!element) {
            element = {
              distance: { text: "45.0 km", value: 45000 },
              duration: { text: "45 mins", value: 2700 }
            };
            distanceValue = 45.0;
          }
        }
      }
      
      const priceResult = calculateTransferPrices(originLocation, destLocation, distanceValue);
      
      setResult({
        distance: element?.distance?.text || "45.0 km",
        duration: element?.duration?.text || "45 mins",
        prices: priceResult.prices,
        formatSpecial: priceResult.formatSpecial
      });
      setSelectedVehicle(null);
      setBookingStep('vehicles');
    } catch (e) {
      console.error("Quote calculation error:", e);
    } finally {
      setLoading(false);
    }
  };

  // URL query parameter detection (e.g. from ads ?from=Malpensa&to=Courmayeur)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlFrom = searchParams.get('from');
      const urlTo = searchParams.get('to');
      const urlPassengers = searchParams.get('passengers');

      if (urlFrom) setFrom(urlFrom);
      if (urlTo) setTo(urlTo);
      if (urlPassengers) setPassengers(Number(urlPassengers) || 1);

      if (urlFrom && urlTo) {
        handleCalculate(urlFrom, urlTo);
        setTimeout(() => {
          calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } catch (e) {
      console.warn("Could not parse query params", e);
    }
  }, []);

  // Smooth scroll to section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Smooth scroll to calculator box
  const scrollToCalculator = () => {
    if (calculatorRef.current) {
      const navOffset = 90;
      const elementPosition = calculatorRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth'
      });
    }
  };

  // ScrollSpy listener to update active section in navbar
  useEffect(() => {
    const sectionIds = ['hero', 'faq', 'experience', 'destinations', 'fleet', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Vehicle selection handler (step 1 -> step 2)
  const handleSelectVehicle = (type: string, price: number) => {
    setSelectedVehicle({ type, price });
    setBookingStep('form');
  };

  // Booking dispatch handler (step 2 -> step 3)
  const handleBookingSubmit = (formData: ClientFormData) => {
    setBookingSending(true);
    setTimeout(() => {
      setBookingSending(false);
      const code = `ZEP-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRefCode(code);
      setBookingStep('success');
    }, 1000);
  };

  // Reset booking state
  const handleBookAnother = () => {
    setResult(null);
    setSelectedVehicle(null);
    setBookingStep('vehicles');
    setBookingRefCode('');
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1] flex flex-col font-sans selection:bg-[#f0a500] selection:text-[#131313] overflow-x-hidden w-full max-w-full relative">
      {/* Top Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onScrollToSection={scrollToSection}
        onScrollToCalculator={scrollToCalculator}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection
          calculatorRef={calculatorRef}
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          passengers={passengers}
          setPassengers={setPassengers}
          loading={loading}
          result={result}
          onCalculate={() => handleCalculate()}
          onModifyRoute={() => {
            setResult(null);
            setSelectedVehicle(null);
            setBookingStep('vehicles');
          }}
          selectedVehicle={selectedVehicle}
          bookingStep={bookingStep}
          bookingSending={bookingSending}
          bookingRefCode={bookingRefCode}
          onSelectVehicle={handleSelectVehicle}
          onBackToVehicles={() => setBookingStep('vehicles')}
          onSubmitBooking={handleBookingSubmit}
          onBookAnother={handleBookAnother}
        />

        <FaqSection />

        <ExperienceSection />

        <DestinationsSection
          onSelectRoute={(origin, dest) => {
            setFrom(origin);
            setTo(dest);
            scrollToCalculator();
          }}
          onExploreAllRoutes={scrollToCalculator}
        />

        <FleetSection />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
