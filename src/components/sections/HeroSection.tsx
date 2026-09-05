import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PriceResult, SelectedVehicle, BookingStep, ClientFormData } from '../../types';
import { CalculatorForm } from '../calculator/CalculatorForm';
import { CalculationResults } from '../calculator/CalculationResults';
import { BookingForm } from '../calculator/BookingForm';
import { BookingConfirmation } from '../calculator/BookingConfirmation';

interface HeroSectionProps {
  calculatorRef: React.RefObject<HTMLDivElement | null>;
  from: string;
  setFrom: (val: string) => void;
  to: string;
  setTo: (val: string) => void;
  passengers: number;
  setPassengers: (val: number) => void;
  loading: boolean;
  result: PriceResult | null;
  onCalculate: () => void;
  onModifyRoute: () => void;
  selectedVehicle: SelectedVehicle | null;
  bookingStep: BookingStep;
  bookingSending: boolean;
  bookingRefCode: string;
  onSelectVehicle: (type: string, price: number) => void;
  onBackToVehicles: () => void;
  onSubmitBooking: (formData: ClientFormData) => void;
  onBookAnother: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  calculatorRef,
  from,
  setFrom,
  to,
  setTo,
  passengers,
  setPassengers,
  loading,
  result,
  onCalculate,
  onModifyRoute,
  selectedVehicle,
  bookingStep,
  bookingSending,
  bookingRefCode,
  onSelectVehicle,
  onBackToVehicles,
  onSubmitBooking,
  onBookAnother
}) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          className="w-full h-full object-cover object-[35%_65%] sm:object-[45%_60%] md:object-center scale-110 sm:scale-105 md:scale-100 transition-all duration-700"
          alt="Zephyr luxury Mercedes-Benz chauffeur vehicle on Italian Amalfi Coast at sunset"
          src="./hero-bg.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#131313] pointer-events-none"></div>
      </div>

      <div className="relative z-20 w-full max-w-[1440px] px-2.5 sm:px-6 md:px-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#131313]/85 backdrop-blur-2xl border border-white/20 mb-5 sm:mb-7 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-[0.2em] text-[#f0a500] font-semibold max-w-[94vw] shadow-2xl shadow-black/60 ring-1 ring-white/10 hover:border-[#f0a500]/50 transition-all">
            <ShieldCheck size={16} className="text-[#f0a500] flex-shrink-0" />
            <span className="truncate">Premier Chauffeur Services in Italy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 text-glow max-w-5xl tracking-tight text-white leading-tight">
            Excellence in Every Kilometre
          </h1>
        </motion.div>

        <div ref={calculatorRef} className="w-full max-w-5xl">
          <div className="liquid-glass p-3.5 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl border border-white/15">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="calculator-form"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <CalculatorForm
                    from={from}
                    setFrom={setFrom}
                    to={to}
                    setTo={setTo}
                    passengers={passengers}
                    setPassengers={setPassengers}
                    loading={loading}
                    onCalculate={onCalculate}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`booking-step-${bookingStep}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                >
                  {bookingStep === 'vehicles' && (
                    <CalculationResults
                      from={from}
                      to={to}
                      passengers={passengers}
                      result={result}
                      selectedVehicle={selectedVehicle}
                      onModifyRoute={onModifyRoute}
                      onSelectVehicle={onSelectVehicle}
                    />
                  )}

                  {bookingStep === 'form' && selectedVehicle && (
                    <BookingForm
                      selectedVehicle={selectedVehicle}
                      result={result}
                      from={from}
                      to={to}
                      passengers={passengers}
                      onBackToVehicles={onBackToVehicles}
                      onSubmitBooking={onSubmitBooking}
                      bookingSending={bookingSending}
                    />
                  )}

                  {bookingStep === 'success' && selectedVehicle && (
                    <BookingConfirmation
                      bookingRefCode={bookingRefCode}
                      selectedVehicle={selectedVehicle}
                      result={result}
                      from={from}
                      to={to}
                      onBookAnother={onBookAnother}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
