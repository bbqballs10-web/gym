import React, { createContext, useContext, useState, useEffect } from 'react';
import { pricing } from '../data/mock';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [sessionId] = useState(() => {
    // Generate or retrieve session ID
    const existing = localStorage.getItem('raze_session_id');
    if (existing) return existing;
    const newId = 'session_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('raze_session_id', newId);
    return newId;
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('raze_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('raze_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, color, size, quantity = 1) => {
    setCart(prev => {
      // Check if item already exists
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.color === color && item.size === size
      );

      if (existingIndex > -1) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        // Add new item - get image from product
        const productImage = product.images?.[0] || product.image || null;
        return [...prev, {
          productId: product.id,
          productName: product.name,
          variant: product.variant,
          category: product.category,
          color,
          size,
          quantity,
          price: product.price || 45, // Default to shirt price if not provided
          image: productImage
        }];
      }
    });
  };

  const removeFromCart = (productId, color, size) => {
    setCart(prev => prev.filter(
      item => !(item.productId === productId && item.color === color && item.size === size)
    ));
  };

  const updateQuantity = (productId, color, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setCart(prev => {
      const index = prev.findIndex(
        item => item.productId === productId && item.color === color && item.size === size
      );

      if (index > -1) {
        const updated = [...prev];
        updated[index].quantity = quantity;
        return updated;
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate totals with discount logic
  const getCartTotals = () => {
    let subtotal = 0;
    let discount = 0;
    let discountDescription = '';
    
    // Count shirts and shorts (case-insensitive)
    const shirtItems = cart.filter(item => 
      item.category?.toLowerCase() === 'shirts' || item.category?.toLowerCase() === 'shirt'
    );
    const shortsItems = cart.filter(item => 
      item.category?.toLowerCase() === 'shorts'
    );
    
    const totalShirts = shirtItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalShorts = shortsItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate base subtotal from all items
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    
    // Apply bundle discount: Shirt + Shorts = $69 (save $31)
    const bundleCount = Math.min(totalShirts, totalShorts);
    if (bundleCount > 0) {
      // Bundle price is $69 instead of $100 ($45 + $55)
      const bundleSavings = bundleCount * 31; // $31 savings per bundle
      discount += bundleSavings;
      discountDescription = `Shirt + Shorts Bundle (${bundleCount}x): -$${bundleSavings}`;
      
      // Remaining shirts after bundles
      const remainingShirts = totalShirts - bundleCount;
      
      // Apply shirt quantity discount on remaining shirts
      if (remainingShirts >= 3) {
        const shirtDiscount = (remainingShirts * pricing.shirt) * pricing.discounts.threeShirts;
        discount += shirtDiscount;
        discountDescription += ` | 35% off ${remainingShirts} shirts: -$${shirtDiscount.toFixed(2)}`;
      } else if (remainingShirts === 2) {
        const shirtDiscount = (remainingShirts * pricing.shirt) * pricing.discounts.twoShirts;
        discount += shirtDiscount;
        discountDescription += ` | 20% off 2 shirts: -$${shirtDiscount.toFixed(2)}`;
      }
    } else {
      // No bundles, apply shirt quantity discount
      if (totalShirts >= 3) {
        const shirtSubtotal = totalShirts * pricing.shirt;
        discount = shirtSubtotal * pricing.discounts.threeShirts;
        discountDescription = `35% off (3+ shirts): -$${discount.toFixed(2)}`;
      } else if (totalShirts === 2) {
        const shirtSubtotal = totalShirts * pricing.shirt;
        discount = shirtSubtotal * pricing.discounts.twoShirts;
        discountDescription = `20% off (2 shirts): -$${discount.toFixed(2)}`;
      }
    }
    
    const total = subtotal - discount;
    
    return {
      subtotal,
      discount,
      discountDescription,
      total,
      itemCount: getCartCount()
    };
  };

  // Legacy method for backward compatibility
  const getCartTotal = () => {
    return getCartTotals().total;
  };

  return (
    <CartContext.Provider value={{
      cart,
      sessionId,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      getCartTotals
    }}>
      {children}
    </CartContext.Provider>
  );
};