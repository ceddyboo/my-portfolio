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
      {/* Enhanced Purple Glassmorphism Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="inline-flex items-center bg-gradient-to-r from-purple-600/30 via-purple-700/25 to-purple-800/30 border border-purple-400/40 rounded-full px-8 py-4 mb-8 backdrop-blur-xl shadow-2xl shadow-purple-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-purple-800/10 rounded-full" />
        <span className="relative text-purple-100 text-sm font-bold tracking-wide">
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

export default function BriannaPlayzWorkPage() {
  // Static video data for BriannaPlayz
  const staticVideos: YouTubeVideo[] = [
    {
      id: "3JmAYUCinA8",
      title: "BriannaPlayz Video 1",
      description: "Gaming content from BriannaPlayz",
      channelTitle: "BriannaPlayz",
      publishedAt: "2024-01-20T00:00:00Z",
      viewCount: "2.1M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/3JmAYUCinA8/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/3JmAYUCinA8/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/3JmAYUCinA8/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/3JmAYUCinA8/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "6B7gk5DpW58",
      title: "BriannaPlayz Video 2",
      description: "Gaming content from BriannaPlayz",
      channelTitle: "BriannaPlayz",
      publishedAt: "2024-01-15T00:00:00Z",
      viewCount: "1.8M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/6B7gk5DpW58/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/6B7gk5DpW58/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/6B7gk5DpW58/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/6B7gk5DpW58/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "FDv4RzsEsy4",
      title: "BriannaPlayz Video 3",
      description: "Gaming content from BriannaPlayz",
      channelTitle: "BriannaPlayz",
      publishedAt: "2024-01-10T00:00:00Z",
      viewCount: "2.5M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/FDv4RzsEsy4/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/FDv4RzsEsy4/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/FDv4RzsEsy4/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/FDv4RzsEsy4/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "IxIc2eZlu2c",
      title: "BriannaPlayz Video 4",
      description: "Gaming content from BriannaPlayz",
      channelTitle: "BriannaPlayz",
      publishedAt: "2024-01-05T00:00:00Z",
      viewCount: "1.9M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/IxIc2eZlu2c/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/IxIc2eZlu2c/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/IxIc2eZlu2c/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/IxIc2eZlu2c/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "Tbk-r6OJoQw",
      title: "BriannaPlayz Video 5",
      description: "Gaming content from BriannaPlayz",
      channelTitle: "BriannaPlayz",
      publishedAt: "2023-12-28T00:00:00Z",
      viewCount: "2.3M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/Tbk-r6OJoQw/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/Tbk-r6OJoQw/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/Tbk-r6OJoQw/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/Tbk-r6OJoQw/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    }
  ];

  // Client data
  const clientData = {
    name: "BriannaPlayz",
    subscribers: "3.8M",
    backgroundImage: "/images/briannaplayz.jpg",
    videos: [],
    thumbnails: [],
    category: "Gaming Content",
    description: "Gaming content creator and streamer with a dedicated community."
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