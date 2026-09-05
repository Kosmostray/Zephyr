import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { faqs } from '../../constants/faq';

export const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 max-w-[1050px] mx-auto relative z-10">
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1c1c] border border-white/15 text-xs font-mono uppercase tracking-[0.2em] text-[#f0a500] mb-4 shadow-lg ring-1 ring-white/5">
          <HelpCircle size={14} className="text-[#f0a500]" />
          <span>Client Inquiries & Protocol</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white text-glow">
          Frequently Asked Questions
        </h2>
        <p className="text-white/65 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Essential details regarding our chauffeur standards, vehicle assignments, luggage allowances, and airport meet-and-greet procedures.
        </p>
        <div className="w-16 h-1 bg-[#f0a500] mx-auto rounded-full mt-6 shadow-sm shadow-[#f0a500]/50"></div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 border ${
                isOpen
                  ? 'bg-[#1a1a1a]/95 border-[#f0a500]/50 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(240,165,0,0.08)]'
                  : 'bg-[#161616]/75 hover:bg-[#1b1c1c]/90 border-white/10 hover:border-white/25 shadow-md'
              } backdrop-blur-xl overflow-hidden`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full px-5 sm:px-7 py-5 sm:py-6 flex items-center justify-between text-left cursor-pointer group transition-colors select-none"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-[#f0a500] transition-colors pr-4 flex items-center gap-3.5">
                  <span className="font-mono text-xs text-[#f0a500]/70 group-hover:text-[#f0a500] tracking-wider shrink-0 bg-[#f0a500]/10 px-2 py-1 rounded-md border border-[#f0a500]/20">
                    0{idx + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isOpen
                      ? 'bg-[#f0a500] border-[#f0a500] text-black rotate-180 shadow-md shadow-[#f0a500]/30'
                      : 'bg-white/5 border-white/15 text-white/70 group-hover:border-[#f0a500]/50 group-hover:text-[#f0a500] group-hover:bg-[#f0a500]/10'
                  }`}
                >
                  <ChevronDown size={18} className="transition-transform duration-300" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-7 pb-6 sm:pb-7 pt-2 border-t border-white/10 text-white/80">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
