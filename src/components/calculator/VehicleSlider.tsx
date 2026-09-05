import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VehicleCard } from './VehicleCard';

interface VehicleSliderProps {
  prices: Record<string, number>;
  passengers: number;
  selectedVehicle: { type: string; price: number } | null;
  onSelectVehicle: (type: string, price: number) => void;
}

export const VehicleSlider: React.FC<VehicleSliderProps> = ({
  prices,
  passengers,
  selectedVehicle,
  onSelectVehicle
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const vehicleEntries = Object.entries(prices).filter(([type]) => {
    if (passengers >= 5) {
      return ["Standard Van", "Business Van", "Business Van Plus", "Minibus 10 pax"].includes(type);
    }
    return true;
  });

  return (
    <div className="relative group/slider">
      <button
        type="button"
        onClick={() => listRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
        className="absolute -left-2.5 sm:-left-4 md:-left-5 top-1/2 -translate-y-1/2 bg-[#131313]/95 border border-white/20 hover:border-[#f0a500] p-2.5 sm:p-3 rounded-full text-[#f0a500] z-30 hover:bg-[#f0a500] hover:text-black transition-all shadow-xl shadow-black/70 cursor-pointer active:scale-95 flex items-center justify-center"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
      </button>

      <div
        ref={listRef}
        className="flex flex-row gap-3.5 sm:gap-5 overflow-x-auto py-2 px-1 snap-x snap-mandatory scroll-smooth custom-scrollbar"
        style={{ scrollbarWidth: 'thin' }}
      >
        {vehicleEntries.map(([type, price]) => (
          <VehicleCard
            key={type}
            type={type}
            price={price}
            passengers={passengers}
            isSelected={selectedVehicle?.type === type}
            onSelect={onSelectVehicle}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => listRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
        className="absolute -right-2.5 sm:-right-4 md:-right-5 top-1/2 -translate-y-1/2 bg-[#131313]/95 border border-white/20 hover:border-[#f0a500] p-2.5 sm:p-3 rounded-full text-[#f0a500] z-30 hover:bg-[#f0a500] hover:text-black transition-all shadow-xl shadow-black/70 cursor-pointer active:scale-95 flex items-center justify-center"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} className="sm:w-[22px] sm:h-[22px]" />
      </button>
    </div>
  );
};
