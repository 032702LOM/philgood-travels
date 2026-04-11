import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⚡ NEW: Real-time password validation tracker
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, password: val });

    // ⚡ NEW: Test the password against our creation limitations
    setPasswordRules({
      length: val.length >= 8,
      uppercase: /[A-Z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
    });
  };

  // ⚡ NEW: Check if all rules are passed
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
        setMessage("Please ensure your password meets all security requirements.");
        setIsError(true);
        return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('https://philgood-travels.onrender.com/api/auth/register', formData);
      setMessage(response.data.message);
      setIsError(false);
      setFormData({ name: '', email: '', password: '' }); 
      setPasswordRules({ length: false, uppercase: false, number: false, special: false });
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '76px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-10" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--card-bg)' }}>
        
        <div className="text-center mb-4">
            <div className="text-navy font-montserrat fw-bold mb-2" style={{ fontSize: '1.2rem' }}>Join</div>
            <img 
              src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" 
              alt="PhilGood Travels Logo" 
              style={{ height: '75px', width: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} 
            />
        </div>
        
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <input 
              type="text" 
              className="form-control-dark w-100 shadow-none" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div>
            <input 
              type="email" 
              className="form-control-dark w-100 shadow-none" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          
          <div className="position-relative">
            <input 
              type="password" 
              className="form-control-dark w-100 shadow-none" 
              placeholder="Create Password" 
              value={formData.password}
              onChange={handlePasswordChange}
              required 
            />
          </div>

          {/* ⚡ NEW: Visual Validation Checklist */}
          {formData.password && (
            <div className="p-3 rounded-3 mt-1" style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
              <p className="text-navy small fw-bold mb-2">Password Requirements:</p>
              <ul className="list-unstyled m-0 small" style={{ fontSize: '0.8rem' }}>
                <li className={passwordRules.length ? 'text-success' : 'text-grey'}>
                  <i className={`fa-solid ${passwordRules.length ? 'fa-check' : 'fa-circle-xmark'} me-2`}></i> At least 8 characters
                </li>
                <li className={passwordRules.uppercase ? 'text-success' : 'text-grey'}>
                  <i className={`fa-solid ${passwordRules.uppercase ? 'fa-check' : 'fa-circle-xmark'} me-2`}></i> One uppercase letter
                </li>
                <li className={passwordRules.number ? 'text-success' : 'text-grey'}>
                  <i className={`fa-solid ${passwordRules.number ? 'fa-check' : 'fa-circle-xmark'} me-2`}></i> One number
                </li>
                <li className={passwordRules.special ? 'text-success' : 'text-grey'}>
                  <i className={`fa-solid ${passwordRules.special ? 'fa-check' : 'fa-circle-xmark'} me-2`}></i> One special character (!@#$...)
                </li>
              </ul>
            </div>
          )}

          {/* ⚡ NEW: Button is disabled until all rules are met */}
          <button 
            type="submit" 
            className="btn btn-proceed w-100 mt-3 py-3 text-uppercase font-montserrat fw-bold shadow"
            disabled={isSubmitting || (formData.password.length > 0 && !isPasswordValid)}
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