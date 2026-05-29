const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = './public/images';
const maxWidth = 1920;
const quality = 80;

async function optimizeImages() {
  const files = fs.readdirSync(imagesDir).filter(f => 
    /\.(jpg|jpeg|png)$/i.test(f) && !f.includes(':Zone')
  );
  
  console.log(`Found ${files.length} images to optimize`);
  
  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const outputPath = path.join(imagesDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    try {
      const meta = await sharp(inputPath).metadata();
      console.log(`Processing ${file}: ${meta.width}x${meta.height}`);
      
      let pipeline = sharp(inputPath);
      
      if (meta.width > maxWidth) {
        pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
      }
      
      await pipeline
        .webp({ quality })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      console.log(`  → ${file.replace(/\.(jpg|jpeg|png)$/i, '.webp')} (${(stats.size/1024/1024).toFixed(2)}MB)`);
      
    } catch (err) {
      console.error(`Error ${file}:`, err.message);
    }
  }
  
  console.log('Done!');
}

optimizeImages();