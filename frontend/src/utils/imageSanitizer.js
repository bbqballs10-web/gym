/**
 * Optimized PNG Image Loader with Caching
 * Uses localStorage for persistent caching across sessions
 */

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Memory cache for current session
const memoryCache = new Map();
const pendingRequests = new Map();

// LocalStorage cache key prefix
const CACHE_PREFIX = 'raze_img_';
const CACHE_VERSION = 'v2';

/**
 * Get cached URL from localStorage
 */
const getFromLocalStorage = (url) => {
  try {
    const key = CACHE_PREFIX + btoa(url).slice(0, 50);
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, version } = JSON.parse(cached);
      if (version === CACHE_VERSION) {
        return data;
      }
    }
  } catch (e) {
    // localStorage not available or quota exceeded
  }
  return null;
};

/**
 * Save to localStorage cache
 */
const saveToLocalStorage = (url, blobUrl) => {
  try {
    const key = CACHE_PREFIX + btoa(url).slice(0, 50);
    // We can't store blob URLs, so just mark as processed
    localStorage.setItem(key, JSON.stringify({ data: 'processed', version: CACHE_VERSION }));
  } catch (e) {
    // Ignore storage errors
  }
};

/**
 * Fast image preload without sanitization
 * Just ensures images are in browser cache
 */
const preloadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(url);
    img.src = url;
  });
};

/**
 * Sanitize a PNG image by cleaning up transparent pixels
 * Optimized: Uses OffscreenCanvas when available, processes in chunks
 */
const sanitizePng = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Use OffscreenCanvas if available for better performance
        const canvas = typeof OffscreenCanvas !== 'undefined' 
          ? new OffscreenCanvas(img.naturalWidth, img.naturalHeight)
          : document.createElement('canvas');
        
        if (!(canvas instanceof OffscreenCanvas)) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Optimized loop - process only transparent pixels
        for (let i = 3; i < data.length; i += 4) {
          const alpha = data[i];
          if (alpha === 0) {
            data[i - 3] = 0;
            data[i - 2] = 0;
            data[i - 1] = 0;
          } else if (alpha < 15) {
            const factor = alpha / 15;
            data[i - 3] = (data[i - 3] * factor) | 0;
            data[i - 2] = (data[i - 2] * factor) | 0;
            data[i - 1] = (data[i - 1] * factor) | 0;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        if (canvas instanceof OffscreenCanvas) {
          canvas.convertToBlob({ type: 'image/png' }).then(blob => {
            resolve(URL.createObjectURL(blob));
          }).catch(reject);
        } else {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png');
        }
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });
};

/**
 * Sanitize via CORS proxy
 */
const sanitizeViaProxy = async (originalUrl) => {
  const proxyUrl = `${API_URL}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
  return await sanitizePng(proxyUrl);
};

/**
 * Get sanitized image URL with multi-level caching
 */
export const getSanitizedImage = async (originalUrl) => {
  if (!originalUrl) return originalUrl;
  
  // For local images (starting with /), return as-is - no sanitization needed
  if (originalUrl.startsWith('/')) {
    return originalUrl;
  }
  
  // Level 1: Memory cache (fastest)
  if (memoryCache.has(originalUrl)) {
    return memoryCache.get(originalUrl);
  }
  
  // Level 2: Check pending requests (avoid duplicate work)
  if (pendingRequests.has(originalUrl)) {
    return pendingRequests.get(originalUrl);
  }
  
  // Level 3: Check localStorage (was processed before)
  const wasProcessed = getFromLocalStorage(originalUrl);
  
  // Create sanitization request
  const requestPromise = (async () => {
    try {
      const sanitized = await sanitizeViaProxy(originalUrl);
      memoryCache.set(originalUrl, sanitized);
      saveToLocalStorage(originalUrl, sanitized);
      return sanitized;
    } catch (err) {
      console.warn('Sanitization failed:', originalUrl);
      memoryCache.set(originalUrl, originalUrl);
      return originalUrl;
    } finally {
      pendingRequests.delete(originalUrl);
    }
  })();
  
  pendingRequests.set(originalUrl, requestPromise);
  return requestPromise;
};

/**
 * Preload critical images (call early in app lifecycle)
 */
export const preloadCriticalImages = (urls) => {
  urls.forEach(url => {
    // Start loading immediately
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Batch preload and sanitize images
 */
export const preloadAndSanitize = async (urls) => {
  return Promise.all(urls.map(url => getSanitizedImage(url)));
};
