import React from 'react';
import { Users, Mail, Phone } from 'lucide-react';

export const GroupTransferNotice: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#f0a500]/10 to-transparent border border-[#f0a500]/40 text-center space-y-4">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#f0a500]/20 flex items-center justify-center text-[#f0a500]">
        <Users size={24} />
      </div>
      <h3 className="font-serif text-xl font-bold text-white">VIP Delegation & Group Transfer</h3>
      <p className="text-white/80 max-w-lg mx-auto text-sm leading-relaxed">
        Your request for 10+ passengers requires customized convoy coordination and specialized logistics. Our concierge team will prepare a bespoke itinerary within 30 minutes.
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
  );
};
