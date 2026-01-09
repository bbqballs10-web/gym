import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, checkStock } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft, Heart, Truck, Lock } from 'lucide-react';
import WaitlistModal from '../components/WaitlistModal';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(parseInt(id, 10));
  const { addToCart } = useCart();
  const { user, hasFirstOrderDiscount } = useAuth();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="not-found">
            <p>Product not found</p>
            <Button onClick={() => navigate('/products')} className="btn-secondary">
              <ArrowLeft size={16} /> Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Select a size",
        description: "Please choose a size before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    const stock = product.stock?.[selectedSize] || 0;
    if (stock < quantity) {
      toast({
        title: "Low stock",
        description: stock === 0 ? "This size is out of stock" : `Only ${stock} available in ${selectedSize}`,
        variant: "destructive"
      });
      return;
    }

    addToCart(product, product.color, selectedSize, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} (${product.variant}, ${selectedSize}) added to cart.`
    });
  };

  const handleJoinWaitlist = () => {
    setWaitlistOpen(true);
  };

  const currentImage = product.images?.[currentImageIndex] || product.images?.[0];

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Back button */}
        <button className="back-link" onClick={() => navigate('/products')}>
          <ArrowLeft size={18} /> Back to Products
        </button>

        <div className="product-detail-grid">
          {/* Product Image */}
          <div className="product-detail-image-section">
            <div className="main-image-wrapper">
              {currentImage ? (
                <img 
                  src={currentImage} 
                  alt={product.name}
                  className="product-detail-image"
                />
              ) : (
                <div className="product-detail-placeholder">
                  <span>Image coming soon</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail gallery */}
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-gallery">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumbnail-btn ${currentImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-detail-info-section">
            <div className="product-detail-header">
              <span className="product-category-label">{product.category?.toUpperCase()}</span>
              <h1 className="product-detail-title">{product.name}</h1>
              <p className="product-variant-label">{product.variant}</p>
              <div className="product-detail-price">
                {product.originalPrice && (
                  <span className="original-price">${product.originalPrice}</span>
                )}
                <span className="current-price">${product.price}</span>
              </div>
            </div>

            <p className="product-detail-description">{product.description}</p>

            {/* Color Display */}
            <div className="product-detail-section">
              <label className="product-detail-label">
                Color: <span className="selected-value">{product.variant}</span>
              </label>
              <div className="color-display">
                <div 
                  className="color-swatch active"
                  style={{ 
                    backgroundColor: product.color === 'Black' ? '#1a1a1a' : '#666'
                  }}
                />
              </div>
            </div>

            {/* Size Selection */}
            <div className="product-detail-section">
              <div className="size-header">
                <label className="product-detail-label">
                  Size: {selectedSize && <span className="selected-value">{selectedSize}</span>}
                </label>
                <button 
                  className="size-guide-link" 
                  onClick={() => {
                    // Navigate to size guide with the correct tab
                    let tab = 'tshirt';
                    if (product.type === 'shorts') {
                      tab = product.gender === 'womens' ? 'shorts-womens' : 'shorts-mens';
                    }
                    navigate(`/size-guide?tab=${tab}`);
                  }}
                >
                  Size Guide
                </button>
              </div>
              <div className="size-selector-detail">
                {product.sizes?.map((size) => {
                  const stock = product.stock?.[size] || 0;
                  const isLowStock = stock > 0 && stock < 5;
                  const isOutOfStock = stock === 0;

                  return (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                    >
                      <span className="size-label">{size}</span>
                      {isLowStock && !isOutOfStock && (
                        <span className="stock-indicator">Low</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* First Order Discount Notice */}
            {user && hasFirstOrderDiscount && hasFirstOrderDiscount() && (
              <div className="discount-notice">
                <p>🎉 First order discount: Use code <strong>{user.first_order_discount_code}</strong> at checkout for 10% off!</p>
              </div>
            )}

            {/* Add to Cart or Join Waitlist */}
            <div className="product-detail-actions">
              {product.inStock ? (
                <>
                  <div className="quantity-control">
                    <button 
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <Button 
                    className="btn-primary btn-large btn-add-cart"
                    onClick={handleAddToCart}
                  >
                    Add to Cart — ${(product.price * quantity).toFixed(2)}
                  </Button>
                </>
              ) : (
                <Button 
                  className="btn-waitlist btn-large"
                  onClick={handleJoinWaitlist}
                >
                  <Lock size={16} /> Join Waitlist
                </Button>
              )}
            </div>

            {/* Shipping info */}
            <div className="shipping-info">
              <Truck size={18} />
              <span>Free shipping on orders over $100 USD</span>
            </div>

            {/* Product Details */}
            <div className="product-details-list">
              <h3 className="details-heading">Details</h3>
              <ul>
                {product.category === 'shorts' ? (
                  <>
                    <li>Engineered for unrestricted hip mobility and deep range of motion</li>
                    <li>Designed to move freely through squats, lunges, and dynamic training</li>
                    <li>Secure athletic fit that stays in place during explosive movement</li>
                    <li>Lightweight, breathable fabric for high-output sessions</li>
                    <li>Durable construction that maintains structure and fit after repeated washes</li>
                  </>
                ) : (
                  <>
                    <li>Technical fabric designed for training</li>
                    <li>Minimal RAZE branding with {product.logo} logo</li>
                    <li>Built for movement and flexibility</li>
                    <li>Machine washable</li>
                    <li>Worldwide shipping available</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetail;
