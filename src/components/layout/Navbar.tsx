import React, { useState, useEffect } from 'react';
import { Car, Menu, X } from 'lucide-react';
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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    onScrollToSection(e, id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-[height,background-color] duration-200 ${
        mobileMenuOpen
          ? 'h-[100dvh] bg-[#131313] flex flex-col md:h-auto md:bg-[#131313]/70 md:nav-blur'
          : 'bg-[#131313]/70 nav-blur'
      }`}
    >
      <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 py-4 sm:py-5 max-w-[1440px] mx-auto w-full flex-shrink-0">
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
          className="md:hidden text-white/80 hover:text-[#f0a500] p-2 transition-colors cursor-pointer active:scale-95"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Fullscreen Mobile Navigation Menu Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden flex-1 flex flex-col justify-between px-6 py-6 sm:px-8 sm:py-8 overflow-y-auto max-w-[1440px] mx-auto w-full"
          >
            {/* Centered Large Menu Links */}
            <div className="flex flex-col items-center justify-center gap-6 sm:gap-7 my-auto py-4">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`font-serif text-2xl sm:text-3xl font-bold transition-all text-center tracking-wide ${
                      isActive 
                        ? 'text-[#f0a500] scale-105' 
                        : 'text-white/80 hover:text-[#f0a500] active:text-[#f0a500]'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Bottom Book Now CTA in Mobile Menu */}
            <div className="pt-4 border-t border-white/10 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  onScrollToCalculator();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#f0a500] text-[#131313] py-4 rounded-2xl font-bold text-sm uppercase tracking-wider amber-glow flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 shadow-xl shadow-[#f0a500]/25"
              >
                <Car size={18} />
                <span>Book Now</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
