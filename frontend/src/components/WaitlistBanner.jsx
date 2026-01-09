import React, { useState, useEffect, useRef } from 'react';
import { Flame, Clock, Users } from 'lucide-react';
import { calculateSpotsRemaining } from '../utils/waitlistSpots';

const WaitlistBanner = ({ onClick }) => {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scrolledPast, setScrolledPast] = useState(false);
  const sentinelRef = useRef(null);

  // Next drop date - February 2, 2026
  const targetDate = new Date('2026-02-02T00:00:00');

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

  // Use IntersectionObserver for smooth detection
  useEffect(() => {
    if (!sentinelRef.current) return;

    const headerHeight = window.innerWidth <= 768 ? 56 : 72;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not visible (scrolled past), banner should be fixed
        setScrolledPast(!entry.isIntersecting);
      },
      {
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
        threshold: 0
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  return (
    <div className="waitlist-banner-wrapper">
      {/* Sentinel element - tracks when banner position is reached */}
      <div ref={sentinelRef} className="waitlist-sentinel" />
      
      {/* The actual banner */}
      <div 
        className={`waitlist-banner ${scrolledPast ? 'is-fixed' : ''}`}
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
