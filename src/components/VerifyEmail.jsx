import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // Tracks 'verifying', 'success', or 'error'
  const [message, setMessage] = useState('Verifying your email address...');
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      // 1. Extract the token from the URL (e.g., ?token=12345abcdef)
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      // 2. If someone navigates here without a token, show an error
      if (!token) {
        setStatus('error');
        setMessage('No verification token found in the link.');
        return;
      }

      // 3. Send the token to our backend to validate
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, { token });
        setStatus('success');
        setMessage(response.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyToken();
  }, [location]);

  return (
    <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '76px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-10 text-center" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--card-bg)' }}>
        
        <div className="mb-4">
          <img 
            src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" 
            alt="PhilGood Travels Logo" 
            style={{ height: '75px', width: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} 
          />
        </div>

        <h3 className="text-navy font-montserrat fw-bold mb-3">Email Verification</h3>

        {/* LOADING STATE */}
        {status === 'verifying' && (
          <div className="text-grey fw-bold">
            <i className="fa-solid fa-spinner fa-spin text-accent me-2 fs-4 mb-3"></i>
            <p>{message}</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <div className="fade-in">
            <div className="text-success mb-3">
              <i className="fa-solid fa-circle-check" style={{ fontSize: '3.5rem' }}></i>
            </div>
            <p className="text-grey fw-bold mb-4">{message}</p>
            <Link to="/login" className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold shadow">
              Proceed to Login
            </Link>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="fade-in">
            <div className="text-danger mb-3">
              <i className="fa-solid fa-circle-xmark" style={{ fontSize: '3.5rem' }}></i>
            </div>
            <p className="text-grey fw-bold mb-4">{message}</p>
            <Link to="/register" className="btn btn-outline-custom w-100 py-3 text-uppercase font-montserrat fw-bold">
              Back to Sign Up
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;