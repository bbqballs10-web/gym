import React, { useState, useEffect } from 'react';
import { X, Coins, Gift, Truck, Clock } from 'lucide-react';
import { popup } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// RAZE Logo URL
const RAZE_LOGO = 'https://customer-assets.emergentagent.com/job_simple-greeting-395/artifacts/7vw9prpd_blue.png';

const EmailPopup = ({ isOpen: externalIsOpen, onClose: externalOnClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Determine if popup is controlled externally or internally
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  useEffect(() => {
    // Skip auto-trigger if controlled externally
    if (isControlled) return;

    // Check if should show based on 14-day cooldown
    if (!popup.shouldShow()) return;

    // Show after EXACTLY 7 seconds
    const timer = setTimeout(() => {
      setInternalIsOpen(true);
      popup.markShown();
    }, popup.TRIGGER_DELAY_MS);

    // Exit intent detection (desktop only)
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && popup.shouldShow()) {
        setInternalIsOpen(true);
        popup.markShown();
        clearTimeout(timer);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isControlled]);

  const handleClose = () => {
    if (isControlled && externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    popup.markDismissed();
  };

  const handleSignUp = () => {
    handleClose();
    navigate('/register');
  };

  const handleLogin = () => {
    handleClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  // If user is already authenticated, show different message
  if (isAuthenticated) {
    return (
      <>
        <div className="popup-overlay" onClick={handleClose} />
        <div className="popup-container no-animation">
          <button className="popup-close" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
          <div className="popup-content popup-success">
            <div className="popup-logo">
              <img src={RAZE_LOGO} alt="RAZE" className="popup-logo-img" />
            </div>
            <h2 className="popup-success-title">You Have Early Access!</h2>
            <p className="popup-success-subtitle">
              You're already signed in and have access to all drops.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="popup-overlay" onClick={handleClose} />

      {/* Popup */}
      <div className="popup-container no-animation early-access-popup">
        <button className="popup-close" onClick={handleClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="popup-content">
          <div className="popup-logo">
            <img src={RAZE_LOGO} alt="RAZE" className="popup-logo-img" />
          </div>
          
          <h2 className="popup-title">Get Early Access</h2>
          <p className="popup-subtitle">
            Create an account to unlock exclusive member benefits
          </p>

          <div className="early-access-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">
                <Gift size={16} />
              </div>
              <div className="benefit-text">
                <strong>10% off</strong> your first order
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon highlight">
                <Coins size={16} />
              </div>
              <div className="benefit-text">
                <strong>RAZE Credits</strong> — Earn $1 credit for every $1 spent
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">
                <Clock size={16} />
              </div>
              <div className="benefit-text">
                <strong>Early access</strong> to new drops
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">
                <Truck size={16} />
              </div>
              <div className="benefit-text">
                <strong>Order tracking</strong> & history
              </div>
            </div>
          </div>
          
          {/* RAZE Credits highlight */}
          <div className="credits-highlight">
            <div className="credits-highlight-header">
              <Coins size={14} className="credits-icon" />
              <span>RAZE CREDITS</span>
            </div>
            <p className="credits-highlight-text">
              Redeem credits: <strong>100 = $5</strong>, <strong>200 = $15</strong>, <strong>300 = $25 off</strong>
            </p>
            <p className="credits-bonus">
              + <strong>10 bonus credits</strong> just for signing up!
            </p>
          </div>

          <button
            onClick={handleSignUp}
            className="popup-btn"
          >
            Create Account
          </button>
          
          <p className="popup-login-link">
            Already have an account?{' '}
            <button onClick={handleLogin} className="link-btn">
              Log in
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default EmailPopup;
