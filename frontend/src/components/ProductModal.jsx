import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShareButton from './ShareButton';
import WaitlistModal from './WaitlistModal';

// WAITLIST MODE - All products are on waitlist (sold out)
const WAITLIST_MODE = true;

const ProductModal = ({ isOpen, onClose, product }) => {
  const [showBack, setShowBack] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedGender, setSelectedGender] = useState('mens');
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const navigate = useNavigate();

  // Determine if this is a shorts product
  const isShorts = product?.category?.toLowerCase() === 'shorts';

  // Get sizes based on gender for shorts
  const getSizes = () => {
    if (!product) return ['XS', 'S', 'M', 'L'];
    if (isShorts) {
      return selectedGender === 'mens' 
        ? (product.mensSizes || ['S', 'M', 'L', 'XL'])
        : (product.womensSizes || ['XS', 'S', 'M', 'L']);
    }
    return product.sizes || ['XS', 'S', 'M', 'L'];
  };

  // Reset size when gender changes
  useEffect(() => {
    if (isShorts) {
      setSelectedSize(selectedGender === 'mens' ? 'M' : 'S');
    }
  }, [selectedGender, isShorts]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleJoinWaitlist = () => {
    setWaitlistOpen(true);
  };

  const toggleView = () => {
    setShowBack(!showBack);
  };

  // Get the correct size guide tab based on product and gender
  const getSizeGuideTab = () => {
    if (isShorts) {
      return selectedGender === 'mens' ? 'shorts-mens' : 'shorts-womens';
    }
    return 'tshirt';
  };

  // Render modal in a portal at body level
  return ReactDOM.createPortal(
    <>
      <div className="product-modal-overlay" onClick={onClose}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          
          {/* Header buttons container - X and Share stacked on mobile */}
          <div className="modal-header-actions">
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
              <X size={24} />
            </button>
            <div className="modal-share modal-share-header">
              <ShareButton product={product} />
            </div>
          </div>

          <div className="modal-content">
            {/* Left side - Product image */}
            <div className="modal-image-section">
              
              <div className="modal-image-container">
                {/* Navigation arrows */}
                <button 
                  className={`view-nav view-nav-left ${!showBack ? 'disabled' : ''}`}
                  onClick={() => setShowBack(false)}
                  disabled={!showBack}
                >
                  <ChevronLeft size={28} />
                </button>
                
                <img 
                  src={showBack 
                    ? (product.backImage || product.images?.[1] || product.image || product.images?.[0]) 
                    : (product.image || product.images?.[0])
                  }
                  alt={`${product.name} - ${showBack ? 'Back' : 'Front'} View`}
                  className="modal-product-image"
                />
                
                <button 
                  className={`view-nav view-nav-right ${showBack ? 'disabled' : ''}`}
                  onClick={() => setShowBack(true)}
                  disabled={showBack}
                >
                  <ChevronRight size={28} />
                </button>
              </div>

              {/* View toggle buttons */}
              <div className="modal-view-toggle">
                <button 
                  className={`modal-toggle-btn ${!showBack ? 'active' : ''}`}
                  onClick={() => setShowBack(false)}
                >
                  Front
                </button>
                <button 
                  className={`modal-toggle-btn ${showBack ? 'active' : ''}`}
                  onClick={() => setShowBack(true)}
                >
                  Back
                </button>
              </div>
            </div>

            {/* Right side - Product details */}
            <div className="modal-details-section">
              <div className="modal-product-info">
                <span className="modal-category">{product.category}</span>
                <h2 className="modal-product-name">{product.name}</h2>
                <span className="modal-variant">{product.variant}</span>
              </div>

              <div className="modal-price-section">
                {product.originalPrice && (
                  <span className="modal-original-price">${product.originalPrice}</span>
                )}
                <span className="modal-price">${product.price}</span>
                {/* Removed stock urgency - sold out/waitlist only */}
              </div>

              {/* Size selector */}
              <div className="modal-size-section">
                <div className="modal-size-header">
                  <span>Select Size</span>
                  <button 
                    className="size-guide-btn"
                    onClick={() => {
                      onClose();
                      navigate(`/size-guide?tab=${getSizeGuideTab()}`);
                    }}
                  >
                    Size Guide
                  </button>
                </div>
                
                {/* Gender toggle for shorts */}
                {isShorts && (
                  <div className="modal-gender-toggle">
                    <button
                      className={`modal-gender-btn ${selectedGender === 'mens' ? 'active' : ''}`}
                      onClick={() => setSelectedGender('mens')}
                    >
                      Men's
                    </button>
                    <button
                      className={`modal-gender-btn ${selectedGender === 'womens' ? 'active' : ''}`}
                      onClick={() => setSelectedGender('womens')}
                    >
                      Women's
                    </button>
                  </div>
                )}
                
                <div className="modal-sizes">
                  {getSizes().map(size => (
                    <button
                      key={size}
                      className={`modal-size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Join Waitlist button (waitlist mode) */}
              <button 
                className="modal-add-to-cart waitlist-btn"
                onClick={handleJoinWaitlist}
              >
                <Lock size={18} /> Join Waitlist
              </button>

              {/* Sold out notice */}
              <div className="modal-bundle-nudge">
                First drop <strong>SOLD OUT</strong> — Secure your spot for Feb 2
              </div>

              {/* Product features */}
              <div className="modal-features">
                <h4>Details</h4>
                <ul>
                  {isShorts ? (
                    <>
                      <li>Engineered for unrestricted hip mobility and deep range of motion</li>
                      <li>Designed to move freely through squats, lunges, and dynamic training</li>
                      <li>Secure athletic fit that stays in place during explosive movement</li>
                      <li>Lightweight, breathable fabric for high-output sessions</li>
                      <li>Durable construction that maintains structure and fit after repeated washes</li>
                    </>
                  ) : (
                    <>
                      <li>Engineered for unrestricted overhead and full-range movement</li>
                      <li>Designed for those who value freedom of movement</li>
                      <li>Athletic cut that stays in place under tension</li>
                      <li>Lightweight, sweat-wicking fabric for high-output sessions</li>
                      <li>Holds structure and fit after repeated washes</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        product={{
          ...product,
          variant: product.variant,
          size: selectedSize
        }}
      />
    </>,
    document.body
  );
};

export default ProductModal;
