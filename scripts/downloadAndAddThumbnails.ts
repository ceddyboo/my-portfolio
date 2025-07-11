import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

// YouTube URLs to process
const youtubeUrls = [
  "https://www.youtube.com/watch?v=43qyQm5omak",
  "https://www.youtube.com/watch?v=2Qf0YZJn0a0",
  "https://www.youtube.com/watch?v=MR3uS_Lnzpo",
  "https://www.youtube.com/watch?v=Uz_ivE4JTRA",
  "https://www.youtube.com/watch?v=-DDgIm5zJY8",
  "https://www.youtube.com/watch?v=xiMwI0jO6zc",
  "https://www.youtube.com/watch?v=WnasMKH4low",
  "https://www.youtube.com/watch?v=6POTkCM1EkE",
  "https://www.youtube.com/watch?v=gh6CPUvUoIY",
  "https://www.youtube.com/watch?v=xKqfO2_1t2U",
  "https://www.youtube.com/watch?v=VwUmeo6Ezjg",
  "https://www.youtube.com/watch?v=s6kjoPWxIXw&pp=0gcJCb4JAYcqIYzv",
  "https://www.youtube.com/watch?v=OhBALYa6JUk",
  "https://www.youtube.com/watch?v=xZ2anlcbUsE",
  "https://www.youtube.com/watch?v=ONiRbTRt2_A",
  "https://www.youtube.com/watch?v=Ih4wtQoWpWs",
  "https://www.youtube.com/watch?v=_nyMVcRSsUk",
  "https://www.youtube.com/watch?v=7gXzQAVRw6w",
  "https://www.youtube.com/watch?v=L4tVdPSgIhQ",
  "https://www.youtube.com/watch?v=Dr8K8RXtYZo",
  "https://www.youtube.com/watch?v=ysh6AhA5Uwo",
  "https://www.youtube.com/watch?v=qam8IMobnow&pp=0gcJCb4JAYcqIYzv",
  "https://www.youtube.com/watch?v=tIyB86sMDLo",
  "https://www.youtube.com/watch?v=4QLyFwBKNAU&pp=0gcJCb4JAYcqIYzv",
  "https://www.youtube.com/watch?v=VrYuTY7Duzs",
  "https://www.youtube.com/watch?v=-gNd8o3Z45k",
  "https://www.youtube.com/watch?v=Vh6sdmxS6UQ",
  "https://www.youtube.com/watch?v=tpcWKIaHM4Y",
  "https://www.youtube.com/watch?v=usI6LgQm3Zc",
  "https://www.youtube.com/watch?v=T8yNoGi0k6k",
  "https://www.youtube.com/watch?v=EtXTgDOVCUU",
  "https://www.youtube.com/watch?v=cH4x2MlpLlI",
  "https://www.youtube.com/watch?v=RBl3nB50TTY",
  "https://www.youtube.com/watch?v=_Ri1TBplMHM",
  "https://www.youtube.com/watch?v=OWAw8hQFcQo",
  "https://www.youtube.com/watch?v=Cpc2ze-XsJ0",
  "https://www.youtube.com/watch?v=r5gcZGupczQ",
  "https://www.youtube.com/watch?v=lzq43tvWbcU",
  "https://www.youtube.com/watch?v=1bVxVwm79ag",
  "https://www.youtube.com/watch?v=GQxPdt7tOwM",
  "https://www.youtube.com/watch?v=sAdd9ZYBHb8",
  "https://www.youtube.com/watch?v=oXAEwK-fNno",
  "https://www.youtube.com/watch?v=yNU5zaSjDOo",
  "https://www.youtube.com/watch?v=2EHnKqRhgJ0",
  "https://www.youtube.com/watch?v=aOEukzVR4yg",
  "https://www.youtube.com/watch?v=YH662IdVwBs",
  "https://www.youtube.com/watch?v=hA148jNTNWI",
  "https://www.youtube.com/watch?v=L-nGD4EVioI",
  "https://www.youtube.com/watch?v=k84xrT0VbvQ",
  "https://www.youtube.com/watch?v=yfDZvtBplDE",
  "https://www.youtube.com/watch?v=dkTROV4ZTEs",
  "https://www.youtube.com/watch?v=BEJwRRwdpMg",
  "https://www.youtube.com/watch?v=yuerVf0gZI4",
  "https://www.youtube.com/watch?v=dM8GihJX-2w",
  "https://www.youtube.com/watch?v=mCSpgqsyvPk",
  "https://www.youtube.com/watch?v=y0CBGR2MnoM",
  "https://www.youtube.com/watch?v=6Kez6QWI-Fw",
  "https://www.youtube.com/watch?v=XCPHObgrJXM",
  "https://www.youtube.com/watch?v=t51g91_ruds",
  "https://www.youtube.com/watch?v=B-sol4v6Oh8",
  "https://www.youtube.com/watch?v=xVBkiufQeGs&pp=0gcJCb4JAYcqIYzv",
  "https://www.youtube.com/watch?v=NF_eQc9nQc0&pp=0gcJCb4JAYcqIYzv",
  "https://www.youtube.com/watch?v=qZ_oPnPsSis",
  "https://www.youtube.com/watch?v=hBkISCcWhOU",
  "https://www.youtube.com/watch?v=UijjUoD19hE&pp=0gcJCb4JAYcqIYzv",
  "https://www.youtube.com/watch?v=RmbORGBJQu4",
  "https://www.youtube.com/watch?v=f2mS2481K3Q",
  "https://www.youtube.com/watch?v=iVLU8_1eWmk",
  "https://www.youtube.com/watch?v=m3MOOXXgi_A",
  "https://www.youtube.com/watch?v=dxMO8PRsIPs",
  "https://www.youtube.com/watch?v=RWflcupxeg0",
  "https://www.youtube.com/watch?v=kA-2T9_snjw&pp=0gcJCb4JAYcqIYzv",
  "https://www.youtube.com/watch?v=G34XtGAFkVI",
  "https://www.youtube.com/watch?v=mjR57PgVhTc",
  "https://www.youtube.com/watch?v=EC3NA6rGupc",
  "https://www.youtube.com/watch?v=RAQmnUpgNPo",
  "https://www.youtube.com/watch?v=8V3p6j5rRVc",
  "https://www.youtube.com/watch?v=vYrUZGZ1E0c",
  "https://www.youtube.com/watch?v=AOIFj-ZuLNA",
  "https://www.youtube.com/watch?v=E87o0parq7A",
  "https://www.youtube.com/watch?v=2geMWL4_WZo",
  "https://www.youtube.com/watch?v=tp-Y3xI78RI",
  "https://www.youtube.com/watch?v=5j1ip8q_fqc",
  "https://www.youtube.com/watch?v=ENVQ_CM2bjA",
  "https://www.youtube.com/watch?v=0mEIkdShSbU",
  "https://www.youtube.com/watch?v=7MsrVBdNYck",
  "https://www.youtube.com/watch?v=sjVeB74pvMY",
  "https://www.youtube.com/watch?v=tzFxaGDC6Kk",
  "https://www.youtube.com/watch?v=HBnMNa8f-ZI",
  "https://www.youtube.com/watch?v=_ZvVjxfPTLs",
  "https://www.youtube.com/watch?v=2XnHCoo_vXY",
  "https://www.youtube.com/watch?v=i2CLWdN702w",
  "https://www.youtube.com/watch?v=iNwwdF6qLZA",
  "https://www.youtube.com/watch?v=q-iQWjgOWmA&pp=0gcJCb4JAYcqIYzv",
  "https://www.youtube.com/watch?v=HF6V3wcX9Kk",
  "https://www.youtube.com/watch?v=SCcQ8wHSLgs",
  "https://www.youtube.com/watch?v=Y7OcvGwzrmQ",
  "https://www.youtube.com/watch?v=5dOmaJtadJs",
  "https://www.youtube.com/watch?v=2e569zwIVxs",
  "https://www.youtube.com/watch?v=fmw1RQNufTs",
  "https://www.youtube.com/watch?v=3TiRh_Dm9_0"
];

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Download image from URL
function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', reject);
  });
}

