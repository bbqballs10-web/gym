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
  const sentinelRef = useRef(null); // Invisible element to detect when banner should stick

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

  // Measure banner height
  useEffect(() => {
    if (isVisible && bannerRef.current) {
      setBannerHeight(bannerRef.current.offsetHeight);
    }
  }, [isVisible]);

  // Use IntersectionObserver for sticky detection
  useEffect(() => {
    if (!isVisible || !sentinelRef.current) return;

    const headerHeight = window.innerWidth <= 768 ? 56 : 72;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is NOT intersecting (scrolled past), banner should be sticky
        setIsSticky(!entry.isIntersecting);
      },
      {
        // Root margin: negative top margin equal to header height
        // This triggers when sentinel reaches the bottom of the header
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
        threshold: 0
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
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

  const formatTime = (num) => String(num).padStart(2, '0');

  if (!isVisible) return null;

  return (
    <div className="waitlist-banner-container">
      {/* Sentinel element - when this scrolls past header, banner becomes sticky */}
      <div ref={sentinelRef} className="waitlist-sentinel" />
      
      {/* Placeholder maintains space when banner is fixed */}
      <div 
        className="waitlist-banner-placeholder"
        style={{ height: isSticky ? bannerHeight : 0 }}
      />
      
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
