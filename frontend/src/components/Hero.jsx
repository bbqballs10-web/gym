import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { heroProduct } from '../data/mock';

const Hero = ({ onEarlyAccessClick }) => {
  const { t } = useTranslation();
  const [showBack, setShowBack] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const frontOriginal = heroProduct.image;
  const backOriginal = heroProduct.backImage;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on mount
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-inner">
        {/* Text content */}
        <div className="hero-content">
          <h1 className="hero-title">RAZE</h1>
          <p className="hero-tagline">{t('hero.tagline')}</p>
          <p className="hero-description">
            {t('hero.description')}
          </p>
          <div className="hero-cta">
            <Button 
              className="btn-primary"
              onClick={() => {
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.shopNow')}
            </Button>
          </div>
        </div>

        {/* Hero shirt display */}
        <div className="hero-product-display">
          {isMobile ? (
            /* Mobile: Show both shirts side by side */
            <div className="hero-shirts-mobile">
              <div className="hero-image-container hero-shirt-front">
                <div className="hero-shirt-glow-layer" />
                <img 
                  src={frontOriginal}
                  alt="Performance T-Shirt - Front View"
                  className="hero-shirt-single"
                  loading="eager"
                />
              </div>
              <div className="hero-image-container hero-shirt-back">
                <div className="hero-shirt-glow-layer" />
                <img 
                  src={backOriginal}
                  alt="Performance T-Shirt - Back View"
                  className="hero-shirt-single"
                  loading="eager"
                />
              </div>
            </div>
          ) : (
            /* Desktop: Show single shirt with toggle */
            <>
              <div className="hero-image-container">
                <div className="hero-shirt-glow-layer" />
                <img 
                  src={showBack ? backOriginal : frontOriginal}
                  alt={`Performance T-Shirt - ${showBack ? 'Back' : 'Front'} View`}
                  className="hero-shirt-single"
                  loading="eager"
                />
              </div>
              
              {/* Front/Back Toggle - Desktop only */}
              <div className="hero-view-toggle">
                <button 
                  className={`toggle-btn ${!showBack ? 'active' : ''}`}
                  onClick={() => setShowBack(false)}
                >
                  {t('hero.front')}
                </button>
                <button 
                  className={`toggle-btn ${showBack ? 'active' : ''}`}
                  onClick={() => setShowBack(true)}
                >
                  {t('hero.back')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
