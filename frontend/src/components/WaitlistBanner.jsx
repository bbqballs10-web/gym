import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, Clock, Users } from 'lucide-react';
import { calculateSpotsRemaining } from '../utils/waitlistSpots';

const WaitlistBanner = ({ onClick }) => {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const bannerRef = useRef(null);
  const wrapperRef = useRef(null);

  // Next drop date - February 2, 2026
  const targetDate = new Date('2026-02-02T00:00:00');

  // Measure banner height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (bannerRef.current) {
        setBannerHeight(bannerRef.current.offsetHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isVisible]);

  // Show banner after first touch or scroll
  useEffect(() => {
    const handleFirstInteraction = () => {
      setIsVisible(true);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('scroll', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const spots = calculateSpotsRemaining();
    setSpotsRemaining(spots);

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    const spotsTimer = setInterval(() => {
      setSpotsRemaining(prev => Math.max(1, prev - Math.floor(Math.random() * 2)));
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(spotsTimer);
    };
  }, []);

  // Handle sticky with proper RAF debouncing
  const handleScroll = useCallback(() => {
    if (!wrapperRef.current) return;
    
    const headerHeight = window.innerWidth <= 768 ? 56 : 72;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const shouldStick = wrapperRect.top <= headerHeight;
    
    setIsSticky(shouldStick);
  }, []);

  useEffect(() => {
    let rafId = null;
    
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  const formatTime = (num) => String(num).padStart(2, '0');

  if (!isVisible) return null;

  return (
    <div 
      ref={wrapperRef}
      className="waitlist-banner-wrapper"
      style={{ 
        // When sticky, the wrapper maintains the space
        minHeight: isSticky ? bannerHeight : 'auto'
      }}
    >
      <div 
        ref={bannerRef}
        className={`waitlist-banner ${isSticky ? 'is-sticky' : ''}`}
        onClick={onClick} 
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <div className="banner-content">
          <div className="banner-left">
            <Flame size={20} className="banner-icon" />
            <span className="sold-out-text">FIRST DROP SOLD OUT</span>
          </div>
          
          <div className="banner-center">
            <Clock size={16} />
            <span className="countdown-inline">
              Next drop: {formatTime(timeLeft.days)}d {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
            </span>
          </div>
          
          <div className="banner-right">
            <Users size={16} />
            <span className="waitlist-count-inline">
              Only <strong>{spotsRemaining}</strong> spots left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistBanner;
