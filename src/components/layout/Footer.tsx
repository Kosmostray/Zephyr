import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0e0e0e] border-t border-white/5 pt-16 pb-12 px-6 md:px-16 text-xs text-white/60">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="space-y-4">
          <img 
            src="./logo.png" 
            alt="ZEPHYR Transfer" 
            className="h-8 sm:h-9 w-auto object-contain"
          />
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
  );
};
