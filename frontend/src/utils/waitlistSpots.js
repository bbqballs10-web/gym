// Shared waitlist spots calculation logic
// Used by both WaitlistBanner and WaitlistModal to ensure consistency

export const calculateSpotsRemaining = () => {
  const STORAGE_KEY = 'raze_waitlist_spots';
  const TIMESTAMP_KEY = 'raze_waitlist_timestamp';
  
  const now = Date.now();
  const stored = localStorage.getItem(STORAGE_KEY);
  const timestamp = localStorage.getItem(TIMESTAMP_KEY);
  
  // If no stored data, generate new random spot (51-89)
  if (!stored || !timestamp) {
    const initialSpots = Math.floor(Math.random() * 39) + 51; // 51-89
    localStorage.setItem(STORAGE_KEY, initialSpots.toString());
    localStorage.setItem(TIMESTAMP_KEY, now.toString());
    return initialSpots;
  }
  
  // Check if 2 hours (7200000ms) have passed since LAST reload
  const timeDiff = now - parseInt(timestamp);
  const twoHours = 2 * 60 * 60 * 1000; // 7200000ms
  
  // If 2+ hours passed, decrease by 2 and update timestamp
  if (timeDiff >= twoHours) {
    const currentSpots = parseInt(stored);
    const newSpots = Math.max(1, currentSpots - 2);
    
    localStorage.setItem(STORAGE_KEY, newSpots.toString());
    localStorage.setItem(TIMESTAMP_KEY, now.toString()); // Reset timestamp to NOW
    return newSpots;
  }
  
  // If less than 2 hours, just return stored spots (no change)
  return parseInt(stored);
};
