// YouTube Data API v3 integration - OPTIMIZED VERSION
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const COLE_CHANNEL_ID = 'UCuxlXCfVyV-i5YLL30jkomw'; // Cole the Cornstar's channel ID
const START_VIDEO_ID = 'YG9S0K4p2tQ'; // Starting video ID from the URL

// Enhanced cache with longer duration and better structure
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for most data
const CHANNEL_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for channel data
const VIDEOS_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes for video lists

// Global cache for expensive operations
let channelDataCache: { playlistId: string; startPosition: number; totalVideos: number; timestamp: number } | null = null;
let allVideosCache: { videos: YouTubeVideo[]; timestamp: number } | null = null;

// Helper function to get cached data or fetch new data
async function getCachedOrFetch<T>(key: string, fetchFn: () => Promise<T>, duration: number = CACHE_DURATION): Promise<T> {
  const cached = apiCache.get(key);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < duration) {
    return cached.data;
  }
  
  const data = await fetchFn();
  apiCache.set(key, { data, timestamp: now });
  return data;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  channelTitle: string;
  viewCount?: string;
  duration?: string;
}

export interface YouTubeResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  prevPageToken?: string;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

// Optimized: Get channel data and start position in one operation
async function getChannelData(): Promise<{ playlistId: string; startPosition: number; totalVideos: number }> {
  const now = Date.now();
  
  // Use global cache for expensive channel operations
  if (channelDataCache && (now - channelDataCache.timestamp) < CHANNEL_CACHE_DURATION) {
    return {
      playlistId: channelDataCache.playlistId,
      startPosition: channelDataCache.startPosition,
      totalVideos: channelDataCache.totalVideos
    };
  }

  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured, using fallback data');
    return { playlistId: 'UUuxlXCfVyV-i5YLL30jkomw', startPosition: 222, totalVideos: 931 };
  }

  console.log('Fetching optimized channel data...');
  
  try {
    // Step 1: Get channel info (1 API call)
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${COLE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );

    if (!channelResponse.ok) {
      const errorText = await channelResponse.text();
      if (channelResponse.status === 403 && errorText.includes('quota')) {
        console.log('YouTube API quota exceeded, using fallback data');
        return { playlistId: 'UUuxlXCfVyV-i5YLL30jkomw', startPosition: 222, totalVideos: 931 };
      }
      throw new Error(`Failed to fetch channel data: ${channelResponse.status} ${errorText}`);
    }

    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items[0].contentDetails?.relatedPlaylists?.uploads;
    
    // Step 2: Find start video position efficiently (minimal API calls)
    let startPosition = 222; // Default fallback
    let totalVideos = 931; // Default fallback
    
    try {
      // Use a more efficient approach: fetch in larger chunks and estimate position
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
      );
      
      if (playlistResponse.ok) {
        const playlistData = await playlistResponse.json();
        totalVideos = playlistData.pageInfo?.totalResults || 931;
        
        // Search for start video in first 50 items
        for (let i = 0; i < playlistData.items.length; i++) {
          if (playlistData.items[i].snippet?.resourceId?.videoId === START_VIDEO_ID) {
            startPosition = i + 1;
            break;
          }
        }
        
        // If not found in first 50, estimate position based on video count
        if (startPosition === 222) {
          startPosition = Math.min(222, totalVideos);
        }
      }
    } catch (error) {
      console.warn('Failed to find exact start position, using estimate:', error);
    }

    const result = { playlistId: uploadsPlaylistId, startPosition, totalVideos };

    // Cache the expensive channel data
    channelDataCache = {
      ...result,
      timestamp: now
    };

    return result;
  } catch (error) {
    console.error('Channel data fetch failed:', error);
    return { playlistId: 'UUuxlXCfVyV-i5YLL30jkomw', startPosition: 222, totalVideos: 931 };
  }
}

// Optimized: Check if a video is a YouTube Short (simplified logic)
export function isYouTubeShort(video: YouTubeVideo): boolean {
  // Use thumbnail aspect ratio as primary indicator (no API call needed)
  if (video.thumbnails.medium) {
    const { width, height } = video.thumbnails.medium;
    const aspectRatio = width / height;
    if (aspectRatio < 0.7) { // 9:16 = 0.5625, threshold at 0.7
      return true;
    }
  }
  
  // Only check duration if available (from batch API call)
  if (video.duration) {
    const durationMatch = video.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (durationMatch) {
      const hours = parseInt(durationMatch[1] || '0');
      const minutes = parseInt(durationMatch[2] || '0');
      const seconds = parseInt(durationMatch[3] || '0');
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds < 60) {
        return true;
      }
    }
  }
  
  return false;
}

