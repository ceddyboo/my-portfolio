"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamically import components with no SSR
const GlassTag = dynamic(() => import("./_components/GlassTag"), { ssr: false });
const ContactForm = dynamic(() => import("./_components/ContactForm"), { ssr: false });

// TestimonialCard Component
const TestimonialCard = ({ 
  text, 
  client, 
  stats, 
  delay = 0, 
  onClick, 
  mobile = false 
}: {
  text: string;
  client: string;
  stats: string;
  delay?: number;
  onClick?: () => void;
  mobile?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = mobile ? 80 : 120;
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded ? text : text.slice(0, maxLength) + "...";

  return (
    <motion.div 
      className={`bg-white/5 border border-white/20 backdrop-blur-lg ${mobile ? 'p-4' : 'p-6'} rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: mobile ? 0 : 30, y: mobile ? 20 : 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={onClick}
    >
      <p className={`${mobile ? 'text-sm' : 'text-base'} font-medium leading-relaxed`}>
        "{displayText}"
      </p>
      
      {shouldTruncate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-purple-400 hover:text-purple-300 text-xs font-medium mt-2 transition-colors duration-200"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
      
      <div className={`mt-4 ${mobile ? 'mt-3' : ''}`}>
        <span className={`text-purple-400 font-semibold ${mobile ? 'text-sm' : ''}`}>{client}</span>
        <p className={`text-gray-400 ${mobile ? 'text-xs' : 'text-sm'} mt-1`}>{stats}</p>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const [counter, setCounter] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("Gaming");
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // User-provided video files
  const videoSources = [
    "/port_vids/bam.mp4",
    "/port_vids/bri.mp4",
    "/port_vids/cole 2.mp4",
    "/port_vids/ctcs.mp4",
    "/port_vids/davee.mp4",
    "/port_vids/jlewi.mp4",
    "/port_vids/loo.mp4",
    "/port_vids/mattyb.mp4",
    "/port_vids/MIKE.mp4",
    "/port_vids/nave.mp4",
    "/port_vids/PRESTON.mp4",
    "/port_vids/rush.mp4",
    "/port_vids/sam.mp4",
    "/port_vids/stove.mp4",
    "/port_vids/taping.mp4",
    "/port_vids/woah.mp4",
  ];

  // Helper: fallback poster for videos
  const fallbackPoster = "/placeholder-avatar.png";
  


  // Video data for tabbed layout
  const gamingVideos = [
    { url: "https://youtu.be/-WLUROvgN_w?si=d_HlRUCMpZCIUJQP", views: "9.3M" },
    { url: "https://youtu.be/ljls6v5Co3g?si=X8xgQ3wNAnVaQ-Vh", views: "7.1M" },
    { url: "https://youtu.be/3JmAYUCinA8?si=0vzhn-gnOADxWYM7", views: "8.3M" },
  ];

  const commentaryVideos = [
    { url: "https://youtu.be/tpTj7CAFudA?si=nU-ILW3bwUOeNBV1", views: "700k" },
    { url: "https://youtu.be/x5-NESCT7Es?si=HW34NrRK0inrttwz", views: "410k" },
    { url: "https://youtu.be/j3OveJwcDwQ?si=a4PRC8rN2T-24LLK", views: "350k" },
  ];

  const farmingVideos = [
    { url: "https://www.youtube.com/watch?v=_oFEKAl-qgU&t=4170s", views: "490k" },
    { url: "https://youtu.be/PgCtxMu7zM0?si=RURImZzSaNz9dh5R", views: "742k" },
    { url: "https://www.youtube.com/watch?v=dhFAU3jMT4M&t=362s", views: "500k" },
  ];

  const getVideos = () => {
    if (activeTab === "Gaming") return gamingVideos;
    if (activeTab === "Commentary") return commentaryVideos;
    if (activeTab === "Farming") return farmingVideos;
    return gamingVideos;
  };

  useEffect(() => {
    // Set loaded state immediately for fast initial render
    setIsLoaded(true);
    
    // Show hero section immediately
    console.log('Setting heroLoaded to true');
    setHeroLoaded(true);
    
    let current = 0;
    const end = 230;
    const increment = end / 100;

    const counter = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(counter);
        setCounter(end);
      } else {
        setCounter(Math.floor(current));
      }
    }, 20);

    return () => {
      clearInterval(counter);
    };
  }, []);

  // Scroll indicator fade out effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-screen bg-black">
        {/* Fallback Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Video Wall - Lazy loaded */}
        {heroLoaded && (
          <div className="absolute inset-0 overflow-hidden z-10">
            <div className="h-[200%] w-full animate-video-scroll">
              {/* First set of videos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-1 p-1">
                {videoSources.map((src, i) => (
                  <div key={`first-${i}`} className="w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <video
                      src={src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload={isMobile ? "metadata" : "none"}
                      className="w-full h-full object-cover"
                      poster={fallbackPoster}
                      onError={e => { 
                        console.log('Video error:', src, e);
                        e.currentTarget.poster = fallbackPoster; 
                      }}
                      onLoadStart={() => console.log('Video loading:', src)}
                      onCanPlay={() => console.log('Video can play:', src)}
                    />
                  </div>
                ))}
              </div>
              {/* Duplicate set for seamless scrolling */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-1 p-1">
                {videoSources.map((src, i) => (
                  <div key={`second-${i}`} className="w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <video
                      src={src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="none"
                      className="w-full h-full object-cover"
                      poster={fallbackPoster}
                      onError={e => { 
                        console.log('Video error:', src, e);
                        e.currentTarget.poster = fallbackPoster; 
                      }}
                      onLoadStart={() => console.log('Video loading:', src)}
                      onCanPlay={() => console.log('Video can play:', src)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Dark gradient overlay - fades to black at top and bottom */}
        <div className="absolute inset-0 pointer-events-none z-5">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
        </div>

        {/* Persistent Dark Overlay */}
        <div className="absolute inset-0 bg-black/80 z-15" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95 z-20" />
        
        {/* Hero Content - Lazy loaded */}
        {heroLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20">
            {/* Mobile: GlassTag above headline */}
            <motion.div 
              className="block md:hidden mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <GlassTag className="relative" />
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
                          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] tracking-tight leading-tight">
              CEDRIC GUERRERO
            </h1>
              {/* Desktop: GlassTag positioned over "ERO" */}
              <div className="hidden md:block">
                <GlassTag className="absolute top-[-15px] right-0" />
              </div>
            </motion.div>
            
            <motion.p 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-6 sm:mb-8 text-white/80 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {counter}M+ <span className="text-purple-400">views generated</span>
            </motion.p>
            
            <motion.div 
              className="cta-container flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-sm sm:max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Link
                href="/work"
                className="px-5 py-3 sm:py-2 rounded-xl glassmorphism-button text-gray-200 font-semibold uppercase tracking-wide transition-all duration-300 ease-out transform hover:scale-105 hover:bg-black/40 hover:text-white active:scale-95 mobile-button text-center"
              >
                Work
              </Link>
              <Link
                href="/contact"
                className="px-5 py-3 sm:py-2 rounded-xl bg-transparent border border-purple-500 text-white font-semibold uppercase tracking-wide transition-all duration-300 ease-out transform hover:scale-105 hover:bg-purple-600/80 hover:shadow-lg hover:shadow-purple-800/20 active:scale-95 mobile-button text-center"
              >
                Get Started
              </Link>
            </motion.div>
            
            {/* Scroll Indicator */}
            <motion.div 
              className={`absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-40 transition-opacity duration-500 ${showScrollIndicator ? 'opacity-100' : 'opacity-0'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showScrollIndicator ? 1 : 0, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative z-30 py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black">
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          Client Testimonials
        </motion.h2>
        
        {/* Desktop Layout: Video Hero + Text Testimonials Sidebar */}
        <div className="hidden md:flex max-w-7xl mx-auto gap-8 items-start">
          {/* Video Hero (Left) */}
          <motion.div 
            className="flex-1 bg-white/5 border border-white/20 backdrop-blur-lg p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            onClick={() => window.open('/work/cole', '_blank')}
          >
            <iframe 
              src="https://player.vimeo.com/video/1099048014?h=8f8f8f8f&title=0&byline=0&portrait=0&autoplay=0&muted=1&loop=1&autopause=0&dnt=1" 
              className="w-full h-96 rounded-xl" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
              title="Cole The Cornstar Testimonial"
            />
            <div className="mt-4 text-center">
              <span className="text-purple-400 font-semibold text-lg">Cole The Cornstar</span>
              <p className="text-gray-400 text-sm mt-1">10M+ subscribers</p>
            </div>
          </motion.div>
          
          {/* Text Testimonials (Right) */}
          <div className="w-1/3 space-y-6">
            <TestimonialCard 
              text="Cedric was great to work with and was able to tackle videos across varying lengths and genres seamlessly with quick turnaround. I'd definitely recommend Cedric to other YouTubers looking to level-up their editing and bring on board somebody to take care of your videos."
              client="Sambucha"
              stats="10M subscribers"
              delay={0.2}
              onClick={() => window.open('/work/sambucha', '_blank')}
            />
            
            <TestimonialCard 
              text="Cedric does a great job on my thumbnails. Gets the thumbnail and the revisions back to me pretty quickly. Definitely recommend Cedric to anyone looking to bring a skilled thumbnail designer onto their team."
              client="Ramo Akh"
              stats="1M subscribers"
              delay={0.3}
              onClick={() => window.open('/work/ramoakh', '_blank')}
            />
          </div>
        </div>
        
        {/* Mobile Layout: Stacked Video + Carousel */}
        <div className="md:hidden space-y-6">
          {/* Video Hero (Top) */}
          <motion.div 
            className="bg-white/5 border border-white/20 backdrop-blur-lg p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            onClick={() => window.open('/work/cole', '_blank')}
          >
            <iframe 
              src="https://player.vimeo.com/video/1099048014?h=8f8f8f8f&title=0&byline=0&portrait=0&autoplay=0&muted=1&loop=1&autopause=0&dnt=1" 
              className="w-full h-64 rounded-lg" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
              title="Cole The Cornstar Testimonial"
            />
            <div className="mt-3 text-center">
              <span className="text-purple-400 font-semibold">Cole The Cornstar</span>
              <p className="text-gray-400 text-sm mt-1">10M+ subscribers</p>
            </div>
          </motion.div>
          
          {/* Mobile Testimonials Carousel */}
          <div className="relative">
            
            {/* Testimonials Container */}
            <div className="space-y-4">
              {/* Sambucha Testimonial */}
              <motion.div 
                className="bg-white/5 border border-white/20 backdrop-blur-lg p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                whileHover={isMobile ? {} : { scale: 1.05 }}
                whileTap={isMobile ? {} : { scale: 0.95 }}
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={isMobile ? { opacity: 1, y: 0 } : {}}
                whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
                transition={isMobile ? {} : { duration: 0.6, delay: 0.2 }}
                viewport={isMobile ? {} : { once: true, margin: "-50px" }}
                onClick={() => window.open('/work/sambucha', '_blank')}
              >
                {/* Profile Header */}
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-sm mr-3 flex-shrink-0">
                    S
                  </div>
                  <div className="flex-1">
                    <span className="text-purple-400 font-semibold text-sm">Sambucha</span>
                    <p className="text-gray-400 text-xs">10M subscribers</p>
                  </div>
                </div>
                
                {/* Testimonial Text */}
                <p className="text-sm font-medium leading-relaxed text-gray-200">
                  "Cedric was great to work with and was able to tackle videos across varying lengths and genres seamlessly with quick turnaround. I'd definitely recommend Cedric to other YouTubers."
                </p>
              </motion.div>
              
              {/* Ramo Akh Testimonial */}
              <motion.div 
                className="bg-white/5 border border-white/20 backdrop-blur-lg p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                whileHover={isMobile ? {} : { scale: 1.05 }}
                whileTap={isMobile ? {} : { scale: 0.95 }}
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={isMobile ? { opacity: 1, y: 0 } : {}}
                whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
                transition={isMobile ? {} : { duration: 0.6, delay: 0.3 }}
                viewport={isMobile ? {} : { once: true, margin: "-50px" }}
                onClick={() => window.open('/work/ramoakh', '_blank')}
              >
                {/* Profile Header */}
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm mr-3 flex-shrink-0">
                    R
                  </div>
                  <div className="flex-1">
                    <span className="text-purple-400 font-semibold text-sm">Ramo Akh</span>
                    <p className="text-gray-400 text-xs">1M subscribers</p>
                  </div>
                </div>
                
                {/* Testimonial Text */}
                <p className="text-sm font-medium leading-relaxed text-gray-200">
                  "Cedric does a great job on my thumbnails. Gets revisions back to me quickly. Definitely recommend Cedric."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="relative z-30 py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black text-center">
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-white"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={isMobile ? { opacity: 1, y: 0 } : {}}
          whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
          transition={isMobile ? {} : { duration: 0.4 }}
          viewport={isMobile ? {} : { once: true, margin: "-50px" }}
        >
          Services
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            { 
              label: "Longform Editing", 
              icon: "🎬",
              description: "High-retention videos crafted for maximum watch time."
            },
            { 
              label: "Shortform Editing", 
              icon: "✂️",
              description: "Scroll-stopping shorts designed to grab attention instantly."
            },
            { 
              label: "Thumbnail Design", 
              icon: "🖼️",
              description: "Eye-catching thumbnails that drive clicks and views."
            },
            { 
              label: "Content Strategy & Ideation", 
              icon: "🧠",
              description: "Smart strategies and viral concepts to grow your channel."
            },
          ].map(({ label, icon, description }, index) => (
            <motion.div 
              key={label} 
              className="backdrop-blur-md bg-white/10 border border-white/20 p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all duration-300 hover:bg-white/15 hover:shadow-xl hover:shadow-purple-500/20"
              whileHover={isMobile ? {} : { scale: 1.05, y: -5 }}
              whileTap={isMobile ? {} : { scale: 0.95 }}
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={isMobile ? { opacity: 1, y: 0 } : {}}
              whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
              transition={isMobile ? {} : { duration: 0.4, delay: index * 0.1 }}
              viewport={isMobile ? {} : { once: true, margin: "-50px" }}
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{label}</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENT WORK SECTION */}
      <section className="relative z-30 py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black text-center">
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-white"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={isMobile ? { opacity: 1, y: 0 } : {}}
          whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
          transition={isMobile ? {} : { duration: 0.4 }}
          viewport={isMobile ? {} : { once: true, margin: "-50px" }}
        >
          Recent Work
        </motion.h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {["Gaming", "Commentary", "Farming"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <motion.div 
          key={activeTab}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {getVideos().map((video, index) => (
            <motion.div
              key={`${activeTab}-${index}`}
              className="relative rounded-xl overflow-hidden shadow-lg"
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              animate={isMobile ? { opacity: 1, y: 0 } : {}}
              transition={isMobile ? {} : { duration: 0.4, delay: index * 0.1 }}
            >
              {/* View Count Badge */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs z-10">
                {video.views} views
              </div>
              {/* YouTube Embed */}
              <iframe
                src={(() => {
                  // Handle different YouTube URL formats
                  let embedUrl = video.url;
                  let videoId = '';
                  
                  if (embedUrl.includes('youtu.be/')) {
                    // Handle youtu.be format
                    videoId = embedUrl.split('youtu.be/')[1].split('?')[0];
                  } else if (embedUrl.includes('youtube.com/watch?v=')) {
                    // Handle youtube.com/watch?v= format
                    videoId = embedUrl.split('watch?v=')[1].split('&')[0];
                  } else if (embedUrl.includes('youtube.com/embed/')) {
                    // Already in embed format
                    videoId = embedUrl.split('embed/')[1].split('?')[0];
                  }
                  
                  // Clean video ID (remove any remaining parameters)
                  videoId = videoId.split('&')[0].split('?')[0];
                  
                  const finalEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
                  console.log('Original URL:', video.url, 'Video ID:', videoId, 'Embed URL:', finalEmbedUrl);
                  return finalEmbedUrl;
                })()}
                className="w-full aspect-video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={(e) => console.error('Video failed to load:', video.url, e)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="relative z-30 py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={isMobile ? { opacity: 1, y: 0 } : {}}
            whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
            transition={isMobile ? {} : { duration: 0.4 }}
            viewport={isMobile ? {} : { once: true, margin: "-50px" }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              Tell me about your project and I'll get back to you within 24 hours.
            </p>
          </motion.div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
