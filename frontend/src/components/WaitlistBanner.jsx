import React, { useState, useEffect } from 'react';
import { Flame, Clock, Users } from 'lucide-react';
import { calculateSpotsRemaining } from '../utils/waitlistSpots';

const WaitlistBanner = ({ onClick }) => {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false); // Hidden until first interaction

  // Next drop date - February 2, 2026
  const targetDate = new Date('2026-02-02T00:00:00');

  // Show banner after first touch or scroll
  useEffect(() => {
    const handleFirstInteraction = () => {
      setIsVisible(true);
      // Remove listeners after first interaction
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

  const formatTime = (num) => String(num).padStart(2, '0');

  // Don't render until first interaction
  if (!isVisible) return null;

  return (
    <div 
      className="waitlist-banner-wrapper"
      onClick={onClick} 
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="waitlist-banner">
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
