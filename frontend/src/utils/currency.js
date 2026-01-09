// Currency configuration based on language/region
// Base prices are in USD, converted to local currencies

const currencyConfig = {
  en: { code: 'USD', symbol: '$', position: 'before', rate: 1 },
  es: { code: 'EUR', symbol: '€', position: 'after', rate: 0.92 },
  fr: { code: 'EUR', symbol: '€', position: 'after', rate: 0.92 },
  de: { code: 'EUR', symbol: '€', position: 'after', rate: 0.92 },
  pt: { code: 'EUR', symbol: '€', position: 'after', rate: 0.92 },
  it: { code: 'EUR', symbol: '€', position: 'after', rate: 0.92 },
  ja: { code: 'JPY', symbol: '¥', position: 'before', rate: 149, decimals: 0 },
  zh: { code: 'CNY', symbol: '¥', position: 'before', rate: 7.24 },
  ko: { code: 'KRW', symbol: '₩', position: 'before', rate: 1320, decimals: 0 },
  nl: { code: 'EUR', symbol: '€', position: 'after', rate: 0.92 }
};

/**
 * Format price based on the current language
 * @param {number} priceUSD - Price in USD
 * @param {string} language - Current language code (e.g., 'en', 'es', 'ja')
 * @returns {string} Formatted price string
 */
export const formatPrice = (priceUSD, language = 'en') => {
  // Get base language code (handle cases like 'en-US')
  const langCode = language.split('-')[0].toLowerCase();
  const config = currencyConfig[langCode] || currencyConfig.en;
  
  // Convert price
  const convertedPrice = priceUSD * config.rate;
  
  // Format with appropriate decimals
  const decimals = config.decimals !== undefined ? config.decimals : 2;
  const formattedNumber = convertedPrice.toFixed(decimals);
  
  // Add thousand separators
  const parts = formattedNumber.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const finalNumber = parts.join('.');
  
  // Position symbol
  if (config.position === 'after') {
    return `${finalNumber} ${config.symbol}`;
  }
  return `${config.symbol}${finalNumber}`;
};

/**
 * Get currency info for a language
 * @param {string} language - Current language code
 * @returns {object} Currency configuration
 */
export const getCurrencyInfo = (language = 'en') => {
  const langCode = language.split('-')[0].toLowerCase();
  return currencyConfig[langCode] || currencyConfig.en;
};

/**
 * Convert USD amount to local currency amount (number only)
 * @param {number} priceUSD - Price in USD
 * @param {string} language - Current language code
 * @returns {number} Converted price
 */
export const convertPrice = (priceUSD, language = 'en') => {
  const langCode = language.split('-')[0].toLowerCase();
  const config = currencyConfig[langCode] || currencyConfig.en;
  return priceUSD * config.rate;
};

export default { formatPrice, getCurrencyInfo, convertPrice };
