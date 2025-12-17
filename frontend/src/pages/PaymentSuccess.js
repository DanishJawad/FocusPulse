import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setError('No payment session found');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const res = await axios.post('/api/payment/verify-session', { sessionId });
      if (res.data.success) {
        setUser(res.data.user);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Failed to verify payment. Please contact support.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="payment-success-page">
          <div className="success-card">
            <h2>Verifying payment...</h2>
            <p>Please wait while we confirm your premium upgrade.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="payment-success-page">
          <div className="success-card">
            <h2>⚠️ Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/dashboard')} className="btn-continue">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="payment-success-page">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h1>Welcome to Premium!</h1>
          <p>Your payment was successful. You now have access to all premium features!</p>
          
          <div className="premium-features">
            <h3>Premium Benefits:</h3>
            <ul>
              <li>✨ Unlimited focus sessions</li>
              <li>📊 Advanced analytics and insights</li>
              <li>📈 Detailed productivity reports</li>
              <li>🎯 Priority customer support</li>
              <li>🔔 Custom notifications and reminders</li>
              <li>💾 Extended data history</li>
            </ul>
          </div>

          <button onClick={() => navigate('/dashboard')} className="btn-continue">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
