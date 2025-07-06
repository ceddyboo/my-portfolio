// Static YouTube data generation for Vercel deployment
import { YouTubeVideo } from './youtubeApi';

// Import static data directly
import { staticFallbackData } from './staticData.js';

// Static generation function for build time
export async function generateStaticYouTubeData(): Promise<{
  featuredVideo: YouTubeVideo | null;
  allVideos: YouTubeVideo[];
  channelData: { playlistId: string; startPosition: number; totalVideos: number };
}> {
  console.log('🔄 Using static YouTube data for build time...');
  
  // Return static data directly
  return {
    featuredVideo: staticFallbackData.featuredVideo,
    allVideos: staticFallbackData.allVideos,
    channelData: staticFallbackData.channelData
  };
}

// Function to get static data for client pages
export async function getStaticYouTubeData(): Promise<{
  featuredVideo: YouTubeVideo | null;
  videos: YouTubeVideo[];
  hasMore: boolean;
  totalResults: number;
}> {
  try {
    console.log('📦 Using static YouTube data');
    return {
      featuredVideo: staticFallbackData.featuredVideo,
      videos: staticFallbackData.allVideos.slice(0, 10), // First 10 videos
      hasMore: staticFallbackData.allVideos.length > 10,
      totalResults: staticFallbackData.allVideos.length
    };
  } catch (error) {
    console.error('❌ Failed to get static YouTube data:', error);
    
    // Return fallback data
    const { getFallbackVideos } = await import('./youtubeApi');
    const fallbackVideos = getFallbackVideos(undefined, 10);
    return {
      featuredVideo: fallbackVideos.videos[0] || null,
      videos: fallbackVideos.videos,
      hasMore: fallbackVideos.hasMore,
      totalResults: fallbackVideos.totalResults
    };
  }
} 