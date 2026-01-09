import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exchangeSession } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      // Get session_id from URL fragment
      const hash = location.hash;
      const params = new URLSearchParams(hash.replace('#', ''));
      const sessionId = params.get('session_id');

      if (!sessionId) {
        console.error('No session_id in URL');
        navigate('/login', { state: { error: 'Authentication failed' } });
        return;
      }

      try {
        const user = await exchangeSession(sessionId);
        
        // Check if user needs to complete profile (Google OAuth without gymnastics_type)
        if (user.needs_profile_completion) {
          navigate('/complete-profile', { replace: true });
        } else {
          // Redirect to dashboard with user data
          navigate('/dashboard', { state: { user }, replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { state: { error: error.message } });
      }
    };

    processAuth();
  }, [location.hash, exchangeSession, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-page)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-primary)' }} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
