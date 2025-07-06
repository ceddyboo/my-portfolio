"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative z-30 bg-black border-t border-white/10 py-8 md:py-12"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Mobile: Stacked layout */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Brand */}
          <motion.div variants={itemVariants} className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">CEDRIC GUERRERO</h3>
          </motion.div>

          {/* Navigation Links - Mobile: Larger touch targets */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-8 md:space-x-6"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/work", label: "Work" },
              { href: "/contact", label: "Contact" }
            ].map((item) => (
              <motion.div 
                key={item.href} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="flex justify-center md:justify-start"
              >
                <Link 
                  href={item.href} 
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-base md:text-sm font-medium px-4 py-2 md:px-0 md:py-0 rounded-lg md:rounded-none hover:bg-white/5 md:hover:bg-transparent"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Copyright - Mobile: Centered */}
          <motion.div variants={itemVariants} className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-xs px-4 py-2">
              © {new Date().getFullYear()} Cedric Guerrero. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
} 