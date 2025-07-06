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
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

  // Build thumbnail URL from video ID
  useEffect(() => {
    if (!video) return;
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
  }, [video]);

  if (!video) return null;

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">
        Latest Video
      </h2>
      <div className="max-w-2xl mx-auto">
        <div 
          className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-2xl bg-black/20 border border-white/10 transition-transform duration-300 hover:scale-[1.02]"
          onClick={handleVideoClick}
        >
          {isPlaying ? (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                className="w-full h-full rounded-2xl"
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
                <div className="absolute inset-0 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
              
              {thumbnailUrl && (
                <Image
                  src={thumbnailUrl}
                  alt={video.title}
                  fill
                  unoptimized
                  className={`object-cover rounded-2xl transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  onLoad={() => {
                    console.log('Featured video thumbnail loaded successfully:', thumbnailUrl);
                    setImageLoaded(true);
                  }}
                  onError={() => {
                    console.error('Featured video thumbnail failed to load:', thumbnailUrl);
                    setImageLoaded(true);
                    // Try fallback thumbnail
                    setThumbnailUrl("https://placehold.co/480x360/1f2937/ffffff.png?text=Video+Thumbnail");
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/30 rounded-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-all duration-300">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-2xl">
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {video.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>{formatDate(video.publishedAt)}</span>
              {video.viewCount && (
                <span>{formatViewCount(video.viewCount)} views</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Lazy Loaded Video Grid Component
const VideoGrid = React.memo(({ 
  videos, 
  hasMore, 
  onLoadMore, 
  isLoading,
  excludeVideoId,
  playingVideos,
  setPlayingVideos,
  loadedImages,
  setLoadedImages
}: {
  videos: YouTubeVideo[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  excludeVideoId?: string;
  playingVideos: Set<string>;
  setPlayingVideos: React.Dispatch<React.SetStateAction<Set<string>>>;
  loadedImages: Set<string>;
  setLoadedImages: React.Dispatch<React.SetStateAction<Set<string>>>;
}) => {

  const filteredVideos = useMemo(() => 
    videos.filter(video => video.id !== excludeVideoId), 
    [videos, excludeVideoId]
  );

  const handleVideoClick = useCallback((videoId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  }, []);

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
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            isPlaying={playingVideos.has(video.id)}
            onVideoClick={() => handleVideoClick(video.id)}
            loadedImages={loadedImages}
            setLoadedImages={setLoadedImages}
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
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <span>{formatDate(video.publishedAt)}</span>
            {video.viewCount && (
              <span>{formatViewCount(video.viewCount)} views</span>
            )}
          </div>
        </div>
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

export default function PrestonPlayzWorkPage() {
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<YouTubeVideo | null>(null);
  const [youtubeLoading, setYoutubeLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Client data
  const clientData = {
    name: "PrestonPlayz",
    subscribers: "850K",
    backgroundImage: "/images/default-background.jpg",
    videos: [],
    thumbnails: [],
    category: "Gaming",
    description: "Gaming content creator with millions of views and engaged subscribers."
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setYoutubeLoading(true);
      try {
        const [featuredResponse, gridResponse] = await Promise.all([
          fetch('/api/youtube?pageToken=&maxResults=1'),
          fetch('/api/youtube?pageToken=&maxResults=10')
        ]);

        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          if (featuredData.videos && featuredData.videos.length > 0) {
            setFeaturedVideo(featuredData.videos[0]);
          }
        }

        if (gridResponse.ok) {
          const data = await gridResponse.json();
          const filteredVideos = data.videos || [];
          setYoutubeVideos(filteredVideos);
          setHasMore(data.hasMore || false);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setYoutubeLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const loadMoreVideos = useCallback(async () => {
    if (youtubeLoading || !hasMore) return;

    setYoutubeLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(`/api/youtube?pageToken=page_${nextPage}&maxResults=10`);
      
      if (response.ok) {
        const data = await response.json();
        const filteredNewVideos = data.videos || [];
        
        setTimeout(() => {
          setYoutubeVideos(prev => [...prev, ...filteredNewVideos]);
          setHasMore(data.hasMore || false);
          setCurrentPage(nextPage);
          setYoutubeLoading(false);
        }, 100);
      } else {
        setYoutubeLoading(false);
      }
    } catch (error) {
      console.error('Error loading more videos:', error);
      setYoutubeLoading(false);
    }
  }, [youtubeLoading, hasMore, currentPage]);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16 md:py-20">

        {/* Lazy Loaded Hero Section */}
        <LazyHeroSection clientData={clientData} />

        {/* Lazy Loaded Featured Video */}
        {featuredVideo && <FeaturedVideo video={featuredVideo} />}

        {/* Lazy Loaded Video Grid */}
        {youtubeVideos.length > 0 && (
          <VideoGrid
            videos={youtubeVideos}
            hasMore={hasMore}
            onLoadMore={loadMoreVideos}
            isLoading={youtubeLoading}
            excludeVideoId={featuredVideo?.id}
            playingVideos={playingVideos}
            setPlayingVideos={setPlayingVideos}
            loadedImages={loadedImages}
            setLoadedImages={setLoadedImages}
          />
        )}

        {/* Show loading state for YouTube data */}
        {youtubeLoading && youtubeVideos.length === 0 && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white">Loading videos...</p>
          </div>
        )}

        {/* Show message if no videos found */}
        {!youtubeLoading && youtubeVideos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white">No videos found. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
} 