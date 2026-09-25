import React, { useState } from 'react';
import { ArrowLeft, User, Mail, MessageSquare, AlertCircle, Loader2, MapPin, Clock, Users, Bus, Info } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { SelectedVehicle, PriceResult, BusFormData, BusFormErrors } from '../../types';

interface BusBookingFormProps {
  selectedVehicle: SelectedVehicle;
  result: PriceResult;
  from: string;
  to: string;
  passengers: number;
  onBackToVehicles: () => void;
  onSubmitBooking: (formData: BusFormData) => void;
  bookingSending: boolean;
}

export const BusBookingForm: React.FC<BusBookingFormProps> = ({
  selectedVehicle,
  result,
  from,
  to,
  passengers,
  onBackToVehicles,
  onSubmitBooking,
  bookingSending
}) => {
  const [formData, setFormData] = useState<BusFormData>({
    name: '',
    email: '',
    phone: '',
    customNotes: ''
  });

  const [errors, setErrors] = useState<BusFormErrors>({});

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
    const newErrors: BusFormErrors = {};

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

  const busSpec = selectedVehicle.busSpec;

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
          <span>Change Bus</span>
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0a500]/10 border border-[#f0a500]/30 text-[11px] sm:text-xs font-mono text-[#f0a500] tracking-wider w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f0a500] animate-pulse"></span>
          <span>Bus Charter Reservation · Step 2 of 2</span>
        </div>
      </div>

      {/* Selected Bus & Journey Summary Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f0a500]/15 border border-[#f0a500]/40 text-xs uppercase font-mono font-bold text-[#f0a500] tracking-wider">
              <Bus size={12} className="text-[#f0a500]" />
              {selectedVehicle.type}
            </span>
            {busSpec?.capacity && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white/80">
                {busSpec.capacity}
              </span>
            )}
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
              <span>{passengers} Passengers</span>
            </div>
          </div>
        </div>

        <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto flex md:flex-col justify-between items-baseline md:items-end border-white/10 shrink-0">
          <span className="text-xs uppercase font-mono tracking-widest text-white/50 font-semibold block">
            {selectedVehicle.isAirportFixed ? 'Fixed Airport Total' : 'Estimated Charter Total'}
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-[#f0a500]">
            €{Math.round(selectedVehicle.price)}
          </div>
          {busSpec?.hourlyRate && (
            <span className="text-xs text-white/60 font-mono mt-0.5">
              €{busSpec.hourlyRate}/hr standby & sightseeing
            </span>
          )}
        </div>
      </div>

      {/* Final Contact Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
              Full Name / Company *
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
                placeholder="e.g. Marco Rossi / Global Tours Ltd"
                className={`w-full bg-black/50 border ${
                  errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-white/20 focus:border-[#f0a500]'
                } rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/35 focus:outline-none focus:bg-black/70 transition-all`}
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs flex items-center gap-1.5 pt-0.5">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
              Corporate / Personal Email *
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
                placeholder="e.g. contact@company.com"
                className={`w-full bg-black/50 border ${
                  errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-white/20 focus:border-[#f0a500]'
                } rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/35 focus:outline-none focus:bg-black/70 transition-all`}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs flex items-center gap-1.5 pt-0.5">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* International Phone */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
            Contact Phone Number (WhatsApp Enabled) *
          </label>
          <div className={`international-phone-wrapper rounded-xl border ${
            errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-white/20 focus-within:border-[#f0a500]'
          } bg-black/50 overflow-hidden`}>
            <PhoneInput
              defaultCountry="it"
              value={formData.phone}
              onChange={(phone) => {
                setFormData({ ...formData, phone });
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder="e.g. +39 345 678 9012"
              className="w-full text-white text-sm"
              inputClassName="!bg-transparent !text-white !border-none !text-sm !py-3.5 !w-full !outline-none focus:!ring-0"
              countrySelectorStyleProps={{
                buttonClassName: "!bg-black/40 !border-r !border-white/20 !px-3 hover:!bg-white/10"
              }}
            />
          </div>
          {errors.phone && (
            <p className="text-red-400 text-xs flex items-center gap-1.5 pt-0.5">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* Custom Request & Itinerary Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
              Trip Details & Special Requirements
            </label>
            <span className="text-[11px] text-[#f0a500]/80 font-mono">Detailed Request</span>
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 text-[#f0a500]" size={18} />
            <textarea
              rows={4}
              value={formData.customNotes}
              onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
              placeholder="Describe your request in detail:&#10;• Multi-day itinerary, dates, or daily operating hours&#10;• Planned stops, excursions, wineries or guided tours&#10;• Total luggage count and oversize baggage / sports gear&#10;• Pickup time, flight numbers, VIP escort or bilingual driver preferences..."
              className="w-full bg-black/50 border border-white/20 focus:border-[#f0a500] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/35 focus:outline-none focus:bg-black/70 transition-all resize-y min-h-[110px]"
            />
          </div>
          <p className="text-[11px] text-white/50 flex items-center gap-1.5 pt-1">
            <Info size={13} className="text-[#f0a500] shrink-0" />
            <span>Our charter operations manager will tailor the route, optimize road tolls, and confirm your dedicated driver.</span>
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={bookingSending}
            className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-[#f0a500] hover:bg-[#d99400] text-black amber-glow transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {bookingSending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Submitting Charter Request...</span>
              </>
            ) : (
              <span>Confirm & Book Bus Charter (€{Math.round(selectedVehicle.price)})</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
