import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    gymnastics_type: '',
    gender: '',
    age: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.gymnastics_type) {
      toast({
        title: "Required field",
        description: "Please select your gymnastics type",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/complete-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to complete profile');
      }

      toast({
        title: "Welcome to RAZE! 🎉",
        description: "Your profile is complete. Check your email for your welcome discount!"
      });

      // Refresh user data
      await checkAuth();
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to complete profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="complete-profile-page">
      <div className="container">
        <div className="complete-profile-container">
          <div className="complete-profile-header">
            <h1 className="complete-profile-title">Welcome to RAZE!</h1>
            <p className="complete-profile-subtitle">
              Just one more step to personalize your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="complete-profile-form">
            <div className="form-field">
              <label htmlFor="gymnastics_type" className="form-label">
                What type of gymnastics do you do?
              </label>
              <select
                id="gymnastics_type"
                name="gymnastics_type"
                value={formData.gymnastics_type}
                onChange={handleChange}
                required
                className="form-input form-select"
              >
                <option value="">Select...</option>
                <option value="mag">MAG - Men's Artistic Gymnastics</option>
                <option value="wag">WAG - Women's Artistic Gymnastics</option>
                <option value="other">Other</option>
              </select>
            </div>

            {formData.gymnastics_type === 'other' && (
              <div className="form-field">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="form-input form-select"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="age" className="form-label">Age (Optional)</label>
              <input
                id="age"
                name="age"
                type="number"
                min="13"
                max="120"
                value={formData.age}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your age"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? 'Completing...' : 'Complete Profile'}
            </Button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .complete-profile-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          padding: 20px;
        }

        .complete-profile-container {
          max-width: 500px;
          width: 100%;
          background: rgba(26, 26, 26, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .complete-profile-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .complete-profile-title {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .complete-profile-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
        }

        .complete-profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .form-input,
        .form-select {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 15px;
          transition: all 0.2s;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #00d9ff;
          background: rgba(255, 255, 255, 0.08);
        }

        .form-select {
          cursor: pointer;
        }

        .submit-btn {
          margin-top: 12px;
          padding: 14px;
          background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 217, 255, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CompleteProfile;
