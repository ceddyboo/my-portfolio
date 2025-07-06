// Static data exports for Vercel deployment
// This file provides fallback data without using Node.js fs operations

import { YouTubeVideo } from './youtubeApi';

// Static fallback data for when API calls fail
export const staticFallbackData = {
  featuredVideo: {
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
  } as YouTubeVideo,
  allVideos: [
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
    }
  ] as YouTubeVideo[],
  channelData: {
    playlistId: 'UUuxlXCfVyV-i5YLL30jkomw',
    startPosition: 222,
    totalVideos: 931
  }
};

// Function to get static data without fs operations
export function getStaticYouTubeData() {
  return {
    featuredVideo: staticFallbackData.featuredVideo,
    videos: staticFallbackData.allVideos.slice(0, 10),
    hasMore: staticFallbackData.allVideos.length > 10,
    totalResults: staticFallbackData.allVideos.length
  };
}

// Function to get static data for specific clients
export function getStaticClientData(clientSlug: string) {
  const clientData = {
    mattyballz: {
      name: "mattyballz",
      subscribers: "1.8M",
      backgroundImage: "/images/mattyballz-bg.jpg..jpg",
      category: "Commentary",
      description: "Insightful commentary on music, culture, and artists with witty, engaging humor"
    },
    cole: {
      name: "Cole The Cornstar",
      subscribers: "2.1M",
      backgroundImage: "/images/cole-background.jpg",
      category: "Agriculture",
      description: "Farming content and agricultural insights from Cole The Cornstar"
    },
    sambucha: {
      name: "Sambucha",
      subscribers: "1.2M",
      backgroundImage: "/images/sambucha-bg.jpg",
      category: "Commentary",
      description: "Entertaining commentary and reaction content"
    },
    ramoakh: {
      name: "Ramo Akh",
      subscribers: "950K",
      backgroundImage: "/images/default-background.jpg",
      category: "Gaming",
      description: "Gaming content and live streams"
    }
  };

  return clientData[clientSlug as keyof typeof clientData] || clientData.cole;
} 