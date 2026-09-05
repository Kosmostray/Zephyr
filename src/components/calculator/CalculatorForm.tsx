import React, { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { LocationInput } from './LocationInput';
import { PassengersSelect } from './PassengersSelect';

interface CalculatorFormProps {
  from: string;
  setFrom: (val: string) => void;
  to: string;
  setTo: (val: string) => void;
  passengers: number;
  setPassengers: (val: number) => void;
  loading: boolean;
  onCalculate: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  from,
  setFrom,
  to,
  setTo,
  passengers,
  setPassengers,
  loading,
  onCalculate
}) => {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      {/* Pick-up Location */}
      <LocationInput
        label="Pick-up Location"
        icon={<MapPin size={18} className="text-[#f0a500]" />}
        value={from}
        onChange={setFrom}
        placeholder="Airport, Hotel, or City"
        isOpen={fromOpen}
        setIsOpen={setFromOpen}
        onFocusCloseOthers={() => {
          setToOpen(false);
          setPassengersOpen(false);
        }}
      />

      {/* Drop-off Destination */}
      <LocationInput
        label="Drop-off Destination"
        icon={<Navigation size={18} className="text-[#f0a500]" />}
        value={to}
        onChange={setTo}
        placeholder="Resort, Villa, or Address"
        isOpen={toOpen}
        setIsOpen={setToOpen}
        onFocusCloseOthers={() => {
          setFromOpen(false);
          setPassengersOpen(false);
        }}
      />

      {/* Passengers Selector */}
      <PassengersSelect
        passengers={passengers}
        setPassengers={setPassengers}
        isOpen={passengersOpen}
        setIsOpen={setPassengersOpen}
        onFocusCloseOthers={() => {
          setFromOpen(false);
          setToOpen(false);
        }}
      />

      {/* Calculate Button */}
      <button
        type="button"
        onClick={onCalculate}
        disabled={!from || !to || loading}
        className="bg-[#f0a500] hover:bg-[#d99400] text-[#131313] h-[46px] md:h-[48px] rounded-xl font-bold text-xs uppercase tracking-wider amber-glow transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#f0a500]/20"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Calculating...</span>
          </>
        ) : (
          <span>Calculate Route</span>
        )}
      </button>
    </div>
  );
};
