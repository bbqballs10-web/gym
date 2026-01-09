import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Check, Loader2, Mail, Lock, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { calculateSpotsRemaining } from '../utils/waitlistSpots';
import { launchConfetti } from '../utils/confetti';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const WaitlistModal = ({ isOpen, onClose, product }) => {
  const [email, setEmail] = useState('');
  const [sizeSelections, setSizeSelections] = useState([{ size: "M (Men's)", quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [spotsRemaining, setSpotsRemaining] = useState(null);

  // Check if this is a shorts product
  const isShorts = product?.category === 'Shorts';

  // Get all size options
  const getSizeOptions = () => {
    if (!product) return ['XS', 'S', 'M', 'L'];
    if (isShorts) {
      const mensSizes = (product.mensSizes || ['S', 'M', 'L', 'XL']).map(s => `${s} (Men's)`);
      const womensSizes = (product.womensSizes || ['XS', 'S', 'M', 'L']).map(s => `${s} (Women's)`);
      return [...mensSizes, ...womensSizes];
    }
    return product.sizes || ['XS', 'S', 'M', 'L'];
  };

  const sizeOptions = getSizeOptions();

  useEffect(() => {
    if (isOpen) {
      // Use the same spots calculation as the banner
      const spots = calculateSpotsRemaining();
      setSpotsRemaining(spots);
      
      // Reset selections when modal opens
      const defaultSize = isShorts ? "M (Men's)" : 'M';
      setSizeSelections([{ size: defaultSize, quantity: 1 }]);
      setSuccess(false);
      setError('');
      setEmail('');
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isShorts]);

  const addSizeSelection = () => {
    // Find a size that hasn't been selected yet, or default to first available
    const selectedSizes = sizeSelections.map(s => s.size);
    const availableSize = sizeOptions.find(s => !selectedSizes.includes(s)) || sizeOptions[0];
    setSizeSelections([...sizeSelections, { size: availableSize, quantity: 1 }]);
  };

  const removeSizeSelection = (index) => {
    if (sizeSelections.length > 1) {
      setSizeSelections(sizeSelections.filter((_, i) => i !== index));
    }
  };

  const updateSize = (index, newSize) => {
    const updated = [...sizeSelections];
    updated[index].size = newSize;
    setSizeSelections(updated);
  };

  const updateQuantity = (index, delta) => {
    const updated = [...sizeSelections];
    const newQty = updated[index].quantity + delta;
    if (newQty >= 1 && newQty <= 10) {
      updated[index].quantity = newQty;
      setSizeSelections(updated);
    }
  };

  const getTotalQuantity = () => {
    return sizeSelections.reduce((sum, s) => sum + s.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, check if user already has this product in waitlist
      const checkResponse = await fetch(`${API_URL}/api/waitlist/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          product_id: product.id,
          variant: product.variant
        })
      });

      const checkData = await checkResponse.json();

      // If already exists, show confirmation
      if (checkData.exists) {
        const confirmed = window.confirm(
          'You have already added this item to your waitlist. Are you sure you would like to add another?'
        );
        
        if (!confirmed) {
          setLoading(false);
          return;
        }
      }

      // Proceed with submission
      const response = await fetch(`${API_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          product_id: product.id,
          product_name: product.name,
          variant: product.variant,
          size: sizeSelections.map(s => `${s.size} x${s.quantity}`).join(', '),
          size_selections: sizeSelections,
          force_add: checkData.exists, // Tell backend this is an intentional addition
          image: product?.image || product?.images?.[0] || null // Product image URL
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setResult(data);
        // Launch confetti celebration!
        launchConfetti();
      } else {
        setError(data.message || 'Failed to join waitlist');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="waitlist-modal-overlay" onClick={onClose}>
      <div className="waitlist-modal" onClick={(e) => e.stopPropagation()}>
        <button className="waitlist-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {!success ? (
          <>
            <div className="waitlist-modal-header">
              <div className="waitlist-badge">🔥 LIMITED DROP</div>
              <h2>Join the Waitlist</h2>
              <p>First drop SOLD OUT. Secure your spot for Feb 2.</p>
            </div>

            {spotsRemaining !== null && (
              <div className="waitlist-spots-banner">
                <Lock size={16} />
                <span>Only <strong>{spotsRemaining}</strong> spots left</span>
              </div>
            )}

            <div className="waitlist-product-preview">
              <img 
                src={product?.image || product?.images?.[0]} 
                alt={product?.name} 
              />
              <div className="preview-info">
                <span className="preview-name">{product?.name}</span>
                <span className="preview-variant">{product?.variant}</span>
                <div className="preview-price">
                  {product?.originalPrice && (
                    <span className="preview-original-price">${product.originalPrice}</span>
                  )}
                  <span className="preview-current-price">${product?.price}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="waitlist-form">
              <div className="waitlist-size-section">
                <div className="size-section-header">
                  <label>Select Size & Quantity</label>
                  <a 
                    href="/size-guide" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="size-guide-link"
                  >
                    Size Guide
                  </a>
                </div>
                
                <div className="size-selections-list">
                  {sizeSelections.map((selection, index) => (
                    <div key={index} className="size-selection-row">
                      <div className="size-select-wrapper">
                        <select 
                          value={selection.size}
                          onChange={(e) => updateSize(index, e.target.value)}
                          className="size-select"
                        >
                          {sizeOptions.map(size => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="quantity-controls">
                        <button 
                          type="button" 
                          className="qty-btn"
                          onClick={() => updateQuantity(index, -1)}
                          disabled={selection.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="qty-value">{selection.quantity}</span>
                        <button 
                          type="button" 
                          className="qty-btn"
                          onClick={() => updateQuantity(index, 1)}
                          disabled={selection.quantity >= 10}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {sizeSelections.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-size-btn"
                          onClick={() => removeSizeSelection(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button 
                  type="button" 
                  className="add-size-btn"
                  onClick={addSizeSelection}
                >
                  <Plus size={16} /> Add Another Size
                </button>
              </div>

              <div className="waitlist-email-section">
                <label>Email Address</label>
                <div className="email-input-wrapper no-icon">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className="waitlist-error">{error}</div>}

              <Button 
                type="submit" 
                className="waitlist-submit-btn"
                disabled={loading || !email}
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Joining...</>
                ) : (
                  <><Lock size={18} /> Secure My Spot</>
                )}
              </Button>

              <div className="waitlist-note">
                <p>No payment required today.</p>
                <p>Your selected item(s) and size(s) are reserved for you.</p>
                <p>We'll notify you as Feb 2 approaches to complete checkout.</p>
              </div>
            </form>
          </>
        ) : (
          <div className="waitlist-success">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h2>{result?.is_update ? "Updated! 🎉" : "You're In! 🎉"}</h2>
            <p className="success-message">
              {result?.is_update 
                ? "Your waitlist entry has been updated with the new items!"
                : "You've successfully joined the waitlist!"
              }
            </p>
            
            {result?.access_code && (
              <div className="access-code-box">
                <span className="access-label">Your Access Code</span>
                <span className="access-code">{result.access_code}</span>
                <span className="access-note">Save this code for early access checkout</span>
              </div>
            )}

            <div className="success-details">
              <p><strong>{product?.name}</strong></p>
              <p>{product?.variant}</p>
              <div className="success-sizes">
                {result?.total_items ? (
                  <p className="total-items-text">
                    <strong>{result.is_update ? "Total Items Reserved:" : "Items Reserved:"}</strong><br/>
                    {result.total_items}
                  </p>
                ) : (
                  sizeSelections.map((s, i) => (
                    <span key={i} className="success-size-tag">
                      {s.size} × {s.quantity}
                    </span>
                  ))
                )}
              </div>
            </div>

            <Button onClick={onClose} className="waitlist-done-btn">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default WaitlistModal;
