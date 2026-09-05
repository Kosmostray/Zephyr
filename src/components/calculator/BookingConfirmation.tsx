import React from 'react';
import { CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { SelectedVehicle, PriceResult } from '../../types';

interface BookingConfirmationProps {
  bookingRefCode: string;
  selectedVehicle: SelectedVehicle;
  result: PriceResult;
  from: string;
  to: string;
  onBookAnother: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingRefCode,
  selectedVehicle,
  result,
  from,
  to,
  onBookAnother
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#f0a500]/15 via-black/60 to-black/80 border border-[#f0a500]/50 text-center space-y-5 shadow-2xl">
      <div className="w-16 h-16 mx-auto rounded-full bg-[#f0a500]/20 border border-[#f0a500]/40 flex items-center justify-center text-[#f0a500]">
        <CheckCircle2 size={36} />
      </div>

      <div>
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#f0a500]">
          Reservation Dispatched
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Thank You! Your Transfer is Booked
        </h3>
        <p className="text-white/80 max-w-md mx-auto text-xs sm:text-sm mt-2 leading-relaxed">
          Our VIP dispatch desk has registered your reservation under code{' '}
          <strong className="text-[#f0a500] font-mono text-base">{bookingRefCode}</strong>.
          You will receive full driver and vehicle details via email and WhatsApp.
        </p>
      </div>

      <div className="bg-black/50 border border-white/10 p-4 rounded-xl max-w-md mx-auto text-left text-xs space-y-2 font-mono">
        <div className="flex justify-between">
          <span className="text-white/50">Route:</span>
          <span className="text-white font-semibold">{from} ➔ {to}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Vehicle:</span>
          <span className="text-[#f0a500] font-semibold">{selectedVehicle.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Distance / Time:</span>
          <span className="text-white">{result.distance} ({result.duration})</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-white/50">Fixed Price:</span>
          <span className="text-[#f0a500] font-bold text-sm">€{Math.round(selectedVehicle.price)}</span>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap justify-center gap-3">
        <a
          href={`https://wa.me/390212345678?text=Hello%20Zephyr,%20I%20have%20reservation%20${bookingRefCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20bd5a] text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2"
        >
          <MessageCircle size={15} /> Message Concierge on WhatsApp
        </a>
        <button
          type="button"
          onClick={onBookAnother}
          className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          Book Another Transfer
        </button>
      </div>
    </div>
  );
};
