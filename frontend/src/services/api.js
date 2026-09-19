export const API_BASE = import.meta.env.VITE_API_BASE ||
  (typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174')
    ? 'http://127.0.0.1:8001/api'
    : '/api');

export const api = {
  getHealth: async () => {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  }
};

