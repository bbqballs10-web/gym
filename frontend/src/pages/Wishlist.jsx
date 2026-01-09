import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      colors: [{ name: item.variant, image: item.image }]
    }, item.variant, 'M', 1);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-empty">
            <Heart size={64} strokeWidth={1} />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love by clicking the heart icon</p>
            <Link to="/">
              <Button className="btn-primary">
                Browse Collection
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <span className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={`${item.id}-${item.variant}`} className="wishlist-card">
              <div className="wishlist-image">
                <img src={item.image} alt={`${item.name} - ${item.variant}`} />
                <button 
                  className="wishlist-remove"
                  onClick={() => removeFromWishlist(item.id, item.variant)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="wishlist-info">
                <div className="wishlist-name">{item.name}</div>
                <div className="wishlist-variant">{item.variant}</div>
                <div className="wishlist-price">${item.price}</div>
                <Button 
                  className="btn-secondary wishlist-add-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingBag size={14} />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="wishlist-actions">
          <Link to="/">
            <Button className="btn-secondary">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
