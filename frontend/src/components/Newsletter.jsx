import React from 'react';
import { useTranslation } from 'react-i18next';

const Newsletter = ({ onJoinClick }) => {
  const { t } = useTranslation();
  
  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-content">
          <h2 className="newsletter-title">{t('newsletter.title')}</h2>
          <p className="newsletter-description">
            {t('newsletter.subtitle')}
          </p>
          <div className="newsletter-cta">
            <button className="btn-cta" onClick={onJoinClick}>
              {t('waitlist.button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
