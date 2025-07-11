"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Play, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { YouTubeVideo, formatViewCount, formatDate } from "../../../lib/youtubeApi";
import Head from "next/head";

// Build YouTube thumbnail URLs directly from video ID
const buildThumbnailUrls = (videoId: string) => ({
  maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
});

// Helper to preload an image and resolve if it loads, reject if it errors
const preloadImage = (src: string) =>
  new Promise<boolean>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

// Helper function to get the best available thumbnail
const getBestThumbnail = (thumbnails: YouTubeVideo['thumbnails']) => {
  // Try maxres first, then high, then medium, then default
  return thumbnails.maxres?.url || 
         thumbnails.high?.url || 
         thumbnails.medium?.url || 
         thumbnails.default?.url ||
         `https://placehold.co/480x360/1f2937/ffffff.png?text=Video+Thumbnail`;
};

// Thumbnail data for LankyBox
const thumbnailImages = [
  { src: "/lankybox/lankyboxworld/thumbnails/-DDgIm5zJY8.webp", alt: "LankyBox Thumbnail - -DDgIm5zJY8" },
  { src: "/lankybox/lankyboxworld/thumbnails/-gNd8o3Z45k.webp", alt: "LankyBox Thumbnail - -gNd8o3Z45k" },
  { src: "/lankybox/lankyboxworld/thumbnails/0mEIkdShSbU.webp", alt: "LankyBox Thumbnail - 0mEIkdShSbU" },
  { src: "/lankybox/lankyboxworld/thumbnails/1bVxVwm79ag.webp", alt: "LankyBox Thumbnail - 1bVxVwm79ag" },
  { src: "/lankybox/lankyboxworld/thumbnails/2EHnKqRhgJ0.webp", alt: "LankyBox Thumbnail - 2EHnKqRhgJ0" },
  { src: "/lankybox/lankyboxworld/thumbnails/2Qf0YZJn0a0.webp", alt: "LankyBox Thumbnail - 2Qf0YZJn0a0" },
  { src: "/lankybox/lankyboxworld/thumbnails/2XnHCoo_vXY.webp", alt: "LankyBox Thumbnail - 2XnHCoo_vXY" },
  { src: "/lankybox/lankyboxworld/thumbnails/2e569zwIVxs.webp", alt: "LankyBox Thumbnail - 2e569zwIVxs" },
  { src: "/lankybox/lankyboxworld/thumbnails/2geMWL4_WZo.webp", alt: "LankyBox Thumbnail - 2geMWL4_WZo" },
  { src: "/lankybox/lankyboxworld/thumbnails/3TiRh_Dm9_0.webp", alt: "LankyBox Thumbnail - 3TiRh_Dm9_0" },
  { src: "/lankybox/lankyboxworld/thumbnails/43qyQm5omak.webp", alt: "LankyBox Thumbnail - 43qyQm5omak" },
  { src: "/lankybox/lankyboxworld/thumbnails/4QLyFwBKNAU.webp", alt: "LankyBox Thumbnail - 4QLyFwBKNAU" },
  { src: "/lankybox/lankyboxworld/thumbnails/5dOmaJtadJs.webp", alt: "LankyBox Thumbnail - 5dOmaJtadJs" },
  { src: "/lankybox/lankyboxworld/thumbnails/5j1ip8q_fqc.webp", alt: "LankyBox Thumbnail - 5j1ip8q_fqc" },
  { src: "/lankybox/lankyboxworld/thumbnails/6Kez6QWI-Fw.webp", alt: "LankyBox Thumbnail - 6Kez6QWI-Fw" },
  { src: "/lankybox/lankyboxworld/thumbnails/6POTkCM1EkE.webp", alt: "LankyBox Thumbnail - 6POTkCM1EkE" },
  { src: "/lankybox/lankyboxworld/thumbnails/7MsrVBdNYck.webp", alt: "LankyBox Thumbnail - 7MsrVBdNYck" },
  { src: "/lankybox/lankyboxworld/thumbnails/7gXzQAVRw6w.webp", alt: "LankyBox Thumbnail - 7gXzQAVRw6w" },
  { src: "/lankybox/lankyboxworld/thumbnails/8V3p6j5rRVc.webp", alt: "LankyBox Thumbnail - 8V3p6j5rRVc" },
  { src: "/lankybox/lankyboxworld/thumbnails/AOIFj-ZuLNA.webp", alt: "LankyBox Thumbnail - AOIFj-ZuLNA" },
  { src: "/lankybox/lankyboxworld/thumbnails/B-sol4v6Oh8.webp", alt: "LankyBox Thumbnail - B-sol4v6Oh8" },
  { src: "/lankybox/lankyboxworld/thumbnails/BEJwRRwdpMg.webp", alt: "LankyBox Thumbnail - BEJwRRwdpMg" },
  { src: "/lankybox/lankyboxworld/thumbnails/Cpc2ze-XsJ0.webp", alt: "LankyBox Thumbnail - Cpc2ze-XsJ0" },
  { src: "/lankybox/lankyboxworld/thumbnails/Dr8K8RXtYZo.webp", alt: "LankyBox Thumbnail - Dr8K8RXtYZo" },
  { src: "/lankybox/lankyboxworld/thumbnails/E87o0parq7A.webp", alt: "LankyBox Thumbnail - E87o0parq7A" },
  { src: "/lankybox/lankyboxworld/thumbnails/EC3NA6rGupc.webp", alt: "LankyBox Thumbnail - EC3NA6rGupc" },
  { src: "/lankybox/lankyboxworld/thumbnails/ENVQ_CM2bjA.webp", alt: "LankyBox Thumbnail - ENVQ_CM2bjA" },
  { src: "/lankybox/lankyboxworld/thumbnails/EtXTgDOVCUU.webp", alt: "LankyBox Thumbnail - EtXTgDOVCUU" },
  { src: "/lankybox/lankyboxworld/thumbnails/G34XtGAFkVI.webp", alt: "LankyBox Thumbnail - G34XtGAFkVI" },
  { src: "/lankybox/lankyboxworld/thumbnails/GQxPdt7tOwM.webp", alt: "LankyBox Thumbnail - GQxPdt7tOwM" },
  { src: "/lankybox/lankyboxworld/thumbnails/HBnMNa8f-ZI.webp", alt: "LankyBox Thumbnail - HBnMNa8f-ZI" },
  { src: "/lankybox/lankyboxworld/thumbnails/HF6V3wcX9Kk.webp", alt: "LankyBox Thumbnail - HF6V3wcX9Kk" },
  { src: "/lankybox/lankyboxworld/thumbnails/Ih4wtQoWpWs.webp", alt: "LankyBox Thumbnail - Ih4wtQoWpWs" },
  { src: "/lankybox/lankyboxworld/thumbnails/L-nGD4EVioI.webp", alt: "LankyBox Thumbnail - L-nGD4EVioI" },
  { src: "/lankybox/lankyboxworld/thumbnails/L4tVdPSgIhQ.webp", alt: "LankyBox Thumbnail - L4tVdPSgIhQ" },
  { src: "/lankybox/lankyboxworld/thumbnails/MR3uS_Lnzpo.webp", alt: "LankyBox Thumbnail - MR3uS_Lnzpo" },
  { src: "/lankybox/lankyboxworld/thumbnails/NF_eQc9nQc0.webp", alt: "LankyBox Thumbnail - NF_eQc9nQc0" },
  { src: "/lankybox/lankyboxworld/thumbnails/ONiRbTRt2_A.webp", alt: "LankyBox Thumbnail - ONiRbTRt2_A" },
  { src: "/lankybox/lankyboxworld/thumbnails/OWAw8hQFcQo.webp", alt: "LankyBox Thumbnail - OWAw8hQFcQo" },
  { src: "/lankybox/lankyboxworld/thumbnails/OhBALYa6JUk.webp", alt: "LankyBox Thumbnail - OhBALYa6JUk" },
  { src: "/lankybox/lankyboxworld/thumbnails/RAQmnUpgNPo.webp", alt: "LankyBox Thumbnail - RAQmnUpgNPo" },
  { src: "/lankybox/lankyboxworld/thumbnails/RBl3nB50TTY.webp", alt: "LankyBox Thumbnail - RBl3nB50TTY" },
  { src: "/lankybox/lankyboxworld/thumbnails/RWflcupxeg0.webp", alt: "LankyBox Thumbnail - RWflcupxeg0" },
  { src: "/lankybox/lankyboxworld/thumbnails/RmbORGBJQu4.webp", alt: "LankyBox Thumbnail - RmbORGBJQu4" },
  { src: "/lankybox/lankyboxworld/thumbnails/SCcQ8wHSLgs.webp", alt: "LankyBox Thumbnail - SCcQ8wHSLgs" },
  { src: "/lankybox/lankyboxworld/thumbnails/T8yNoGi0k6k.webp", alt: "LankyBox Thumbnail - T8yNoGi0k6k" },
  { src: "/lankybox/lankyboxworld/thumbnails/UijjUoD19hE.webp", alt: "LankyBox Thumbnail - UijjUoD19hE" },
  { src: "/lankybox/lankyboxworld/thumbnails/Uz_ivE4JTRA.webp", alt: "LankyBox Thumbnail - Uz_ivE4JTRA" },
  { src: "/lankybox/lankyboxworld/thumbnails/Vh6sdmxS6UQ.webp", alt: "LankyBox Thumbnail - Vh6sdmxS6UQ" },
  { src: "/lankybox/lankyboxworld/thumbnails/VrYuTY7Duzs.webp", alt: "LankyBox Thumbnail - VrYuTY7Duzs" },
  { src: "/lankybox/lankyboxworld/thumbnails/VwUmeo6Ezjg.webp", alt: "LankyBox Thumbnail - VwUmeo6Ezjg" },
  { src: "/lankybox/lankyboxworld/thumbnails/WnasMKH4low.webp", alt: "LankyBox Thumbnail - WnasMKH4low" },
  { src: "/lankybox/lankyboxworld/thumbnails/XCPHObgrJXM.webp", alt: "LankyBox Thumbnail - XCPHObgrJXM" },
  { src: "/lankybox/lankyboxworld/thumbnails/Y7OcvGwzrmQ.webp", alt: "LankyBox Thumbnail - Y7OcvGwzrmQ" },
  { src: "/lankybox/lankyboxworld/thumbnails/YH662IdVwBs.webp", alt: "LankyBox Thumbnail - YH662IdVwBs" },
  { src: "/lankybox/lankyboxworld/thumbnails/_Ri1TBplMHM.webp", alt: "LankyBox Thumbnail - _Ri1TBplMHM" },
  { src: "/lankybox/lankyboxworld/thumbnails/_ZvVjxfPTLs.webp", alt: "LankyBox Thumbnail - _ZvVjxfPTLs" },
  { src: "/lankybox/lankyboxworld/thumbnails/_nyMVcRSsUk.webp", alt: "LankyBox Thumbnail - _nyMVcRSsUk" },
  { src: "/lankybox/lankyboxworld/thumbnails/aOEukzVR4yg.webp", alt: "LankyBox Thumbnail - aOEukzVR4yg" },
  { src: "/lankybox/lankyboxworld/thumbnails/cH4x2MlpLlI.webp", alt: "LankyBox Thumbnail - cH4x2MlpLlI" },
  { src: "/lankybox/lankyboxworld/thumbnails/dM8GihJX-2w.webp", alt: "LankyBox Thumbnail - dM8GihJX-2w" },
  { src: "/lankybox/lankyboxworld/thumbnails/dkTROV4ZTEs.webp", alt: "LankyBox Thumbnail - dkTROV4ZTEs" },
  { src: "/lankybox/lankyboxworld/thumbnails/dxMO8PRsIPs.webp", alt: "LankyBox Thumbnail - dxMO8PRsIPs" },
  { src: "/lankybox/lankyboxworld/thumbnails/f2mS2481K3Q.webp", alt: "LankyBox Thumbnail - f2mS2481K3Q" },
  { src: "/lankybox/lankyboxworld/thumbnails/fmw1RQNufTs.webp", alt: "LankyBox Thumbnail - fmw1RQNufTs" },
  { src: "/lankybox/lankyboxworld/thumbnails/gh6CPUvUoIY.webp", alt: "LankyBox Thumbnail - gh6CPUvUoIY" },
  { src: "/lankybox/lankyboxworld/thumbnails/hA148jNTNWI.webp", alt: "LankyBox Thumbnail - hA148jNTNWI" },
  { src: "/lankybox/lankyboxworld/thumbnails/hBkISCcWhOU.webp", alt: "LankyBox Thumbnail - hBkISCcWhOU" },
  { src: "/lankybox/lankyboxworld/thumbnails/i2CLWdN702w.webp", alt: "LankyBox Thumbnail - i2CLWdN702w" },
  { src: "/lankybox/lankyboxworld/thumbnails/iNwwdF6qLZA.webp", alt: "LankyBox Thumbnail - iNwwdF6qLZA" },
  { src: "/lankybox/lankyboxworld/thumbnails/iVLU8_1eWmk.webp", alt: "LankyBox Thumbnail - iVLU8_1eWmk" },
  { src: "/lankybox/lankyboxworld/thumbnails/k84xrT0VbvQ.webp", alt: "LankyBox Thumbnail - k84xrT0VbvQ" },
  { src: "/lankybox/lankyboxworld/thumbnails/kA-2T9_snjw.webp", alt: "LankyBox Thumbnail - kA-2T9_snjw" },
  { src: "/lankybox/lankyboxworld/thumbnails/lzq43tvWbcU.webp", alt: "LankyBox Thumbnail - lzq43tvWbcU" },
  { src: "/lankybox/lankyboxworld/thumbnails/m3MOOXXgi_A.webp", alt: "LankyBox Thumbnail - m3MOOXXgi_A" },
  { src: "/lankybox/lankyboxworld/thumbnails/mCSpgqsyvPk.webp", alt: "LankyBox Thumbnail - mCSpgqsyvPk" },
  { src: "/lankybox/lankyboxworld/thumbnails/mjR57PgVhTc.webp", alt: "LankyBox Thumbnail - mjR57PgVhTc" },
  { src: "/lankybox/lankyboxworld/thumbnails/oXAEwK-fNno.webp", alt: "LankyBox Thumbnail - oXAEwK-fNno" },
  { src: "/lankybox/lankyboxworld/thumbnails/q-iQWjgOWmA.webp", alt: "LankyBox Thumbnail - q-iQWjgOWmA" },
  { src: "/lankybox/lankyboxworld/thumbnails/qZ_oPnPsSis.webp", alt: "LankyBox Thumbnail - qZ_oPnPsSis" },
  { src: "/lankybox/lankyboxworld/thumbnails/qam8IMobnow.webp", alt: "LankyBox Thumbnail - qam8IMobnow" },
  { src: "/lankybox/lankyboxworld/thumbnails/r5gcZGupczQ.webp", alt: "LankyBox Thumbnail - r5gcZGupczQ" },
  { src: "/lankybox/lankyboxworld/thumbnails/s6kjoPWxIXw.webp", alt: "LankyBox Thumbnail - s6kjoPWxIXw" },
  { src: "/lankybox/lankyboxworld/thumbnails/sAdd9ZYBHb8.webp", alt: "LankyBox Thumbnail - sAdd9ZYBHb8" },
  { src: "/lankybox/lankyboxworld/thumbnails/sjVeB74pvMY.webp", alt: "LankyBox Thumbnail - sjVeB74pvMY" },
  { src: "/lankybox/lankyboxworld/thumbnails/t51g91_ruds.webp", alt: "LankyBox Thumbnail - t51g91_ruds" },
  { src: "/lankybox/lankyboxworld/thumbnails/tIyB86sMDLo.webp", alt: "LankyBox Thumbnail - tIyB86sMDLo" },
  { src: "/lankybox/lankyboxworld/thumbnails/tp-Y3xI78RI.webp", alt: "LankyBox Thumbnail - tp-Y3xI78RI" },
  { src: "/lankybox/lankyboxworld/thumbnails/tpcWKIaHM4Y.webp", alt: "LankyBox Thumbnail - tpcWKIaHM4Y" },
  { src: "/lankybox/lankyboxworld/thumbnails/tzFxaGDC6Kk.webp", alt: "LankyBox Thumbnail - tzFxaGDC6Kk" },
  { src: "/lankybox/lankyboxworld/thumbnails/usI6LgQm3Zc.webp", alt: "LankyBox Thumbnail - usI6LgQm3Zc" },
  { src: "/lankybox/lankyboxworld/thumbnails/vYrUZGZ1E0c.webp", alt: "LankyBox Thumbnail - vYrUZGZ1E0c" },
  { src: "/lankybox/lankyboxworld/thumbnails/xKqfO2_1t2U.webp", alt: "LankyBox Thumbnail - xKqfO2_1t2U" },
  { src: "/lankybox/lankyboxworld/thumbnails/xVBkiufQeGs.webp", alt: "LankyBox Thumbnail - xVBkiufQeGs" },
  { src: "/lankybox/lankyboxworld/thumbnails/xZ2anlcbUsE.webp", alt: "LankyBox Thumbnail - xZ2anlcbUsE" },
  { src: "/lankybox/lankyboxworld/thumbnails/xiMwI0jO6zc.webp", alt: "LankyBox Thumbnail - xiMwI0jO6zc" },
  { src: "/lankybox/lankyboxworld/thumbnails/y0CBGR2MnoM.webp", alt: "LankyBox Thumbnail - y0CBGR2MnoM" },
  { src: "/lankybox/lankyboxworld/thumbnails/yNU5zaSjDOo.webp", alt: "LankyBox Thumbnail - yNU5zaSjDOo" },
  { src: "/lankybox/lankyboxworld/thumbnails/yfDZvtBplDE.webp", alt: "LankyBox Thumbnail - yfDZvtBplDE" },
  { src: "/lankybox/lankyboxworld/thumbnails/ysh6AhA5Uwo.webp", alt: "LankyBox Thumbnail - ysh6AhA5Uwo" },
  { src: "/lankybox/lankyboxworld/thumbnails/yuerVf0gZI4.webp", alt: "LankyBox Thumbnail - yuerVf0gZI4" }
];