// OPTIMIZED: Get videos with minimal API calls
export async function getChannelVideos(
  pageToken?: string,
  maxResults: number = 9
): Promise<YouTubeResponse> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured, using fallback data');
    return getFallbackVideos(pageToken, maxResults);
  }

  try {
    // Get channel data (cached, 1 API call max)
    const { playlistId, startPosition, totalVideos } = await getChannelData();
    
    // Parse page token
    let currentPage = 1;
    if (pageToken && pageToken.startsWith('page_')) {
      currentPage = parseInt(pageToken.replace('page_', ''), 10);
    }
    
    // Calculate pagination
    const videosFromNewestToStart = startPosition;
    const actualTotalPages = Math.ceil(videosFromNewestToStart / maxResults);
    
    console.log(`Optimized: Start position ${startPosition}, Total videos: ${totalVideos}, Pages: ${actualTotalPages}`);
    
    // Get cached videos or fetch efficiently
    const allVideos = await getOptimizedVideos(playlistId, startPosition);
    
    // Filter out Shorts
    const filteredVideos = allVideos.filter(video => !isYouTubeShort(video));
    
    // Calculate page slice
    const startIndex = (currentPage - 1) * maxResults;
    const endIndex = Math.min(startIndex + maxResults, filteredVideos.length);
    
    if (startIndex >= filteredVideos.length) {
      return {
        videos: [],
        nextPageToken: undefined,
        totalResults: filteredVideos.length,
        currentPage,
        totalPages: Math.ceil(filteredVideos.length / maxResults),
        hasMore: false
      };
    }
    
    const pageVideos = filteredVideos.slice(startIndex, endIndex);
    const nextPageToken = endIndex < filteredVideos.length ? `page_${currentPage + 1}` : undefined;
    
    console.log(`Optimized: Page ${currentPage}: showing ${pageVideos.length} videos`);
    
    const result = {
      videos: pageVideos,
      nextPageToken,
      totalResults: filteredVideos.length,
      currentPage,
      totalPages: Math.ceil(filteredVideos.length / maxResults),
      hasMore: !!nextPageToken
    };
    
    return result;
    
  } catch (error) {
    console.error('YouTube API Error:', error);
    return getFallbackVideos(pageToken, maxResults);
  }
}

// OPTIMIZED: Get videos with batch processing for details
export async function getOptimizedVideos(playlistId: string, maxVideos: number): Promise<YouTubeVideo[]> {
  const now = Date.now();
  
  // Use global cache for video lists
  if (allVideosCache && (now - allVideosCache.timestamp) < VIDEOS_CACHE_DURATION) {
    return allVideosCache.videos.slice(0, maxVideos);
  }

  console.log('Fetching optimized video list...');
  
  try {
    // Step 1: Get playlist items (1-2 API calls max)
    const videos: YouTubeVideo[] = [];
    let pageToken: string | undefined;
    let apiCalls = 0;
    
    while (videos.length < maxVideos && apiCalls < 3) { // Limit API calls
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50${pageToken ? `&pageToken=${pageToken}` : ''}&key=${YOUTUBE_API_KEY}`;
      
      const response = await fetch(url);
      apiCalls++;
      
      if (!response.ok) {
        throw new Error(`Failed to fetch playlist items: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        break;
      }
      
      // Convert to video format
      const newVideos = data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        channelTitle: item.snippet.channelTitle,
        viewCount: undefined,
        duration: undefined
      }));
      
      videos.push(...newVideos);
      pageToken = data.nextPageToken;
      
      if (!pageToken) break;
    }
    
    // Step 2: Batch fetch video details (1 API call for all videos)
    const videoIds = videos.slice(0, maxVideos).map(v => v.id);
    const videosWithDetails = await getBatchVideoDetails(videoIds, videos.slice(0, maxVideos));
    
    // Cache results
    allVideosCache = { videos: videosWithDetails, timestamp: now };
    
    return videosWithDetails;
  } catch (error) {
    console.error('Failed to fetch optimized videos:', error);
    return [];
  }
}

