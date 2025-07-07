const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_KEY = process.env.YOUTUBE_API_KEY;
// Cole the Cornstar's channel ID
const CHANNEL_ID = "UCuxlXCfVyV-i5YLL30jkomw";
const TARGET_VIDEO_ID = "YG9S0K4p2tQ";

async function fetchVideoDetails(videoId) {
  try {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        key: API_KEY,
        part: "snippet",
        id: videoId
      }
    });

    if (res.data.items && res.data.items.length > 0) {
      const item = res.data.items[0];
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching video details:", error.message);
    return null;
  }
}

async function fetchColeVideos(pageToken = "", videos = []) {
  console.log("Fetching Cole the Cornstar videos...");

  const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      key: API_KEY,
      channelId: CHANNEL_ID,
      part: "snippet",
      order: "date",
      type: "video",  // only videos
      maxResults: 50,
      pageToken
    }
  });

  console.log(`Found ${res.data.items.length} videos in this page`);
  
  const newVideos = res.data.items.map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    thumbnails: item.snippet.thumbnails
  }));

  videos.push(...newVideos);

  // Check if we found the target video
  const targetVideo = newVideos.find(v => v.id === TARGET_VIDEO_ID);
  if (targetVideo) {
    console.log(`✅ Found target video: "${targetVideo.title}"`);
  }

  // Continue fetching until we find the target video or reach a reasonable limit
  if (res.data.nextPageToken && videos.length < 500) {
    return fetchColeVideos(res.data.nextPageToken, videos);
  }

  return videos;
}

(async () => {
  try {
    const allVideos = await fetchColeVideos();
    console.log(`Total videos fetched: ${allVideos.length}`);
    
    const coleVideos = allVideos.filter(v => v.channelTitle === "Cole The Cornstar");
    console.log(`Cole videos found: ${coleVideos.length}`);

    // Check if target video is in the final list
    let targetVideo = coleVideos.find(v => v.id === TARGET_VIDEO_ID);
    if (targetVideo) {
      console.log(`✅ Target video included: "${targetVideo.title}"`);
    } else {
      console.log(`❌ Target video not found in cache, fetching directly...`);
      targetVideo = await fetchVideoDetails(TARGET_VIDEO_ID);
      if (targetVideo && targetVideo.channelTitle === "Cole The Cornstar") {
        console.log(`✅ Fetched target video: "${targetVideo.title}"`);
        coleVideos.unshift(targetVideo); // Add to beginning since it's likely newer
      } else {
        console.log(`❌ Could not fetch target video`);
      }
    }

    const outputPath = path.join(process.cwd(), "public", "cole-videos-cache.json");
    fs.writeFileSync(outputPath, JSON.stringify(coleVideos, null, 2));
    console.log(`✅ Cached ${coleVideos.length} Cole videos to ${outputPath}`);
  } catch (err) {
    console.error("❌ Error caching videos:", err);
  }
})(); 