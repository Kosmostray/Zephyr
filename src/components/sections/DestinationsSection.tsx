import React from 'react';

interface DestinationsSectionProps {
  onSelectRoute: (fromLocation: string, toLocation: string) => void;
  onExploreAllRoutes: () => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  onSelectRoute,
  onExploreAllRoutes
}) => {
  return (
    <section id="destinations" className="scroll-mt-20 py-24 bg-[#1b1c1c]/50 px-6 md:px-16 border-y border-white/5">
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
            type="button"
            onClick={onExploreAllRoutes}
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
                type="button"
                onClick={() => onSelectRoute("Rome Fiumicino Airport (FCO)", "Rome City Center")}
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
                type="button"
                onClick={() => onSelectRoute("Milan Malpensa Airport (MXP)", "Milan City Center")}
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
                type="button"
                onClick={() => onSelectRoute("Florence Airport (FLR)", "Tuscany Boutique Villa")}
                className="text-xs text-[#f0a500] hover:underline cursor-pointer"
              >
                Select ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
