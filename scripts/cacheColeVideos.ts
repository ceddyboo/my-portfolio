import fs from "fs";
import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UCX6OQ3DkcsbYNE6H8uQQuVA"; // Cole's channel ID

async function fetchColeVideos() {
  let videos: any[] = [];
  let pageToken = "";
  let done = false;

  while (!done) {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: API_KEY,
        channelId: CHANNEL_ID,
        part: "snippet",
        order: "date",
        maxResults: 50,
        pageToken
      }
    });

    const newVideos = res.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnails: item.snippet.thumbnails,
      publishedAt: item.snippet.publishedAt
    }));

    videos.push(...newVideos);

    if (!res.data.nextPageToken || videos.length >= 100) {
      done = true;
    } else {
      pageToken = res.data.nextPageToken;
    }
  }

  return videos;
}

(async () => {
  try {
    const videos = await fetchColeVideos();
    fs.writeFileSync("./public/cole-videos-cache.json", JSON.stringify(videos, null, 2));
    console.log(`✅ Cached ${videos.length} videos to public/cole-videos-cache.json`);
  } catch (error) {
    console.error("❌ Error caching videos:", error);
  }
})(); 