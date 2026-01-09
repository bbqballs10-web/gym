import React, { useState, useEffect, useRef } from 'react';
import { Flame, Clock, Users } from 'lucide-react';
import { calculateSpotsRemaining } from '../utils/waitlistSpots';

const WaitlistBanner = ({ onClick }) => {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showFixed, setShowFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Hidden until first interaction
  const bannerRef = useRef(null);

  // Next drop date - February 2, 2026
  const targetDate = new Date('2026-02-02T00:00:00');

  // Show banner after first click, scroll, or touch
  useEffect(() => {
    const handleFirstInteraction = () => {
      setIsVisible(true);
      // Remove all listeners after first interaction
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('scroll', handleFirstInteraction, { passive: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
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

  // Track when inline banner scrolls past header
  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return;
      
      const headerHeight = window.innerWidth <= 768 ? 56 : 72;
      const bannerRect = bannerRef.current.getBoundingClientRect();
      
      // Show fixed banner when inline banner top reaches header bottom
      setShowFixed(bannerRect.top <= headerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  const BannerContent = () => (
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
  );

  return (
    <>
      {/* Inline banner - always in document flow */}
      <div 
        ref={bannerRef}
        className={`waitlist-banner waitlist-banner-inline ${showFixed ? 'is-hidden' : ''} ${isVisible ? 'fade-in' : 'initially-hidden'}`}
        onClick={onClick} 
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <BannerContent />
      </div>
      
      {/* Fixed banner - only visible when scrolled past */}
      <div 
        className={`waitlist-banner waitlist-banner-fixed ${showFixed && isVisible ? 'is-visible' : ''}`}
        onClick={onClick} 
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <BannerContent />
      </div>
    </>
  );
};

export default WaitlistBanner;
