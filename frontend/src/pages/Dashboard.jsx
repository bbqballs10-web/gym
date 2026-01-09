import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, ChevronRight, LogOut, Loader2, Gift, Tag, Star, Award, TrendingUp, CheckCircle, Copy } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, getUserOrders, isAuthenticated, loading, hasFirstOrderDiscount } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [credits, setCredits] = useState(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, getUserOrders]);

  // Fetch credits
  useEffect(() => {
    const fetchCredits = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/credits`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setCredits(data);
        }
      } catch (error) {
        console.error('Failed to fetch credits:', error);
      } finally {
        setCreditsLoading(false);
      }
    };

    fetchCredits();
  }, [isAuthenticated]);

  const handleRedeemCredits = async (tierCredits) => {
    setRedeeming(true);
    setRedeemSuccess(null);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/credits/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tier_credits: tierCredits })
      });
      
      if (response.ok) {
        const data = await response.json();
        setRedeemSuccess(data);
        // Refresh credits
        const creditsResponse = await fetch(`${BACKEND_URL}/api/auth/credits`, {
          credentials: 'include'
        });
        if (creditsResponse.ok) {
          setCredits(await creditsResponse.json());
        }
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to redeem credits');
      }
    } catch (error) {
      console.error('Redeem error:', error);
      alert('Failed to redeem credits');
    } finally {
      setRedeeming(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4A9FF5';
      case 'processing': return '#F59E0B';
      case 'shipped': return '#8B5CF6';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#888';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-primary)' }} />
            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-empty">
            <h2>Please log in to view your dashboard</h2>
            <Link to="/login" className="btn-cta">Log In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Account</h1>
          <p className="dashboard-subtitle">Welcome back, {user.name || 'Athlete'}</p>
        </div>

        {/* First Order Discount Banner */}
        {hasFirstOrderDiscount && hasFirstOrderDiscount() && (
          <div className="discount-banner">
            <div className="discount-banner-content">
              <Gift size={24} />
              <div className="discount-banner-text">
                <h3>Your First Order Discount!</h3>
                <p>Use code <strong>{user.first_order_discount_code}</strong> at checkout for 10% off</p>
              </div>
              <div className="discount-code-box">
                <Tag size={16} />
                <span>{user.first_order_discount_code}</span>
              </div>
            </div>
          </div>
        )}

        {/* RAZE Credits Section */}
        <div className="credits-section">
          <div className="credits-header">
            <Award size={24} />
            <h2>RAZE Credits</h2>
          </div>
          
          {creditsLoading ? (
            <div className="credits-loading">
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : credits ? (
            <div className="credits-content">
              {/* Credits Balance Card */}
              <div className="credits-balance-card">
                <div className="credits-balance">
                  <Star size={32} className="credits-icon" />
                  <div className="credits-amount">
                    <span className="credits-number">{credits.current_credits}</span>
                    <span className="credits-label">Credits</span>
                  </div>
                </div>
                <div className="credits-stats">
                  <div className="credits-stat">
                    <TrendingUp size={16} />
                    <span>{credits.total_earned} earned</span>
                  </div>
                  <div className="credits-stat">
                    <CheckCircle size={16} />
                    <span>{credits.total_redeemed} redeemed</span>
                  </div>
                </div>
                {credits.next_tier && (
                  <div className="credits-progress">
                    <div className="progress-text">
                      <span>{credits.next_tier.credits_needed} more credits for {credits.next_tier.label}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(credits.current_credits / credits.next_tier.credits) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Redemption Success */}
              {redeemSuccess && (
                <div className="redeem-success">
                  <CheckCircle size={20} />
                  <div className="redeem-success-content">
                    <p><strong>Success!</strong> Your discount code:</p>
                    <div className="redeem-code" onClick={() => copyToClipboard(redeemSuccess.discount_code)}>
                      <code>{redeemSuccess.discount_code}</code>
                      <Copy size={16} />
                      {copiedCode && <span className="copied-badge">Copied!</span>}
                    </div>
                    <p className="redeem-expiry">Expires in {redeemSuccess.expires_in_days} days • {redeemSuccess.message}</p>
                  </div>
                </div>
              )}

              {/* Redemption Tiers */}
              <div className="credits-tiers">
                <h3>Redeem Your Credits</h3>
                <div className="tiers-grid">
                  {[
                    { credits: 100, discount: 5, label: '$5 off' },
                    { credits: 200, discount: 15, label: '$15 off' },
                    { credits: 300, discount: 25, label: '$25 off' }
                  ].map((tier) => {
                    const canRedeem = credits.current_credits >= tier.credits;
                    return (
                      <div key={tier.credits} className={`tier-card ${canRedeem ? 'available' : 'locked'}`}>
                        <div className="tier-credits">{tier.credits} Credits</div>
                        <div className="tier-discount">{tier.label}</div>
                        <button 
                          className={`tier-btn ${canRedeem ? 'btn-primary' : ''}`}
                          disabled={!canRedeem || redeeming}
                          onClick={() => handleRedeemCredits(tier.credits)}
                        >
                          {redeeming ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 
                            canRedeem ? 'Redeem' : `Need ${tier.credits - credits.current_credits} more`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* How to Earn */}
              <div className="credits-info">
                <h3>How to Earn Credits</h3>
                <ul>
                  <li><Gift size={16} /> <strong>10 credits</strong> just for signing up!</li>
                  <li><Package size={16} /> <strong>$1 spent = 1 credit</strong> on every order</li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="credits-error">Unable to load credits</p>
          )}
        </div>

        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <User size={20} />
              <h3>Profile</h3>
            </div>
            <div className="card-content">
              <div className="profile-info">
                <p className="profile-name">{user.name}</p>
                <p className="profile-email">{user.email}</p>
                {user.auth_provider === 'google' && (
                  <span className="auth-badge">Google Account</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <Package size={20} />
              <h3>Quick Actions</h3>
            </div>
            <div className="card-content">
              <Link to="/products" className="card-link">
                Shop Products <ChevronRight size={16} />
              </Link>
              <Link to="/cart" className="card-link">
                View Cart <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="dashboard-section">
          <div className="section-header">
            <Package size={20} />
            <h2>Order History</h2>
          </div>
          
          {ordersLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-primary)' }} />
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <p>No orders yet</p>
              <Link to="/products" className="btn-cta">Browse Products</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-number">{order.order_number}</span>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="order-items-preview">
                    {order.items?.slice(0, 2).map((item, idx) => (
                      <span key={idx} className="order-item-name">
                        {item.product_name} ({item.color}, {item.size})
                        {idx < order.items.length - 1 && order.items.length <= 2 ? ', ' : ''}
                      </span>
                    ))}
                    {order.items?.length > 2 && (
                      <span className="order-more">+{order.items.length - 2} more</span>
                    )}
                  </div>
                  <div 
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <div className="order-total">${order.total?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="dashboard-actions">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
