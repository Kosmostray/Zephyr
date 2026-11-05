import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Car, 
  Bus, 
  MapPin, 
  Clock, 
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Order } from '../../types';

interface AdminCalendarProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

const WEEKDAYS_DESKTOP = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAYS_MOBILE = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const AdminCalendar: React.FC<AdminCalendarProps> = ({ orders, onSelectOrder }) => {
  // Calendar viewed month
  const [currentDate, setCurrentDate] = useState(() => {
    // If there are orders, pick the date of the latest order, otherwise today
    if (orders.length > 0) {
      const latestOrder = [...orders].sort((a, b) => 
        new Date(b.pickupDate || b.createdAt).getTime() - new Date(a.pickupDate || a.createdAt).getTime()
      )[0];
      const d = new Date(latestOrder.pickupDate || latestOrder.createdAt);
      if (!isNaN(d.getTime())) {
        return new Date(d.getFullYear(), d.getMonth(), 1);
      }
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Group orders by date string YYYY-MM-DD
  const ordersByDate = useMemo(() => {
    const map: Record<string, Order[]> = {};
    orders.forEach((order) => {
      const raw = order.pickupDate || order.createdAt;
      if (!raw) return;
      const d = new Date(raw);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[key]) map[key] = [];
      map[key].push(order);
    });

    // Sort orders on the same day by time
    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => {
        const timeA = new Date(a.pickupDate || a.createdAt).getTime();
        const timeB = new Date(b.pickupDate || b.createdAt).getTime();
        return timeA - timeB;
      });
    });

    return map;
  }, [orders]);

  // Default selected day to today or the first day in month with orders
  const [selectedDayKey, setSelectedDayKey] = useState<string>(() => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return todayKey;
  });

  // When month changes, if current selected day is not in this month, select first day of month or first day with orders
  useEffect(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    if (!selectedDayKey.startsWith(prefix)) {
      // Find first day with orders in this month
      const match = Object.keys(ordersByDate).find(k => k.startsWith(prefix));
      if (match) {
        setSelectedDayKey(match);
      } else {
        setSelectedDayKey(`${prefix}-01`);
      }
    }
  }, [year, month, ordersByDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDayKey(todayKey);
  };

  // Build grid days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Convert Sunday(0) to 6, Mon(1) to 0
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const daysInMonth = lastDayOfMonth.getDate();

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevDays = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, d);
      const key = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      prevDays.push({
        dayNumber: d,
        dateKey: key,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Current month days
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const currentDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      currentDays.push({
        dayNumber: d,
        dateKey: key,
        isCurrentMonth: true,
        isToday: key === todayKey
      });
    }

    // Next month filler days
    const totalFilled = prevDays.length + currentDays.length;
    const totalCells = totalFilled > 35 ? 42 : 35;
    const nextDays = [];
    for (let d = 1; d <= totalCells - totalFilled; d++) {
      const nextDate = new Date(year, month + 1, d);
      const key = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      nextDays.push({
        dayNumber: d,
        dateKey: key,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return [...prevDays, ...currentDays, ...nextDays];
  }, [year, month]);

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Get status pill style for desktop
  const getStatusPill = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25';
      case 'taken':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25';
      case 'completed':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20 opacity-60 line-through';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  // Status dot color for mobile
  const getStatusDot = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-[#f0a500]';
      case 'taken':
        return 'bg-cyan-400';
      case 'completed':
        return 'bg-emerald-400';
      case 'cancelled':
        return 'bg-red-400';
      default:
        return 'bg-white/50';
    }
  };

  const selectedDayOrders = selectedDayKey ? (ordersByDate[selectedDayKey] || []) : [];
  const selectedDateObj = selectedDayKey ? new Date(selectedDayKey) : null;
  const formattedSelectedDate = selectedDateObj && !isNaN(selectedDateObj.getTime())
    ? selectedDateObj.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    : '';

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Calendar Header Controls */}
      <div className="flex flex-row items-center justify-between gap-3 bg-black/40 p-3 sm:p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#f0a500]/15 border border-[#f0a500]/30 flex items-center justify-center text-[#f0a500] shrink-0">
            <CalendarIcon size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-2xl font-serif font-bold text-white tracking-wide">
              {monthName}
            </h2>
            <p className="hidden sm:block text-xs text-white/40 font-mono">
              Monthly Schedule & Fleet Dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium text-[#f0a500] cursor-pointer transition-all active:scale-95"
          >
            Today
          </button>
          <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Weekday headers: abbreviated for mobile, 3-letter for desktop */}
        <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.02]">
          {WEEKDAYS_DESKTOP.map((day, idx) => (
            <div
              key={day}
              className="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-white/50"
            >
              <span className="sm:hidden">{WEEKDAYS_MOBILE[idx]}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-white/10">
          {calendarDays.map((cell) => {
            const dayOrders = ordersByDate[cell.dateKey] || [];
            const isSelected = selectedDayKey === cell.dateKey;
            const hasOrders = dayOrders.length > 0;

            return (
              <div
                key={cell.dateKey}
                onClick={() => setSelectedDayKey(cell.dateKey)}
                className={`min-h-[52px] sm:min-h-[135px] p-1 sm:p-2.5 flex flex-col justify-between transition-all cursor-pointer relative ${
                  !cell.isCurrentMonth
                    ? 'bg-black/80 opacity-25 hover:opacity-50'
                    : isSelected
                    ? 'bg-[#f0a500]/10 ring-2 ring-[#f0a500] z-10'
                    : 'bg-black/40 hover:bg-white/[0.03]'
                }`}
              >
                {/* Day Header (Number & Badges) */}
                <div className="flex items-center justify-center sm:justify-between gap-1">
                  <span
                    className={`text-xs sm:text-sm font-mono font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full transition-all ${
                      cell.isToday
                        ? 'bg-[#f0a500] text-black font-bold shadow-md'
                        : isSelected
                        ? 'text-[#f0a500] font-bold'
                        : cell.isCurrentMonth
                        ? 'text-white/80'
                        : 'text-white/30'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {/* Desktop ride badge */}
                  {hasOrders && (
                    <span className="hidden sm:inline-flex text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#f0a500]/20 text-[#f0a500] border border-[#f0a500]/30 shrink-0">
                      {dayOrders.length} {dayOrders.length === 1 ? 'ride' : 'rides'}
                    </span>
                  )}
                </div>

                {/* Mobile indicators: neat colored dots under date number */}
                {hasOrders && (
                  <div className="sm:hidden flex items-center justify-center gap-1 mt-1 pb-0.5">
                    {dayOrders.slice(0, 3).map((ord) => (
                      <span
                        key={ord.id}
                        className={`w-1.5 h-1.5 rounded-full ${getStatusDot(ord.status)}`}
                      />
                    ))}
                    {dayOrders.length > 3 && (
                      <span className="text-[8px] font-mono text-[#f0a500] font-bold">
                        +{dayOrders.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Desktop orders preview pills */}
                <div className="hidden sm:flex space-y-1 overflow-hidden flex-1 flex-col justify-start mt-1">
                  {dayOrders.slice(0, 3).map((order) => {
                    const orderTime = new Date(order.pickupDate || order.createdAt);
                    const timeStr = !isNaN(orderTime.getTime())
                      ? orderTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                      : '';
                    const isBus = order.category === 'bus';

                    const fromShort = order.from.split(',')[0].trim();
                    const toShort = order.to.split(',')[0].trim();

                    return (
                      <button
                        key={order.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        className={`w-full text-left px-1.5 py-1 rounded-lg border text-[11px] font-mono leading-tight transition-all cursor-pointer truncate flex items-center gap-1.5 shadow-sm ${getStatusPill(
                          order.status
                        )}`}
                        title={`${order.id} • ${order.from} ➔ ${order.to} (${order.status})`}
                      >
                        <span className="shrink-0">
                          {isBus ? <Bus size={10} /> : <Car size={10} />}
                        </span>
                        {timeStr && <span className="font-bold shrink-0">{timeStr}</span>}
                        <span className="truncate">
                          {fromShort} ➔ {toShort}
                        </span>
                      </button>
                    );
                  })}

                  {dayOrders.length > 3 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDayKey(cell.dateKey);
                      }}
                      className="text-[10px] font-mono text-[#f0a500] hover:underline text-left pl-1"
                    >
                      +{dayOrders.length - 3} more...
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Section (Essential on Mobile, very clean on Desktop) */}
      <div className="bg-black/50 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl text-left">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-[#f0a500]" />
            <h3 className="font-serif font-bold text-white text-sm sm:text-base">
              Rides on {formattedSelectedDate}
            </h3>
            {selectedDayOrders.length > 0 && (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#f0a500]/20 text-[#f0a500] border border-[#f0a500]/30">
                {selectedDayOrders.length} {selectedDayOrders.length === 1 ? 'ride' : 'rides'}
              </span>
            )}
          </div>
          <span className="text-[11px] text-white/40 font-mono hidden sm:inline">
            Tap a ride card to view details
          </span>
        </div>

        {selectedDayOrders.length === 0 ? (
          <div className="py-6 text-center text-white/40 text-xs sm:text-sm">
            <AlertCircle size={20} className="mx-auto mb-1.5 opacity-40 text-[#f0a500]" />
            <span>No rides scheduled for this date. Tap any highlighted date on the calendar.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedDayOrders.map((order) => {
              const orderTime = new Date(order.pickupDate || order.createdAt);
              const timeStr = !isNaN(orderTime.getTime())
                ? orderTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                : '';
              const isBus = order.category === 'bus';

              return (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="p-3.5 sm:p-4 rounded-xl bg-black/60 hover:bg-white/[0.04] border border-white/10 hover:border-[#f0a500]/40 transition-all cursor-pointer flex flex-col justify-between gap-3 group active:scale-[0.99]"
                >
                  <div className="space-y-1.5">
                    {/* Header: ID, Category & Time */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#f0a500] group-hover:underline">
                          {order.id}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-white/60">
                          {isBus ? <Bus size={11} className="text-purple-400" /> : <Car size={11} className="text-blue-400" />}
                          <span className="truncate max-w-[110px]">{order.vehicleType}</span>
                        </span>
                      </div>
                      {timeStr && (
                        <div className="flex items-center gap-1 text-xs font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                          <Clock size={11} className="text-[#f0a500]" />
                          <span>{timeStr}</span>
                        </div>
                      )}
                    </div>

                    {/* Route */}
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 leading-snug">
                      <span className="truncate">{order.from}</span>
                      <span className="text-[#f0a500] shrink-0 font-black">➔</span>
                      <span className="truncate">{order.to}</span>
                    </div>

                    {/* Passenger & Client */}
                    <div className="text-xs text-white/60 font-mono flex items-center gap-3 pt-0.5">
                      <span className="truncate">{order.client?.name || 'Guest'}</span>
                      <span className="text-white/20">•</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Users size={11} className="text-[#f0a500]" /> {order.passengers}
                      </span>
                      {order.luggage !== undefined && (
                        <>
                          <span className="text-white/20">•</span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Briefcase size={11} className="text-[#f0a500]" /> {order.luggage}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Footer: Status, Price & Arrow */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded-full uppercase text-[10px] font-bold border ${getStatusPill(order.status)}`}>
                      {order.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">
                        {order.clientPrice > 0 ? `€${Math.round(order.clientPrice)}` : 'On Request'}
                      </span>
                      <ArrowRight size={13} className="text-white/40 group-hover:text-[#f0a500] transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