// Process and compress image
async function processImage(imageBuffer: Buffer, outputPath: string): Promise<void> {
  try {
    await sharp(imageBuffer)
      .resize(1280, null, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(outputPath);
  } catch (error) {
    console.error(`Error processing image: ${error}`);
    throw error;
  }
}

// Main function
async function downloadAndProcessThumbnails() {
  const outputDir = path.join(process.cwd(), 'public', 'lankybox', 'lankyboxworld', 'thumbnails');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Starting download and processing of ${youtubeUrls.length} thumbnails...`);
  console.log(`Output directory: ${outputDir}`);

  let successCount = 0;
  let errorCount = 0;

  for (const url of youtubeUrls) {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      console.error(`❌ Could not extract video ID from URL: ${url}`);
      errorCount++;
      continue;
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const outputPath = path.join(outputDir, `${videoId}.webp`);

    try {
      console.log(`📥 Downloading thumbnail for video ID: ${videoId}`);
      const imageBuffer = await downloadImage(thumbnailUrl);
      
      console.log(`🔄 Processing and compressing: ${videoId}.webp`);
      await processImage(imageBuffer, outputPath);
      
      console.log(`✅ Successfully processed: ${videoId}.webp`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to process ${videoId}: ${error}`);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully processed: ${successCount} thumbnails`);
  console.log(`❌ Failed to process: ${errorCount} thumbnails`);
  console.log(`📁 Thumbnails saved to: ${outputDir}`);
}

// Run the script
if (require.main === module) {
  downloadAndProcessThumbnails().catch(console.error);
}

export { downloadAndProcessThumbnails }; 