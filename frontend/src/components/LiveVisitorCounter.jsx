import React, { useState, useEffect, useRef } from 'react';

const LiveVisitorCounter = ({ isAdmin }) => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const visitorIdRef = useRef(localStorage.getItem('raze_visitor_id'));
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Send heartbeat to track this visitor
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        if (visitorIdRef.current) {
          headers['X-Visitor-ID'] = visitorIdRef.current;
        }

        const response = await fetch(`${BACKEND_URL}/api/visitors/heartbeat`, {
          method: 'POST',
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          if (!visitorIdRef.current) {
            visitorIdRef.current = data.visitor_id;
            localStorage.setItem('raze_visitor_id', data.visitor_id);
          }
        }
      } catch (error) {
        console.error('Heartbeat error:', error);
      }
    };

    // Send initial heartbeat
    sendHeartbeat();

    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(sendHeartbeat, 30000);

    return () => clearInterval(heartbeatInterval);
  }, [BACKEND_URL]);

  // Fetch visitor count (only if admin)
  useEffect(() => {
    if (!isAdmin) return;

    const fetchVisitorCount = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/visitors/count`);
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      }
    };

    // Fetch immediately
    fetchVisitorCount();

    // Then fetch every 10 seconds
    const countInterval = setInterval(fetchVisitorCount, 10000);

    return () => clearInterval(countInterval);
  }, [isAdmin, BACKEND_URL]);

  // Only show for admin users
  if (!isAdmin) return null;

  return (
    <>
      {/* Floating badge - click to expand */}
      <div 
        className="live-visitor-badge"
        onClick={() => setIsVisible(!isVisible)}
        title="Live Visitors"
      >
        <span className="pulse-dot"></span>
        <span className="visitor-count">{visitorCount}</span>
      </div>

      {/* Expanded panel */}
      {isVisible && (
        <div className="live-visitor-panel">
          <div className="panel-header">
            <span className="pulse-dot"></span>
            <span>Live Visitors</span>
            <button onClick={() => setIsVisible(false)}>×</button>
          </div>
          <div className="panel-content">
            <div className="big-count">{visitorCount}</div>
            <div className="label">currently viewing</div>
          </div>
        </div>
      )}

      <style>{`
        .live-visitor-badge {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          z-index: 9999;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }

        .live-visitor-badge:hover {
          border-color: rgba(0, 212, 255, 0.6);
          transform: scale(1.05);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #00d4ff;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .visitor-count {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
        }

        .live-visitor-panel {
          position: fixed;
          bottom: 70px;
          left: 20px;
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 12px;
          min-width: 180px;
          z-index: 9999;
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #00d4ff;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .panel-header button {
          margin-left: auto;
          background: none;
          border: none;
          color: #666;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .panel-header button:hover {
          color: #fff;
        }

        .panel-content {
          padding: 20px;
          text-align: center;
        }

        .big-count {
          font-size: 48px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .label {
          color: #666;
          font-size: 12px;
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .live-visitor-badge {
            bottom: 80px;
            left: 16px;
            padding: 6px 12px;
          }

          .live-visitor-panel {
            bottom: 130px;
            left: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default LiveVisitorCounter;
