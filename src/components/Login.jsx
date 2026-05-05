import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast'; // ⚡ Using toast for consistency

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ⚡ Hook into our updated Auth Context
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // ⚡ The token is now automatically handled by the backend cookie
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
      
      const userData = response.data.user;

      // ⚡ UPDATED: Passing only user data to the global state
      login(userData);
      
      toast.success(response.data.message || "Welcome back!");

      // ⚡ AUTOMATION: Direct the user based on their role
      if (userData.isAdmin) {
          navigate('/admin'); // No more manual typing needed!
      } else {
          navigate('/'); 
      }

    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.error || "Login failed. Please check your credentials.");
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
            <label className="text-grey small fw-bold mb-1">Email Address</label>
            <input 
              type="email" 
              className="form-control-dark w-100 shadow-none" 
              placeholder="juan@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          
          <div className="position-relative">
            <div className="d-flex justify-content-between">
                <label className="text-grey small fw-bold mb-1">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--accent-color)', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
            <div className="position-relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control-dark w-100 shadow-none" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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
          </div>

          <button 
            type="submit" 
            className="btn btn-proceed w-100 mt-2 py-3 text-uppercase font-montserrat fw-bold shadow"
            disabled={isSubmitting}
          >
            {isSubmitting ? <><i className="fa-solid fa-spinner fa-spin me-2"></i> Logging in...</> : "Log In"}
          </button>
        </form>

        <div className="text-center mt-4">
            <small className="text-grey">Don't have an account? <Link to="/register" className="text-accent fw-bold text-decoration-none">Sign Up</Link></small>
        </div>
      </div>
    </div>
  );
};

export default Login;