import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { popularPlaces, getPlaceIcon } from '../../constants/places';

interface LocationInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onFocusCloseOthers?: () => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
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

  const matchingPlaces = popularPlaces.filter(p => 
    p.toLowerCase().includes(value.toLowerCase().trim())
  );

  return (
    <div className="text-left relative" ref={containerRef}>
      <label className="block text-xs uppercase tracking-wider text-white/70 mb-2 font-medium">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onFocus={() => {
            onFocusCloseOthers?.();
            setIsOpen(true);
          }}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-black/50 border border-white/20 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] focus:bg-black/70 text-sm text-white placeholder-white/40 transition-all cursor-text min-h-[46px]"
        />
      </div>

      {/* Autocomplete Dropdown - only opens when there are matching places */}
      <AnimatePresence>
        {isOpen && matchingPlaces.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#161616]/95 backdrop-blur-2xl border border-[#f0a500]/30 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.9)] max-h-60 overflow-y-auto p-1.5 flex flex-col gap-0.5"
          >
            <div className="px-3.5 py-2 text-xs sm:text-[10px] uppercase font-bold tracking-wider text-[#f0a500] border-b border-white/10 mb-1 flex items-center justify-between">
              <span>Popular Hubs & Resorts</span>
              <span className="text-white/50 text-[11px] sm:text-[10px] font-normal lowercase tracking-normal">
                {matchingPlaces.length} popular places
              </span>
            </div>
            {matchingPlaces.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(p);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3.5 py-3 sm:py-2 text-sm sm:text-xs text-white/95 hover:text-[#f0a500] hover:bg-[#f0a500]/15 rounded-lg transition-all flex items-center gap-3 group cursor-pointer active:bg-[#f0a500]/25"
              >
                {getPlaceIcon(p)}
                <span className="truncate">{p}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
