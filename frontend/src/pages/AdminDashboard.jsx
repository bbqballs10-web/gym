import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Mail, 
  ShoppingBag, 
  Clock, 
  Send, 
  Trash2, 
  LogOut,
  RefreshCw,
  ChevronDown,
  Check,
  X,
  BarChart3,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Email form state
  const [emailForm, setEmailForm] = useState({
    subject: '',
    html_content: '',
    target: 'all'
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState(null);

  // Check if already authenticated
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check localStorage first
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      try {
        const res = await fetch(`${API_URL}/api/admin/verify`, {
          
          headers: { 'X-Admin-Token': storedToken }
        });
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          loadStats();
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('admin_token');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Store token in localStorage as fallback
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        setIsAuthenticated(true);
        setPassword('');
        loadStats();
      } else {
        setLoginError(data.detail || 'Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST',
        
        headers: token ? { 'X-Admin-Token': token } : {}
      });
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'X-Admin-Token': token } : {};
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
    setLoading(false);
  };

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/subscribers`, {
        
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error('Failed to load subscribers:', error);
    }
    setLoading(false);
  };

  const loadWaitlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/waitlist`, {
        
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setWaitlist(data.waitlist || []);
    } catch (error) {
      console.error('Failed to load waitlist:', error);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load all data for analytics
      const [statsRes, ordersRes, usersRes, waitlistRes, subscribersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/orders`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/users`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/waitlist`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/subscribers`, { headers: getAuthHeaders() })
      ]);

      const [statsData, ordersData, usersData, waitlistData, subscribersData] = await Promise.all([
        statsRes.json(),
        ordersRes.json(),
        usersRes.json(),
        waitlistRes.json(),
        subscribersRes.json()
      ]);

      const ordersList = ordersData.orders || [];
      const usersList = usersData.users || [];
      const waitlistList = waitlistData.waitlist || [];
      const subscribersList = subscribersData.subscribers || [];

      // Process data for charts
      // 1. Revenue over time (last 30 days)
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayOrders = ordersList.filter(o => o.created_at?.startsWith(dateStr));
        const revenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        last30Days.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: revenue,
          orders: dayOrders.length
        });
      }

      // 2. Order status breakdown
      const statusCounts = {};
      ordersList.forEach(o => {
        const status = o.status || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      const orderStatusData = Object.entries(statusCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }));

      // 3. Signups over time (last 7 days)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayUsers = usersList.filter(u => u.created_at?.startsWith(dateStr)).length;
        const daySubscribers = subscribersList.filter(s => s.timestamp?.startsWith(dateStr)).length;
        const dayWaitlist = waitlistList.filter(w => w.created_at?.startsWith(dateStr)).length;
        last7Days.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          users: dayUsers,
          subscribers: daySubscribers,
          waitlist: dayWaitlist
        });
      }

      // 4. Product popularity (from waitlist)
      const productCounts = {};
      waitlistList.forEach(w => {
        const product = w.product_name || 'Unknown';
        productCounts[product] = (productCounts[product] || 0) + 1;
      });
      const productData = Object.entries(productCounts)
        .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // 5. Calculate totals
      const totalRevenue = ordersList.reduce((sum, o) => sum + (o.total || 0), 0);
      const avgOrderValue = ordersList.length > 0 ? totalRevenue / ordersList.length : 0;

      setAnalyticsData({
        revenueData: last30Days,
        orderStatusData: orderStatusData.length > 0 ? orderStatusData : [{ name: 'No Orders', value: 1 }],
        signupData: last7Days,
        productData: productData.length > 0 ? productData : [{ name: 'No Data', value: 1 }],
        totalRevenue,
        avgOrderValue,
        totalOrders: ordersList.length,
        totalUsers: usersList.length,
        totalWaitlist: waitlistList.length
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
    setLoading(false);
  };

  const deleteSubscriber = async (email) => {
    if (!window.confirm(`Delete subscriber ${email}?`)) return;
    
    try {
      await fetch(`${API_URL}/api/admin/subscriber/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        
        headers: getAuthHeaders()
      });
      loadSubscribers();
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
    }
  };

  const deleteUser = async (userId, email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    
    try {
      await fetch(`${API_URL}/api/admin/user/${userId}`, {
        method: 'DELETE',
        
        headers: getAuthHeaders()
      });
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const sendBulkEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.subject || !emailForm.html_content) {
      alert('Please fill in subject and content');
      return;
    }
    
    if (!window.confirm(`Send email to ${emailForm.target} recipients?`)) return;
    
    setSendingEmail(true);
    setEmailResult(null);
    
    try {
      const res = await fetch(`${API_URL}/api/admin/send-bulk-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        
        body: JSON.stringify(emailForm)
      });
      const data = await res.json();
      setEmailResult(data);
      
      if (data.success) {
        setEmailForm({ subject: '', html_content: '', target: 'all' });
      }
    } catch (error) {
      setEmailResult({ success: false, message: 'Failed to send emails' });
    }
    setSendingEmail(false);
  };

  // Load data when tab changes
  useEffect(() => {
    if (!isAuthenticated) return;
    
    switch (activeTab) {
      case 'users':
        loadUsers();
        break;
      case 'subscribers':
        loadSubscribers();
        break;
      case 'waitlist':
        loadWaitlist();
        break;
      case 'orders':
        loadOrders();
        break;
      case 'analytics':
        loadAnalytics();
        break;
      default:
        loadStats();
    }
  }, [activeTab, isAuthenticated]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <h1>Admin Access</h1>
          <p>Enter admin password to continue</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="admin-password-input"
              autoFocus
            />
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="admin-login-btn">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>RAZE Admin Dashboard</h1>
        <button onClick={handleLogout} className="admin-logout-btn">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: <ChevronDown size={18} /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
          { id: 'users', label: 'Users', icon: <Users size={18} /> },
          { id: 'subscribers', label: 'Subscribers', icon: <Mail size={18} /> },
          { id: 'waitlist', label: 'Waitlist', icon: <Clock size={18} /> },
          { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
          { id: 'email', label: 'Send Email', icon: <Send size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="admin-content">
        {loading && <div className="admin-loading">Loading...</div>}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="admin-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <Users className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.total_users}</h3>
                  <p>Total Users</p>
                  <span className="stat-sub">+{stats.recent_users_7d} this week</span>
                </div>
              </div>
              <div className="stat-card">
                <Mail className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.total_subscribers}</h3>
                  <p>Email Subscribers</p>
                  <span className="stat-sub">+{stats.recent_subscribers_7d} this week</span>
                </div>
              </div>
              <div className="stat-card">
                <Clock className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.total_waitlist}</h3>
                  <p>Waitlist Entries</p>
                </div>
              </div>
              <div className="stat-card">
                <ShoppingBag className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.total_orders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
            </div>
            <button onClick={loadStats} className="refresh-btn">
              <RefreshCw size={16} /> Refresh Stats
            </button>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analyticsData && (
          <div className="admin-analytics">
            {/* Top Stats Row */}
            <div className="analytics-stats-row">
              <div className="analytics-stat-card revenue">
                <DollarSign className="analytics-icon" />
                <div>
                  <h3>${analyticsData.totalRevenue.toFixed(2)}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className="analytics-stat-card orders">
                <ShoppingBag className="analytics-icon" />
                <div>
                  <h3>{analyticsData.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="analytics-stat-card avg">
                <TrendingUp className="analytics-icon" />
                <div>
                  <h3>${analyticsData.avgOrderValue.toFixed(2)}</h3>
                  <p>Avg Order Value</p>
                </div>
              </div>
              <div className="analytics-stat-card waitlist">
                <Clock className="analytics-icon" />
                <div>
                  <h3>{analyticsData.totalWaitlist}</h3>
                  <p>Waitlist Entries</p>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              {/* Revenue Chart */}
              <div className="chart-card full-width">
                <h3>Revenue (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4A9FF5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4A9FF5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#4A9FF5" 
                      strokeWidth={2}
                      fill="url(#revenueGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Signups Chart */}
              <div className="chart-card">
                <h3>Signups (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.signupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="users" fill="#4A9FF5" name="Users" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="subscribers" fill="#10B981" name="Subscribers" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="waitlist" fill="#F59E0B" name="Waitlist" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Order Status Pie Chart */}
              <div className="chart-card">
                <h3>Order Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {analyticsData.orderStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={['#4A9FF5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products Chart */}
              <div className="chart-card">
                <h3>Top Waitlisted Products</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.productData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#888" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={100} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Entries" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <button onClick={loadAnalytics} className="refresh-btn">
              <RefreshCw size={16} /> Refresh Analytics
            </button>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-table-container">
            <div className="table-header">
              <h2>Registered Users ({users.length})</h2>
              <button onClick={loadUsers} className="refresh-btn">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Provider</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i}>
                    <td>{user.email}</td>
                    <td>{user.name || '-'}</td>
                    <td>{user.auth_provider}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => deleteUser(user.user_id, user.email)}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="5" className="empty-row">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="admin-table-container">
            <div className="table-header">
              <h2>Email Subscribers ({subscribers.length})</h2>
              <button onClick={loadSubscribers} className="refresh-btn">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, i) => (
                  <tr key={i}>
                    <td>{sub.email}</td>
                    <td><span className={`source-badge ${sub.source}`}>{sub.source}</span></td>
                    <td>{sub.product_id || '-'}</td>
                    <td>{new Date(sub.timestamp).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => deleteSubscriber(sub.email)}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr><td colSpan="5" className="empty-row">No subscribers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Waitlist Tab */}
        {activeTab === 'waitlist' && (
          <div className="admin-table-container">
            <div className="table-header">
              <h2>Waitlist Entries ({waitlist.length})</h2>
              <button onClick={loadWaitlist} className="refresh-btn">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Variant</th>
                  <th>Size</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.email}</td>
                    <td>{entry.product_name}</td>
                    <td>{entry.variant}</td>
                    <td>{entry.size}</td>
                    <td>#{entry.position || i + 1}</td>
                  </tr>
                ))}
                {waitlist.length === 0 && (
                  <tr><td colSpan="5" className="empty-row">No waitlist entries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="admin-table-container">
            <div className="table-header">
              <h2>Orders ({orders.length})</h2>
              <button onClick={loadOrders} className="refresh-btn">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i}>
                    <td className="order-id">{order.order_id?.slice(0, 12)}...</td>
                    <td>{order.shipping?.email || order.customer_email || '-'}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td>${order.total?.toFixed(2) || '0.00'}</td>
                    <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="6" className="empty-row">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Send Email Tab */}
        {activeTab === 'email' && (
          <div className="admin-email-form">
            <h2>Send Bulk Email</h2>
            
            <form onSubmit={sendBulkEmail}>
              <div className="form-group">
                <label>Target Audience</label>
                <select 
                  value={emailForm.target}
                  onChange={(e) => setEmailForm({...emailForm, target: e.target.value})}
                >
                  <option value="all">All (Subscribers + Users)</option>
                  <option value="subscribers">All Subscribers</option>
                  <option value="users">Registered Users Only</option>
                  <option value="waitlist">Waitlist Only</option>
                  <option value="early_access">Early Access Subscribers</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  placeholder="Email subject..."
                />
              </div>
              
              <div className="form-group">
                <label>HTML Content</label>
                <textarea
                  value={emailForm.html_content}
                  onChange={(e) => setEmailForm({...emailForm, html_content: e.target.value})}
                  placeholder="<h1>Hello!</h1><p>Your email content here...</p>"
                  rows={10}
                />
              </div>
              
              <button type="submit" disabled={sendingEmail} className="send-email-btn">
                {sendingEmail ? (
                  <>Sending...</>
                ) : (
                  <><Send size={18} /> Send Email</>
                )}
              </button>
            </form>
            
            {emailResult && (
              <div className={`email-result ${emailResult.success ? 'success' : 'error'}`}>
                {emailResult.success ? <Check size={20} /> : <X size={20} />}
                <div>
                  <strong>{emailResult.success ? 'Success!' : 'Failed'}</strong>
                  <p>{emailResult.message}</p>
                  {emailResult.sent_count !== undefined && (
                    <p>Sent: {emailResult.sent_count} / {emailResult.total_recipients}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
