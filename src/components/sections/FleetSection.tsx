import React from 'react';
import { vehicleImages } from '../../constants/fleet';

export const FleetSection: React.FC = () => {
  return (
    <section id="fleet" className="scroll-mt-20 w-full relative overflow-hidden py-24 px-6 md:px-16 bg-gradient-to-b from-[#131313] via-[#1c170a] md:via-[#16130b] to-[#131313]">
      {/* Stylized Subdued Yellow / Amber Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Ambient Radial Golden Aura: rich on mobile, subtle unified wash on desktop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_35%,rgba(240,165,0,0.18),transparent_75%)] md:bg-[radial-gradient(ellipse_90%_65%_at_50%_40%,rgba(240,165,0,0.07),transparent_80%)]"></div>
        
        {/* Central Glow: concentrated on mobile, ultra-diffused and quiet on desktop */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] md:w-[1300px] h-[450px] md:h-[600px] bg-[#f0a500]/12 md:bg-[#f0a500]/5 rounded-full blur-[160px] md:blur-[220px]"></div>
        
        {/* Side spots: preserved on mobile, silenced on desktop to eliminate patchiness */}
        <div className="absolute -bottom-20 left-10 w-[550px] h-[400px] bg-[#d99400]/10 md:opacity-0 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 -right-20 w-[600px] h-[450px] bg-[#f0a500]/10 md:opacity-0 rounded-full blur-[150px]"></div>

        {/* Subtle Golden Section Dividers */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#f0a500]/30 md:via-[#f0a500]/20 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#f0a500]/30 md:via-[#f0a500]/20 to-transparent"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#f0a500] mb-2 block">
            The Flagship Collection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-white">Our Fleet Classes</h2>
          <p className="text-white/60 text-sm max-w-xl mx-auto">
            Every vehicle is maintained to obsessive European safety standards with complimentary amenities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Standard Class */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-black/40">
              <img src={vehicleImages["Standard"]} alt="Standard Sedan" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-mono text-[#f0a500] uppercase block mb-1">Standard Class</span>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Mercedes C-Class / Passat</h3>
              <p className="text-xs text-white/60 mb-4">Reliable and comfortable chauffeur service for daily city travel and efficient airport transfers.</p>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
              <span>3 Passengers · 2 Bags</span>
              <span className="text-[#f0a500] font-semibold">Comfort Sedan</span>
            </div>
          </div>

          {/* Executive Class */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-black/40">
              <img src={vehicleImages["Business"]} alt="Executive Sedan" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-mono text-[#f0a500] uppercase block mb-1">Executive Class</span>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Mercedes-Benz E-Class</h3>
              <p className="text-xs text-white/60 mb-4">Quiet luxury tailored for seamless corporate commutes and business airport transfers.</p>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
              <span>3 Passengers · 2 Bags</span>
              <span className="text-[#f0a500] font-semibold">Leather Interior</span>
            </div>
          </div>

          {/* First Class */}
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
              <span className="text-[#f0a500] font-semibold">Ultimate Luxury</span>
            </div>
          </div>

          {/* Luxury Transporter */}
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
      </div>
    </section>
  );
};
