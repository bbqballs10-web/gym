import React, { useState, useEffect, useRef } from 'react';
import { Flame, Clock, Users } from 'lucide-react';
import { calculateSpotsRemaining } from '../utils/waitlistSpots';

const WaitlistBanner = ({ onClick }) => {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(48);
  const bannerRef = useRef(null);
  const wrapperRef = useRef(null);
  const initialOffsetRef = useRef(null);

  // Next drop date - February 2, 2026
  const targetDate = new Date('2026-02-02T00:00:00');

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

  // Measure banner height and initial offset once visible
  useEffect(() => {
    if (isVisible && wrapperRef.current && bannerRef.current) {
      // Wait a frame for render
      requestAnimationFrame(() => {
        if (bannerRef.current) {
          setBannerHeight(bannerRef.current.offsetHeight);
        }
        if (wrapperRef.current && initialOffsetRef.current === null) {
          // Store the initial offset from top of document (only once)
          initialOffsetRef.current = wrapperRef.current.offsetTop;
        }
      });
    }
  }, [isVisible]);

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

  // Handle sticky - simple scroll position check
  useEffect(() => {
    let rafId = null;
    
    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const headerHeight = window.innerWidth <= 768 ? 56 : 72;
        
        // If we haven't captured the initial offset yet, try now
        if (initialOffsetRef.current === null && wrapperRef.current) {
          // Get current scroll + wrapper's visual position to find document offset
          const rect = wrapperRef.current.getBoundingClientRect();
          initialOffsetRef.current = rect.top + window.scrollY;
        }
        
        if (initialOffsetRef.current !== null) {
          // Banner should stick when scroll position puts the banner at header level
          const stickyPoint = initialOffsetRef.current - headerHeight;
          const shouldStick = window.scrollY >= stickyPoint;
          setIsSticky(shouldStick);
        }
        
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  if (!isVisible) return null;

  return (
    <div 
      ref={wrapperRef}
      className="waitlist-banner-wrapper"
      style={{ 
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
