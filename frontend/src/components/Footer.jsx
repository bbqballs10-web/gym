import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { socialLinks } from '../data/mock';
import { PaymentMethods } from './TrustBadges';

// Custom social icons
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Footer = () => {
  const { t } = useTranslation();
  
  // Use window.open to bypass iframe restrictions in preview environment
  const openSocialLink = (url, e) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-brand">
          <h3 className="footer-logo">RAZE</h3>
          <p className="footer-tagline">{t('footer.builtByDiscipline')}</p>
          <div className="social-links">
            <a href={socialLinks.instagram} aria-label="Instagram" onClick={(e) => openSocialLink(socialLinks.instagram, e)}>
              <InstagramIcon size={20} />
            </a>
            <a href={socialLinks.tiktok} aria-label="TikTok" onClick={(e) => openSocialLink(socialLinks.tiktok, e)}>
              <TikTokIcon size={20} />
            </a>
            <a href={socialLinks.twitter} aria-label="X / Twitter" onClick={(e) => openSocialLink(socialLinks.twitter, e)}>
              <XIcon size={20} />
            </a>
            <a href={socialLinks.youtube} aria-label="YouTube" onClick={(e) => openSocialLink(socialLinks.youtube, e)}>
              <YouTubeIcon size={20} />
            </a>
            <a href={`mailto:${socialLinks.email}`} aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Shop Column */}
        <div className="footer-section">
          <h4 className="footer-heading">{t('footer.shop')}</h4>
          <ul className="footer-list">
            <li><Link to="/products">{t('footer.allProducts')}</Link></li>
            <li><Link to="/size-guide">{t('footer.sizeGuide')}</Link></li>
            <li><Link to="/returns">{t('footer.shippingReturns')}</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="footer-section">
          <h4 className="footer-heading">{t('footer.company')}</h4>
          <ul className="footer-list">
            <li><Link to="/about">{t('footer.about')}</Link></li>
            <li><Link to="/faq">{t('footer.faq')}</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="footer-section">
          <h4 className="footer-heading">{t('footer.support')}</h4>
          <ul className="footer-list">
            <li><Link to="/track">{t('footer.trackOrder')}</Link></li>
            <li><a href="mailto:support@razetraining.com">{t('footer.contact')}</a></li>
          </ul>
        </div>
      </div>

      {/* Payment Methods */}
      <PaymentMethods />

      <div className="footer-bottom">
        <p className="footer-copyright">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
