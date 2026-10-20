/**
 * Safely resolves an asset path against the application base URL (e.g. /sirat/).
 * Ensures assets resolve properly both when hosted at root (sirat-theta.vercel.app)
 * and when served under a reverse-proxied subpath (markazuliman.com/sirat).
 */
export function getAssetUrl(path) {
  if (!path) return '';
  // Remote URLs, data URIs, and blobs should remain untouched
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
