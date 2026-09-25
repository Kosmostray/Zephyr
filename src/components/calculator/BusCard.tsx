import React from 'react';
import { Users, Clock, Plane, CheckCircle2 } from 'lucide-react';
import { BusSpec } from '../../types';

interface BusCardProps {
  bus: BusSpec;
  clientPrice: number;
  driverPrice: number;
  isAirportFixed: boolean;
  isSelected: boolean;
  onSelect: (bus: BusSpec, clientPrice: number, driverPrice: number) => void;
}

export const BusCard: React.FC<BusCardProps> = ({
  bus,
  clientPrice,
  driverPrice,
  isAirportFixed,
  isSelected,
  onSelect
}) => {
  return (
    <div
      className={`glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between transition-all group flex-shrink-0 w-[310px] sm:w-[350px] md:w-[380px] snap-center select-none text-left border ${
        isSelected
          ? 'border-[#f0a500] ring-2 ring-[#f0a500]/50 bg-[#1e1c18]/95 shadow-2xl shadow-black/80'
          : 'border-white/15 hover:border-[#f0a500]/60 bg-black/50 hover:bg-black/60 shadow-xl'
      }`}
    >
      <div>
        {/* Bus Image with Capacity Badge */}
        <div className="relative w-full h-[160px] sm:h-[180px] overflow-hidden rounded-xl sm:rounded-2xl mb-4 bg-black/70 border border-white/10 shadow-inner">
          <img
            src={bus.image}
            alt={bus.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Prominent Capacity Badge */}
          <div className="absolute top-3 right-3 bg-black/90 backdrop-blur-md border border-[#f0a500]/60 text-[#f0a500] font-mono font-bold text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5">
            <Users size={14} className="text-[#f0a500]" />
            <span>{bus.capacity}</span>
          </div>

          {isAirportFixed && (
            <div className="absolute bottom-3 left-3 bg-[#f0a500] text-black font-sans font-extrabold text-[11px] sm:text-xs uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg">
              Fixed Airport Rate
            </div>
          )}
        </div>

        {/* Bus Title & Details */}
        <div className="mb-3">
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide truncate">
            {bus.name}
          </h4>
          <p className="text-[#f0a500] text-xs sm:text-sm font-mono font-semibold mt-0.5">
            {bus.model}
          </p>
          <p className="text-white/70 text-xs sm:text-sm line-clamp-2 mt-1.5 leading-relaxed">
            {bus.desc}
          </p>
        </div>

        {/* Hourly Rate & Airport Fixed Rate Info Blocks */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          {/* Hourly Rate Block */}
          <div className="bg-black/60 p-3 sm:p-3.5 rounded-xl border border-white/15 hover:border-white/25 transition-all text-left">
            <div className="flex items-center gap-1.5 text-white/60 text-xs font-mono uppercase tracking-wider">
              <Clock size={13} className="text-[#f0a500] shrink-0" />
              <span>Hourly Rate</span>
            </div>
            <div className="mt-1 font-mono text-base sm:text-lg font-bold text-white">
              €{bus.hourlyRate}<span className="text-xs sm:text-sm text-white/50 font-normal"> / hr</span>
            </div>
          </div>

          {/* Airport Fixed Rate Block */}
          <div className="bg-black/60 p-3 sm:p-3.5 rounded-xl border border-white/15 hover:border-white/25 transition-all text-left">
            <div className="flex items-center gap-1.5 text-white/60 text-xs font-mono uppercase tracking-wider">
              <Plane size={13} className="text-[#f0a500] shrink-0" />
              <span>Milan Airport</span>
            </div>
            <div className="mt-1 font-mono text-base sm:text-lg font-bold text-[#f0a500]">
              €{bus.fixedAirportPrice}<span className="text-xs sm:text-sm text-white/50 font-normal"> fixed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing and Action */}
      <div className="mt-2 pt-4 border-t border-white/10 flex flex-col items-center">
        <div className="text-center mb-3">
          <span className="text-xs uppercase font-mono tracking-wider text-white/60 font-medium block">
            {isAirportFixed ? 'Fixed Airport Total' : 'Calculated Route Total'}
          </span>
          <div className="text-3xl sm:text-4xl font-bold font-mono text-[#f0a500] tracking-tight mt-0.5">
            €{Math.round(clientPrice)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(bus, clientPrice, driverPrice)}
          className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            isSelected
              ? 'bg-white text-black font-extrabold shadow-lg shadow-white/20'
              : 'bg-[#f0a500] hover:bg-[#d99400] text-black amber-glow active:scale-95 shadow-lg shadow-[#f0a500]/25'
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={18} /> Selected
            </>
          ) : (
            'Select Bus & Reserve'
          )}
        </button>
      </div>
    </div>
  );
};