// Lazy Loaded Featured Video Component
const FeaturedVideo = React.memo(({ video }: { video: YouTubeVideo | null }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "100px"
  });

  if (!video) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-12"
    >
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="text-2xl md:text-3xl font-bold mb-6 text-center text-white"
      >
        Featured Video
      </motion.h2>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/20 border border-white/10">
          <div className="aspect-video w-full">
            {inView && (
              <motion.iframe
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                title={video.title}
                className="w-full h-full rounded-2xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
              />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

// Tab System Component
const TabSystem = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <button
          onClick={() => onTabChange('video-editing')}
          className={`px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 ${
            activeTab === 'video-editing'
              ? 'bg-gradient-to-r from-emerald-600/30 via-emerald-700/25 to-emerald-800/30 border border-emerald-400/40 backdrop-blur-xl shadow-2xl shadow-emerald-500/20'
              : 'bg-black/20 border border-white/10 backdrop-blur-sm hover:bg-black/30'
          }`}
        >
          <div className={`absolute inset-0 rounded-full ${
            activeTab === 'video-editing'
              ? 'bg-gradient-to-r from-emerald-600/10 to-emerald-800/10'
              : ''
          }`} />
          <span className={`relative ${
            activeTab === 'video-editing' ? 'text-emerald-100' : 'text-white'
          }`}>
            VIDEO EDITING
          </span>
        </button>
        
        <button
          onClick={() => onTabChange('thumbnail-design')}
          className={`px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 ${
            activeTab === 'thumbnail-design'
              ? 'bg-gradient-to-r from-emerald-600/30 via-emerald-700/25 to-emerald-800/30 border border-emerald-400/40 backdrop-blur-xl shadow-2xl shadow-emerald-500/20'
              : 'bg-black/20 border border-white/10 backdrop-blur-sm hover:bg-black/30'
          }`}
        >
          <div className={`absolute inset-0 rounded-full ${
            activeTab === 'thumbnail-design'
              ? 'bg-gradient-to-r from-emerald-600/10 to-emerald-800/10'
              : ''
          }`} />
          <span className={`relative ${
            activeTab === 'thumbnail-design' ? 'text-emerald-100' : 'text-white'
          }`}>
            THUMBNAIL DESIGN
          </span>
        </button>
      </div>
    </motion.div>
  );
};

