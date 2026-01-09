import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { giveawayPopup, emails } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// RAZE Logo URL
const RAZE_LOGO = 'https://customer-assets.emergentagent.com/job_simple-greeting-395/artifacts/7vw9prpd_blue.png';

const GiveawayPopup = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [isOpen, isSubmitted]);

  const handleTimeExpired = () => {
    setIsOpen(false);
    giveawayPopup.markDismissed();
  };

  useEffect(() => {
    // Check if should show based on 14-day cooldown
    if (!giveawayPopup.shouldShow()) return;

    // Show after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
      setTimeLeft(30); // Reset timer
      giveawayPopup.markShown();
    }, giveawayPopup.TRIGGER_DELAY_MS);

    // Exit intent detection (desktop only)
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && giveawayPopup.shouldShow()) {
        setIsOpen(true);
        setTimeLeft(30); // Reset timer
        giveawayPopup.markShown();
        clearTimeout(timer);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    giveawayPopup.markDismissed();
    setEmail('');
    setIsSubmitted(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await emails.addGiveaway(email);
      
      if (result.success) {
        // Send webhook to n8n for giveaway entry email
        try {
          await fetch(`${API_URL}/api/webhook/giveaway-entry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              event_type: 'giveaway_entry',
              timestamp: new Date().toISOString()
            })
          });
        } catch (webhookErr) {
          console.log('Webhook notification sent');
        }
        
        setIsSubmitted(true);
      } else if (result.reason === 'duplicate') {
        setError('This email is already entered.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = () => {
    handleClose();
    navigate('/register');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="giveaway-overlay" onClick={handleClose} />

      <div className="giveaway-popup">
        <button className="giveaway-close" onClick={handleClose} aria-label="Close">
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <div className="giveaway-content">
            {/* Countdown Timer */}
            <div className="giveaway-timer" data-testid="giveaway-timer">
              <span className="timer-icon">⏱️</span>
              <span className="timer-text">
                {timeLeft}s remaining
              </span>
            </div>

            <div className="giveaway-logo">
              <img 
                src={RAZE_LOGO} 
                alt="RAZE" 
                className="giveaway-logo-img"
              />
            </div>
            <h2 className="giveaway-title">
              {t('popup.giveaway.title')}
            </h2>
            <p className="giveaway-choice-line">
              <span className="giveaway-highlight">(Shirt + Shorts)</span> <span className="giveaway-choice-text">OF YOUR CHOICE</span>
            </p>

            <form onSubmit={handleSubmit} className="giveaway-form">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="giveaway-input"
                disabled={isLoading}
              />
              {error && (
                <p className="giveaway-error">{error}</p>
              )}
              <button
                type="submit"
                className="giveaway-btn"
                disabled={isLoading}
              >
                {isLoading ? t('common.loading') : t('popup.giveaway.button')}
              </button>
            </form>

            <div className="giveaway-benefits">
              <p className="benefits-heading">WHAT YOU GET:</p>
              <ul className="benefits-list">
                <li>
                  <span className="check">✓</span>
                  Complete RAZE Performance Set (shirt + shorts of your choice)
                </li>
                <li>
                  <span className="check">✓</span>
                  1 winner selected every month
                </li>
                <li>
                  <span className="check">✓</span>
                  Early access to new drops
                </li>
                <li>
                  <span className="check">✓</span>
                  Exclusive training tips & discipline content
                </li>
              </ul>
            </div>

            <p className="giveaway-disclaimer">No spam. Unsubscribe anytime.</p>
          </div>
        ) : (
          <div className="giveaway-content giveaway-success">
            <div className="giveaway-logo success-logo">
              <img 
                src={RAZE_LOGO} 
                alt="RAZE" 
                className="giveaway-logo-img"
              />
            </div>
            <h2 className="giveaway-title">You're In The Giveaway!</h2>
            <p className="giveaway-subtitle">
              1 winner selected every month. Check your email for updates!
            </p>
            
            <div className="signup-promo">
              <p className="signup-promo-text">
                Want <strong>10% off</strong> your first order?
              </p>
              <button 
                className="giveaway-btn signup-btn"
                onClick={handleSignUp}
              >
                Create Account & Get 10% Off
              </button>
              <p className="signup-note">
                Sign up for an account to unlock your personal discount code
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GiveawayPopup;
