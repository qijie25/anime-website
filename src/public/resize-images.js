const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const outputDir = path.join(__dirname, 'assets-resized');

const width = 200;
const height = 320;

// Read all files in the assets directory
fs.readdir(assetsDir, (err, files) => {
  if (err) {
    console.error('Failed to read assets folder:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(assetsDir, file);
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

    const outputPath = path.join(outputDir, file);

    sharp(filePath)
      .resize(width, height)
      .toFile(outputPath)
      .then(() => {
        console.log(`Resized: ${file}`);
      })
      .catch((err) => {
        console.error(`Failed to resize ${file}:`, err);
      });
  });
});
