import React from 'react';
import { X, Check, ShoppingBag } from 'lucide-react';
import { shorts } from '../data/mock';

const UpsellModal = ({ isOpen, onClose, onAddShorts, addedProduct }) => {
  if (!isOpen) return null;

  // Find matching shorts based on the shirt color
  const matchingShorts = shorts.find(s => 
    s.variant.includes(addedProduct?.logoColor) || s.variant === "Black / Cyan"
  ) || shorts[0];

  const handleAddShorts = () => {
    onAddShorts(matchingShorts);
    onClose();
  };

  return (
    <div className="upsell-overlay" onClick={onClose}>
      <div className="upsell-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="upsell-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Success header */}
        <div className="upsell-header">
          <div className="upsell-check">
            <Check size={24} />
          </div>
          <h3>Added to Cart!</h3>
          <p className="upsell-product-name">{addedProduct?.variant} Shirt</p>
        </div>

        {/* Upsell offer */}
        <div className="upsell-offer">
          <div className="upsell-offer-title">Complete your set?</div>
          
          <div className="upsell-product-row">
            <div className="upsell-product-image">
              <img src={matchingShorts.image} alt={matchingShorts.variant} />
            </div>
            <div className="upsell-product-details">
              <span className="upsell-product-variant">{matchingShorts.variant} Shorts</span>
              <div className="upsell-pricing">
                <span className="upsell-price-old">$55</span>
                <span className="upsell-price-new">+$24</span>
              </div>
            </div>
          </div>

          <div className="upsell-savings">
            <span>Bundle Total: <strong>$69</strong></span>
            <span className="upsell-save-tag">Save $31</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="upsell-actions">
          <button className="upsell-btn-add" onClick={handleAddShorts}>
            <ShoppingBag size={18} />
            Add Shorts & Save
          </button>
          <button className="upsell-btn-skip" onClick={onClose}>
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpsellModal;
