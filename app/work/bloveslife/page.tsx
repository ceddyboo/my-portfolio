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
      {/* Enhanced Teal Glassmorphism Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="inline-flex items-center bg-gradient-to-r from-teal-600/30 via-teal-700/25 to-teal-800/30 border border-teal-400/40 rounded-full px-8 py-4 mb-8 backdrop-blur-xl shadow-2xl shadow-teal-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-teal-800/10 rounded-full" />
        <span className="relative text-teal-100 text-sm font-bold tracking-wide">
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
      

    </motion.div>
  );
});

export default function BLovesLifeWorkPage() {
  // Static video data for B. Loves Life
  const staticVideos: YouTubeVideo[] = [
    {
      id: "kl_4Ev4NVv4",
      title: "B. Loves Life - Featured Video",
      description: "Lifestyle content from B. Loves Life",
      channelTitle: "B. Loves Life",
      publishedAt: "2024-01-20T00:00:00Z",
      viewCount: "2.1M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/kl_4Ev4NVv4/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/kl_4Ev4NVv4/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/kl_4Ev4NVv4/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/kl_4Ev4NVv4/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "0l09oKxvt9E",
      title: "B. Loves Life Video 2",
      description: "Lifestyle content from B. Loves Life",
      channelTitle: "B. Loves Life",
      publishedAt: "2024-01-15T00:00:00Z",
      viewCount: "1.8M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/0l09oKxvt9E/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/0l09oKxvt9E/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/0l09oKxvt9E/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/0l09oKxvt9E/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "cqNXNeHjwss",
      title: "B. Loves Life Video 3",
      description: "Lifestyle content from B. Loves Life",
      channelTitle: "B. Loves Life",
      publishedAt: "2024-01-10T00:00:00Z",
      viewCount: "2.5M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/cqNXNeHjwss/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/cqNXNeHjwss/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/cqNXNeHjwss/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/cqNXNeHjwss/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "MYopZFQXBtg",
      title: "B. Loves Life Video 4",
      description: "Lifestyle content from B. Loves Life",
      channelTitle: "B. Loves Life",
      publishedAt: "2024-01-05T00:00:00Z",
      viewCount: "1.9M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/MYopZFQXBtg/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/MYopZFQXBtg/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/MYopZFQXBtg/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/MYopZFQXBtg/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "ESlphPY_Pjg",
      title: "B. Loves Life Video 5",
      description: "Lifestyle content from B. Loves Life",
      channelTitle: "B. Loves Life",
      publishedAt: "2023-12-28T00:00:00Z",
      viewCount: "2.3M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/ESlphPY_Pjg/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/ESlphPY_Pjg/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/ESlphPY_Pjg/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/ESlphPY_Pjg/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "c63Knv2cgaE",
      title: "B. Loves Life Video 6",
      description: "Lifestyle content from B. Loves Life",
      channelTitle: "B. Loves Life",
      publishedAt: "2023-12-20T00:00:00Z",
      viewCount: "1.7M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/c63Knv2cgaE/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/c63Knv2cgaE/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/c63Knv2cgaE/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/c63Knv2cgaE/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "eY6KwKzPUOE",
      title: "B. Loves Life Video 7",
      description: "Lifestyle content from B. Loves Life",
      channelTitle: "B. Loves Life",
      publishedAt: "2023-12-15T00:00:00Z",
      viewCount: "2.0M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/eY6KwKzPUOE/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/eY6KwKzPUOE/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/eY6KwKzPUOE/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/eY6KwKzPUOE/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "sYListIydWA",
      title: "B. Loves Life Video 8",
      description: "Lifestyle content from B. Loves Life",
      channelTitle: "B. Loves Life",
      publishedAt: "2023-12-10T00:00:00Z",
      viewCount: "1.6M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/sYListIydWA/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/sYListIydWA/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/sYListIydWA/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/sYListIydWA/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    }
  ];

  // Client data
  const clientData = {
    name: "Bloveslife",
    subscribers: "2.1M",
    backgroundImage: "/images/bloveslife.jpg",
    videos: [],
    thumbnails: [],
    category: "Mukbang",
    description: ""
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