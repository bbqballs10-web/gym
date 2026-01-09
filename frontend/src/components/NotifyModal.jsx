import React, { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { emails } from '../utils/storage';

const NotifyModal = ({ isOpen, onClose, product }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setIsSubmitted(false);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await emails.addDropNotify(email, product?.id, product?.name);
      
      if (result.success) {
        setIsSubmitted(true);
      } else if (result.reason === 'duplicate') {
        setError('You\'re already on the list for this product.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="notify-overlay" onClick={handleClose} />

      {/* Modal */}
      <div className="notify-modal">
        <button className="notify-close" onClick={handleClose} aria-label="Close">
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <div className="notify-content">
            <div className="notify-icon">
              <Bell size={32} />
            </div>
            <h2 className="notify-title">Get Notified</h2>
            <p className="notify-subtitle">
              Be the first to know when<br />
              <strong>{product?.name || 'this product'}</strong> drops.
            </p>

            <form onSubmit={handleSubmit} className="notify-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="notify-input"
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <p className="notify-error">{error}</p>
              )}
              <button
                type="submit"
                className="notify-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Notify Me'}
              </button>
            </form>

            <p className="notify-disclaimer">No spam. Only drop notifications.</p>
          </div>
        ) : (
          <div className="notify-content notify-success">
            <div className="notify-icon success">✓</div>
            <h2 className="notify-title">You're on the list</h2>
            <p className="notify-subtitle">
              We'll notify you when<br />
              <strong>{product?.name || 'this product'}</strong> is available.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default NotifyModal;