// Lazy Loaded Video Grid Component
const VideoGrid = React.memo(({ 
  videos, 
  hasMore, 
  onLoadMore, 
  isLoading,
  excludeVideoId
}: {
  videos: YouTubeVideo[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  excludeVideoId?: string;
}) => {

  const filteredVideos = useMemo(() => 
    videos.filter(video => video.id !== excludeVideoId), 
    [videos, excludeVideoId]
  );

  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({
    threshold: 0.1,
    rootMargin: "100px"
  });

  useEffect(() => {
    if (loadMoreInView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [loadMoreInView, hasMore, isLoading, onLoadMore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">
        Recent Videos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <LazyVideoCard
            key={video.id}
            video={video}
            index={index}
          />
        ))}
      </div>
      
      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="text-center py-8">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-white mr-2" />
              <span className="text-white">Loading more videos...</span>
            </div>
          ) : (
            <div className="h-8" /> // Invisible trigger
          )}
        </div>
      )}
    </motion.div>
  );
});

// Thumbnail Grid optimized for fast loading, no hover zoom
const ThumbnailGrid = () => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const eagerCount = isMobile ? 2 : 3;
  const preloadLinks = thumbnailImages.slice(0, 3).map((image, idx) => (
    <link
      key={image.src}
      rel="preload"
      as="image"
      href={image.src}
      imageSrcSet={image.src}
      imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  ));

  return (
    <>
      <Head>{preloadLinks}</Head>
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">
          Thumbnail Gallery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {thumbnailImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-black/20 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-video">
                <img
                  src={image.src}
                  alt={`LankyBox Thumbnail - ${image.alt}`}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500"
                  loading={index < eagerCount ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index < eagerCount ? "high" : "auto"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Lazy load the ThumbnailGrid only when in view
const LazyThumbnailGrid = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <div ref={ref} style={{ minHeight: 300 }}>
      {inView ? <ThumbnailGrid /> : (
        <div className="flex items-center justify-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></span>
        </div>
      )}
    </div>
  );
};

// Individual Video Card Component
const VideoCard = React.memo(({ 
  video, 
  index, 
  isPlaying, 
  onVideoClick,
  loadedImages,
  setLoadedImages
}: {
  video: YouTubeVideo;
  index: number;
  isPlaying: boolean;
  onVideoClick: () => void;
  loadedImages: Set<string>;
  setLoadedImages: React.Dispatch<React.SetStateAction<Set<string>>>;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

  useEffect(() => {
    if (!inView) return;
    
    let isMounted = true;
    
    // Start with fallback thumbnail
    setThumbnailUrl("https://placehold.co/480x360/1f2937/ffffff.png?text=Video+Thumbnail");
    
    // Try to use API thumbnails as secondary option
    const apiThumbnail = video.thumbnails?.maxres?.url || video.thumbnails?.high?.url;
    if (apiThumbnail) {
      // Test if the YouTube thumbnail loads
      preloadImage(apiThumbnail).then((ok) => {
        if (isMounted && ok) {
          setThumbnailUrl(apiThumbnail);
        }
      });
    }
    
    return () => { isMounted = false; };
  }, [video, inView]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setLoadedImages(prev => new Set([...prev, video.id]));
  };

  const handleImageError = () => {
    setImageLoaded(true);
    setThumbnailUrl("https://placehold.co/480x360/1f2937/ffffff.png?text=Video+Thumbnail");
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl bg-black/20 border border-white/10 shadow-xl"
    >
      <div 
        className="relative aspect-video cursor-pointer"
        onClick={onVideoClick}
      >
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            className="w-full h-full rounded-xl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <>
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-800 rounded-xl flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}
            
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt={video.title}
                fill
                unoptimized
                className={`object-cover rounded-xl transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            <div className="absolute inset-0 bg-black/30 rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Play className="w-6 h-6 text-white ml-0.5" />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
});

// Lazy Video Card Component
const LazyVideoCard = React.memo(({ 
  video, 
  index 
}: {
  video: YouTubeVideo;
  index: number;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleVideoClick = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  return (
    <VideoCard
      video={video}
      index={index}
      isPlaying={isPlaying}
      onVideoClick={handleVideoClick}
      loadedImages={loadedImages}
      setLoadedImages={setLoadedImages}
    />
  );
});

// Lazy Loaded Hero Section Component
const LazyHeroSection = React.memo(({ clientData }: { clientData: any }) => {
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
      {/* Enhanced Emerald Glassmorphism Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="inline-flex items-center bg-gradient-to-r from-emerald-600/30 via-emerald-700/25 to-emerald-800/30 border border-emerald-400/40 rounded-full px-8 py-4 mb-8 backdrop-blur-xl shadow-2xl shadow-emerald-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-emerald-800/10 rounded-full" />
        <span className="relative text-emerald-100 text-sm font-bold tracking-wide">
          {clientData.category}
        </span>
      </motion.div>
      
      {/* Hero Title with Enhanced Animation */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4"
      >
        {clientData.name}
      </motion.h1>
      
      {/* Hero Description with Enhanced Animation */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4"
      >
        {clientData.description}
      </motion.p>
    </motion.div>
  );
});

export default function LankyBoxWorkPage() {
  const [activeTab, setActiveTab] = useState('thumbnail-design');

  // Static video data for LankyBox
  const staticVideos: YouTubeVideo[] = [
    {
      id: "xGddiFwRH80",
      title: "LankyBox Plays AMONG US But Ever Winner GETS $1,000!? (EXPENSIVE GIVEAWAY!)",
      description: "Gaming content from LankyBox",
      channelTitle: "LankyBox",
      publishedAt: "2024-01-20T00:00:00Z",
      viewCount: "2.1M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/xGddiFwRH80/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/xGddiFwRH80/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/xGddiFwRH80/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/xGddiFwRH80/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "Ts0rZbIzol8",
      title: "SLENDER MAN WITH ZERO BUDGET! (Slender Man PARODY By LANKYBOX!)",
      description: "Gaming content from LankyBox",
      channelTitle: "LankyBox",
      publishedAt: "2024-01-15T00:00:00Z",
      viewCount: "1.8M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/Ts0rZbIzol8/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/Ts0rZbIzol8/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/Ts0rZbIzol8/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/Ts0rZbIzol8/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "_c7mB8qS5R4",
      title: "LankyBox HATCHING 100 GOLDEN PENGUINS In ADOPT ME!? (LUCKIEST OPENING CHALLENGE EVER!)",
      description: "Gaming content from LankyBox",
      channelTitle: "LankyBox",
      publishedAt: "2024-01-10T00:00:00Z",
      viewCount: "2.5M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/_c7mB8qS5R4/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/_c7mB8qS5R4/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/_c7mB8qS5R4/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/_c7mB8qS5R4/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "nS-4PIOl8Kk",
      title: "Can We Beat AMONG US But WE TURNED COLORS OFF!? (IMPOSSIBLE CHALLENGE!)",
      description: "Gaming content from LankyBox",
      channelTitle: "LankyBox",
      publishedAt: "2024-01-05T00:00:00Z",
      viewCount: "1.9M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/nS-4PIOl8Kk/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/nS-4PIOl8Kk/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/nS-4PIOl8Kk/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/nS-4PIOl8Kk/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "-8ek169lH3U",
      title: "Can We Beat The TRADING SHADOW DRAGONS ONLY CHALLENGE In Roblox ADOPT ME!? (MEGA RARE TRADES!)",
      description: "Gaming content from LankyBox",
      channelTitle: "LankyBox",
      publishedAt: "2023-12-28T00:00:00Z",
      viewCount: "2.3M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/-8ek169lH3U/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/-8ek169lH3U/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/-8ek169lH3U/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/-8ek169lH3U/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "RSH89G4c3oU",
      title: "Can We Beat The AMONG US MYSTERY WHEEL CHALLENGE!? (MYSTERY WHEEL DECIDES WHAT WE DO!?)",
      description: "Gaming content from LankyBox",
      channelTitle: "LankyBox",
      publishedAt: "2023-12-20T00:00:00Z",
      viewCount: "1.7M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/RSH89G4c3oU/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/RSH89G4c3oU/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/RSH89G4c3oU/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/RSH89G4c3oU/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    }
  ];

  // Client data
  const clientData = {
    name: "LankyBox",
    subscribers: "15.2M",
    backgroundImage: "/images/lankybox.jpg",
    videos: [],
    thumbnails: [],
    category: "Gaming & Entertainment",
    description: "Justin and Adam bring you the most entertaining gaming content with challenges, giveaways, and hilarious moments."
  };

  // Set featured video as the first video
  const featuredVideo = staticVideos[0];
  const gridVideos = staticVideos.slice(1); // All videos except the first one

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 pt-28 pb-16 md:pt-40 md:pb-20">

        {/* Lazy Loaded Hero Section */}
        <LazyHeroSection clientData={clientData} />

        {/* Lazy Loaded Featured Video */}
        {featuredVideo && <FeaturedVideo video={featuredVideo} />}

        {/* Tab System */}
        <TabSystem activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'video-editing' && (
            <motion.div
              key="video-editing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {gridVideos.length > 0 && (
                <VideoGrid
                  videos={gridVideos}
                  hasMore={false}
                  onLoadMore={() => {}}
                  isLoading={false}
                  excludeVideoId={featuredVideo?.id}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'thumbnail-design' && (
            <div key="thumbnail-design">
              <LazyThumbnailGrid />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 