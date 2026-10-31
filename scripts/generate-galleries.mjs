import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const GALLERIES_DIR = path.join(ROOT_DIR, 'public', 'galleries');
const MANIFEST_PATH = path.join(ROOT_DIR, 'public', 'galleries-manifest.json');

const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'
]);

function toTitleCase(str) {
  return str
    .replace(/^(\d+[\s_-]*)/, '') // Strip order prefixes like "01-", "1_"
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateGalleriesManifest() {
  if (!fs.existsSync(GALLERIES_DIR)) {
    fs.mkdirSync(GALLERIES_DIR, { recursive: true });
  }

  const entries = fs.readdirSync(GALLERIES_DIR, { withFileTypes: true });
  const folders = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const galleries = [];

  for (const folderName of folders) {
    const folderPath = path.join(GALLERIES_DIR, folderName);
    const files = fs.readdirSync(folderPath);

    let customInfo = {};
    const infoJsonPath = path.join(folderPath, 'info.json');
    if (fs.existsSync(infoJsonPath)) {
      try {
        customInfo = JSON.parse(fs.readFileSync(infoJsonPath, 'utf8'));
      } catch (err) {
        console.warn(`[galleries] Warning: Failed to parse ${infoJsonPath}`, err.message);
      }
    }

    const descTxtPath = path.join(folderPath, 'description.txt');
    const infoTxtPath = path.join(folderPath, 'info.txt');
    if (fs.existsSync(descTxtPath)) {
      customInfo.description = fs.readFileSync(descTxtPath, 'utf8').trim();
    } else if (fs.existsSync(infoTxtPath)) {
      customInfo.description = fs.readFileSync(infoTxtPath, 'utf8').trim();
    }

    const titleTxtPath = path.join(folderPath, 'title.txt');
    if (fs.existsSync(titleTxtPath)) {
      customInfo.title = fs.readFileSync(titleTxtPath, 'utf8').trim();
    }

    const imageFiles = files
      .filter(file => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    if (imageFiles.length === 0) {
      continue;
    }

    // Determine cover image: look for "cover.*" first, else use the first image
    const explicitCover = imageFiles.find(file => {
      const base = path.basename(file, path.extname(file)).toLowerCase();
      return base === 'cover' || base.startsWith('cover-') || base.startsWith('cover_');
    });
    const coverFile = explicitCover || imageFiles[0];

    const photos = imageFiles.map((file, idx) => {
      const ext = path.extname(file);
      const rawTitle = path.basename(file, ext);
      const photoTitle = toTitleCase(rawTitle);

      return {
        id: `${toSlug(folderName)}-${idx + 1}`,
        filename: file,
        path: `/galleries/${encodeURIComponent(folderName)}/${encodeURIComponent(file)}`,
        title: photoTitle,
        isCover: file === coverFile
      };
    });

    const defaultTitle = toTitleCase(folderName);
    const slug = toSlug(folderName);

    galleries.push({
      id: slug,
      folderName,
      title: customInfo.title || defaultTitle,
      description: customInfo.description || `Exclusive engineering archive from the ${defaultTitle} division.`,
      coverImage: `/galleries/${encodeURIComponent(folderName)}/${encodeURIComponent(coverFile)}`,
      count: photos.length,
      photos
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: 'local-filesystem',
    totalGalleries: galleries.length,
    totalPhotos: galleries.reduce((acc, g) => acc + g.count, 0),
    galleries
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(output, null, 2), 'utf8');
  console.log(`[galleries] Generated ${MANIFEST_PATH} with ${galleries.length} galleries, ${output.totalPhotos} photos.`);
  return output;
}

// If executed directly from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateGalleriesManifest();
}
