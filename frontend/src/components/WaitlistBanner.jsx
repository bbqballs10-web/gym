import React, { useState, useEffect, useRef } from 'react';
import { Flame, Clock, Users } from 'lucide-react';
import { calculateSpotsRemaining } from '../utils/waitlistSpots';

const WaitlistBanner = ({ onClick }) => {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFixed, setIsFixed] = useState(false);
  const bannerRef = useRef(null);
  const placeholderRef = useRef(null);

  // Next drop date - February 2, 2026
  const targetDate = new Date('2026-02-02T00:00:00');

  useEffect(() => {
    const spots = calculateSpotsRemaining();
    setSpotsRemaining(spots);

    // Countdown timer
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

    // Slowly decrease spots remaining for urgency
    const spotsTimer = setInterval(() => {
      setSpotsRemaining(prev => Math.max(1, prev - Math.floor(Math.random() * 2)));
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(spotsTimer);
    };
  }, []);

  // Handle scroll to switch from sticky to fixed
  useEffect(() => {
    const handleScroll = () => {
      if (!placeholderRef.current) return;
      
      const headerHeight = window.innerWidth <= 768 ? 56 : 72;
      const placeholderRect = placeholderRef.current.getBoundingClientRect();
      
      // When placeholder top reaches header bottom, switch to fixed
      setIsFixed(placeholderRect.top <= headerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  const bannerHeight = bannerRef.current?.offsetHeight || 48;

  return (
    <>
      {/* Placeholder to maintain layout space */}
      <div 
        ref={placeholderRef}
        style={{ height: isFixed ? bannerHeight : 0, marginTop: isFixed ? 0 : '-40px' }}
      />
      
      <div 
        ref={bannerRef}
        className={`waitlist-banner ${isFixed ? 'is-fixed' : ''}`}
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
    </>
  );
};

export default WaitlistBanner;
