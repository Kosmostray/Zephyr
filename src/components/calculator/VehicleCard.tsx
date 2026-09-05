import React from 'react';
import { Users, Briefcase, CheckCircle2 } from 'lucide-react';
import { vehicleImages, vehicleSpecs } from '../../constants/fleet';

interface VehicleCardProps {
  type: string;
  price: number;
  passengers: number;
  isSelected: boolean;
  onSelect: (type: string, price: number) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  type,
  price,
  passengers,
  isSelected,
  onSelect
}) => {
  const spec = vehicleSpecs[type] || {
    model: type,
    capacity: `${passengers} Passengers`,
    luggage: "Bags",
    desc: "Premium chauffeur service."
  };

  return (
    <div className="glass-card p-4 sm:p-5 md:p-6 rounded-2xl flex flex-col justify-between transition-all group flex-shrink-0 w-[265px] sm:w-[300px] md:w-[330px] snap-center select-none text-center hover:border-[#f0a500]/50">
      <div>
        <div className="relative w-full h-[135px] sm:h-[145px] overflow-hidden rounded-xl mb-3.5 bg-black/60 border border-white/10 shadow-inner">
          <img
            src={vehicleImages[type]}
            alt={type}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold font-mono text-[#f0a500] uppercase border border-[#f0a500]/40 tracking-wider shadow-lg">
            {type}
          </div>
        </div>

        <div className="mb-2 text-center h-[62px] sm:h-[68px] flex flex-col justify-start">
          <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide truncate">
            {spec.model}
          </h4>
          <p className="text-white/60 text-[11px] sm:text-xs line-clamp-2 mt-1 px-1 leading-snug">
            {spec.desc}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 my-3 text-[11px] sm:text-xs bg-white/5 py-2 px-2.5 rounded-xl border border-white/10 h-[36px] items-center">
          <div className="flex items-center justify-center gap-1.5 text-white/90">
            <Users size={14} className="text-[#f0a500] shrink-0" />
            <span className="truncate">{spec.capacity}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-white/90">
            <Briefcase size={14} className="text-[#f0a500] shrink-0" />
            <span className="truncate">{spec.luggage}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex flex-col items-center">
        <div className="text-center mb-3">
          <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-white/50 block">
            All-Inclusive Total
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#f0a500] tracking-tight">
            €{Math.round(price)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(type, price)}
          className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            isSelected
              ? 'bg-white text-black font-extrabold shadow-lg shadow-white/20'
              : 'bg-[#f0a500] hover:bg-[#d99400] text-black amber-glow active:scale-95 shadow-md shadow-[#f0a500]/20'
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={16} /> Selected
            </>
          ) : (
            'Select & Continue'
          )}
        </button>
      </div>
    </div>
  );
};
