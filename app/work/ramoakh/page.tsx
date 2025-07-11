"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Thumbnail data structure - grouped by variations
const thumbnailGroups = [
  {
    id: 1,
    variations: [
      { src: "/tinified/ramo1a.jpg", alt: "Ramo Akh Thumbnail 1a" },
      { src: "/tinified/ramo1b.jpg", alt: "Ramo Akh Thumbnail 1b" }
    ]
  },
  {
    id: 2,
    variations: [
      { src: "/tinified/ramo2a.jpg", alt: "Ramo Akh Thumbnail 2a" },
      { src: "/tinified/ramo2b.png", alt: "Ramo Akh Thumbnail 2b" },
      { src: "/tinified/ramo2c.png", alt: "Ramo Akh Thumbnail 2c" }
    ]
  },
  {
    id: 3,
    variations: [
      { src: "/tinified/ramo3a.jpg", alt: "Ramo Akh Thumbnail 3a" }
    ]
  },
  {
    id: 4,
    variations: [
      { src: "/tinified/ramo4a.png", alt: "Ramo Akh Thumbnail 4a" },
      { src: "/tinified/ramo4b.png", alt: "Ramo Akh Thumbnail 4b" }
    ]
  },
  {
    id: 5,
    variations: [
      { src: "/tinified/ramo5a.png", alt: "Ramo Akh Thumbnail 5a" }
    ]
  }
];

// Hero Section Component
const HeroSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-12"
    >
      {/* Enhanced Pink Glassmorphism Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="inline-flex items-center bg-gradient-to-r from-pink-600/30 via-pink-700/25 to-pink-800/30 border border-pink-400/40 rounded-full px-8 py-4 mb-8 backdrop-blur-xl shadow-2xl shadow-pink-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-pink-800/10 rounded-full" />
        <span className="relative text-pink-100 text-sm font-bold tracking-wide">
          GAMING
        </span>
      </motion.div>
      
      {/* Hero Title with Enhanced Animation */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4"
      >
        Ramo Akh
      </motion.h1>
      
      {/* Hero Description with Enhanced Animation */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 mb-8"
      >
        Quick-witted humor, culturally relevant skits, and engaging lifestyle narratives that resonate deeply with a highly loyal Gen Z audience.
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        className="inline-flex items-center bg-gradient-to-r from-pink-600/30 via-pink-700/25 to-pink-800/30 border border-pink-400/40 rounded-full px-8 py-4 backdrop-blur-xl shadow-2xl shadow-pink-500/20 hover:from-pink-600/40 hover:via-pink-700/35 hover:to-pink-800/40 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-pink-800/10 rounded-full" />
        <span className="relative text-pink-100 text-sm font-bold tracking-wide">
          THUMBNAIL DESIGN
        </span>
      </motion.button>
    </motion.div>
  );
};

// Thumbnail Card Component with Navigation
const ThumbnailCard = ({ group, index }: { group: any, index: number }) => {
  const [currentVariation, setCurrentVariation] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentVariation(prev => 
      prev === 0 ? group.variations.length - 1 : prev - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentVariation(prev => 
      prev === group.variations.length - 1 ? 0 : prev + 1
    );
  };

  const currentImage = group.variations[currentVariation];
  const hasMultipleVariations = group.variations.length > 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl bg-black/20 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative aspect-video">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index === 0} // Eager load first image
          loading={index === 0 ? "eager" : "lazy"}
          unoptimized
        />
        
        {/* Navigation Arrows - only show if multiple variations */}
        {hasMultipleVariations && (
          <div className="absolute top-3 right-3 flex gap-1">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="inline-flex items-center justify-center bg-gradient-to-r from-pink-600/30 via-pink-700/25 to-pink-800/30 border border-pink-400/40 rounded-full w-8 h-8 backdrop-blur-xl shadow-lg shadow-pink-500/20 hover:from-pink-600/40 hover:via-pink-700/35 hover:to-pink-800/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-pink-800/10 rounded-full" />
              <ChevronLeft className="relative w-4 h-4 text-pink-100" />
            </button>
            
            {/* Next Button */}
            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center bg-gradient-to-r from-pink-600/30 via-pink-700/25 to-pink-800/30 border border-pink-400/40 rounded-full w-8 h-8 backdrop-blur-xl shadow-lg shadow-pink-500/20 hover:from-pink-600/40 hover:via-pink-700/35 hover:to-pink-800/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-pink-800/10 rounded-full" />
              <ChevronRight className="relative w-4 h-4 text-pink-100" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Thumbnail Grid Component
const ThumbnailGrid = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">
        Thumbnail Gallery
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {thumbnailGroups.map((group, index) => (
          <ThumbnailCard key={group.id} group={group} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default function RamoAkhPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 pt-28 pb-16 md:pt-40 md:pb-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Thumbnail Grid */}
        <ThumbnailGrid />
      </div>
    </div>
  );
} 