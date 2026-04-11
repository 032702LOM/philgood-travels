import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('https://philgood-travels.onrender.com/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '76px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-10" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--card-bg)' }}>
        
        <div className="text-center mb-4">
            <div className="text-navy font-montserrat fw-bold mb-2" style={{ fontSize: '1.2rem' }}>Reset Password</div>
            <img 
              src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" 
              alt="PhilGood Travels Logo" 
              style={{ height: '75px', width: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} 
            />
        </div>
        
        <p className="text-center text-grey small mb-4">Enter your email address and we will send you a link to reset your password.</p>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <input 
              type="email" 
              className="form-control-dark w-100 shadow-none" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-proceed w-100 mt-2 py-3 text-uppercase font-montserrat fw-bold shadow"
            disabled={isSubmitting || !email}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-4">
            <small className="text-grey"><Link to="/login" className="text-accent fw-bold text-decoration-none"><i className="fa-solid fa-arrow-left me-1"></i> Back to Login</Link></small>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded text-center fw-bold small text-success" style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;