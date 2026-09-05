import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Send, Loader2, Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { ContactFormData } from '../../types';

export const ContactSection: React.FC = () => {
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Transfer Service',
    message: ''
  });
  const [contactSending, setContactSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSending(true);
    setTimeout(() => {
      setContactSending(false);
      setContactSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        serviceType: 'Transfer Service',
        message: ''
      });
      setTimeout(() => setContactSuccess(false), 6000);
    }, 1000);
  };

  return (
    <section id="contact" className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-8 md:px-16 w-full relative overflow-hidden">
      {/* Background Chauffeur Image with Darkened Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="./italian_chauffeur_bmw.jpg" 
          alt="Italian VIP chauffeur with BMW" 
          className="w-full h-full object-cover object-[center_30%] scale-105"
        />
        {/* Multi-layered dark overlay */}
        <div className="absolute inset-0 bg-[#131313]/65 backdrop-blur-[0.5px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313] via-transparent to-[#131313]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#131313]/75 via-[#131313]/40 to-[#131313]/75"></div>
      </div>

      {/* Subtle Ambient Lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#f0a500]/10 rounded-full blur-[140px] pointer-events-none z-[1]"></div>
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-[#f0a500]/10 rounded-full blur-[120px] pointer-events-none z-[1]"></div>

      <div className="max-w-[1440px] mx-auto w-full relative z-10">
        {/* Header */}
        <div className="mb-12 sm:mb-16 max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131313]/85 backdrop-blur-xl border border-white/15 mb-4 text-xs uppercase tracking-widest text-[#f0a500] font-semibold">
            <ShieldCheck size={14} /> Premier Chauffeur Concierge
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Connect With Us
          </h2>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl">
            Experience unparalleled chauffeur excellence across Italy. Reach out to our 24/7 concierge team to tailor your bespoke transfer, airport VIP meet-and-greet, or executive corporate fleet requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Contact Form (Bento Main - 7 cols) */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-10 rounded-2xl md:rounded-3xl relative overflow-hidden">
            {contactSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-[#f0a500]/15 border border-[#f0a500]/40 text-[#f0a500] text-sm flex items-center gap-3"
              >
                <CheckCircle2 size={18} className="flex-shrink-0" />
                <span>Thank you! Your inquiry has been dispatched to our VIP Concierge team. We will contact you within 15 minutes.</span>
              </motion.div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2 text-left">
                  <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Giacomo Rossi"
                    className="w-full bg-black/50 border border-white/20 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] focus:bg-black/70 text-sm text-white placeholder-white/35 transition-all"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="e.g. giacomo@luxury.it"
                    className="w-full bg-black/50 border border-white/20 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] focus:bg-black/70 text-sm text-white placeholder-white/35 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2 text-left">
                  <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="e.g. +39 333 123 4567"
                    className="w-full bg-black/50 border border-white/20 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] focus:bg-black/70 text-sm text-white placeholder-white/35 transition-all"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
                    Service Type
                  </label>
                  <select
                    value={contactForm.serviceType}
                    onChange={(e) => setContactForm({ ...contactForm, serviceType: e.target.value })}
                    className="w-full bg-black/50 border border-white/20 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] focus:bg-black/70 text-sm text-white transition-all appearance-none cursor-pointer [&>option]:bg-[#1b1c1c] [&>option]:text-white"
                  >
                    <option value="Transfer Service">Point-to-Point VIP Transfer</option>
                    <option value="Airport VIP Chauffeur">Airport VIP Chauffeur & Meet & Greet</option>
                    <option value="Daily Chauffeur Hire">By-The-Hour / Full Day Chauffeur Hire</option>
                    <option value="Corporate Fleet">Corporate & Event Fleet Logistics</option>
                    <option value="Custom Tour">Tuscany & Lake Como Bespoke Tour</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="block text-xs uppercase tracking-widest text-white/70 font-medium">
                  Message & Transfer Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us about dates, passenger count, luggage, flight numbers, or special requirements..."
                  className="w-full bg-black/50 border border-white/20 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] focus:bg-black/70 text-sm text-white placeholder-white/35 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={contactSending}
                className="w-full sm:w-auto bg-[#f0a500] hover:bg-[#d99400] text-[#131313] px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] amber-glow transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2.5 shadow-lg shadow-[#f0a500]/20"
              >
                {contactSending ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            {/* Direct Channels Card */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl md:rounded-3xl text-left">
              <h3 className="text-xl font-bold text-[#f0a500] mb-6 tracking-tight">Direct Concierge Channels</h3>
              <div className="space-y-5">
                <a href="tel:+390212345678" className="flex items-center gap-4 group transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#f0a500] group-hover:border-[#f0a500]/40 group-hover:scale-105 transition-all flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium">24/7 Phone Dispatch</p>
                    <p className="text-base font-semibold text-white group-hover:text-[#f0a500] transition-colors">+39 02 1234 5678</p>
                  </div>
                </a>

                <a href="https://wa.me/393331234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#f0a500] group-hover:border-[#f0a500]/40 group-hover:scale-105 transition-all flex-shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium">WhatsApp VIP Concierge</p>
                    <p className="text-base font-semibold text-white group-hover:text-[#f0a500] transition-colors">+39 333 123 4567</p>
                  </div>
                </a>

                <a href="mailto:bookings@zephyrtransfer.com" className="flex items-center gap-4 group transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#f0a500] group-hover:border-[#f0a500]/40 group-hover:scale-105 transition-all flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium">Email Dispatch</p>
                    <p className="text-base font-semibold text-white group-hover:text-[#f0a500] transition-colors">bookings@zephyrtransfer.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Hubs / Operational Coverage */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl md:rounded-3xl text-left space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#f0a500] font-semibold">Italian Hubs & Coverage</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                    <MapPin size={14} className="text-[#f0a500]" /> Milan Office
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Via Montenapoleone 8. Serving Malpensa (MXP), Linate (LIN), Bergamo (BGY), Lake Como & Swiss Alps.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                    <MapPin size={14} className="text-[#f0a500]" /> Rome Concierge
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Via Veneto 42. Serving Fiumicino (FCO), Ciampino (CIA), Tuscany, Amalfi Coast & Florence.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-white/40 font-mono">
                <Clock size={14} className="text-[#f0a500]" />
                <span>Guaranteed on-time arrival & 60 min complimentary airport waiting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
