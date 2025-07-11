import fs from 'fs';
import path from 'path';

// Generate thumbnail data from downloaded files
function generateThumbnailData() {
  const thumbnailsDir = path.join(process.cwd(), 'public', 'lankybox', 'lankyboxworld', 'thumbnails');
  
  if (!fs.existsSync(thumbnailsDir)) {
    console.error('Thumbnails directory does not exist');
    return;
  }

  const files = fs.readdirSync(thumbnailsDir);
  const webpFiles = files.filter(file => file.endsWith('.webp') && !file.startsWith('._'));

  console.log('Found thumbnail files:');
  webpFiles.forEach(file => {
    console.log(`  - ${file}`);
  });

  const thumbnailData = webpFiles.map(file => {
    const videoId = file.replace('.webp', '');
    return {
      src: `/lankybox/lankyboxworld/thumbnails/${file}`,
      alt: `LankyBox Thumbnail - ${videoId}`,
      videoId: videoId
    };
  });

  console.log('\nThumbnail data array:');
  console.log('const thumbnailImages = [');
  thumbnailData.forEach((item, index) => {
    const comma = index < thumbnailData.length - 1 ? ',' : '';
    console.log(`  { src: "${item.src}", alt: "${item.alt}" }${comma}`);
  });
  console.log('];');

  console.log(`\nTotal thumbnails: ${thumbnailData.length}`);
}

generateThumbnailData(); 