import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Trash2, Copy, CheckCircle, XCircle, Percent, DollarSign, Calendar, Users, RefreshCw } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PromoCodeManager = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order: '',
    max_uses: '',
    expires_at: ''
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/promo/list`);
      const data = await response.json();
      setCodes(data);
    } catch (error) {
      console.error('Failed to fetch promo codes:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (code, currentActive) => {
    try {
      const response = await fetch(`${API_URL}/api/promo/${code}?active=${!currentActive}`, {
        method: 'PATCH'
      });
      if (response.ok) {
        fetchCodes();
      }
    } catch (error) {
      console.error('Failed to update promo code:', error);
    }
  };

  const handleDeleteCode = async (code) => {
    if (!window.confirm(`Are you sure you want to delete the code "${code}"?`)) return;
    
    try {
      const response = await fetch(`${API_URL}/api/promo/${code}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchCodes();
      }
    } catch (error) {
      console.error('Failed to delete promo code:', error);
    }
  };

  const handleCreateCode = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    if (!formData.code.trim()) {
      setError('Please enter a promo code');
      setCreating(false);
      return;
    }

    if (!formData.discount_value || parseFloat(formData.discount_value) <= 0) {
      setError('Please enter a valid discount value');
      setCreating(false);
      return;
    }

    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order: formData.min_order ? parseFloat(formData.min_order) : 0,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        expires_at: formData.expires_at || null
      };

      const response = await fetch(`${API_URL}/api/promo/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create promo code');
      }

      // Reset form and refresh
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order: '',
        max_uses: '',
        expires_at: ''
      });
      setShowForm(false);
      fetchCodes();
    } catch (error) {
      setError(error.message);
    }
    setCreating(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = (code) => {
    if (!code.active) {
      return <Badge className="badge-inactive">Inactive</Badge>;
    }
    if (isExpired(code.expires_at)) {
      return <Badge className="badge-expired">Expired</Badge>;
    }
    if (code.max_uses && code.uses >= code.max_uses) {
      return <Badge className="badge-depleted">Depleted</Badge>;
    }
    return <Badge className="badge-active">Active</Badge>;
  };

  return (
    <div className="promo-manager">
      <div className="promo-header">
        <div>
          <h2>Promo Codes</h2>
          <p className="promo-subtitle">Create and manage discount codes for your Instagram campaigns</p>
        </div>
        <div className="promo-header-actions">
          <Button onClick={fetchCodes} className="btn-secondary" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} />
            Create Code
          </Button>
        </div>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="promo-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="promo-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Promo Code</h3>
            
            <form onSubmit={handleCreateCode}>
              {error && <div className="promo-error">{error}</div>}
              
              <div className="form-group">
                <label>Code Name</label>
                <input
                  type="text"
                  placeholder="e.g., INSTA20"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="form-input"
                  maxLength={20}
                />
                <span className="form-hint">This is what customers will enter at checkout</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type</label>
                  <div className="discount-type-toggle">
                    <button
                      type="button"
                      className={`toggle-btn ${formData.discount_type === 'percentage' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, discount_type: 'percentage'})}
                    >
                      <Percent size={16} />
                      Percentage
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${formData.discount_type === 'fixed' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, discount_type: 'fixed'})}
                    >
                      <DollarSign size={16} />
                      Fixed Amount
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Discount Value</label>
                  <div className="input-with-icon">
                    {formData.discount_type === 'percentage' ? (
                      <Percent size={16} className="input-icon" />
                    ) : (
                      <DollarSign size={16} className="input-icon" />
                    )}
                    <input
                      type="number"
                      placeholder={formData.discount_type === 'percentage' ? '10' : '10.00'}
                      value={formData.discount_value}
                      onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                      className="form-input"
                      min="0"
                      max={formData.discount_type === 'percentage' ? '100' : '1000'}
                      step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Minimum Order (optional)</label>
                  <div className="input-with-icon">
                    <DollarSign size={16} className="input-icon" />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.min_order}
                      onChange={(e) => setFormData({...formData, min_order: e.target.value})}
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <span className="form-hint">Leave empty for no minimum</span>
                </div>

                <div className="form-group">
                  <label>Max Uses (optional)</label>
                  <div className="input-with-icon">
                    <Users size={16} className="input-icon" />
                    <input
                      type="number"
                      placeholder="Unlimited"
                      value={formData.max_uses}
                      onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                      className="form-input"
                      min="1"
                    />
                  </div>
                  <span className="form-hint">Leave empty for unlimited uses</span>
                </div>
              </div>

              <div className="form-group">
                <label>Expiry Date (optional)</label>
                <div className="input-with-icon">
                  <Calendar size={16} className="input-icon" />
                  <input
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                    className="form-input"
                  />
                </div>
                <span className="form-hint">Leave empty for no expiration</span>
              </div>

              <div className="form-actions">
                <Button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Code'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Codes List */}
      <div className="promo-list">
        {loading ? (
          <div className="loading-state">Loading promo codes...</div>
        ) : codes.length === 0 ? (
          <div className="empty-state">
            <Percent size={48} />
            <p>No promo codes yet</p>
            <span>Create your first code for your Instagram campaign!</span>
          </div>
        ) : (
          <div className="promo-table">
            <div className="promo-table-header">
              <span>Code</span>
              <span>Discount</span>
              <span>Min Order</span>
              <span>Usage</span>
              <span>Expires</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {codes.map((code, index) => (
              <div key={index} className="promo-table-row">
                <div className="promo-code-cell">
                  <span className="promo-code-value">{code.code}</span>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopyCode(code.code)}
                    title="Copy code"
                  >
                    {copiedCode === code.code ? <CheckCircle size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <span className="promo-discount">
                  {code.discount_type === 'percentage' 
                    ? `${code.discount_value}%` 
                    : `$${code.discount_value.toFixed(2)}`
                  }
                </span>
                <span className="promo-min-order">
                  {code.min_order > 0 ? `$${code.min_order.toFixed(2)}` : '-'}
                </span>
                <span className="promo-usage">
                  {code.uses} {code.max_uses ? `/ ${code.max_uses}` : ''}
                </span>
                <span className="promo-expires">
                  {formatDate(code.expires_at)}
                </span>
                <span>{getStatusBadge(code)}</span>
                <div className="promo-actions">
                  <button
                    className={`action-btn ${code.active ? 'deactivate' : 'activate'}`}
                    onClick={() => handleToggleActive(code.code, code.active)}
                    title={code.active ? 'Deactivate' : 'Activate'}
                  >
                    {code.active ? <XCircle size={16} /> : <CheckCircle size={16} />}
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteCode(code.code)}
                    title="Delete code"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoCodeManager;
