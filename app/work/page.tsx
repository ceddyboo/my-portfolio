"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const featuredClient = {
  name: "Cole the Cornstar",
  slug: "cole",
  color: "from-green-600 via-green-700 to-green-800",
  views: "50M+ views",
  category: "Agriculture Content",
  description: "Revolutionary farming content that has captured millions of viewers worldwide.",
  subscribers: 629000,
  image: "/images/Cole BG.jpg"
};

const clients = [
  {
    name: "Sambucha",
    slug: "sambucha",
    color: "from-blue-600 to-blue-700",
    views: "25M+ views",
    category: "Gaming",
    subscribers: 10000000,
    image: "/images/sambucha-bg.jpg"
  },
  {
    name: "mattyballz",
    slug: "mattyballz",
    color: "from-red-600 to-red-700",
    views: "30M+ views",
    category: "Commentary",
    subscribers: 433000,
    image: "/images/mattyballz-bg.jpg..jpg"
  },
  {
    name: "PrestonPlayz",
    slug: "prestonplayz",
    color: "from-orange-600 to-orange-700",
    views: "15M+ views",
    category: "Gaming",
    subscribers: 17000000,
    image: "/images/prestonplayz.jpg"
  },
  {
    name: "BriannaPlayz",
    slug: "briannaplayz",
    color: "from-purple-600 to-purple-700",
    views: "20M+ views",
    category: "Gaming",
    subscribers: 6100000,
    image: "/images/briannaplayz.jpg"
  },
  {
    name: "DistroMike",
    slug: "distromike",
    color: "from-indigo-600 to-indigo-700",
    views: "35M+ views",
    category: "Educational",
    subscribers: 9500,
    image: "/images/distromike.jpg"
  },
  {
    name: "Ramo Akh",
    slug: "ramoakh",
    color: "from-pink-600 to-pink-700",
    views: "18M+ views",
    category: "Gaming",
    subscribers: 950000,
    image: "/images/ramo akh.jpg"
  },
  {
    name: "LankyBox",
    slug: "lankybox",
    color: "from-emerald-600 to-emerald-700",
    views: "22M+ views",
    category: "Gaming",
    subscribers: 41800000,
    image: "/images/lankybox.jpg"
  },
  {
    name: "Bloveslife",
    slug: "bloveslife",
    color: "from-teal-600 to-teal-700",
    views: "28M+ views",
    category: "Mukbang",
    subscribers: 3100000,
    image: "/images/bloveslife.jpg"
  },
  {
    name: "Stoves Kitchen",
    slug: "stoveskitchen",
    color: "from-cyan-600 to-cyan-700",
    views: "12M+ views",
    category: "IRL",
    subscribers: 1500000,
    image: "/images/stoveskitchen.jpg"
  }
];

const formatCount = (num: number) => {
  if (num >= 1000000) {
    return `${Math.round(num / 1000000)}M`;
  } else if (num >= 1000) {
    return `${Math.round(num / 1000)}K`;
  }
  return num.toString();
};

const FeaturedCard = ({ client }: { client: typeof featuredClient }) => {
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
      className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-2xl shadow-inner mb-8"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <Link href={`/work/${client.slug}`} className="block">
        <div className={`relative w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 overflow-hidden bg-gradient-to-r ${client.color}`}>
          <div className="absolute inset-0">
            <img 
              src={client.image}
              alt={`${client.name} Background`} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </div>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
            <div className="text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{client.name}</h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 md:mb-4 opacity-90 line-clamp-2">{client.description}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <span className="bg-white/20 backdrop-blur-sm border border-white/10 px-2 sm:px-3 py-1 rounded-full text-xs">{client.category}</span>
                <span className="text-white font-inter">{formatCount(client.subscribers)} subscribers</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ClientCard = ({ client, index }: { client: typeof clients[0], index: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl"
      whileHover={{ 
        scale: 1.03,
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <Link href={`/work/${client.slug}`} className="block">
        <div className={`relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br ${client.color}`}>
          <div className="absolute inset-0">
            <img 
              src={client.image}
              alt={`${client.name} Background`}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
            <div className="text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2">{client.name}</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-sm border border-white/10 px-2 py-1 rounded-full text-xs">{client.category}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white font-inter">{formatCount(client.subscribers)} subscribers</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function WorkPage() {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

  const { ref: descRef, inView: descInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h1
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
          >
            Work
          </motion.h1>
          <motion.p
            ref={descRef}
            initial={{ opacity: 0, y: 20 }}
            animate={descInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4"
          >
            Discover the incredible creators we've had the privilege to work with, 
            each bringing their unique vision to life through compelling content.
          </motion.p>
        </div>

        <div className="mb-12 sm:mb-16">
          <FeaturedCard client={featuredClient} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {clients.map((client, index) => (
            <ClientCard key={client.slug} client={client} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