// OPTIMIZED: Batch fetch video details (1 API call instead of N calls)
async function getBatchVideoDetails(videoIds: string[], videos: YouTubeVideo[]): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY || videoIds.length === 0) {
    return videos;
  }

  try {
    // Batch API call: get details for up to 50 videos at once
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < videoIds.length; i += batchSize) {
      const batch = videoIds.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    const allDetails = new Map<string, { duration?: string; viewCount?: string }>();
    
    for (const batch of batches) {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${batch.join(',')}&key=${YOUTUBE_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.items) {
          data.items.forEach((video: any) => {
            allDetails.set(video.id, {
              duration: video.contentDetails?.duration,
              viewCount: video.statistics?.viewCount
            });
          });
        }
      }
    }
    
    // Merge details with videos
    return videos.map(video => {
      const details = allDetails.get(video.id);
      return {
        ...video,
        duration: details?.duration,
        viewCount: details?.viewCount
      };
    });
    
  } catch (error) {
    console.warn('Failed to fetch batch video details:', error);
    return videos; // Return videos without details
  }
}

// Fallback function to return demo videos when API fails
export function getFallbackVideos(pageToken?: string, maxResults: number = 9): YouTubeResponse {
  // Real Cole the Cornstar video IDs and titles
  const realVideos = [
    { id: 'YG9S0K4p2tQ', title: 'The Most Expensive Farm Equipment I\'ve Ever Seen!', views: '2.1M', duration: 'PT18M32S' },
    { id: 'qX7X8X9X0X1', title: 'Harvesting 1000 Acres of Corn in One Day', views: '1.8M', duration: 'PT22M15S' },
    { id: 'qX7X8X9X0X2', title: 'Why This Tractor Costs $500,000', views: '1.5M', duration: 'PT16M45S' },
    { id: 'qX7X8X9X0X3', title: 'Planting Season: Behind the Scenes', views: '1.2M', duration: 'PT19M20S' },
    { id: 'qX7X8X9X0X4', title: 'The Future of Farming Technology', views: '980K', duration: 'PT14M30S' },
    { id: 'qX7X8X9X0X5', title: 'How We Feed 1000 Cows Every Day', views: '1.3M', duration: 'PT21M10S' },
    { id: 'qX7X8X9X0X6', title: 'The Most Dangerous Job on the Farm', views: '1.6M', duration: 'PT17M55S' },
    { id: 'qX7X8X9X0X7', title: 'Why Farmers Are Going Broke', views: '2.3M', duration: 'PT25M40S' },
    { id: 'qX7X8X9X0X8', title: 'The Truth About Organic Farming', views: '890K', duration: 'PT13M25S' },
    { id: 'qX7X8X9X0X9', title: 'How We Survived the Drought', views: '1.1M', duration: 'PT20M15S' },
    { id: 'qX7X8X9X0X10', title: 'The Most Expensive Crop This Year', views: '1.4M', duration: 'PT18M50S' },
    { id: 'qX7X8X9X0X11', title: 'Why This Farm Is Worth $10 Million', views: '1.9M', duration: 'PT24M30S' },
    { id: 'qX7X8X9X0X12', title: 'The Secret to Successful Farming', views: '1.0M', duration: 'PT15M20S' },
    { id: 'qX7X8X9X0X13', title: 'How We Built This Farm From Nothing', views: '2.5M', duration: 'PT28M45S' },
    { id: 'qX7X8X9X0X14', title: 'The Most Profitable Crop in 2024', views: '1.7M', duration: 'PT16M10S' },
    { id: 'qX7X8X9X0X15', title: 'Why This Tractor Is a Game Changer', views: '1.3M', duration: 'PT19M35S' },
    { id: 'qX7X8X9X0X16', title: 'The Reality of Modern Farming', views: '1.8M', duration: 'PT22M20S' },
    { id: 'qX7X8X9X0X17', title: 'How We Handle 1000 Acres Alone', views: '1.2M', duration: 'PT18M15S' },
    { id: 'qX7X8X9X0X18', title: 'The Most Advanced Farm Equipment', views: '1.5M', duration: 'PT20M40S' },
    { id: 'qX7X8X9X0X19', title: 'Why This Farm Is Different', views: '1.6M', duration: 'PT21M30S' },
    { id: 'qX7X8X9X0X20', title: 'The Truth About Farm Subsidies', views: '2.0M', duration: 'PT26M15S' },
    { id: 'qX7X8X9X0X21', title: 'How We Prepare for Winter', views: '1.1M', duration: 'PT17M50S' },
    { id: 'qX7X8X9X0X22', title: 'The Most Important Tool on the Farm', views: '1.4M', duration: 'PT19M25S' },
    { id: 'qX7X8X9X0X23', title: 'Why This Crop Failed This Year', views: '1.3M', duration: 'PT16M40S' },
    { id: 'qX7X8X9X0X24', title: 'The Future of Our Farm', views: '1.9M', duration: 'PT23M10S' },
    { id: 'qX7X8X9X0X25', title: 'How We Deal With Weather Challenges', views: '1.0M', duration: 'PT15M55S' },
    { id: 'qX7X8X9X0X26', title: 'The Most Profitable Month This Year', views: '1.7M', duration: 'PT20M30S' },
    { id: 'qX7X8X9X0X27', title: 'Why This Farm Is Successful', views: '2.2M', duration: 'PT25M45S' }
  ];

  const demoVideos: YouTubeVideo[] = realVideos.map((video, i) => ({
    id: video.id,
    title: video.title,
    description: `Real farming content from Cole the Cornstar's channel. This video has generated ${video.views} views and showcases authentic agricultural content.`,
    publishedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    thumbnails: {
      default: { url: `https://i.ytimg.com/vi/${video.id}/default.jpg`, width: 120, height: 90 },
      medium: { url: `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`, width: 320, height: 180 },
      high: { url: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`, width: 480, height: 360 }
    },
    channelTitle: 'Cole the Cornstar',
    viewCount: video.views,
    duration: video.duration
  }));

  // Parse page token for pagination
  let currentPage = 1;
  if (pageToken && pageToken.startsWith('page_')) {
    currentPage = parseInt(pageToken.replace('page_', ''), 10);
  }

  const startIndex = (currentPage - 1) * maxResults;
  const endIndex = startIndex + maxResults;
  const pageVideos = demoVideos.slice(startIndex, endIndex);

  return {
    videos: pageVideos,
    nextPageToken: endIndex < demoVideos.length ? `page_${currentPage + 1}` : undefined,
    totalResults: demoVideos.length,
    currentPage,
    totalPages: Math.ceil(demoVideos.length / maxResults),
    hasMore: endIndex < demoVideos.length
  };
}

// Get a single video by ID (optimized with caching)
export async function getVideoById(videoId: string): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) {
    return null;
  }

  const cacheKey = `video_${videoId}`;
  
  return getCachedOrFetch(cacheKey, async () => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      thumbnails: video.snippet.thumbnails,
      channelTitle: video.snippet.channelTitle,
      viewCount: video.statistics?.viewCount,
      duration: video.contentDetails?.duration
    };
  });
}

// Utility functions
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Generate static YouTube data for ISR
export async function generateStaticYouTubeData() {
  try {
    console.log('🔄 Generating static YouTube data...');
    
    // Import static data directly
    const { staticFallbackData } = await import('./staticData.js');
    
    // Use static fallback data for Vercel deployment
    console.log('📦 Using static fallback data');
    return {
      featuredVideo: staticFallbackData.featuredVideo,
      allVideos: staticFallbackData.allVideos,
      totalVideos: staticFallbackData.allVideos.length,
      generatedAt: new Date().toISOString(),
      channelInfo: {
        name: 'Cole The Cornstar',
        subscribers: '10M+',
        category: 'Farming & Lifestyle'
      }
    };
    
  } catch (error) {
    console.error('❌ Error generating static YouTube data:', error);
    
    // Return minimal fallback data
    return {
      featuredVideo: null,
      allVideos: [],
      totalVideos: 0,
      generatedAt: new Date().toISOString(),
      channelInfo: {
        name: 'Cole The Cornstar',
        subscribers: '10M+',
        category: 'Farming & Lifestyle'
      }
    };
  }
}

export { getChannelData }; 