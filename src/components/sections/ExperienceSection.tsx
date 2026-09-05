import React from 'react';

export const ExperienceSection: React.FC = () => {
  return (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Punctuality Card */}
        <div className="relative isolate min-h-[380px] sm:min-h-[420px] rounded-2xl md:rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 border border-white/15 shadow-2xl flex flex-col justify-end p-6 sm:p-8 md:p-10 text-left bg-[#131313]">
          <img 
            src="./Absolute Punctuality.jpg" 
            alt="Absolute Punctuality" 
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/65 to-black/10 z-10 pointer-events-none"></div>
          <div className="relative z-20">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f0a500] block mb-2 font-semibold">
              Precision On Time
            </span>
            <h3 className="font-serif text-2xl font-bold mb-3 text-white group-hover:text-[#f0a500] transition-colors">
              Absolute Punctuality
            </h3>
            <p className="text-white/80 text-sm leading-relaxed font-normal">
              Precision is our heritage. We monitor flights and real-time traffic to guarantee your chauffeur is staged 15 minutes prior to your arrival.
            </p>
          </div>
        </div>

        {/* Local Mastery Card */}
        <div className="relative isolate min-h-[380px] sm:min-h-[420px] rounded-2xl md:rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 border border-white/15 shadow-2xl flex flex-col justify-end p-6 sm:p-8 md:p-10 text-left bg-[#131313]">
          <img 
            src="./Local Mastery.jpg" 
            alt="Local Mastery" 
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/65 to-black/10 z-10 pointer-events-none"></div>
          <div className="relative z-20">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f0a500] block mb-2 font-semibold">
              Elite Drivers
            </span>
            <h3 className="font-serif text-2xl font-bold mb-3 text-white group-hover:text-[#f0a500] transition-colors">
              Local Mastery
            </h3>
            <p className="text-white/80 text-sm leading-relaxed font-normal">
              Our chauffeurs are certified multilingual ambassadors, navigating Milan's restricted zones and winding coastal cliffs with effortless grace.
            </p>
          </div>
        </div>

        {/* Pristine Fleet Card */}
        <div className="relative isolate min-h-[380px] sm:min-h-[420px] rounded-2xl md:rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 border border-white/15 shadow-2xl flex flex-col justify-end p-6 sm:p-8 md:p-10 text-left bg-[#131313]">
          <img 
            src="./Pristine Fleet.jpg" 
            alt="Pristine Fleet" 
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/65 to-black/10 z-10 pointer-events-none"></div>
          <div className="relative z-20">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f0a500] block mb-2 font-semibold">
              Luxury Vehicles
            </span>
            <h3 className="font-serif text-2xl font-bold mb-3 text-white group-hover:text-[#f0a500] transition-colors">
              Pristine Fleet
            </h3>
            <p className="text-white/80 text-sm leading-relaxed font-normal">
              From executive S-Class sedans to luxury V-Class transporters, every vehicle offers high-speed Wi-Fi, chilled mineral water, and sanitization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
