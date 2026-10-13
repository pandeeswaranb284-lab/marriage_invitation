import { VERIFIED_WEDDING_DATA } from '../data/verifiedWedding';

const CACHE_PREFIX = 'royal_wedding_cache_';

/**
 * Normalizes slug candidates for comparison.
 */
function normalizeSlug(slug) {
  if (!slug) return 'current';
  return String(slug).toLowerCase().trim();
}

/**
 * Checks if the requested slug matches the verified wedding for Prabhu & Nalini.
 */
export function isDefaultWeddingSlug(slug) {
  const norm = normalizeSlug(slug);
  return (
    norm === 'current' ||
    norm === 'k-prabhu-m-nalini' ||
    norm === 'prabhu-nalini' ||
    norm === ''
  );
}

/**
 * Synchronously retrieves initial wedding data for immediate First Contentful Paint.
 * Priority:
 * 1. Fresh/stored cache in localStorage
 * 2. Pre-bundled verified data (if matching default wedding)
 * 3. null (only if an unknown custom slug is requested)
 */
export function getInitialWeddingData(slug) {
  const norm = normalizeSlug(slug);

  // 1. Try browser localStorage first
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(`${CACHE_PREFIX}${norm}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.groom_name && parsed.bride_name) {
          return parsed;
        }
      }

      // Also check fallback key 'current'
      const fallbackStored = window.localStorage.getItem(`${CACHE_PREFIX}current`);
      if (fallbackStored) {
        const parsedFallback = JSON.parse(fallbackStored);
        if (parsedFallback && parsedFallback.groom_name && parsedFallback.bride_name) {
          return parsedFallback;
        }
      }
    } catch (_) {
      // Ignore storage read errors (e.g. storage disabled/incognito)
    }
  }

  // 2. Return verified default baseline for instant 0ms first paint
  if (isDefaultWeddingSlug(slug)) {
    return VERIFIED_WEDDING_DATA;
  }

  return null;
}

/**
 * Persists wedding data to localStorage for instant subsequent loads.
 */
export function saveWeddingToCache(slug, data) {
  if (!data || typeof window === 'undefined' || !window.localStorage) return;
  try {
    const norm = normalizeSlug(slug);
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(`${CACHE_PREFIX}${norm}`, serialized);

    if (data.slug && data.slug !== norm) {
      window.localStorage.setItem(`${CACHE_PREFIX}${normalizeSlug(data.slug)}`, serialized);
    }
    // Also store as latest 'current'
    window.localStorage.setItem(`${CACHE_PREFIX}current`, serialized);
  } catch (_) {
    // Ignore storage write quota exceptions
  }
}
