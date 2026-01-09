import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shirts, shorts } from '../data/mock';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, Clock, Star, Flame, Heart, Lock } from 'lucide-react';
import UpsellModal from './UpsellModal';
import ProductModal from './ProductModal';
import WaitlistModal from './WaitlistModal';
import SanitizedImage from './SanitizedImage';
import { initializeStockCounts } from '../utils/stockUrgency';
import { formatPrice } from '../utils/currency';

// Products that should show "Only X left" urgency badge
const URGENCY_PRODUCT_IDS = [1, 3, 5]; // Black/Cyan shirt, Grey/Cyan shirt, Black/Cyan shorts

// WAITLIST MODE - Set to true to enable waitlist instead of cart
const WAITLIST_MODE = true;

const ProductCategories = () => {
  const { t, i18n } = useTranslation();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedGender, setSelectedGender] = useState({}); // Track Men's/Women's selection for shorts
  const [addedToCart, setAddedToCart] = useState({});
  const [upsellModal, setUpsellModal] = useState({ isOpen: false, product: null });
  const [productModal, setProductModal] = useState({ isOpen: false, product: null });
  const [waitlistModal, setWaitlistModal] = useState({ isOpen: false, product: null });
  const [stockCounts, setStockCounts] = useState({});
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Find the highest sold count within each category (best seller per category)
  const highestShirtSoldCount = Math.max(...shirts.map(p => p.soldCount || 0));
  const highestShortSoldCount = Math.max(...shorts.map(p => p.soldCount || 0));

  // Initialize stock counts on mount (only for urgency products)
  useEffect(() => {
    const counts = initializeStockCounts(URGENCY_PRODUCT_IDS);
    setStockCounts(counts);
  }, []);

  // Check if product should show urgency badge
  const shouldShowUrgency = (productId) => URGENCY_PRODUCT_IDS.includes(productId);
  
  // Check if shirt is best seller (within shirts category)
  const isShirtBestSeller = (soldCount) => soldCount === highestShirtSoldCount;
  
  // Check if short is best seller (within shorts category)
  const isShortBestSeller = (soldCount) => soldCount === highestShortSoldCount;

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleGenderSelect = (productId, gender) => {
    setSelectedGender(prev => ({
      ...prev,
      [productId]: gender
    }));
    // Reset size selection when gender changes
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: gender === 'mens' ? 'M' : 'S'
    }));
  };

  const handleProductClick = (product) => {
    setProductModal({ isOpen: true, product });
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      variant: product.variant,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  const handleJoinWaitlist = (product) => {
    setWaitlistModal({ isOpen: true, product: {
      ...product,
      sizes: product.sizes || ['XS', 'S', 'M', 'L', 'XL']
    }});
  };

  const handleAddToCart = (product, isShirt = true) => {
    // In waitlist mode, open waitlist modal instead
    if (WAITLIST_MODE) {
      handleJoinWaitlist(product);
      return;
    }
    
    const selectedSize = selectedSizes[product.id] || 'M';
    
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      colors: [{ name: product.variant, hex: product.hex, image: product.image }]
    }, product.variant, selectedSize, 1);
    
    // Show feedback
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 1500);

    // Show upsell modal only for shirts
    if (isShirt) {
      setUpsellModal({ isOpen: true, product: product });
    }
  };

  const handleUpsellAddShorts = (shortsProduct) => {
    const selectedSize = selectedSizes[shortsProduct.id] || 'M';
    
    // Add shorts at full price - cart will apply bundle discount
    addToCart({
      id: shortsProduct.id,
      name: shortsProduct.name,
      category: shortsProduct.category,
      price: shortsProduct.price, // Full price $55, cart applies bundle discount
      colors: [{ name: shortsProduct.variant, hex: shortsProduct.hex, image: shortsProduct.image }]
    }, shortsProduct.variant, selectedSize, 1);
  };

  return (
    <section className="collection-section" id="collection">
      <div className="container">
        {/* Section Header */}
        <div className="collection-header">
          <h2 className="collection-title">THE COLLECTION</h2>
          <p className="collection-subtitle">Performance pieces built for discipline</p>
        </div>

        {/* Single focused bundle banner */}
        <div className="bundle-banner">
          <div className="bundle-banner-content">
            <span className="bundle-main">Complete the set — Performance Shirt + Shorts for <span className="bundle-original-price">{formatPrice(100, i18n.language)}</span> <strong>{formatPrice(69, i18n.language)}</strong></span>
            <span className="bundle-subtext">Built to move together. Save {formatPrice(31, i18n.language)}.</span>
          </div>
        </div>

        {/* ROW 1: Performance T-Shirts */}
        <div className="product-row">
          <h3 className="row-title">Performance T-Shirts</h3>
          <div className="product-grid shirts-grid">
            {shirts.map((shirt, index) => {
              const selectedSize = selectedSizes[shirt.id] || 'M';
              const isAdded = addedToCart[shirt.id];
              const isMostPopular = index === 0; // Black/Cyan is first and most popular
              const isBlackShirt = shirt.color === 'Black';
              
              return (
                <div key={shirt.id} className={`product-card ${isMostPopular ? 'most-popular' : ''} ${isBlackShirt ? 'black-product' : ''}`}>
                  {/* Most Popular badge for Black/Cyan only */}
                  {isMostPopular && (
                    <div className="popular-badge">
                      <Star size={12} fill="currentColor" /> Most Popular
                    </div>
                  )}
                  
                  {/* Wishlist heart button */}
                  <button 
                    className={`wishlist-heart ${isInWishlist(shirt.id, shirt.variant) ? 'active' : ''}`}
                    onClick={(e) => handleWishlistToggle(e, shirt)}
                    title={isInWishlist(shirt.id, shirt.variant) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={18} fill={isInWishlist(shirt.id, shirt.variant) ? 'currentColor' : 'none'} />
                  </button>
                  
                  <div 
                    className="product-image-wrapper clickable"
                    onClick={() => handleProductClick(shirt)}
                  >
                    <SanitizedImage 
                      src={shirt.image} 
                      alt={`${shirt.name} - ${shirt.variant}`}
                      className="product-image"
                      lazy={true}
                    />
                    <div className="view-details-hint">Click to view</div>
                  </div>
                  
                  <div className="product-info">
                    <div className="product-variant">{shirt.variant}</div>
                    <div className="product-price-row">
                      {shirt.price < 65 && (
                        <span className="product-original-price">{formatPrice(65, i18n.language)}</span>
                      )}
                      <span className="product-price">{formatPrice(shirt.price, i18n.language)}</span>
                      {/* Stock urgency removed - sold out/waitlist only */}
                    </div>
                    
                    {/* Sold Count */}
                    {shirt.soldCount && (
                      <div className={`product-sold-count ${isShirtBestSeller(shirt.soldCount) ? 'best-seller' : ''}`}>
                        {isShirtBestSeller(shirt.soldCount) && <span className="sold-icon">🔥</span>} {t('product.soldCount', { count: shirt.soldCount.toLocaleString() })}
                      </div>
                    )}
                    
                    {/* Size Selector */}
                    <div className="size-selector">
                      {shirt.sizes.map((size) => (
                        <button
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                          onClick={() => handleSizeSelect(shirt.id, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {/* Join Waitlist */}
                    <button 
                      className={`btn-add-to-cart ${isAdded ? 'added' : ''} waitlist-btn`}
                      onClick={() => handleAddToCart(shirt, true)}
                    >
                      <Lock size={16} /> {t('product.joinWaitlist')}
                    </button>

                    {/* Bundle nudge */}
                    <p className="bundle-upsell">
                      Pair with matching shorts — <span className="bundle-link">Bundle for {formatPrice(69, i18n.language)}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Performance Shorts with Men's/Women's Toggle */}
        <div className="product-row shorts-row">
          <h3 className="row-title">Performance Shorts</h3>
          <p className="row-subtitle">Designed for full-range movement — built to match Performance T-Shirts</p>
          
          <div className="product-grid shorts-grid">
            {shorts.map((short) => {
              const gender = selectedGender[short.id] || 'mens';
              const sizes = gender === 'mens' ? short.mensSizes : short.womensSizes;
              const selectedSize = selectedSizes[short.id] || (gender === 'mens' ? 'M' : 'S');
              const isAdded = addedToCart[short.id];
              const isComingSoon = short.status === 'coming_soon';
              const isBlackShort = short.color === 'Black';
              
              return (
                <div key={short.id} className={`product-card ${isComingSoon ? 'coming-soon' : ''} ${isBlackShort ? 'black-product' : ''}`}>
                  {/* Wishlist heart button - only for available products */}
                  {!isComingSoon && (
                    <button 
                      className={`wishlist-heart ${isInWishlist(short.id, short.variant) ? 'active' : ''}`}
                      onClick={(e) => handleWishlistToggle(e, short)}
                      title={isInWishlist(short.id, short.variant) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart size={18} fill={isInWishlist(short.id, short.variant) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                  
                  <div 
                    className={`product-image-wrapper ${!isComingSoon ? 'clickable' : ''}`}
                    onClick={() => !isComingSoon && handleProductClick(short)}
                  >
                    {short.image ? (
                      <SanitizedImage 
                        src={short.image} 
                        alt={`${short.name} - ${short.variant}`}
                        className="product-image"
                        lazy={true}
                      />
                    ) : (
                      <div className="product-placeholder">
                        <div className="placeholder-content">
                          <Clock size={32} />
                          <span>Coming Soon</span>
                        </div>
                      </div>
                    )}
                    {!isComingSoon && <div className="view-details-hint">Click to view</div>}
                  </div>
                  
                  <div className="product-info">
                    <div className="product-variant">{short.variant}</div>
                    <div className="product-price-row">
                      {short.price < 75 && (
                        <span className="product-original-price">{formatPrice(75, i18n.language)}</span>
                      )}
                      <span className="product-price">{formatPrice(short.price, i18n.language)}</span>
                    </div>
                    
                    {/* Sold Count */}
                    {short.soldCount && !isComingSoon && (
                      <div className={`product-sold-count ${isShortBestSeller(short.soldCount) ? 'best-seller' : ''}`}>
                        {isShortBestSeller(short.soldCount) && <span className="sold-icon">🔥</span>} {t('product.soldCount', { count: short.soldCount.toLocaleString() })}
                      </div>
                    )}
                    
                    {/* Size Selector */}
                    <div className="size-selector">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'active' : ''} ${isComingSoon ? 'disabled' : ''}`}
                          onClick={() => !isComingSoon && handleSizeSelect(short.id, size)}
                          disabled={isComingSoon}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {/* Coming Soon / Join Waitlist */}
                    {isComingSoon ? (
                      <button className="btn-coming-soon" disabled>
                        <Clock size={16} /> {t('product.comingSoon')}
                      </button>
                    ) : (
                      <button 
                        className="btn-add-to-cart waitlist-btn"
                        onClick={() => handleAddToCart(short, false)}
                      >
                        <Lock size={16} /> {t('product.joinWaitlist')}
                      </button>
                    )}

                    {/* Bundle nudge */}
                    <p className="bundle-upsell">
                      Complete the set — <span className="bundle-link">Bundle for {formatPrice(69, i18n.language)}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upsell Modal */}
      <UpsellModal 
        isOpen={upsellModal.isOpen}
        onClose={() => setUpsellModal({ isOpen: false, product: null })}
        onAddShorts={handleUpsellAddShorts}
        addedProduct={upsellModal.product}
      />

      {/* Product Detail Modal */}
      <ProductModal
        isOpen={productModal.isOpen}
        onClose={() => setProductModal({ isOpen: false, product: null })}
        product={productModal.product}
      />

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistModal.isOpen}
        onClose={() => setWaitlistModal({ isOpen: false, product: null })}
        product={waitlistModal.product}
      />
    </section>
  );
};

export default ProductCategories;
