import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Plane, AlertCircle, Loader2, MapPin, Clock, Users } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { SelectedVehicle, PriceResult, ClientFormData, ClientFormErrors } from '../../types';

interface BookingFormProps {
  selectedVehicle: SelectedVehicle;
  result: PriceResult;
  from: string;
  to: string;
  passengers: number;
  onBackToVehicles: () => void;
  onSubmitBooking: (formData: ClientFormData) => void;
  bookingSending: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedVehicle,
  result,
  from,
  to,
  passengers,
  onBackToVehicles,
  onSubmitBooking,
  bookingSending
}) => {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    flightNotes: ''
  });

  const [errors, setErrors] = useState<ClientFormErrors>({});

  const validateEmail = (val: string): string | null => {
    const trimmed = (val || '').trim();
    if (!trimmed) return "Email address is required.";
    if (!trimmed.includes('@')) {
      return "Email must contain '@' symbol.";
    }
    const parts = trimmed.split('@');
    if (parts.length !== 2 || !parts[0]) {
      return "Please enter a valid mailbox name before '@'.";
    }
    const domain = parts[1];
    if (!domain.includes('.')) {
      return "Domain after '@' must include a dot (e.g. gmail.com, luxury.it).";
    }
    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
      return "Domain extension is too short (e.g. .com, .it).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address (e.g. name@domain.com).";
    }
    return null;
  };

  const validatePhone = (val: string): string | null => {
    if (!val || val.trim().length < 4) {
      return "Phone number with international country code is required.";
    }
    try {
      if (!isValidPhoneNumber(val)) {
        return "Please enter a valid phone number for the selected country.";
      }
    } catch {
      return "Invalid international phone format.";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: ClientFormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your full name (minimum 2 characters).";
    }

    const emailErr = validateEmail(formData.email);
    if (emailErr) {
      newErrors.email = emailErr;
    }

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      newErrors.phone = phoneErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmitBooking(formData);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Back to vehicle selection & step indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={onBackToVehicles}
          className="text-[#f0a500] hover:text-white flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider bg-white/5 py-2.5 px-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer border border-[#f0a500]/30 hover:border-[#f0a500] shadow-sm whitespace-nowrap w-fit active:scale-95"
        >
          <ArrowLeft size={16} className="shrink-0" />
          <span>Change Vehicle</span>
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0a500]/10 border border-[#f0a500]/30 text-[11px] sm:text-xs font-mono text-[#f0a500] tracking-wider w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f0a500] animate-pulse"></span>
          <span>Step 2 of 2 · Reservation Details</span>
        </div>
      </div>

      {/* Selected Vehicle & Journey Summary Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
        <div className="w-full md:w-auto">
          <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#f0a500]/15 border border-[#f0a500]/40 text-xs uppercase font-mono font-bold text-[#f0a500] tracking-wider mb-2">
            {selectedVehicle.type}
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2.5 sm:gap-3 flex-wrap leading-snug">
            <span>{from}</span>
            <span className="text-[#f0a500] text-xl sm:text-2xl font-black shrink-0">➔</span>
            <span>{to}</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 mt-3.5 flex-wrap">
            <div className="flex items-center gap-2 text-[#f0a500] text-sm sm:text-base font-semibold font-mono">
              <MapPin size={17} className="text-[#f0a500] shrink-0" />
              <span>{result.distance}</span>
            </div>
            <div className="flex items-center gap-2 text-[#f0a500] text-sm sm:text-base font-semibold font-mono">
              <Clock size={17} className="text-[#f0a500] shrink-0" />
              <span>{result.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-[#f0a500] text-sm sm:text-base font-semibold font-mono">
              <Users size={17} className="text-[#f0a500] shrink-0" />
              <span>{passengers} {passengers === 1 ? 'Passenger' : 'Passengers'}</span>
            </div>
          </div>
        </div>

        <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto flex md:flex-col justify-between items-baseline md:items-end border-white/10 shrink-0">
          <span className="text-xs uppercase font-mono tracking-widest text-white/50 font-semibold block">Fixed Rate</span>
          <span className="text-3xl sm:text-4xl font-mono font-bold text-[#f0a500]">
            €{Math.round(selectedVehicle.price)}
          </span>
          <span className="text-[11px] text-white/40 hidden md:block">All-inclusive · No hidden fees</span>
        </div>
      </div>

      {/* Final Contact Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0a500]" size={18} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g. Lord Alexander Wright"
                className={`w-full bg-black/50 border ${
                  errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-white/20 focus:border-[#f0a500]'
                } rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/35 focus:outline-none focus:bg-black/70 transition-all`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1.5 font-medium">
                <AlertCircle size={13} className="shrink-0" /> {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0a500]" size={18} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="e.g. alexander@luxurytravel.com"
                className={`w-full bg-black/50 border ${
                  errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-white/20 focus:border-[#f0a500]'
                } rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/35 focus:outline-none focus:bg-black/70 transition-all`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1.5 font-medium">
                <AlertCircle size={13} className="shrink-0" /> {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone Number with International Flag and Dial-code */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
              Phone Number (WhatsApp) *
            </label>
            <div className={`international-phone-container rounded-xl overflow-hidden border ${
              errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-white/20 focus-within:border-[#f0a500]'
            } transition-all`}>
              <PhoneInput
                defaultCountry="it"
                value={formData.phone}
                onChange={(phone) => {
                  setFormData({ ...formData, phone });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone ? (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1.5 font-medium">
                <AlertCircle size={13} className="shrink-0" /> {errors.phone}
              </p>
            ) : (
              <p className="text-[11px] text-white/40 font-mono">
                Select country flag or dial code (e.g. +39, +380, +1, +44)
              </p>
            )}
          </div>

          {/* Flight Details / Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
              Flight Number / Special Notes (Optional)
            </label>
            <div className="relative">
              <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0a500]" size={18} />
              <input
                type="text"
                value={formData.flightNotes}
                onChange={(e) => setFormData({ ...formData, flightNotes: e.target.value })}
                placeholder="e.g. Flight AZ 204 from JFK, child seat, skis..."
                className="w-full bg-black/50 border border-white/20 focus:border-[#f0a500] rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/35 focus:outline-none focus:bg-black/70 transition-all"
              />
            </div>
            <p className="text-[11px] text-white/40 font-mono">
              Automatic flight delay tracking & 60-min complimentary wait
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={bookingSending}
            className="w-full bg-[#f0a500] hover:bg-[#d99400] text-black py-4 px-8 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 amber-glow cursor-pointer flex items-center justify-center gap-3 shadow-xl shadow-[#f0a500]/25 disabled:opacity-50 hover:scale-[1.01] active:scale-95"
          >
            {bookingSending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Dispatching Reservation...</span>
              </>
            ) : (
              <>
                <span>Confirm Reservation</span>
                <span>➔</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-white/40 mt-3 font-mono">
            No upfront payment required · Free cancellation up to 24h before pickup
          </p>
        </div>
      </form>
    </div>
  );
};
