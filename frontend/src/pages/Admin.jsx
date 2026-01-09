import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Package, DollarSign, Clock, Truck, CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp, Boxes, Percent } from 'lucide-react';
import InventoryManager from '../components/InventoryManager';
import PromoCodeManager from '../components/PromoCodeManager';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      const url = filter === 'all' 
        ? `${API_URL}/api/orders`
        : `${API_URL}/api/orders?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchStats()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [filter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        await refreshData();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
    setUpdating(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return (
      <Badge className={`${styles[status] || ''} border uppercase text-xs`}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage orders and inventory</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} />
            Orders
          </button>
          <button 
            className={`admin-tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Boxes size={18} />
            Inventory
          </button>
          <button 
            className={`admin-tab ${activeTab === 'promos' ? 'active' : ''}`}
            onClick={() => setActiveTab('promos')}
          >
            <Percent size={18} />
            Promo Codes
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Stats Cards */}
            <div className="admin-section-header">
              <h2>Order Management</h2>
              <Button onClick={refreshData} className="btn-secondary" disabled={loading}>
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>
            
            {stats && (
              <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-value">{stats.total_orders}</p>
                <p className="stat-label">Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-value">${stats.total_revenue.toLocaleString()}</p>
                <p className="stat-label">Total Revenue</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-value">{stats.pending + stats.confirmed}</p>
                <p className="stat-label">Pending</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon shipped">
                <Truck size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-value">{stats.shipped}</p>
                <p className="stat-label">Shipped</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon delivered">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-value">{stats.delivered}</p>
                <p className="stat-label">Delivered</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon cancelled">
                <XCircle size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-value">{stats.cancelled}</p>
                <p className="stat-label">Cancelled</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="order-filters">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {loading ? (
            <div className="loading-state">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <p>No orders found</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div 
                  className="order-header"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="order-main-info">
                    <span className="order-number">{order.order_number}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="order-meta">
                    <span className="order-customer">{order.shipping.first_name} {order.shipping.last_name}</span>
                    <span className="order-total">${order.total.toFixed(2)}</span>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-details">
                    {/* Items */}
                    <div className="order-section">
                      <h4>Items</h4>
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            {item.image && (
                              <img src={item.image} alt={item.product_name} className="order-item-image" />
                            )}
                            <div className="order-item-info">
                              <p className="item-name">{item.product_name}</p>
                              <p className="item-variant">{item.color} / {item.size}</p>
                              <p className="item-qty">Qty: {item.quantity}</p>
                            </div>
                            <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping */}
                    <div className="order-section">
                      <h4>Shipping Address</h4>
                      <div className="shipping-info">
                        <p>{order.shipping.first_name} {order.shipping.last_name}</p>
                        <p>{order.shipping.address_line1}</p>
                        {order.shipping.address_line2 && <p>{order.shipping.address_line2}</p>}
                        <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postal_code}</p>
                        <p>{order.shipping.country}</p>
                        <p className="shipping-email">{order.shipping.email}</p>
                        {order.shipping.phone && <p>{order.shipping.phone}</p>}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="order-section">
                      <h4>Order Summary</h4>
                      <div className="order-summary">
                        <div className="summary-row">
                          <span>Subtotal</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="summary-row discount">
                            <span>Discount</span>
                            <span>-${order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="summary-row">
                          <span>Shipping</span>
                          <span>{order.shipping_cost > 0 ? `$${order.shipping_cost.toFixed(2)}` : 'Free'}</span>
                        </div>
                        <div className="summary-row total">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking */}
                    {order.tracking_number && (
                      <div className="order-section">
                        <h4>Tracking</h4>
                        <p className="tracking-number">{order.tracking_number}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="order-actions">
                      <label>Update Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updating === order.id && <span className="updating">Updating...</span>}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
          </>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <InventoryManager />
        )}

        {/* Promo Codes Tab */}
        {activeTab === 'promos' && (
          <PromoCodeManager />
        )}
      </div>
    </div>
  );
};

export default Admin;
