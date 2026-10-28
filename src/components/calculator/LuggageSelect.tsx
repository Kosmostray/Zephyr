import React, { useRef, useEffect } from 'react';
import { Luggage, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface LuggageOption {
  value: number;
  label: string;
  desc: string;
}

export const luggageOptions: LuggageOption[] = [
  { value: 1, label: "1 Bag", desc: "Cabin / 1 Suitcase" },
  { value: 2, label: "2 Bags", desc: "Standard (Fits Sedans)" },
  { value: 3, label: "3 Bags", desc: "Medium (Fits Sedans)" },
  { value: 4, label: "4 Bags", desc: "Max capacity for Sedans" },
  { value: 5, label: "5 Bags", desc: "Large (Requires Minivan)" },
  { value: 6, label: "6 Bags", desc: "Extra Luggage (Requires Minivan)" },
  { value: 7, label: "7 Bags", desc: "Executive Van (V-Class / Plus)" },
  { value: 8, label: "8+ Bags", desc: "Bulky Luggage & Skis (Minibus)" }
];

interface LuggageSelectProps {
  luggage: number;
  setLuggage: (val: number) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onFocusCloseOthers?: () => void;
}

export const LuggageSelect: React.FC<LuggageSelectProps> = ({
  luggage,
  setLuggage,
  isOpen,
  setIsOpen,
  onFocusCloseOthers
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const selectedOption = luggageOptions.find(opt => opt.value === luggage);

  return (
    <div className="text-left relative" ref={containerRef}>
      <label className="block text-xs uppercase tracking-wider text-white/70 mb-2 font-medium">
        Luggage
      </label>
      <button
        type="button"
        onClick={() => {
          onFocusCloseOthers?.();
          setIsOpen(!isOpen);
        }}
        className={`w-full bg-black/50 border ${
          isOpen ? 'border-[#f0a500] ring-1 ring-[#f0a500]' : 'border-white/20 hover:border-[#f0a500]/50'
        } rounded-xl py-3 px-3.5 focus:outline-none focus:bg-black/70 text-sm text-white transition-all cursor-pointer flex items-center justify-between group min-h-[46px]`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Luggage className="text-[#f0a500] shrink-0" size={18} />
          <span className="truncate font-medium text-left">
            {selectedOption?.label || `${luggage} Bags`}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-white/40 group-hover:text-[#f0a500] transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-[#f0a500]' : ''
          }`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 lg:left-auto lg:right-0 w-full lg:w-[320px] top-full mt-2 z-50 bg-[#161616]/95 backdrop-blur-2xl border border-[#f0a500]/30 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.9)] max-h-64 overflow-y-auto p-1.5 flex flex-col gap-0.5"
          >
            <div className="px-3.5 py-2 text-xs sm:text-[10px] uppercase font-bold tracking-wider text-[#f0a500] border-b border-white/10 mb-1 flex items-center justify-between">
              <span>Baggage Count</span>
              <span className="text-white/50 text-[11px] sm:text-[10px] font-normal lowercase tracking-normal">
                select luggage
              </span>
            </div>
            {luggageOptions.map((opt) => {
              const isSelected = luggage === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setLuggage(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs rounded-lg transition-all flex items-center justify-between gap-3 group cursor-pointer active:bg-[#f0a500]/25 ${
                    isSelected
                      ? 'bg-[#f0a500]/20 text-[#f0a500] font-bold border border-[#f0a500]/40'
                      : 'text-white/95 hover:text-[#f0a500] hover:bg-[#f0a500]/15'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Luggage size={14} className={`shrink-0 ${isSelected ? 'text-[#f0a500]' : 'text-white/40 group-hover:text-[#f0a500]'}`} />
                    <span className="whitespace-nowrap font-medium">{opt.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50 group-hover:text-white/70 shrink-0 text-right">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
