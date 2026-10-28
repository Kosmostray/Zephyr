import React from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { SelectedVehicle, PriceResult } from '../../types';

interface BookingConfirmationProps {
  bookingRefCode: string;
  selectedVehicle?: SelectedVehicle | null;
  result?: PriceResult | null;
  from?: string;
  to?: string;
  confirmedOrder?: any;
  onBookAnother: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingRefCode,
  selectedVehicle,
  result,
  from,
  to,
  confirmedOrder,
  onBookAnother
}) => {
  const displayFrom = confirmedOrder?.from || from || 'Milan';
  const displayTo = confirmedOrder?.to || to || 'Destination';
  const displayVehicle = confirmedOrder?.vehicleType || selectedVehicle?.type || 'Executive Chauffeur';
  const displayDistance = confirmedOrder?.distance || result?.distance || '';
  const displayDuration = confirmedOrder?.duration || result?.duration || '';
  const displayPrice = confirmedOrder?.clientPrice || (selectedVehicle?.price ? Math.round(selectedVehicle.price) : 0);
  const payment = confirmedOrder?.payment;

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#f0a500]/15 via-black/60 to-black/80 border border-[#f0a500]/50 text-center space-y-5 shadow-2xl">
      <div className="w-16 h-16 mx-auto rounded-full bg-[#f0a500]/20 border border-[#f0a500]/40 flex items-center justify-center text-[#f0a500]">
        <CheckCircle2 size={36} />
      </div>

      <div>
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#f0a500]">
          {payment?.type === 'deposit_30' ? '30% Deposit Paid · Confirmed' : 'Payment Confirmed · Reserved'}
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Thank You! Your Transfer is Booked
        </h3>
        <p className="text-white/80 max-w-md mx-auto text-xs sm:text-sm mt-2 leading-relaxed">
          Our VIP dispatch desk has registered your reservation under code{' '}
          <strong className="text-[#f0a500] font-mono text-base">{bookingRefCode}</strong>.
          A confirmation with all travel details has been sent to your email.
        </p>
      </div>

      <div className="bg-black/50 border border-white/10 p-4 rounded-xl max-w-md mx-auto text-left text-xs space-y-2.5 font-mono">
        <div className="flex justify-between">
          <span className="text-white/50">Route:</span>
          <span className="text-white font-semibold">{displayFrom} ➔ {displayTo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Vehicle:</span>
          <span className="text-[#f0a500] font-semibold">{displayVehicle}</span>
        </div>
        {displayDistance && (
          <div className="flex justify-between">
            <span className="text-white/50">Distance / Time:</span>
            <span className="text-white">{displayDistance} {displayDuration ? `(${displayDuration})` : ''}</span>
          </div>
        )}
        {(confirmedOrder?.passengers || confirmedOrder?.luggage) && (
          <div className="flex justify-between">
            <span className="text-white/50">Party & Luggage:</span>
            <span className="text-white">
              {confirmedOrder?.passengers ? `${confirmedOrder.passengers} Pax` : ''}
              {confirmedOrder?.luggage ? ` · ${confirmedOrder.luggage} Bags` : ''}
            </span>
          </div>
        )}
        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-white/50">Total Price:</span>
          <span className="text-[#f0a500] font-bold text-sm">€{displayPrice}</span>
        </div>

        {payment?.type === 'deposit_30' && (
          <div className="border-t border-white/10 pt-2 space-y-1">
            <div className="flex justify-between text-emerald-400">
              <span>Paid Online (30%):</span>
              <span className="font-bold">€{payment.amountPaid}</span>
            </div>
            <div className="flex justify-between text-[#f0a500]">
              <span>Cash to Driver at Transfer:</span>
              <span className="font-bold">€{payment.remainingCash}</span>
            </div>
          </div>
        )}

        {payment?.type === 'full' && (
          <div className="border-t border-white/10 pt-2 text-emerald-400 flex justify-between">
            <span>Paid Online (100%):</span>
            <span className="font-bold">€{payment.amountPaid} (Fully Paid)</span>
          </div>
        )}
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
