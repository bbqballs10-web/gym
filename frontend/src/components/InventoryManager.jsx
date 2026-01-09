import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Package, AlertTriangle, RefreshCw, Save, Minus, Plus } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedItems, setEditedItems] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/inventory`);
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/inventory/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchInventory(), fetchStats()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleQuantityChange = (item, delta) => {
    const key = `${item.product_id}-${item.color}-${item.size}`;
    const currentQty = editedItems[key]?.quantity ?? item.quantity;
    const newQty = Math.max(0, currentQty + delta);
    
    setEditedItems(prev => ({
      ...prev,
      [key]: { ...item, quantity: newQty }
    }));
  };

  const handleDirectInput = (item, value) => {
    const key = `${item.product_id}-${item.color}-${item.size}`;
    const newQty = Math.max(0, parseInt(value) || 0);
    
    setEditedItems(prev => ({
      ...prev,
      [key]: { ...item, quantity: newQty }
    }));
  };

  const saveChanges = async () => {
    const updates = Object.values(editedItems).map(item => ({
      product_id: item.product_id,
      color: item.color,
      size: item.size,
      quantity: item.quantity
    }));

    if (updates.length === 0) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/inventory/bulk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updates })
      });

      if (response.ok) {
        setEditedItems({});
        await refreshData();
      }
    } catch (error) {
      console.error('Failed to save inventory:', error);
    }
    setSaving(false);
  };

  // Group inventory by product
  const groupedInventory = inventory.reduce((acc, item) => {
    const key = `${item.product_id}-${item.product_name}`;
    if (!acc[key]) {
      acc[key] = {
        product_id: item.product_id,
        product_name: item.product_name,
        colors: {}
      };
    }
    if (!acc[key].colors[item.color]) {
      acc[key].colors[item.color] = [];
    }
    acc[key].colors[item.color].push(item);
    return acc;
  }, {});

  const getStockBadge = (quantity, reserved = 0) => {
    const available = quantity - reserved;
    if (available <= 0) {
      return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Out of Stock</Badge>;
    }
    if (available <= 5) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Low Stock</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">In Stock</Badge>;
  };

  const hasChanges = Object.keys(editedItems).length > 0;

  return (
    <div className="inventory-manager">
      {/* Stats Header */}
      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <Package size={20} className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{stats.total_available}</span>
              <span className="stat-label">Total Available</span>
            </div>
          </div>
          <div className="stat-card">
            <AlertTriangle size={20} className="stat-icon warning" />
            <div className="stat-info">
              <span className="stat-value">{stats.low_stock_count}</span>
              <span className="stat-label">Low Stock</span>
            </div>
          </div>
          <div className="stat-card">
            <Package size={20} className="stat-icon danger" />
            <div className="stat-info">
              <span className="stat-value">{stats.out_of_stock_count}</span>
              <span className="stat-label">Out of Stock</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="inventory-actions">
        <Button onClick={refreshData} disabled={loading} className="btn-secondary">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
        {hasChanges && (
          <Button onClick={saveChanges} disabled={saving} className="btn-cta">
            <Save size={16} />
            {saving ? 'Saving...' : `Save Changes (${Object.keys(editedItems).length})`}
          </Button>
        )}
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="admin-loading">Loading inventory...</div>
      ) : (
        <div className="inventory-products">
          {Object.values(groupedInventory).map((product) => (
            <div key={product.product_id} className="inventory-product-card">
              <h3 className="inventory-product-name">{product.product_name}</h3>
              
              {Object.entries(product.colors).map(([color, items]) => (
                <div key={color} className="inventory-color-group">
                  <div className="inventory-color-header">
                    <span className="color-indicator" style={{ 
                      background: items[0]?.color === 'Black' ? '#1a1a1a' : 
                                 items[0]?.color === 'Cyan' ? '#00D4FF' :
                                 items[0]?.color === 'Silver' ? '#C0C0C0' :
                                 items[0]?.color === 'Green' ? '#00FF7F' :
                                 items[0]?.color === 'Pink' ? '#FF00FF' :
                                 items[0]?.color === 'Red' ? '#FF4444' : '#888'
                    }}></span>
                    <span className="color-name">{color}</span>
                  </div>
                  
                  <div className="inventory-sizes">
                    {items.sort((a, b) => {
                      const order = ['S', 'M', 'L', 'XL', 'XXL'];
                      return order.indexOf(a.size) - order.indexOf(b.size);
                    }).map((item) => {
                      const key = `${item.product_id}-${item.color}-${item.size}`;
                      const editedQty = editedItems[key]?.quantity;
                      const displayQty = editedQty !== undefined ? editedQty : item.quantity;
                      const isEdited = editedQty !== undefined && editedQty !== item.quantity;
                      
                      return (
                        <div key={item.size} className={`inventory-size-item ${isEdited ? 'edited' : ''}`}>
                          <div className="size-info">
                            <span className="size-label">{item.size}</span>
                            {getStockBadge(displayQty, item.reserved)}
                          </div>
                          <div className="quantity-control">
                            <button 
                              className="qty-btn"
                              onClick={() => handleQuantityChange(item, -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              value={displayQty}
                              onChange={(e) => handleDirectInput(item, e.target.value)}
                              className="qty-input"
                              min="0"
                            />
                            <button 
                              className="qty-btn"
                              onClick={() => handleQuantityChange(item, 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          {item.reserved > 0 && (
                            <span className="reserved-info">{item.reserved} reserved</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Low Stock Alerts */}
      {stats && stats.out_of_stock_items.length > 0 && (
        <div className="stock-alerts">
          <h4>⚠️ Out of Stock Items</h4>
          <div className="alert-items">
            {stats.out_of_stock_items.map((item, idx) => (
              <span key={idx} className="alert-item">
                {item.product_name} - {item.color} ({item.size})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
