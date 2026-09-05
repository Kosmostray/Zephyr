import React from 'react';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { PriceResult, SelectedVehicle } from '../../types';
import { VehicleSlider } from './VehicleSlider';
import { GroupTransferNotice } from './GroupTransferNotice';

interface CalculationResultsProps {
  from: string;
  to: string;
  passengers: number;
  result: PriceResult;
  selectedVehicle: SelectedVehicle | null;
  onModifyRoute: () => void;
  onSelectVehicle: (type: string, price: number) => void;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({
  from,
  to,
  passengers,
  result,
  selectedVehicle,
  onModifyRoute,
  onSelectVehicle
}) => {
  return (
    <div className="text-left space-y-5 sm:space-y-6">
      {/* Route Header and Distance / Duration Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-5 border-b border-white/10 pb-4 sm:pb-5">
        <button
          type="button"
          onClick={onModifyRoute}
          className="text-[#f0a500] hover:text-white flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider bg-white/5 py-2.5 px-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer border border-[#f0a500]/30 hover:border-[#f0a500] shadow-sm whitespace-nowrap shrink-0 active:scale-95"
        >
          <ArrowLeft size={16} className="sm:w-[18px] shrink-0" />
          <span>Modify Route</span>
        </button>

        <div className="flex flex-row items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial bg-black/50 border border-white/15 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-4 shadow-xl">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#f0a500]/15 flex items-center justify-center text-[#f0a500] flex-shrink-0">
              <MapPin size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-white/50 block font-semibold">Distance</span>
              <span className="font-mono text-lg sm:text-2xl md:text-3xl text-[#f0a500] font-bold leading-tight block">{result.distance}</span>
            </div>
          </div>

          <div className="flex-1 sm:flex-initial bg-black/50 border border-white/15 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-4 shadow-xl">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#f0a500]/15 flex items-center justify-center text-[#f0a500] flex-shrink-0">
              <Clock size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-white/50 block font-semibold">Duration</span>
              <span className="font-mono text-lg sm:text-2xl md:text-3xl text-[#f0a500] font-bold leading-tight block">{result.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* From -> To display */}
      <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-medium px-1 flex-wrap">
        <span className="text-white font-bold">{from}</span>
        <span className="text-[#f0a500] font-bold text-base sm:text-xl">➔</span>
        <span className="text-white font-bold">{to}</span>
      </div>

      {/* Vehicle Slider or VIP Notice for 10+ passengers */}
      {passengers >= 10 ? (
        <GroupTransferNotice />
      ) : (
        <VehicleSlider
          prices={result.prices}
          passengers={passengers}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={onSelectVehicle}
        />
      )}
    </div>
  );
};
