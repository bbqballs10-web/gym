import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { Lock, CreditCard, Tag, Check, X, Wallet, Bitcoin } from 'lucide-react';
import ShippingOptions from '../components/ShippingOptions';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotals, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fallback: Use localStorage cart if context cart is empty (handles page refresh)
  const [localCart, setLocalCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  
  useEffect(() => {
    // Try to load from localStorage if context is empty
    if (cart.length === 0) {
      const savedCart = localStorage.getItem('raze_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            setLocalCart(parsedCart);
          }
        } catch (e) {
          console.error('Failed to parse cart:', e);
        }
      }
    }
    setIsLoading(false);
  }, [cart.length]);
  
  // Use whichever cart has items
  const effectiveCart = cart.length > 0 ? cart : localCart;
  
  // Redirect to cart if no items (after loading)
  useEffect(() => {
    if (!isLoading && effectiveCart.length === 0) {
      navigate('/cart');
    }
  }, [isLoading, effectiveCart.length, navigate]);

  const [shippingInfo, setShippingInfo] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });

  const [createAccount, setCreateAccount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedShippingRate, setSelectedShippingRate] = useState(null);

  // Calculate cart totals - use context method if cart has items, otherwise calculate from localCart
  const calculateLocalTotals = () => {
    let subtotal = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    let discountDescription = '';
    
    // Count shirts for discount calculation
    const shirtItems = localCart.filter(item => item.category === 'Shirts');
    const totalShirts = shirtItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Apply discount logic
    if (totalShirts >= 3) {
      discount = subtotal * 0.35;
      discountDescription = `35% off (3+ shirts): -$${discount.toFixed(2)}`;
    } else if (totalShirts === 2) {
      discount = subtotal * 0.20;
      discountDescription = `20% off (2 shirts): -$${discount.toFixed(2)}`;
    }
    
    return {
      subtotal,
      discount,
      discountDescription,
      total: subtotal - discount
    };
  };
  
  const cartTotals = cart.length > 0 ? getCartTotals() : calculateLocalTotals();
  
  // Dynamic shipping cost from selected rate, or fallback to $15
  const shipping = selectedShippingRate ? selectedShippingRate.amount : 15;
  
  // Calculate promo discount
  const promoDiscount = appliedPromo ? appliedPromo.discount_amount : 0;
  const totalBeforePromo = cartTotals.total + shipping;
  const total = totalBeforePromo - promoDiscount;

  // Promo code handlers
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setPromoLoading(true);
    setPromoError('');
    
    try {
      const response = await fetch(`${API_URL}/api/promo/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.trim().toUpperCase(),
          subtotal: cartTotals.total
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        setAppliedPromo(data);
        setPromoError('');
        toast({
          title: "Promo code applied!",
          description: data.discount_display
        });
      } else {
        setPromoError(data.detail || 'Invalid promo code');
        setAppliedPromo(null);
      }
    } catch (err) {
      setPromoError('Failed to validate code');
      setAppliedPromo(null);
    }
    
    setPromoLoading(false);
  };
  
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Calculate total discount (bulk + promo)
      const totalDiscount = cartTotals.discount + promoDiscount;
      let discountDesc = cartTotals.discountDescription || '';
      if (appliedPromo) {
        discountDesc = discountDesc 
          ? `${discountDesc} + ${appliedPromo.discount_display} (${appliedPromo.code})`
          : `${appliedPromo.discount_display} (${appliedPromo.code})`;
      }
      
      // Prepare checkout data for Stripe
      const checkoutData = {
        items: effectiveCart.map(item => ({
          product_id: item.productId,
          product_name: item.productName,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shipping: {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address_line1: shippingInfo.address,
          address_line2: '',
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.zipCode,
          country: 'US'
        },
        subtotal: cartTotals.subtotal,
        discount: totalDiscount,
        discount_description: discountDesc || null,
        promo_code: appliedPromo?.code || null,
        shipping_cost: shipping,
        total: total,
        origin_url: window.location.origin
      };

      // Mark promo code as used
      if (appliedPromo) {
        await fetch(`${API_URL}/api/promo/use`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: appliedPromo.code, subtotal: cartTotals.total })
        });
      }

      // Create Stripe checkout session
      const response = await fetch(`${API_URL}/api/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
      });

      const data = await response.json();

      if (data.success && data.checkout_url) {
        // Store session info for later retrieval
        localStorage.setItem('raze_checkout_session', data.session_id);
        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        throw new Error(data.detail || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout. Please try again.');
      toast({
        title: "Checkout Error",
        description: err.message || 'Failed to process checkout',
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  // Show loading state while checking cart
  if (isLoading) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-grid">
          {/* Shipping Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h2 className="section-title">Contact Information</h2>
                <div className="form-field">
                  <label htmlFor="email" className="form-label">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Shipping Address</h2>
                
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="address" className="form-label">Address</label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="city" className="form-label">City</label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="state" className="form-label">State</label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Shipping Options from Shippo */}
              <div className="form-section">
                <ShippingOptions 
                  shippingAddress={{
                    first_name: shippingInfo.firstName,
                    last_name: shippingInfo.lastName,
                    email: shippingInfo.email,
                    phone: shippingInfo.phone,
                    address_line1: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    postal_code: shippingInfo.zipCode,
                    country: 'US'
                  }}
                  onRateSelect={setSelectedShippingRate}
                  selectedRate={selectedShippingRate}
                />
              </div>

              {!user && (
                <div className="form-section">
                  <div className="checkbox-field">
                    <input
                      type="checkbox"
                      id="createAccount"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="checkbox-input"
                    />
                    <label htmlFor="createAccount" className="checkbox-label">
                      Create account to track order and get 10% off next time
                    </label>
                  </div>
                </div>
              )}

              <div className="form-section">
                <h2 className="section-title">Payment</h2>
                
                {/* Payment Method Icons */}
                <div className="payment-methods">
                  <div className="payment-method-icons">
                    <div className="payment-icon" title="Credit/Debit Card">
                      <CreditCard size={24} />
                    </div>
                    <div className="payment-icon apple-pay" title="Apple Pay">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M17.72 7.21c-.09-.67-.45-1.31-.98-1.75-.53-.44-1.21-.66-1.91-.6-.64.06-1.23.35-1.7.81-.46.46-.73 1.05-.78 1.69.04.68.32 1.31.79 1.79.47.48 1.1.76 1.78.79.67-.03 1.31-.29 1.8-.74.49-.45.82-1.06.95-1.72l.05-.27zM13.08 10.5c-.47.28-.86.66-1.15 1.12-.29.46-.47.98-.53 1.51.02.59.19 1.17.49 1.67.3.5.73.91 1.23 1.19.51.28 1.08.42 1.66.41.54-.02 1.07-.17 1.53-.44-.02-.59-.19-1.17-.49-1.67-.3-.5-.72-.91-1.23-1.2-.5-.28-1.07-.43-1.65-.41-.54.01-1.06.16-1.52.44-.31-.93-.34-1.95-.08-2.89.26-.94.78-1.78 1.49-2.43-.41-.47-.93-.83-1.51-1.05-.58-.22-1.21-.29-1.83-.22-.79.09-1.52.45-2.08.99-.56.54-.93 1.24-1.05 2.01-.12.77 0 1.55.35 2.24.35.69.9 1.26 1.57 1.63z"/>
                      </svg>
                    </div>
                    <div className="payment-icon google-pay" title="Google Pay">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                      </svg>
                    </div>
                    <div className="payment-icon crypto" title="Crypto (Coming Soon)">
                      <Bitcoin size={24} />
                    </div>
                  </div>
                  <p className="payment-methods-note">
                    All payment methods available at checkout
                  </p>
                </div>
                
                <div className="stripe-payment-info">
                  <div className="stripe-badge">
                    <Lock size={16} />
                    <span>Secure checkout powered by Stripe</span>
                  </div>
                  <p className="payment-note">
                    Apple Pay, Google Pay, and all major cards accepted. You'll be redirected to complete payment securely.
                  </p>
                </div>
              </div>

              {error && (
                <div className="checkout-error">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="btn-primary btn-large"
                disabled={isProcessing}
              >
                {isProcessing ? 'Redirecting to Stripe...' : `Pay $${total.toFixed(2)} with Stripe`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-items">
              {effectiveCart.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="summary-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} />
                    ) : (
                      <div className="summary-item-placeholder"></div>
                    )}
                  </div>
                  <div className="summary-item-details">
                    <p className="summary-item-name">{item.productName}</p>
                    <p className="summary-item-variant">{item.color} / {item.size}</p>
                    <p className="summary-item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <div className="summary-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="promo-code-section">
              <label className="promo-label">
                <Tag size={16} />
                Promo Code
              </label>
              {appliedPromo ? (
                <div className="promo-applied">
                  <div className="promo-applied-info">
                    <Check size={16} className="promo-check" />
                    <span className="promo-applied-code">{appliedPromo.code}</span>
                    <span className="promo-applied-discount">{appliedPromo.discount_display}</span>
                  </div>
                  <button 
                    type="button" 
                    className="promo-remove-btn"
                    onClick={handleRemovePromo}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="promo-input-group">
                  <Input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="promo-input"
                    disabled={promoLoading}
                  />
                  <Button 
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode.trim()}
                    className="promo-apply-btn"
                  >
                    {promoLoading ? '...' : 'Apply'}
                  </Button>
                </div>
              )}
              {promoError && (
                <p className="promo-error">{promoError}</p>
              )}
            </div>

            <div className="summary-totals">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${cartTotals.subtotal.toFixed(2)}</span>
              </div>

              {cartTotals.discount > 0 && (
                <div className="summary-line discount">
                  <span>{cartTotals.discountDescription || 'Bulk Discount'}</span>
                  <span>-${cartTotals.discount.toFixed(2)}</span>
                </div>
              )}

              {appliedPromo && (
                <div className="summary-line discount">
                  <span>Promo ({appliedPromo.code})</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-line">
                <span>Shipping {selectedShippingRate ? `(${selectedShippingRate.provider})` : ''}</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-line summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;