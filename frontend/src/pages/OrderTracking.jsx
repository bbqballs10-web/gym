import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Package, Truck, CheckCircle, Clock, MapPin, Search, ArrowRight } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const initialOrderNumber = searchParams.get('order') || '';
  
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const url = email 
        ? `${API_URL}/api/orders/track/${orderNumber}?email=${encodeURIComponent(email)}`
        : `${API_URL}/api/orders/track/${orderNumber}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Order not found. Please check your order number and email.');
        } else {
          setError('Unable to track order. Please try again.');
        }
        setOrder(null);
      } else {
        const data = await response.json();
        setOrder(data);
      }
    } catch (err) {
      setError('Unable to connect. Please try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status, completed) => {
    const iconClass = completed ? 'status-icon completed' : 'status-icon';
    
    switch (status) {
      case 'confirmed':
        return <CheckCircle className={iconClass} size={24} />;
      case 'processing':
        return <Clock className={iconClass} size={24} />;
      case 'shipped':
        return <Truck className={iconClass} size={24} />;
      case 'delivered':
        return <Package className={iconClass} size={24} />;
      default:
        return <Clock className={iconClass} size={24} />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const statuses = ['confirmed', 'processing', 'shipped', 'delivered'];
    return statuses.indexOf(order.status);
  };

  return (
    <div className="tracking-page">
      <div className="container">
        <div className="tracking-header">
          <h1 className="tracking-title">Track Your Order</h1>
          <p className="tracking-subtitle">Enter your order number to see the latest status</p>
        </div>

        {/* Search Form */}
        <div className="tracking-search-card">
          <form onSubmit={handleSearch} className="tracking-form">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="orderNumber" className="form-label">Order Number</label>
                <Input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., RAZE-D2336D48"
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="email" className="form-label">Email (optional)</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For verification"
                  className="form-input"
                />
              </div>
              <Button type="submit" className="btn-cta tracking-btn" disabled={loading}>
                <Search size={18} />
                {loading ? 'Searching...' : 'Track Order'}
              </Button>
            </div>
          </form>

          {error && (
            <div className="tracking-error">
              {error}
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="tracking-result">
            {/* Order Summary Header */}
            <div className="order-summary-header">
              <div className="order-number-display">
                <span className="label">Order</span>
                <span className="value">{order.order_number}</span>
              </div>
              <div className={`order-status-badge status-${order.status}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="status-timeline">
              <h3 className="timeline-title">Order Status</h3>
              <div className="timeline-track">
                {order.timeline.map((step, index) => (
                  <div 
                    key={step.status} 
                    className={`timeline-step ${step.completed ? 'completed' : ''} ${order.status === step.status ? 'current' : ''}`}
                  >
                    <div className="step-icon">
                      {getStatusIcon(step.status, step.completed)}
                    </div>
                    <div className="step-content">
                      <span className="step-label">{step.label}</span>
                      {step.date && (
                        <span className="step-date">{formatDate(step.date)}</span>
                      )}
                    </div>
                    {index < order.timeline.length - 1 && (
                      <div className={`step-connector ${step.completed ? 'completed' : ''}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Info */}
            {order.tracking_number && (
              <div className="tracking-info-card">
                <h3>Shipping Information</h3>
                <div className="tracking-details">
                  <div className="tracking-item">
                    <Truck size={18} />
                    <div>
                      <span className="tracking-label">Carrier</span>
                      <span className="tracking-value">{order.carrier || 'Standard Shipping'}</span>
                    </div>
                  </div>
                  <div className="tracking-item">
                    <Package size={18} />
                    <div>
                      <span className="tracking-label">Tracking Number</span>
                      <span className="tracking-value tracking-number">{order.tracking_number}</span>
                    </div>
                  </div>
                  {order.estimated_delivery && (
                    <div className="tracking-item">
                      <Clock size={18} />
                      <div>
                        <span className="tracking-label">Estimated Delivery</span>
                        <span className="tracking-value">{order.estimated_delivery}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="order-items-card">
              <h3>Order Items</h3>
              <div className="order-items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <div className="item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.product_name} />
                      ) : (
                        <div className="item-placeholder">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <div className="item-details">
                      <span className="item-name">{item.product_name}</span>
                      <span className="item-variant">{item.color} / {item.size}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="total-row discount">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Shipping</span>
                  <span>${order.shipping_cost.toFixed(2)}</span>
                </div>
                <div className="total-row final">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="shipping-address-card">
              <h3>
                <MapPin size={18} />
                Shipping Address
              </h3>
              <div className="address-content">
                <p className="address-name">{order.shipping_address.name}</p>
                <p>{order.shipping_address.address}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Order Found / Initial State */}
        {searched && !order && !loading && !error && (
          <div className="tracking-empty">
            <Package size={48} />
            <p>No order found with that number</p>
          </div>
        )}

        {/* Help Section */}
        <div className="tracking-help">
          <h3>Need Help?</h3>
          <p>Can't find your order? Check your confirmation email for the order number, or <Link to="/faq">visit our FAQ</Link>.</p>
          <p>For further assistance, contact us at <a href="mailto:support@razetraining.com">support@razetraining.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
