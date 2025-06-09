import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOUNDS_DIR = path.join(__dirname, '../public/sounds');

// Create sounds directory if it doesn't exist
if (!fs.existsSync(SOUNDS_DIR)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
}

// Sound files to download
const soundFiles = [
  {
    name: 'crowd-chatter.mp3',
    url: 'https://cdn.freesound.org/previews/398/398271_5121236-lq.mp3',
    description: 'Ambient crowd chatter'
  },
  {
    name: 'applause.mp3',
    url: 'https://cdn.freesound.org/previews/277/277021_5121236-lq.mp3',
    description: 'Crowd applause'
  },
  {
    name: 'bid-success.mp3',
    url: 'https://cdn.freesound.org/previews/131/131142_5121236-lq.mp3',
    description: 'Bid success sound'
  }
];

// Download function
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(SOUNDS_DIR, filename));
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(path.join(SOUNDS_DIR, filename));
      reject(err);
    });
  });
}

// Main function
async function downloadSounds() {
  console.log('Starting sound download...');
  
  for (const sound of soundFiles) {
    try {
      await downloadFile(sound.url, sound.name);
      console.log(`Successfully downloaded ${sound.description}`);
    } catch (error) {
      console.error(`Error downloading ${sound.name}:`, error);
    }
  }
  
  console.log('Sound download complete!');
  console.log('Please check the sounds in the public/sounds directory.');
}

// Run the download
downloadSounds(); 