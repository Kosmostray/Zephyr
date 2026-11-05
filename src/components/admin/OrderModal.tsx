import React, { useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  Car, 
  Bus, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  TrendingUp,
  MessageCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Order } from '../../types';

interface OrderModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: 'taken' | 'completed' | 'cancelled') => Promise<void>;
  actionLoading?: string | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  actionLoading
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  const isBus = order.category === 'bus';
  const cleanPhone = (order.client?.phone || '').replace(/[^0-9+]/g, '');
  const waPhone = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone;

  const orderDate = new Date(order.pickupDate || order.createdAt);
  const formattedDate = !isNaN(orderDate.getTime()) 
    ? orderDate.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    : 'Date not set';
  const formattedTime = !isNaN(orderDate.getTime())
    ? orderDate.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : '';

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'taken':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#141414] border border-[#f0a500]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-white/[0.02] flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm sm:text-base font-bold text-[#f0a500] tracking-wider">
                {order.id}
              </span>
              <span className="text-white/20">•</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider ${
                isBus ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {isBus ? <Bus size={12} /> : <Car size={12} />}
                <span>{order.vehicleType}</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
              <CalendarIcon size={13} className="text-[#f0a500]" />
              <span>{formattedDate} {formattedTime && `at ${formattedTime}`}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Route Journey Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
            <div className="text-xs uppercase font-mono tracking-wider text-white/40 font-semibold">
              Route Itinerary
            </div>
            <div className="text-base sm:text-xl font-bold text-white flex items-center gap-2.5 flex-wrap">
              <span>{order.from}</span>
              <span className="text-[#f0a500] font-black shrink-0">➔</span>
              <span>{order.to}</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 pt-2 border-t border-white/5 text-xs sm:text-sm font-mono text-white/70 flex-wrap">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#f0a500]" />
                <span>{order.distance}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#f0a500]" />
                <span>{order.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-[#f0a500]" />
                <span>{order.passengers} Passengers</span>
              </div>
              {order.luggage !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Briefcase size={14} className="text-[#f0a500]" />
                  <span>{order.luggage} Bags</span>
                </div>
              )}
            </div>
          </div>

          {/* Client Details & Fast Actions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
            <div className="text-xs uppercase font-mono tracking-wider text-white/40 font-semibold">
              Passenger & Contact Information
            </div>
            <div className="text-base font-bold text-white">
              {order.client?.name || 'Unnamed Client'}
            </div>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {order.client?.phone && (
                <>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[#f0a500] border border-[#f0a500]/30 text-xs font-mono font-medium transition-all"
                  >
                    <Phone size={13} />
                    <span>{order.client.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${waPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium transition-all"
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp</span>
                  </a>
                </>
              )}
              {order.client?.email && (
                <a
                  href={`mailto:${order.client.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-mono transition-all"
                >
                  <Mail size={13} />
                  <span>{order.client.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Flight & Custom Notes */}
          {(order.client?.flightNotes || order.client?.customNotes) && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-[#f0a500] font-semibold">
                <FileText size={14} />
                <span>Flight Notes / Chauffeur Instructions</span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 italic leading-relaxed whitespace-pre-wrap pl-1">
                {order.client.customNotes || order.client.flightNotes}
              </p>
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="space-y-2.5">
            <div className="text-xs uppercase font-mono tracking-wider text-white/40 font-semibold">
              Financial Breakdown & Settlement
            </div>
            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="bg-black/60 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] sm:text-xs text-white/40 block uppercase">Driver Payout</span>
                <span className="text-base sm:text-lg font-bold text-blue-400">
                  {order.driverPrice > 0 ? `€${Math.round(order.driverPrice)}` : 'On Request'}
                </span>
              </div>
              <div className="bg-black/60 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] sm:text-xs text-white/40 block uppercase">Client Price</span>
                <span className="text-base sm:text-lg font-bold text-emerald-400">
                  {order.clientPrice > 0 ? `€${Math.round(order.clientPrice)}` : 'On Request'}
                </span>
              </div>
              <div className="bg-black/60 p-3 rounded-2xl border border-[#f0a500]/40 bg-[#f0a500]/5">
                <span className="text-[10px] sm:text-xs text-[#f0a500] block uppercase font-bold">Operator Profit</span>
                <span className="text-base sm:text-lg font-bold text-[#f0a500]">
                  {order.profit > 0 ? `€${Math.round(order.profit)}` : '—'}
                </span>
              </div>
            </div>

            {/* Payment Details Badge */}
            {order.payment?.type && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-center">
                {order.payment.type === 'deposit_30' ? (
                  <span className="text-[#f0a500]">
                    💳 Stripe 30% Deposit Paid: <strong>€{order.payment.amountPaid}</strong> · Remaining Cash Balance: <strong>€{order.payment.remainingCash}</strong>
                  </span>
                ) : order.payment.type === 'full' ? (
                  <span className="text-emerald-400">
                    ✓ Stripe 100% Fully Paid Online: <strong>€{order.payment.amountPaid}</strong>
                  </span>
                ) : (
                  <span className="text-amber-300">
                    🛎 Custom Lake Como Quote Request (No online prepayment charged)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Assigned Driver (if taken) */}
          {order.takenBy && (
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                <CheckCircle2 size={16} />
                <span>Assigned Chauffeur: {order.takenBy.driverName}</span>
              </div>
              {order.takenBy.driverPhone && (
                <a href={`tel:${order.takenBy.driverPhone}`} className="font-mono text-cyan-400 hover:underline">
                  {order.takenBy.driverPhone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {onUpdateStatus && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-end gap-2.5 flex-wrap">
            {order.status === 'pending' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'taken')}
                disabled={actionLoading === order.id}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                Mark as Taken
              </button>
            )}

            {order.status !== 'completed' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'completed')}
                disabled={actionLoading === order.id}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                Mark as Completed
              </button>
            )}

            {order.status !== 'cancelled' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                disabled={actionLoading === order.id}
                className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-mono text-xs font-semibold cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel Order
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono cursor-pointer transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
