import React, { useState } from 'react';
import { Car, Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navItems } from '../../constants/navigation';

interface NavbarProps {
  activeSection: string;
  onScrollToSection: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  onScrollToCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onScrollToSection,
  onScrollToCalculator
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    onScrollToSection(e, id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#131313]/70 nav-blur border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 py-4 sm:py-5 max-w-[1440px] mx-auto">
        <a href="#" onClick={(e) => handleNavClick(e, 'hero')} className="flex items-center gap-2 group">
          <img 
            src="./logo.png" 
            alt="ZEPHYR Transfer" 
            className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </a>

        {/* Desktop Navigation Links with Active Indicator */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative py-1 transition-all ${
                  isActive 
                    ? 'text-[#f0a500] font-bold' 
                    : 'text-[#e4e2e1]/70 hover:text-[#f0a500]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#f0a500] rounded-full shadow-[0_0_8px_rgba(240,165,0,0.8)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Desktop Book Now Button */}
        <button 
          type="button"
          onClick={onScrollToCalculator}
          className="hidden md:flex bg-[#f0a500] text-[#131313] px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider amber-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer items-center gap-2"
        >
          <Car size={16} />
          <span>Book Now</span>
        </button>

        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white/80 hover:text-[#f0a500] p-2 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#131313]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 shadow-2xl overflow-hidden"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`py-2 text-base font-medium transition-colors flex items-center justify-between ${
                    isActive ? 'text-[#f0a500] font-bold' : 'text-white/80 hover:text-[#f0a500]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#f0a500]" />}
                </a>
              );
            })}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  onScrollToCalculator();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#f0a500] text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider amber-glow flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Car size={16} />
                <span>Book a Transfer</span>
              </button>
              <a
                href="https://wa.me/390212345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
