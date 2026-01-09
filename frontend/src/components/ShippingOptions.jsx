import React, { useState, useEffect } from 'react';
import { Truck, Package, Clock, Check, Loader2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ShippingOptions = ({ shippingAddress, onRateSelect, selectedRate }) => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shippingAddress && shippingAddress.address_line1) {
      fetchRates();
    }
  }, [shippingAddress]);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/shipping/rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address_to: shippingAddress,
          weight: 0.5,  // Default weight for apparel
          length: 12,
          width: 9,
          height: 2
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.rates.length > 0) {
        setRates(data.rates);
        // Auto-select cheapest option
        if (!selectedRate) {
          onRateSelect(data.rates[0]);
        }
      } else {
        setError(data.message || 'No shipping options available');
      }
    } catch (err) {
      setError('Failed to fetch shipping rates');
      console.error('Shipping error:', err);
    }
    
    setLoading(false);
  };

  const formatDelivery = (days, terms) => {
    if (days === 1) return '1 business day';
    if (days) return `${days} business days`;
    if (terms) return terms;
    return 'Standard delivery';
  };

  const getProviderIcon = (provider) => {
    switch (provider?.toUpperCase()) {
      case 'USPS':
        return '📬';
      case 'UPS':
        return '📦';
      case 'FEDEX':
        return '🚚';
      case 'DHL':
        return '✈️';
      default:
        return '📦';
    }
  };

  if (loading) {
    return (
      <div className="shipping-options-loading">
        <Loader2 className="animate-spin" size={24} />
        <span>Finding best shipping rates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shipping-options-error">
        <p>{error}</p>
        <button onClick={fetchRates} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className="shipping-options-empty">
        <Truck size={24} />
        <p>Enter your address to see shipping options</p>
      </div>
    );
  }

  return (
    <div className="shipping-options">
      <h3 className="shipping-options-title">
        <Truck size={18} />
        Shipping Method
      </h3>
      
      <div className="shipping-rates-list">
        {rates.slice(0, 5).map((rate) => (
          <div 
            key={rate.object_id}
            className={`shipping-rate-option ${selectedRate?.object_id === rate.object_id ? 'selected' : ''}`}
            onClick={() => onRateSelect(rate)}
          >
            <div className="rate-select-indicator">
              {selectedRate?.object_id === rate.object_id ? (
                <Check size={16} />
              ) : (
                <div className="rate-radio" />
              )}
            </div>
            
            <div className="rate-info">
              <div className="rate-provider">
                <span className="provider-icon">{getProviderIcon(rate.provider)}</span>
                <span className="provider-name">{rate.provider}</span>
                <span className="service-level">{rate.service_level}</span>
              </div>
              <div className="rate-delivery">
                <Clock size={12} />
                <span>{formatDelivery(rate.estimated_days, rate.duration_terms)}</span>
              </div>
            </div>
            
            <div className="rate-price">
              ${rate.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      {rates.length > 5 && (
        <p className="more-options-text">
          +{rates.length - 5} more options available
        </p>
      )}
    </div>
  );
};

export default ShippingOptions;
