export interface GalleryPhoto {
  id: string;
  filename: string;
  path: string;
  title: string;
  isCover: boolean;
}

export interface Gallery {
  id: string;
  folderName: string;
  title: string;
  description: string;
  coverImage: string;
  count: number;
  photos: GalleryPhoto[];
  source?: 'local' | 'github';
}

export interface GalleryManifest {
  generatedAt: string;
  source: string;
  totalGalleries: number;
  totalPhotos: number;
  galleries: Gallery[];
}

const GITHUB_OWNER = 'dhanushgoud81';
const GITHUB_REPO = 'Sunithaenterprises-v3';
const GITHUB_BRANCH = 'main';
const CACHE_KEY = 'sunitha_galleries_cache_v1';
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache to avoid GitHub rate limits

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.slice(lastDot).toLowerCase();
}

function toTitleCase(str: string): string {
  return str
    .replace(/^(\d+[\s_-]*)/, '') // Strip order prefixes like "01-", "1_"
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetch local build-time manifest (/galleries-manifest.json).
 * This delivers instantaneous load time with zero network latency.
 */
export async function fetchLocalManifest(): Promise<GalleryManifest | null> {
  try {
    const res = await fetch('/galleries-manifest.json', { cache: 'no-cache' });
    if (!res.ok) return null;
    const data: GalleryManifest = await res.json();
    data.galleries = (data.galleries || []).map((g) => ({ ...g, source: 'local' }));
    return data;
  } catch (err) {
    console.warn('[galleryService] Could not load local manifest:', err);
    return null;
  }
}

interface GitHubContentItem {
  name: string;
  path: string;
  type: 'dir' | 'file';
  download_url: string | null;
}

/**
 * Directly queries the GitHub REST API to find all folders in public/galleries
 * and all image files inside each folder.
 */
export async function fetchGalleriesFromGitHub(): Promise<Gallery[] | null> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    // 1. Fetch directories inside public/galleries
    const dirUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/galleries?ref=${GITHUB_BRANCH}`;
    const res = await fetch(dirUrl, { headers });

    if (!res.ok) {
      if (res.status === 404) {
        // Maybe galleries are under 'master' branch or yet to be pushed
        const fallbackUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/galleries?ref=master`;
        const fbRes = await fetch(fallbackUrl, { headers });
        if (!fbRes.ok) return null;
        return parseGitHubGalleries(await fbRes.json(), 'master');
      }
      return null;
    }

    const items: GitHubContentItem[] = await res.json();
    return parseGitHubGalleries(items, GITHUB_BRANCH);
  } catch (err) {
    console.warn('[galleryService] GitHub API fetch failed or offline:', err);
    return null;
  }
}

