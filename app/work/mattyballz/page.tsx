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
  }, [inView, video.thumbnails]);

  const handleImageLoad = () => {
    console.log('Video thumbnail loaded successfully:', thumbnailUrl);
    setImageLoaded(true);
    setLoadedImages(prev => new Set([...prev, video.id]));
  };

  const handleImageError = () => {
    console.error('Video thumbnail failed to load:', thumbnailUrl);
    setImageLoaded(true);
    setThumbnailUrl("https://placehold.co/480x360/1f2937/ffffff.png?text=Video+Thumbnail");
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1, 
        ease: "easeOut" 
      }}
      className="group cursor-pointer"
    >
      <div 
        className="relative rounded-xl overflow-hidden shadow-lg bg-black/20 border border-white/10 transition-transform duration-300 hover:scale-[1.02]"
        onClick={onVideoClick}
      >
        {isPlaying ? (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              className="w-full h-full rounded-xl"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className="relative aspect-video w-full">
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
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-xl">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {video.title}
          </h3>
        </div>
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
  const [isLoaded, setIsLoaded] = useState(false);
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
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl"
      whileHover={{ 
        scale: 1.03,
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <div className="aspect-video w-full">
        {inView && (
          <motion.iframe
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
            title={video.title}
            className="w-full h-full rounded-xl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </div>
    </motion.div>
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

export default function MattyballzWorkPage() {
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Static video data for mattyballz
  const staticVideos: YouTubeVideo[] = [
    {
      id: "StYahCW6pYc",
      title: "I GOT BANNED FROM YOUTUBE",
      description: "Featured commentary video from mattyballz",
      channelTitle: "mattyballz",
      publishedAt: "2024-01-20T00:00:00Z",
      viewCount: "3.5M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/StYahCW6pYc/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/StYahCW6pYc/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/StYahCW6pYc/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/StYahCW6pYc/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "WN1PErGVefY",
      title: "I GOT BANNED FROM YOUTUBE",
      description: "Latest commentary video from mattyballz",
      channelTitle: "mattyballz",
      publishedAt: "2024-01-15T00:00:00Z",
      viewCount: "2.5M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/WN1PErGVefY/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/WN1PErGVefY/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/WN1PErGVefY/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/WN1PErGVefY/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "j3OveJwcDwQ",
      title: "I GOT BANNED FROM YOUTUBE",
      description: "Commentary content from mattyballz",
      channelTitle: "mattyballz",
      publishedAt: "2024-01-10T00:00:00Z",
      viewCount: "1.8M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/j3OveJwcDwQ/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/j3OveJwcDwQ/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/j3OveJwcDwQ/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/j3OveJwcDwQ/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "IvXTAZIL5cM",
      title: "I GOT BANNED FROM YOUTUBE",
      description: "Commentary content from mattyballz",
      channelTitle: "mattyballz",
      publishedAt: "2024-01-05T00:00:00Z",
      viewCount: "3.2M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/IvXTAZIL5cM/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/IvXTAZIL5cM/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/IvXTAZIL5cM/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/IvXTAZIL5cM/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "dy2eA-QaYq0",
      title: "I GOT BANNED FROM YOUTUBE",
      description: "Commentary content from mattyballz",
      channelTitle: "mattyballz",
      publishedAt: "2023-12-28T00:00:00Z",
      viewCount: "2.1M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/dy2eA-QaYq0/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/dy2eA-QaYq0/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/dy2eA-QaYq0/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/dy2eA-QaYq0/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "x5-NESCT7Es",
      title: "I GOT BANNED FROM YOUTUBE",
      description: "Commentary content from mattyballz",
      channelTitle: "mattyballz",
      publishedAt: "2023-12-20T00:00:00Z",
      viewCount: "1.9M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/x5-NESCT7Es/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/x5-NESCT7Es/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/x5-NESCT7Es/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/x5-NESCT7Es/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    },
    {
      id: "tpTj7CAFudA",
      title: "I GOT BANNED FROM YOUTUBE",
      description: "Commentary content from mattyballz",
      channelTitle: "mattyballz",
      publishedAt: "2023-12-15T00:00:00Z",
      viewCount: "2.7M",
      thumbnails: {
        default: { url: `https://i.ytimg.com/vi/tpTj7CAFudA/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://i.ytimg.com/vi/tpTj7CAFudA/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://i.ytimg.com/vi/tpTj7CAFudA/hqdefault.jpg`, width: 480, height: 360 },
        maxres: { url: `https://i.ytimg.com/vi/tpTj7CAFudA/maxresdefault.jpg`, width: 1280, height: 720 }
      }
    }
  ];

  // Client data - using static data for Vercel compatibility
  const clientData = {
    name: "mattyballz",
    subscribers: "1.8M",
    backgroundImage: "/images/mattyballz-bg.jpg..jpg",
    videos: [],
    thumbnails: [],
    category: "Commentary",
    description: "Insightful commentary on music, culture, and artists with witty, engaging humor"
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