import React from 'react';
import { shirts, shorts } from '../data/mock';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';

const PostPurchaseUpsell = ({ purchasedItems = [] }) => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});

  // Get IDs of purchased items
  const purchasedIds = purchasedItems.map(item => item.id);

  // Filter out purchased items and get complementary products
  const allProducts = [...shirts, ...shorts];
  
  // Smart recommendations: if bought shirt, suggest shorts and vice versa
  const hasBoughtShirt = purchasedItems.some(item => item.category === 'Shirts');
  const hasBoughtShorts = purchasedItems.some(item => item.category === 'Shorts');

  let recommendations = [];
  
  if (hasBoughtShirt && !hasBoughtShorts) {
    // Suggest shorts
    recommendations = shorts.filter(p => !p.comingSoon).slice(0, 2);
  } else if (hasBoughtShorts && !hasBoughtShirt) {
    // Suggest shirts
    recommendations = shirts.slice(0, 2);
  } else {
    // Suggest mix of both, excluding purchased
    recommendations = allProducts
      .filter(p => !purchasedIds.includes(p.id) && !p.comingSoon)
      .slice(0, 3);
  }

  if (recommendations.length === 0) return null;

  const handleQuickAdd = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      colors: [{ name: product.variant, image: product.image }]
    }, product.variant, 'M', 1);
    
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="post-purchase-upsell">
      <div className="upsell-header">
        <h3>Complete Your Training Kit</h3>
        <p>Pair with these essentials</p>
      </div>

      <div className="upsell-products">
        {recommendations.map((product) => (
          <div key={product.id} className="upsell-card">
            <div className="upsell-image">
              <img src={product.image} alt={`${product.name} - ${product.variant}`} />
            </div>
            <div className="upsell-details">
              <span className="upsell-category">{product.category}</span>
              <span className="upsell-variant">{product.variant}</span>
              <span className="upsell-price">${product.price}</span>
            </div>
            <button 
              className={`upsell-add-btn ${addedItems[product.id] ? 'added' : ''}`}
              onClick={() => handleQuickAdd(product)}
              disabled={addedItems[product.id]}
            >
              {addedItems[product.id] ? (
                <>
                  <Check size={14} />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  Add
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPurchaseUpsell;
