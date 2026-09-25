import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Bus } from 'lucide-react';
import { BusCard } from './BusCard';
import { busFleet, calculateBusPrice } from '../../constants/buses';
import { BusSpec, SelectedVehicle } from '../../types';

interface BusSliderProps {
  from: string;
  to: string;
  distanceText: string;
  passengers: number;
  selectedVehicle: SelectedVehicle | null;
  onSelectBus: (bus: BusSpec, clientPrice: number, driverPrice: number, isAirportFixed: boolean) => void;
}

export const BusSlider: React.FC<BusSliderProps> = ({
  from,
  to,
  distanceText,
  passengers,
  selectedVehicle,
  onSelectBus
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const distanceKm = parseFloat(distanceText.replace(/[^0-9.]/g, '')) || 45;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#f0a500]/20 text-[#f0a500]">
            <Bus size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-serif">
              Executive Bus & Coach Fleet ({passengers}+ Guests)
            </h3>
            <p className="text-xs text-white/50">
              VIP Minibuses, Mercedes Sprinters & Grand Tourism Coaches
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-[#f0a500] bg-[#f0a500]/10 px-2.5 py-1 rounded-full border border-[#f0a500]/30 hidden sm:inline-block">
          5 Options Available
        </span>
      </div>

      <div className="relative group/slider">
        <button
          type="button"
          onClick={() => listRef.current?.scrollBy({ left: -370, behavior: 'smooth' })}
          className="absolute -left-2.5 sm:-left-4 md:-left-5 top-1/2 -translate-y-1/2 bg-[#131313]/95 border border-white/20 hover:border-[#f0a500] p-2.5 sm:p-3 rounded-full text-[#f0a500] z-30 hover:bg-[#f0a500] hover:text-black transition-all shadow-xl shadow-black/70 cursor-pointer active:scale-95 flex items-center justify-center"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>

        <div
          ref={listRef}
          className="flex flex-row gap-4 sm:gap-5 overflow-x-auto py-2 px-1 snap-x snap-mandatory scroll-smooth custom-scrollbar"
          style={{ scrollbarWidth: 'thin' }}
        >
          {busFleet.map((bus) => {
            const pricing = calculateBusPrice(bus, from, to, distanceKm);
            const isSelected = selectedVehicle?.type === bus.name;

            return (
              <BusCard
                key={bus.id}
                bus={bus}
                clientPrice={pricing.clientPrice}
                driverPrice={pricing.driverPrice}
                isAirportFixed={pricing.isAirportFixed}
                isSelected={isSelected}
                onSelect={(selectedBus, clientP, driverP) => {
                  onSelectBus(selectedBus, clientP, driverP, pricing.isAirportFixed);
                }}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => listRef.current?.scrollBy({ left: 370, behavior: 'smooth' })}
          className="absolute -right-2.5 sm:-right-4 md:-right-5 top-1/2 -translate-y-1/2 bg-[#131313]/95 border border-white/20 hover:border-[#f0a500] p-2.5 sm:p-3 rounded-full text-[#f0a500] z-30 hover:bg-[#f0a500] hover:text-black transition-all shadow-xl shadow-black/70 cursor-pointer active:scale-95 flex items-center justify-center"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>
      </div>
    </div>
  );
};
