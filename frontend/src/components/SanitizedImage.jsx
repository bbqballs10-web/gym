import React, { useState, useEffect, useRef } from 'react';
import { getSanitizedImage } from '../utils/imageSanitizer';

/**
 * Optimized SanitizedImage Component
 * - Shows original image immediately for fast LCP
 * - Sanitizes in background and swaps when ready
 * - Supports lazy loading for below-fold images
 */
const SanitizedImage = ({ 
  src, 
  alt, 
  className, 
  style,
  onClick,
  onLoad,
  lazy = false,
  priority = false,
  ...props 
}) => {
  const [sanitizedSrc, setSanitizedSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);
  
  useEffect(() => {
    let mounted = true;
    setSanitizedSrc(null);
    setIsLoaded(false);
    
    if (!src) return;
    
    // Start sanitization in background
    const loadSanitized = async () => {
      try {
        const result = await getSanitizedImage(src);
        if (mounted) {
          setSanitizedSrc(result);
        }
      } catch (err) {
        // Fallback handled by getSanitizedImage
        if (mounted) {
          setSanitizedSrc(src);
        }
      }
    };
    
    // For priority images, start immediately
    // For lazy images, use IntersectionObserver
    if (priority || !lazy) {
      loadSanitized();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadSanitized();
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      
      if (imgRef.current) {
        observer.observe(imgRef.current);
      }
      
      return () => observer.disconnect();
    }
    
    return () => {
      mounted = false;
    };
  }, [src, lazy, priority]);
  
  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };
  
  // Show original immediately, swap to sanitized when ready
  const displaySrc = sanitizedSrc || src;
  
  return (
    <img
      ref={imgRef}
      src={displaySrc}
      alt={alt}
      className={`${className || ''} ${isLoaded ? 'loaded' : 'loading'}`}
      style={style}
      onClick={onClick}
      onLoad={handleLoad}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      {...props}
    />
  );
};

export default SanitizedImage;
