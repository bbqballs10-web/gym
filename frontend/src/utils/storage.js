/**
 * RAZE Storage Utility
 * Single point of access for all localStorage operations
 * Can be swapped for backend API later
 */

const STORAGE_KEYS = {
  // Early Access Popup
  POPUP_LAST_SEEN: 'raze_popup_last_seen',
  POPUP_DISMISSED: 'raze_popup_dismissed',
  
  // Giveaway Popup
  GIVEAWAY_LAST_SEEN: 'raze_giveaway_last_seen',
  GIVEAWAY_DISMISSED: 'raze_giveaway_dismissed',
  
  // Email lists
  EARLY_ACCESS_EMAILS: 'raze_early_access_emails',
  GIVEAWAY_EMAILS: 'raze_giveaway_emails',
  DROP_NOTIFY_EMAILS: 'raze_drop_notify_emails',
  
  // User & Auth
  USER: 'raze_user',
  USED_LAUNCH_BENEFITS: 'raze_used_launch_benefits',
  
  // Cart
  CART: 'raze_cart'
};

// ============================================
// POPUP MANAGEMENT
// ============================================

export const popup = {
  COOLDOWN_DAYS: 14,
  TRIGGER_DELAY_MS: 7000,

  shouldShow: () => {
    const lastSeen = localStorage.getItem(STORAGE_KEYS.POPUP_LAST_SEEN);
    const dismissed = localStorage.getItem(STORAGE_KEYS.POPUP_DISMISSED);
    
    if (!dismissed || dismissed !== 'true') return true;
    if (!lastSeen) return true;
    
    const cooldownMs = popup.COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    const lastSeenTime = parseInt(lastSeen, 10);
    return Date.now() - lastSeenTime >= cooldownMs;
  },

  markShown: () => {
    localStorage.setItem(STORAGE_KEYS.POPUP_LAST_SEEN, Date.now().toString());
  },

  markDismissed: () => {
    localStorage.setItem(STORAGE_KEYS.POPUP_DISMISSED, 'true');
    localStorage.setItem(STORAGE_KEYS.POPUP_LAST_SEEN, Date.now().toString());
  }
};

// ============================================
// GIVEAWAY POPUP MANAGEMENT
// ============================================

export const giveawayPopup = {
  COOLDOWN_DAYS: 14,
  TRIGGER_DELAY_MS: 4000, // 4 seconds

  shouldShow: () => {
    const lastSeen = localStorage.getItem(STORAGE_KEYS.GIVEAWAY_LAST_SEEN);
    const dismissed = localStorage.getItem(STORAGE_KEYS.GIVEAWAY_DISMISSED);
    
    if (!dismissed || dismissed !== 'true') return true;
    if (!lastSeen) return true;
    
    const cooldownMs = giveawayPopup.COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    const lastSeenTime = parseInt(lastSeen, 10);
    return Date.now() - lastSeenTime >= cooldownMs;
  },

  markShown: () => {
    localStorage.setItem(STORAGE_KEYS.GIVEAWAY_LAST_SEEN, Date.now().toString());
  },

  markDismissed: () => {
    localStorage.setItem(STORAGE_KEYS.GIVEAWAY_DISMISSED, 'true');
    localStorage.setItem(STORAGE_KEYS.GIVEAWAY_LAST_SEEN, Date.now().toString());
  }
};

// ============================================
// EMAIL MANAGEMENT (Backend API)
// ============================================

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const emails = {
  // Early Access emails (from popup)
  addEarlyAccess: async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/emails/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'early_access'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, reason: 'duplicate' };
      }
    } catch (error) {
      console.error('Email subscription error:', error);
      // Fallback to localStorage if API fails
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.EARLY_ACCESS_EMAILS) || '[]');
      if (list.some(item => item.email === email)) {
        return { success: false, reason: 'duplicate' };
      }
      list.push({ email, source: 'early_access', timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEYS.EARLY_ACCESS_EMAILS, JSON.stringify(list));
      return { success: true };
    }
  },

  getEarlyAccessList: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EARLY_ACCESS_EMAILS) || '[]');
  },

  // Giveaway emails (from giveaway popup)
  addGiveaway: async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/emails/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'giveaway_popup'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, reason: 'duplicate' };
      }
    } catch (error) {
      console.error('Email subscription error:', error);
      // Fallback to localStorage if API fails
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.GIVEAWAY_EMAILS) || '[]');
      if (list.some(item => item.email === email)) {
        return { success: false, reason: 'duplicate' };
      }
      list.push({ email, source: 'giveaway_popup', timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEYS.GIVEAWAY_EMAILS, JSON.stringify(list));
      return { success: true };
    }
  },

  getGiveawayList: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GIVEAWAY_EMAILS) || '[]');
  },

  // Drop Notify emails (from Notify Me button)
  addDropNotify: async (email, productId, productName) => {
    try {
      const response = await fetch(`${API_URL}/api/emails/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'notify_me',
          product_id: String(productId),
          product_name: productName,
          drop: 'Drop 01'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', errorData);
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, reason: 'duplicate' };
      }
    } catch (error) {
      console.error('Email subscription error:', error);
      // Fallback to localStorage if API fails
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.DROP_NOTIFY_EMAILS) || '[]');
      if (list.some(item => item.email === email && item.productId === productId)) {
        return { success: false, reason: 'duplicate' };
      }
      list.push({ email, productId, productName, drop: 'Drop 01', source: 'notify_me', timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEYS.DROP_NOTIFY_EMAILS, JSON.stringify(list));
      return { success: true };
    }
  },

  getDropNotifyList: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DROP_NOTIFY_EMAILS) || '[]');
  }
};

// ============================================
// USER & BENEFITS MANAGEMENT
// ============================================

export const user = {
  get: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  set: (userData) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Launch benefit (10% off first order)
  hasLaunchBenefit: (email) => {
    const usedList = JSON.parse(localStorage.getItem(STORAGE_KEYS.USED_LAUNCH_BENEFITS) || '[]');
    return !usedList.includes(email);
  },

  useLaunchBenefit: (email) => {
    const usedList = JSON.parse(localStorage.getItem(STORAGE_KEYS.USED_LAUNCH_BENEFITS) || '[]');
    if (!usedList.includes(email)) {
      usedList.push(email);
      localStorage.setItem(STORAGE_KEYS.USED_LAUNCH_BENEFITS, JSON.stringify(usedList));
    }
  },

  // RAZE Credit (3% of subtotal)
  CREDIT_RATE: 0.03,

  getRazeCredit: () => {
    const userData = user.get();
    return userData?.razeCredit || 0;
  },

  addRazeCredit: (subtotal) => {
    const userData = user.get();
    if (!userData) return 0;
    
    const creditEarned = Math.floor(subtotal * user.CREDIT_RATE * 100) / 100;
    userData.razeCredit = (userData.razeCredit || 0) + creditEarned;
    user.set(userData);
    return creditEarned;
  },

  useRazeCredit: (amount) => {
    const userData = user.get();
    if (!userData || (userData.razeCredit || 0) < amount) return false;
    
    userData.razeCredit = Math.max(0, (userData.razeCredit || 0) - amount);
    user.set(userData);
    return true;
  }
};

// ============================================
// CART MANAGEMENT
// ============================================

export const cart = {
  get: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  },

  set: (items) => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.CART);
  }
};

export default {
  STORAGE_KEYS,
  popup,
  giveawayPopup,
  emails,
  user,
  cart
};
