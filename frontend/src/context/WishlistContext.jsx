import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('raze_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('raze_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist(prev => {
      // Check if already in wishlist
      const exists = prev.some(item => 
        item.id === product.id && item.variant === product.variant
      );
      if (exists) return prev;
      
      return [...prev, {
        id: product.id,
        name: product.name,
        variant: product.variant,
        price: product.price,
        image: product.image,
        category: product.category,
        addedAt: new Date().toISOString()
      }];
    });
  };

  const removeFromWishlist = (productId, variant) => {
    setWishlist(prev => 
      prev.filter(item => !(item.id === productId && item.variant === variant))
    );
  };

  const isInWishlist = (productId, variant) => {
    return wishlist.some(item => 
      item.id === productId && item.variant === variant
    );
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id, product.variant)) {
      removeFromWishlist(product.id, product.variant);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
      wishlistCount: wishlist.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
