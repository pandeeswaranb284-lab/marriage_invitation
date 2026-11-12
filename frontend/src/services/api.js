const rawApiUrl =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE;

// Correct production Render backend
export const PROD_BACKEND_ORIGIN =
  'https://wedding-invitation-backend-we5q.onrender.com';

// Resolve backend origin
const normalizeOrigin = (url) => {
  if (!url) return '';

  return url
    .replace(/\/api\/?$/, '')
    .replace(/\/+$/, '');
};

const BACKEND_ORIGIN = rawApiUrl
  ? normalizeOrigin(rawApiUrl)
  : (typeof window !== 'undefined' &&
      (window.location.port === '5173' ||
       window.location.port === '5174')
      ? 'http://127.0.0.1:8000'
      : PROD_BACKEND_ORIGIN);

// API base URL
export const API_BASE = `${BACKEND_ORIGIN}/api`;

// Backend origin getter
export const getBackendOrigin = () => BACKEND_ORIGIN;

// Resolve uploaded image and media URLs
export const resolveMediaUrl = (url) => {
  if (!url) return '';

  if (typeof url !== 'string') return url;

  // Preserve absolute and browser-generated URLs
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  // Resolve backend uploads from Render
  return `${BACKEND_ORIGIN}/${url.replace(/^\/+/, '')}`;
};

// API health check
export const api = {
  getHealth: async () => {
    const response = await fetch(`${API_BASE}/health`);

    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`);
    }

    return response.json();
  }
};
