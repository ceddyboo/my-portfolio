"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Helper function to extract video ID from YouTube embed URL
const extractVideoId = (url: string) => {
  const match = url.match(/embed\/([^?]+)/);
  return match ? match[1] : '';
};

// Helper function to format view count
const formatViewCount = (count: string) => {
  return count;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Video interface
interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  viewCount: string;
  thumbnailUrl: string;
}

// Featured Video Component
const FeaturedVideo = ({ video }: { video: Video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

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
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/30 rounded-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-all duration-300">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            </div>
          )}
          

        </div>
      </div>
    </motion.div>
  );
};

// Video Grid Component
const VideoGrid = ({ videos }: { videos: Video[] }) => {
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());

  const handleVideoClick = (videoId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-12"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">
        More Videos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-xl bg-black/20 border border-white/10 shadow-xl"
          >
            <div 
              className="relative aspect-video cursor-pointer"
              onClick={() => handleVideoClick(video.id)}
            >
              {playingVideos.has(video.id) ? (
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
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                  />
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
        ))}
      </div>
    </motion.div>
  );
};

// Hero Section Component
const HeroSection = ({ clientData }: { clientData: any }) => {
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="inline-flex items-center bg-gradient-to-r from-orange-600/30 via-orange-700/25 to-orange-800/30 border border-orange-400/40 rounded-full px-8 py-4 mb-8 backdrop-blur-xl shadow-2xl shadow-orange-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-orange-800/10 rounded-full" />
        <span className="relative text-orange-100 text-sm font-bold tracking-wide">
          {clientData.category}
        </span>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4"
      >
        {clientData.name}
      </motion.h1>
      
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
};

export default function PrestonPlayzWorkPage() {
  // Client data
  const clientData = {
    name: "PrestonPlayz",
    subscribers: "31.1M",
    backgroundImage: "/images/prestonplayz.jpg",
    category: "Gaming",
    description: "Gaming content creator with millions of views and engaged subscribers."
  };

  // Static video data
  const featuredVideo: Video = {
    id: "sj-DQ_RTvTY",
    title: "PrestonPlayz - Latest Gaming Content",
    description: "Latest gaming content from PrestonPlayz",
    publishedAt: "2024-01-20T00:00:00Z",
    viewCount: "2.5M",
    thumbnailUrl: "https://i.ytimg.com/vi/sj-DQ_RTvTY/maxresdefault.jpg"
  };

  const gridVideos: Video[] = [
    {
      id: "JvytAIr7d1E",
      title: "PrestonPlayz - Gaming Challenge",
      description: "Gaming content from PrestonPlayz",
      publishedAt: "2024-01-15T00:00:00Z",
      viewCount: "1.8M",
      thumbnailUrl: "https://i.ytimg.com/vi/JvytAIr7d1E/maxresdefault.jpg"
    },
    {
      id: "ljls6v5Co3g",
      title: "PrestonPlayz - Gaming Stream",
      description: "Gaming content from PrestonPlayz",
      publishedAt: "2024-01-10T00:00:00Z",
      viewCount: "2.1M",
      thumbnailUrl: "https://i.ytimg.com/vi/ljls6v5Co3g/maxresdefault.jpg"
    },
    {
      id: "5Sb68u2j2Hw",
      title: "PrestonPlayz - Best Moments",
      description: "Gaming content from PrestonPlayz",
      publishedAt: "2024-01-05T00:00:00Z",
      viewCount: "1.9M",
      thumbnailUrl: "https://i.ytimg.com/vi/5Sb68u2j2Hw/maxresdefault.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 pt-28 pb-16 md:pt-40 md:pb-20">
        {/* Hero Section */}
        <HeroSection clientData={clientData} />

        {/* Featured Video */}
        <FeaturedVideo video={featuredVideo} />

        {/* Video Grid */}
        <VideoGrid videos={gridVideos} />
      </div>
    </div>
  );
} 