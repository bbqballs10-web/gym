import React from 'react';
import { Lock, Calendar, Zap } from 'lucide-react';

const WaitlistInfo = ({ onJoinClick }) => {
  return (
    <div className="waitlist-info-section">
      <div className="waitlist-info-container">
        <div className="waitlist-info-card">
          <Lock size={24} className="info-icon" />
          <div className="info-content">
            <h4>Exclusive Access</h4>
            <p>Only waitlist members can purchase on Feb 2</p>
          </div>
        </div>
        
        <div className="waitlist-info-card">
          <Calendar size={24} className="info-icon" />
          <div className="info-content">
            <h4>Next Drop: Feb 2</h4>
            <p>First drop sold out in hours</p>
          </div>
        </div>
        
        <div className="waitlist-info-card">
          <Zap size={24} className="info-icon" />
          <div className="info-content">
            <h4>Limited Spots</h4>
            <p>Join now before spots run out</p>
          </div>
        </div>
      </div>
      
      <button className="waitlist-info-cta" onClick={onJoinClick}>
        Join Waitlist — Secure Your Spot
      </button>
    </div>
  );
};

export default WaitlistInfo;
