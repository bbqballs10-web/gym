import React, { useState, useRef, useEffect } from 'react';
import { Share2, X, Link2, Check } from 'lucide-react';

// Custom TikTok icon since lucide doesn't have one
const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Custom X/Twitter icon
const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Instagram icon
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// WhatsApp icon
const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const ShareButton = ({ product, variant = "icon" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/products/${product.id}` 
    : '';
  
  const shareText = `Check out this ${product.name} - ${product.variant} from RAZE!`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`,
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform) => {
    if (platform === 'copy') {
      handleCopyLink();
    } else if (platform === 'instagram') {
      // Instagram doesn't have direct share API - copy link instead
      handleCopyLink();
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
      setIsOpen(false);
    }
  };

  if (variant === "icon") {
    return (
      <div className="share-button-container">
        <button 
          ref={buttonRef}
          className="share-trigger"
          onClick={() => setIsOpen(!isOpen)}
          title="Share"
          aria-label="Share product"
          aria-expanded={isOpen}
        >
          <Share2 size={22} />
        </button>

        {isOpen && (
          <div className="share-dropdown" ref={dropdownRef}>
            <div className="share-dropdown-header">
              <span>Share this product</span>
              <button onClick={() => setIsOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="share-dropdown-options">
              <button onClick={() => handleShare('instagram')} className="share-dropdown-option">
                <InstagramIcon size={22} />
                <span>Instagram</span>
              </button>
              <button onClick={() => handleShare('twitter')} className="share-dropdown-option">
                <XIcon size={22} />
                <span>X / Twitter</span>
              </button>
              <button onClick={() => handleShare('whatsapp')} className="share-dropdown-option">
                <WhatsAppIcon size={22} />
                <span>WhatsApp</span>
              </button>
              <button onClick={() => handleShare('copy')} className="share-dropdown-option copy-link">
                {copied ? <Check size={22} /> : <Link2 size={22} />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ShareButton;