async function parseGitHubGalleries(items: GitHubContentItem[], branch: string): Promise<Gallery[]> {
  if (!Array.isArray(items)) return [];

  const dirItems = items.filter((item) => item.type === 'dir');
  const galleries: Gallery[] = [];

  for (const dir of dirItems) {
    try {
      const folderUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/galleries/${encodeURIComponent(dir.name)}?ref=${branch}`;
      const folderRes = await fetch(folderUrl, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (!folderRes.ok) continue;
      const fileList: GitHubContentItem[] = await folderRes.json();
      if (!Array.isArray(fileList)) continue;

      const imageFiles = fileList.filter((file) => {
        if (file.type !== 'file') return false;
        const ext = getFileExtension(file.name);
        return IMAGE_EXTENSIONS.has(ext);
      });

      if (imageFiles.length === 0) continue;

      // Sort files naturally
      imageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

      // Pick cover
      const explicitCover = imageFiles.find((f) => {
        const base = f.name.substring(0, f.name.lastIndexOf('.')).toLowerCase();
        return base === 'cover' || base.startsWith('cover-') || base.startsWith('cover_');
      });
      const coverItem = explicitCover || imageFiles[0];

      const folderSlug = toSlug(dir.name);
      const defaultTitle = toTitleCase(dir.name);

      let customTitle = defaultTitle;
      let customDescription = `Exclusive visual project archive from the ${defaultTitle} division.`;

      const descFile = fileList.find((f) => f.name.toLowerCase() === 'description.txt' || f.name.toLowerCase() === 'info.txt');
      if (descFile && descFile.download_url) {
        try {
          const descRes = await fetch(descFile.download_url);
          if (descRes.ok) customDescription = (await descRes.text()).trim();
        } catch {
          // ignore
        }
      }

      const infoFile = fileList.find((f) => f.name.toLowerCase() === 'info.json');
      if (infoFile && infoFile.download_url) {
        try {
          const infoRes = await fetch(infoFile.download_url);
          if (infoRes.ok) {
            const data = await infoRes.json();
            if (data.title) customTitle = data.title;
            if (data.description) customDescription = data.description;
          }
        } catch {
          // ignore
        }
      }

      const photos: GalleryPhoto[] = imageFiles.map((file, idx) => {
        const ext = getFileExtension(file.name);
        const rawTitle = file.name.slice(0, -ext.length);
        // Use clean website domain path so GitHub repo is never exposed to visitors
        const imagePath = `/galleries/${encodeURIComponent(dir.name)}/${encodeURIComponent(file.name)}`;
        
        return {
          id: `${folderSlug}-${idx + 1}`,
          filename: file.name,
          path: imagePath,
          title: toTitleCase(rawTitle),
          isCover: file.name === coverItem.name,
        };
      });

      const coverUrl = `/galleries/${encodeURIComponent(dir.name)}/${encodeURIComponent(coverItem.name)}`;

      galleries.push({
        id: folderSlug,
        folderName: dir.name,
        title: customTitle,
        description: customDescription,
        coverImage: coverUrl,
        count: photos.length,
        photos,
        source: 'github',
      });
    } catch (e) {
      console.warn(`[galleryService] Failed to parse folder ${dir.name}:`, e);
    }
  }

  return galleries;
}

/**
 * Loads galleries combining local pre-built manifest and live GitHub detection.
 * Provides caching and instant fallback.
 */
export async function getGalleries(forceRefresh = false): Promise<{
  galleries: Gallery[];
  source: 'local' | 'github' | 'cached-github';
  lastSynced: Date;
}> {
  // Check cached GitHub response if not force refreshing
  if (!forceRefresh) {
    try {
      const rawCache = sessionStorage.getItem(CACHE_KEY);
      if (rawCache) {
        const cached = JSON.parse(rawCache);
        const age = Date.now() - (cached.timestamp || 0);
        if (age < CACHE_TTL_MS && Array.isArray(cached.galleries) && cached.galleries.length > 0) {
          return {
            galleries: cached.galleries,
            source: 'cached-github',
            lastSynced: new Date(cached.timestamp),
          };
        }
      }
    } catch {
      // sessionStorage error, ignore
    }
  }

  // 1. Fetch local manifest first (guaranteed instant)
  const localManifest = await fetchLocalManifest();
  let baseGalleries: Gallery[] = localManifest?.galleries || [];

  // 2. Try fetching live from GitHub API if connected
  try {
    const githubGalleries = await fetchGalleriesFromGitHub();
    if (githubGalleries && githubGalleries.length > 0) {
      // Merge: GitHub is the source of truth for newly committed folders
      // If a folder exists in GitHub, use GitHub's photo list
      const mergedMap = new Map<string, Gallery>();
      for (const g of baseGalleries) {
        mergedMap.set(g.id, g);
      }
      for (const g of githubGalleries) {
        mergedMap.set(g.id, g); // overrides or appends new folders
      }
      const combined = Array.from(mergedMap.values());

      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            galleries: combined,
          })
        );
      } catch {
        // sessionStorage quota, ignore
      }

      return {
        galleries: combined,
        source: 'github',
        lastSynced: new Date(),
      };
    }
  } catch (err) {
    console.warn('[galleryService] Live GitHub sync skipped:', err);
  }

  // Fallback to local manifest
  return {
    galleries: baseGalleries,
    source: 'local',
    lastSynced: localManifest?.generatedAt ? new Date(localManifest.generatedAt) : new Date(),
  };
}
