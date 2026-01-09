import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import PostPurchaseUpsell from '../components/PostPurchaseUpsell';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const CheckoutSuccess = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  // Get session_id from URL params (Stripe redirects with this)
  const sessionId = searchParams.get('session_id');
  
  // Fallback to state if passed directly (legacy support)
  const stateData = location.state || {};

  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId) {
        try {
          // Verify the payment status with backend
          const response = await fetch(`${API_URL}/api/checkout/status/${sessionId}`);
          const data = await response.json();
          
          if (data.success && data.payment_status === 'paid') {
            setOrderData({
              orderNumber: data.order_number,
              orderId: data.order_id,
              status: data.status,
              paymentStatus: data.payment_status
            });
            // Clear cart after successful payment
            clearCart();
            // Clear checkout session from localStorage
            localStorage.removeItem('raze_checkout_session');
          } else if (data.success) {
            // Payment still pending or not completed
            setError('Payment is still processing. Please check back later.');
          } else {
            setError('Unable to verify payment. Please contact support.');
          }
        } catch (err) {
          console.error('Error verifying payment:', err);
          setError('Error verifying payment status. Please contact support if you were charged.');
        }
      } else if (stateData.orderNumber) {
        // Legacy: Order data passed via state
        setOrderData({
          orderNumber: stateData.orderNumber,
          total: stateData.total
        });
        clearCart();
      } else {
        setError('No order information found.');
      }
      setLoading(false);
    };

    verifyPayment();
  }, [sessionId, stateData.orderNumber, stateData.total, clearCart]);

  if (loading) {
    return (
      <div className="success-page" style={{ 
        padding: '100px 24px 80px',
        background: 'var(--bg-page)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-primary)' }} />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page" style={{ 
        padding: '100px 24px 80px',
        background: 'var(--bg-page)',
        minHeight: '100vh'
      }}>
        <div className="container">
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '40px 32px'
          }}>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: 'var(--text-primary)',
              margin: '0 0 16px 0'
            }}>Payment Verification</h1>
            
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem',
              margin: '0 0 24px 0'
            }}>
              {error}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/cart">
                <Button className="btn-secondary">Return to Cart</Button>
              </Link>
              <Link to="/">
                <Button className="btn-cta">Go Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page" style={{ 
      padding: '100px 24px 80px',
      background: 'var(--bg-page)',
      minHeight: '100vh'
    }}>
      <div className="container">
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          textAlign: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '10px',
          padding: '40px 32px'
        }}>
          <div style={{ color: 'var(--brand-primary)', marginBottom: '20px' }}>
            <CheckCircle size={56} />
          </div>

          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            margin: '0 0 8px 0'
          }}>Order Confirmed</h1>
          
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem',
            margin: '0 0 24px 0'
          }}>
            Thank you for your order. You'll receive a confirmation email shortly.
          </p>

          <div style={{
            background: 'var(--bg-page)',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>Order Number:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{orderData?.orderNumber || 'N/A'}</span>
            </div>
            {orderData?.total && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${orderData.total.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Guest checkout: Show account creation CTA */}
          {!isAuthenticated && (
            <div style={{
              background: 'rgba(74, 159, 245, 0.08)',
              border: '1px solid var(--brand-primary)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: 'var(--text-primary)', 
                fontSize: '0.9rem',
                margin: '0 0 16px 0',
                lineHeight: '1.5'
              }}>
                Save your details for next time. Create an account in 10 seconds.
              </p>
              <Link to="/register">
                <Button className="btn-cta" style={{ width: '100%' }}>
                  Create Account
                </Button>
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/track?order=${orderData?.orderNumber || ''}`}>
              <Button className="btn-secondary">Track Order</Button>
            </Link>
            <Link to="/products">
              <Button className="btn-cta">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        {/* Post-Purchase Upsell */}
        <PostPurchaseUpsell purchasedItems={[]} />
      </div>
    </div>
  );
};

export default CheckoutSuccess;
