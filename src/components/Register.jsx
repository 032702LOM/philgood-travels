import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', optInNewsletter: true });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (!isPasswordValid || !passwordsMatch) {
      setIsError(true);
      setMessage("Please ensure passwords match and meet all security rules.");
      return;
    }

    setIsSubmitting(true);
    setIsError(false);
    setMessage('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      setMessage(response.data.message);
      setIsError(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '', optInNewsletter: true });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-lg border border-primary border-opacity-10" style={{ maxWidth: '500px', width: '90%', backgroundColor: 'var(--card-bg)' }}>
        
        <div className="text-center mb-4">
            <h2 className="text-navy font-montserrat fw-bold mb-2">Create an Account</h2>
            <p className="text-grey small">Start your adventure with PhilGood Travels</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="mb-3 position-relative">
            <label className="text-grey fw-bold small mb-2">Full Name</label>
            <div className="input-with-icon position-relative">
                <i className="fa-regular fa-user position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}></i>
                <input 
                  type="text" 
                  className="form-control-dark form-control w-100" 
                  placeholder="Juan Dela Cruz"
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  style={{ paddingLeft: '45px' }}
                  required 
                />
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label className="text-grey fw-bold small mb-2">Email Address</label>
            <div className="input-with-icon position-relative">
                <i className="fa-regular fa-envelope position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}></i>
                <input 
                  type="email" 
                  className="form-control-dark form-control w-100" 
                  placeholder="juan@example.com"
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  style={{ paddingLeft: '45px' }}
                  required 
                />
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label className="text-grey fw-bold small mb-2">Password</label>
            <div className="input-with-icon position-relative">
                <i className="fa-solid fa-lock position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}></i>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className={`form-control-dark form-control w-100 ${formData.password.length > 0 && !isPasswordValid ? 'border-danger' : ''}`}
                  placeholder="Create a strong password"
                  value={formData.password} 
                  onChange={handlePasswordChange} 
                  style={{ paddingLeft: '45px', paddingRight: '45px' }}
                  required 
                />
                {/* ⚡ FIX: Added zIndex: 10 so it is never blocked by the input field */}
                <button 
                  type="button" 
                  className="btn btn-link position-absolute text-muted p-0" 
                  style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', textDecoration: 'none', zIndex: 10 }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
            </div>
            
            {/* Password Rules Checklist */}
            {formData.password.length > 0 && (
                <div className="mt-2 p-3 rounded-3" style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <small className="d-block fw-bold mb-2 text-navy">Password Requirements:</small>
                    <div className="row g-2">
                        <div className="col-6">
                            <small className={`d-flex align-items-center ${passwordRules.length ? 'text-success fw-bold' : 'text-muted'}`}>
                                <i className={`fa-solid ${passwordRules.length ? 'fa-check' : 'fa-xmark'} me-2`}></i> 8+ characters
                            </small>
                        </div>
                        <div className="col-6">
                            <small className={`d-flex align-items-center ${passwordRules.uppercase ? 'text-success fw-bold' : 'text-muted'}`}>
                                <i className={`fa-solid ${passwordRules.uppercase ? 'fa-check' : 'fa-xmark'} me-2`}></i> Uppercase letter
                            </small>
                        </div>
                        <div className="col-6">
                            <small className={`d-flex align-items-center ${passwordRules.number ? 'text-success fw-bold' : 'text-muted'}`}>
                                <i className={`fa-solid ${passwordRules.number ? 'fa-check' : 'fa-xmark'} me-2`}></i> Number
                            </small>
                        </div>
                        <div className="col-6">
                            <small className={`d-flex align-items-center ${passwordRules.special ? 'text-success fw-bold' : 'text-muted'}`}>
                                <i className={`fa-solid ${passwordRules.special ? 'fa-check' : 'fa-xmark'} me-2`}></i> Special char (!@#$%)
                            </small>
                        </div>
                    </div>
                </div>
            )}
          </div>

          <div className="mb-4 position-relative">
            <label className="text-grey fw-bold small mb-2">Confirm Password</label>
            <div className="input-with-icon position-relative">
                <i className="fa-solid fa-lock position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}></i>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className={`form-control-dark form-control w-100 ${formData.confirmPassword.length > 0 && !passwordsMatch ? 'border-danger' : formData.confirmPassword.length > 0 && passwordsMatch ? 'border-success' : ''}`}
                  placeholder="Repeat your password"
                  value={formData.confirmPassword} 
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                  style={{ paddingLeft: '45px', paddingRight: '45px' }}
                  required 
                />
                {/* ⚡ FIX: Added zIndex: 10 so it is never blocked by the input field */}
                <button 
                  type="button" 
                  className="btn btn-link position-absolute text-muted p-0" 
                  style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', textDecoration: 'none', zIndex: 10 }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
            </div>
            
            {formData.confirmPassword && !passwordsMatch && (
              <small className="text-danger mt-1 d-block fw-bold"><i className="fa-solid fa-triangle-exclamation me-1"></i> Passwords do not match.</small>
            )}
            {formData.confirmPassword && passwordsMatch && formData.password.length > 0 && (
              <small className="text-success mt-1 d-block fw-bold"><i className="fa-solid fa-check me-1"></i> Passwords match!</small>
            )}
          </div>

          {/* Newsletter Checkbox */}
          <div className="mb-4 form-check border border-primary border-opacity-25 rounded-3 p-3 text-start" style={{ backgroundColor: 'rgba(0, 180, 216, 0.05)' }}>
            <div className="d-flex">
                <input 
                  type="checkbox" 
                  className="form-check-input mt-1 ms-0 me-3" 
                  id="optInNewsletter" 
                  checked={formData.optInNewsletter}
                  onChange={(e) => setFormData({ ...formData, optInNewsletter: e.target.checked })}
                  style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                />
                <label className="form-check-label small text-navy fw-bold" htmlFor="optInNewsletter" style={{ cursor: 'pointer' }}>
                  Send me exclusive travel deals, hidden gem destinations, and my <span className="text-accent">10% OFF</span> welcome code!
                </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-proceed w-100 mt-2 py-3 text-uppercase font-montserrat fw-bold shadow"
            disabled={isSubmitting || (formData.password.length > 0 && (!isPasswordValid || !passwordsMatch))}
          >
            {isSubmitting ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
            <small className="text-grey">Already have an account? <Link to="/login" className="text-accent fw-bold text-decoration-none">Log In</Link></small>
        </div>

        {message && (
          <div className={`mt-3 text-center fw-bold small ${isError ? 'text-danger' : 'text-success'}`}>
             {message}
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;