import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // ⚡ ADDED useNavigate
import { useAuth } from '../context/AuthContext'; // ⚡ ADDED useAuth

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ⚡ Hook into our Auth Context and Router
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
      
      setMessage(response.data.message);
      setIsError(false);
      
      // ⚡ Replace the manual localStorage and window.location.href with this:
      login(response.data.token, response.data.user);
      navigate('/'); // Instantly routes to home without a page reload!

    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '76px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-10" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--card-bg)' }}>
        
        <div className="text-center mb-4">
            <div className="text-navy font-montserrat fw-bold mb-2" style={{ fontSize: '1.2rem' }}>Sign in to</div>
            <img 
              src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" 
              alt="PhilGood Travels Logo" 
              style={{ height: '75px', width: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} 
            />
        </div>
        
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
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
              type={showPassword ? "text" : "password"} // ⚡ NEW: Dynamic type
              className="form-control-dark w-100 shadow-none" 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ paddingRight: '40px' }} // Prevent text from hiding behind the icon
              required 
            />
            {/* ⚡ NEW: Eye Icon Toggle */}
            <button 
              type="button" 
              className="btn position-absolute end-0 top-50 translate-middle-y border-0 shadow-none" 
              style={{ color: 'var(--text-grey)' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>

          {/* ⚡ NEW: Forgot Password Link */}
          <div className="text-end mt-1 mb-1">
              <Link to="/forgot-password" className="text-grey small text-decoration-none fw-bold" style={{ fontSize: '0.8rem' }}>
                  Forgot Password?
              </Link>
          </div>

          <button 
            type="submit" 
            className="btn btn-proceed w-100 mt-2 py-3 text-uppercase font-montserrat fw-bold shadow"
            disabled={isSubmitting} // ⚡ Disable spam clicking
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* ⚡ NEW: Sign Up Link for new users */}
        <div className="text-center mt-4">
            <small className="text-grey">Don't have an account? <Link to="/register" className="text-accent fw-bold text-decoration-none">Sign Up</Link></small>
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

export default Login;