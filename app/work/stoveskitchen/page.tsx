"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Play, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { YouTubeVideo, formatViewCount, formatDate } from "../../../lib/youtubeApi";

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

// Lazy Loaded Hero Section Component
const LazyHeroSection = React.memo(({ clientData }: { clientData: any }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "100px"
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-12"
    >
      {/* Enhanced Cyan Glassmorphism Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="inline-flex items-center bg-gradient-to-r from-cyan-600/30 via-cyan-700/25 to-cyan-800/30 border border-cyan-400/40 rounded-full px-8 py-4 mb-8 backdrop-blur-xl shadow-2xl shadow-cyan-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-cyan-800/10 rounded-full" />
        <span className="relative text-cyan-100 text-sm font-bold tracking-wide">
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

// Individual Video Card Component
const VideoCard = React.memo(({ 
  video, 
  index
}: {
  video: YouTubeVideo;
  index: number;
}) => {
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
      className="group relative overflow-hidden rounded-xl bg-black/20 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative aspect-video">
        {inView && (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
            title={video.title}
            className="w-full h-full rounded-xl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
    </motion.div>
  );
});

// Lazy Video Card Component
const LazyVideoCard = React.memo(({ video, index }: { video: YouTubeVideo; index: number }) => {
  return (
    <VideoCard
      video={video}
      index={index}
    />
  );
});

export default function StovesKitchenWorkPage() {
  // Static video data for Stove's Kitchen
  const staticVideos: YouTubeVideo[] = [
    {
      id: "xHufSa4Nfss",
      title: "Stove's Kitchen - Featured Video",
      description: "IRL content from Stove's Kitchen",
      channelTitle: "Stove's Kitchen",
      publishedAt: "2024-01-20T00:00:00Z",
      viewCount: "1.8M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/xHufSa4Nfss/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/xHufSa4Nfss/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/xHufSa4Nfss/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/xHufSa4Nfss/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "E4YkN5-ehjs",
      title: "Stove's Kitchen Video 2",
      description: "IRL content from Stove's Kitchen",
      channelTitle: "Stove's Kitchen",
      publishedAt: "2024-01-15T00:00:00Z",
      viewCount: "2.1M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/E4YkN5-ehjs/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/E4YkN5-ehjs/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/E4YkN5-ehjs/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/E4YkN5-ehjs/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "GjaVkt9G1gA",
      title: "Stove's Kitchen Video 3",
      description: "IRL content from Stove's Kitchen",
      channelTitle: "Stove's Kitchen",
      publishedAt: "2024-01-10T00:00:00Z",
      viewCount: "1.9M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/GjaVkt9G1gA/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/GjaVkt9G1gA/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/GjaVkt9G1gA/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/GjaVkt9G1gA/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "K1c-gzKbFXM",
      title: "Stove's Kitchen Video 4",
      description: "IRL content from Stove's Kitchen",
      channelTitle: "Stove's Kitchen",
      publishedAt: "2024-01-05T00:00:00Z",
      viewCount: "2.3M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/K1c-gzKbFXM/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/K1c-gzKbFXM/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/K1c-gzKbFXM/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/K1c-gzKbFXM/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "HP5OxMTaRBI",
      title: "Stove's Kitchen Video 5",
      description: "IRL content from Stove's Kitchen",
      channelTitle: "Stove's Kitchen",
      publishedAt: "2023-12-28T00:00:00Z",
      viewCount: "1.7M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/HP5OxMTaRBI/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/HP5OxMTaRBI/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/HP5OxMTaRBI/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/HP5OxMTaRBI/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "f4DXnUUn0rU",
      title: "Stove's Kitchen Video 6",
      description: "IRL content from Stove's Kitchen",
      channelTitle: "Stove's Kitchen",
      publishedAt: "2023-12-20T00:00:00Z",
      viewCount: "2.0M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/f4DXnUUn0rU/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/f4DXnUUn0rU/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/f4DXnUUn0rU/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/f4DXnUUn0rU/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    }
  ];

  // Client data
  const clientData = {
    name: "Stove's Kitchen",
    subscribers: "1.5M",
    backgroundImage: "/images/stoveskitchen.jpg",
    videos: [],
    thumbnails: [],
    category: "IRL",
    description: "Real-life adventures and challenges that keep viewers on the edge of their seats."
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

        {/* Lazy Loaded Video Grid */}
        {gridVideos.length > 0 && (
          <VideoGrid
            videos={gridVideos}
            hasMore={false}
            onLoadMore={() => {}}
            isLoading={false}
            excludeVideoId={featuredVideo?.id}
          />
        )}
      </div>
    </div>
  );
} 