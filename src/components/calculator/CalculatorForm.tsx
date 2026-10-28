import React, { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { LocationInput } from './LocationInput';
import { PassengersSelect } from './PassengersSelect';
import { LuggageSelect } from './LuggageSelect';

interface CalculatorFormProps {
  from: string;
  setFrom: (val: string) => void;
  to: string;
  setTo: (val: string) => void;
  passengers: number;
  setPassengers: (val: number) => void;
  luggage: number;
  setLuggage: (val: number) => void;
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
  luggage,
  setLuggage,
  loading,
  onCalculate
}) => {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);
  const [luggageOpen, setLuggageOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-end">
      {/* Pick-up Location */}
      <div className="sm:col-span-1 lg:col-span-3">
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
            setLuggageOpen(false);
          }}
        />
      </div>

      {/* Drop-off Destination */}
      <div className="sm:col-span-1 lg:col-span-3">
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
            setLuggageOpen(false);
          }}
        />
      </div>

      {/* Passengers Selector */}
      <div className="sm:col-span-1 lg:col-span-2">
        <PassengersSelect
          passengers={passengers}
          setPassengers={setPassengers}
          isOpen={passengersOpen}
          setIsOpen={setPassengersOpen}
          onFocusCloseOthers={() => {
            setFromOpen(false);
            setToOpen(false);
            setLuggageOpen(false);
          }}
        />
      </div>

      {/* Luggage Selector */}
      <div className="sm:col-span-1 lg:col-span-2">
        <LuggageSelect
          luggage={luggage}
          setLuggage={setLuggage}
          isOpen={luggageOpen}
          setIsOpen={setLuggageOpen}
          onFocusCloseOthers={() => {
            setFromOpen(false);
            setToOpen(false);
            setPassengersOpen(false);
          }}
        />
      </div>

      {/* Calculate Button */}
      <div className="sm:col-span-2 lg:col-span-2">
        <button
          type="button"
          onClick={onCalculate}
          disabled={!from || !to || loading}
          className="w-full bg-[#f0a500] hover:bg-[#d99400] text-[#131313] h-[46px] md:h-[48px] rounded-xl font-bold text-xs uppercase tracking-wider amber-glow transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#f0a500]/20"
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
    </div>
  );
};
