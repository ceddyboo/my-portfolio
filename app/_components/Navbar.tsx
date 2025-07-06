"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-4 md:top-6 left-1/2 z-[100] w-[95%] md:w-[90%] max-w-4xl -translate-x-1/2 transition-all duration-300 ${
        isScrolled 
          ? "bg-black/20 backdrop-blur-lg" 
          : "bg-black/20 backdrop-blur-lg"
      } rounded-2xl px-4 md:px-8 py-2 md:py-1 shadow-xl`}
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0"
        >
          <Link 
            href="/" 
            className="text-xl md:text-2xl lg:text-3xl font-bold text-white hover:text-white hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.6)] transition-all duration-200 ease-out tracking-wide uppercase px-2 py-1 rounded-lg hover:bg-white/5"
          >
            CG
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <motion.div 
            className="flex space-x-6 lg:space-x-8"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { href: "/work", label: "Work" },
              { href: "/contact", label: "Contact" }
            ].map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  className="text-sm md:text-base font-bold text-white hover:text-white hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.6)] transition-all duration-200 ease-out tracking-wide uppercase px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile menu button - Larger touch target */}
        <div className="md:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-white hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.6)] transition-all duration-200 ease-out p-2 rounded-lg hover:bg-white/5"
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation - Enhanced for better UX */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 mt-3 rounded-xl overflow-hidden"
          >
            <div className="px-3 py-4 space-y-2">
              {[
                { href: "/work", label: "Work" },
                { href: "/contact", label: "Contact" }
              ].map((item) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-base font-bold text-white hover:text-white hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.6)] transition-all duration-200 ease-out tracking-wide uppercase rounded-lg hover:bg-white/10 active:bg-white/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
