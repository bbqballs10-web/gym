// Generate random stock numbers per device (persisted in localStorage)
// Numbers between 1-15 to create urgency

const STORAGE_KEY = 'raze_stock_counts';

// Generate a random number between 1 and 15
const generateRandomStock = () => Math.floor(Math.random() * 15) + 1;

// Get or create stock counts for all products
export const getStockCount = (productId) => {
  try {
    let stockCounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    
    // If this product doesn't have a stock count yet, generate one
    if (!stockCounts[productId]) {
      stockCounts[productId] = generateRandomStock();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stockCounts));
    }
    
    return stockCounts[productId];
  } catch (e) {
    // If localStorage fails, just return a random number
    return generateRandomStock();
  }
};

// Initialize stock counts for multiple products at once
export const initializeStockCounts = (productIds) => {
  try {
    let stockCounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    let updated = false;
    
    productIds.forEach(id => {
      if (!stockCounts[id]) {
        stockCounts[id] = generateRandomStock();
        updated = true;
      }
    });
    
    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stockCounts));
    }
    
    return stockCounts;
  } catch (e) {
    // If localStorage fails, generate fresh counts
    const counts = {};
    productIds.forEach(id => {
      counts[id] = generateRandomStock();
    });
    return counts;
  }
};
