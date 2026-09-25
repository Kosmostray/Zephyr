import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Car, 
  Bus, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  LogOut, 
  Phone, 
  Mail, 
  FileText, 
  Search,
  ExternalLink
} from 'lucide-react';
import { Order } from '../../types';

interface AdminDashboardProps {
  onLogout: () => void;
  onGoHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onGoHome }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'car' | 'bus'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'taken' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: 'taken' | 'completed' | 'cancelled') => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchOrders();
      }
    } catch (err) {
      console.error('Error updating order status', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.clientPrice || 0), 0);
  const totalDriverPayout = orders.reduce((sum, o) => sum + (o.driverPrice || 0), 0);
  const totalProfit = orders.reduce((sum, o) => sum + (o.profit || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  const filteredOrders = orders.filter(o => {
    if (categoryFilter !== 'all' && o.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchClient = o.client?.name?.toLowerCase().includes(q) || 
                          o.client?.phone?.includes(q) || 
                          o.client?.email?.toLowerCase().includes(q);
      const matchRoute = o.from?.toLowerCase().includes(q) || o.to?.toLowerCase().includes(q);
      const matchVehicle = o.vehicleType?.toLowerCase().includes(q);
      const matchId = o.id?.toLowerCase().includes(q);
      return matchClient || matchRoute || matchVehicle || matchId;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#101010] text-[#e4e2e1] p-4 sm:p-6 md:p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f0a500] animate-pulse"></span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Zephyr Dispatch & Operator Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Live Booking Fleet Administration · Driver Orders & Profit Margin Control
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#f0a500] flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onGoHome}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 hover:text-white flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <ExternalLink size={14} />
            <span>Customer Site</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-medium text-red-400 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 my-6">
        <div className="bg-black/50 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-xs uppercase font-mono tracking-wider">
            <span>Total Orders</span>
            <Users size={16} className="text-[#f0a500]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {orders.length}
            </span>
            {pendingCount > 0 && (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-[#f0a500] border border-[#f0a500]/30">
                {pendingCount} Pending
              </span>
            )}
          </div>
        </div>

        <div className="bg-black/50 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-xs uppercase font-mono tracking-wider">
            <span>Client Revenue</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
              €{Math.round(totalRevenue).toLocaleString()}
            </span>
            <p className="text-[10px] text-white/40 mt-0.5">Gross client bookings</p>
          </div>
        </div>

        <div className="bg-black/50 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-xs uppercase font-mono tracking-wider">
            <span>Driver Payouts</span>
            <Car size={16} className="text-blue-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-blue-400">
              €{Math.round(totalDriverPayout).toLocaleString()}
            </span>
            <p className="text-[10px] text-white/40 mt-0.5">Dispatched to chauffeurs</p>
          </div>
        </div>

        <div className="bg-black/50 border border-[#f0a500]/30 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between bg-gradient-to-br from-[#f0a500]/10 to-transparent">
          <div className="flex items-center justify-between text-[#f0a500] text-xs uppercase font-mono tracking-wider font-bold">
            <span>Operator Margin</span>
            <TrendingUp size={16} className="text-[#f0a500]" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#f0a500]">
              €{Math.round(totalProfit).toLocaleString()}
            </span>
            <p className="text-[10px] text-[#f0a500]/70 mt-0.5 font-mono">
              Net Commission: {totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 bg-black/40 p-3 sm:p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
            {(['all', 'car', 'bus'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize cursor-pointer transition-all ${
                  categoryFilter === cat
                    ? 'bg-[#f0a500] text-black font-bold shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Fleets' : cat === 'car' ? 'Cars & Vans' : 'Buses & Coaches'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs overflow-x-auto">
            {(['all', 'pending', 'taken', 'completed', 'cancelled'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-lg font-medium capitalize cursor-pointer transition-all ${
                  statusFilter === st
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client, route, ID..."
            className="w-full bg-black/60 border border-white/15 focus:border-[#f0a500] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-white/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table / Cards */}
      <div className="max-w-7xl mx-auto">
        {loading && orders.length === 0 ? (
          <div className="p-12 text-center text-white/40 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#f0a500]" />
            <span>Loading orders database...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-black/40 rounded-2xl border border-white/10 text-white/50">
            <AlertCircle size={28} className="mx-auto mb-2 text-[#f0a500]/60" />
            <p className="text-sm font-medium">No orders found matching the filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isBus = order.category === 'bus';
              return (
                <div
                  key={order.id}
                  className="bg-black/50 border border-white/10 hover:border-white/20 p-5 rounded-2xl shadow-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 text-left"
                >
                  {/* Left: Route, vehicle, status */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono text-white/40 font-semibold">{order.id}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-white/50 font-mono">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                      <span className="text-white/20">•</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider ${
                          isBus 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {isBus ? <Bus size={12} /> : <Car size={12} />}
                        <span>{order.vehicleType}</span>
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                          order.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : order.status === 'taken'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                            : order.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Route display */}
                    <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-white flex-wrap">
                      <span>{order.from}</span>
                      <span className="text-[#f0a500]">➔</span>
                      <span>{order.to}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-white/60 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-[#f0a500]" /> {order.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-[#f0a500]" /> {order.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={13} className="text-[#f0a500]" /> {order.passengers} pax
                      </span>
                      {order.takenBy && (
                        <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 size={13} /> Driver: {order.takenBy.driverName}
                        </span>
                      )}
                    </div>

                    {/* Client contact info */}
                    <div className="pt-1.5 border-t border-white/5 flex flex-wrap items-center gap-3 text-xs text-white/80">
                      <span className="font-semibold text-white">{order.client?.name}</span>
                      <a href={`tel:${order.client?.phone}`} className="flex items-center gap-1 text-[#f0a500] hover:underline">
                        <Phone size={12} /> {order.client?.phone}
                      </a>
                      <a href={`mailto:${order.client?.email}`} className="flex items-center gap-1 text-white/60 hover:text-white hover:underline">
                        <Mail size={12} /> {order.client?.email}
                      </a>
                    </div>

                    {/* Custom notes or flight details */}
                    {(order.client?.flightNotes || order.client?.customNotes) && (
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 flex items-start gap-2">
                        <FileText size={14} className="text-[#f0a500] shrink-0 mt-0.5" />
                        <span className="italic leading-relaxed whitespace-pre-wrap">
                          {order.client.customNotes || order.client.flightNotes}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Financial breakdown and status controls */}
                  <div className="lg:border-l lg:border-white/10 lg:pl-6 flex flex-col justify-between gap-4 shrink-0">
                    <div className="grid grid-cols-3 gap-3 text-center font-mono">
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-white/40 block uppercase">Driver Price</span>
                        <span className="text-base font-bold text-blue-400">€{Math.round(order.driverPrice)}</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-white/40 block uppercase">Client Price</span>
                        <span className="text-base font-bold text-emerald-400">€{Math.round(order.clientPrice)}</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-[#f0a500]/30 bg-[#f0a500]/5">
                        <span className="text-[10px] text-[#f0a500] block uppercase font-bold">Profit</span>
                        <span className="text-base font-bold text-[#f0a500]">€{Math.round(order.profit)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {order.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'taken')}
                          disabled={actionLoading === order.id}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold cursor-pointer transition-all active:scale-95"
                        >
                          Mark Taken
                        </button>
                      )}
                      {order.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          disabled={actionLoading === order.id}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold cursor-pointer transition-all active:scale-95"
                        >
                          Complete
                        </button>
                      )}
                      {order.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          disabled={actionLoading === order.id}
                          className="py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs font-semibold cursor-pointer transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                      )}
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
