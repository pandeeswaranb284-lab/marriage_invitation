const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE;

export const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`)
  : (typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174')
    ? 'http://127.0.0.1:8000/api'
    : '/api');

export const getBackendOrigin = () => {
  if (rawApiUrl) {
    return rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174')) {
    return 'http://127.0.0.1:8000';
  }
  return '';
};

export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const origin = getBackendOrigin();
  if (origin) {
    return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url;
};

export const api = {
  getHealth: async () => {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  }
};


