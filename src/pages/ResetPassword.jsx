import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ResetPassword = () => {
  // ⚡ Extract the dynamic token from the URL
  const { token } = useParams();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, password: val });

    setPasswordRules({
      length: val.length >= 8,
      uppercase: /[A-Z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
    });
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid || !passwordsMatch) return;

    setIsSubmitting(true);
    try {
      // ⚡ Send the new password to our backend, using the token in the URL parameter
      const response = await axios.post(`https://philgood-travels.onrender.com/api/auth/reset-password/${token}`, { 
          password: formData.password 
      });
      
      setMessage(response.data.message);
      setIsError(false);
      setIsSuccess(true);
      setFormData({ password: '', confirmPassword: '' }); 
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to reset password. The link may have expired.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully reset, just show a success screen and a login button
  if (isSuccess) {
      return (
        <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '76px', backgroundColor: 'var(--bg-dark)' }}>
            <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-10 text-center" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--card-bg)' }}>
                <div className="text-success mb-3"><i className="fa-solid fa-circle-check" style={{ fontSize: '3.5rem' }}></i></div>
                <h3 className="text-navy font-montserrat fw-bold mb-3">Password Updated!</h3>
                <p className="text-grey fw-bold mb-4">{message}</p>
                <Link to="/login" className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold shadow">Proceed to Login</Link>
            </div>
        </div>
      );
  }

  return (
    <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '76px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-10" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--card-bg)' }}>
        
        <div className="text-center mb-4">
            <div className="text-navy font-montserrat fw-bold mb-2" style={{ fontSize: '1.2rem' }}>Create New Password</div>
        </div>
        
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          
          <div className="position-relative">
            <input 
              type={showPassword ? "text" : "password"} 
              className="form-control-dark w-100 shadow-none" 
              placeholder="New Password" 
              value={formData.password}
              onChange={handlePasswordChange}
              style={{ paddingRight: '40px' }}
              required 
            />
            <button 
              type="button" 
              className="btn position-absolute end-0 top-50 translate-middle-y border-0 shadow-none" 
              style={{ color: 'var(--text-grey)' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>

          {formData.password && (
            <div className="p-3 rounded-3 mt-1" style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
              <p className="text-navy small fw-bold mb-2">Password Requirements:</p>
              <ul className="list-unstyled m-0 small" style={{ fontSize: '0.8rem' }}>
                <li className={passwordRules.length ? 'text-success' : 'text-grey'}><i className={`fa-solid ${passwordRules.length ? 'fa-check' : 'fa-circle-xmark'} me-2`}></i> At least 8 characters</li>
                <li className={passwordRules.uppercase ? 'text-success' : 'text-grey'}><i className={`fa-solid ${passwordRules.uppercase ? 'fa-check' : 'fa-circle-xmark'} me-2`}></i> One uppercase letter</li>
                <li className={passwordRules.number ? 'text-success' : 'text-grey'}><i className={`fa-solid ${passwordRules.number ? 'fa-check' : 'fa-circle-xmark'} me-2`}></i> One number</li>
                <li className={passwordRules.special ? 'text-success' : 'text-grey'}><i className={`fa-solid ${passwordRules.special ? 'fa-check' : 'fa-circle-xmark'} me-2`}></i> One special character (!@#$...)</li>
              </ul>
            </div>
          )}

          <div className="position-relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              className={`form-control-dark w-100 shadow-none ${formData.confirmPassword && !passwordsMatch ? 'border-danger' : ''}`} 
              placeholder="Confirm New Password" 
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={{ paddingRight: '40px' }}
              required 
            />
            <button 
              type="button" 
              className="btn position-absolute end-0 top-0 mt-1 border-0 shadow-none" 
              style={{ color: 'var(--text-grey)' }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
            
            {formData.confirmPassword && !passwordsMatch && (
              <small className="text-danger mt-1 d-block fw-bold"><i className="fa-solid fa-triangle-exclamation me-1"></i> Passwords do not match.</small>
            )}
            {formData.confirmPassword && passwordsMatch && formData.password.length > 0 && (
              <small className="text-success mt-1 d-block fw-bold"><i className="fa-solid fa-check me-1"></i> Passwords match!</small>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-proceed w-100 mt-3 py-3 text-uppercase font-montserrat fw-bold shadow"
            disabled={isSubmitting || (formData.password.length > 0 && (!isPasswordValid || !passwordsMatch))}
          >
            {isSubmitting ? "Processing..." : "Reset Password"}
          </button>
        </form>

        {message && isError && (
          <div className="mt-4 p-3 rounded text-center fw-bold small text-danger" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;