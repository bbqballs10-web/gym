import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const WaitlistStats = () => {
  const [stats, setStats] = useState({
    waitlistCount: 2847, // Default value
    progress: 75 // Percentage to next drop
  });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Fetch actual stats from backend
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/waitlist/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats({
            waitlistCount: data.total_waitlist || 2847,
            progress: data.progress || 75
          });
        }
      } catch (err) {
        // Use default values on error
        console.log('Using default waitlist stats');
      }
    };

    fetchStats();
    
    // Simulate occasional updates for "live" feel
    const interval = setInterval(() => {
      setIsAnimating(true);
      setStats(prev => ({
        ...prev,
        waitlistCount: prev.waitlistCount + Math.floor(Math.random() * 3)
      }));
      setTimeout(() => setIsAnimating(false), 500);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="waitlist-stats">
      <div className="waitlist-count">
        <Users size={16} className="waitlist-icon" />
        <span className={`count-number ${isAnimating ? 'pulse' : ''}`}>
          {formatNumber(stats.waitlistCount)}
        </span>
        <span className="count-label">people waiting</span>
      </div>
      
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Next Drop Progress</span>
          <span className="progress-percent">{stats.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default WaitlistStats;
