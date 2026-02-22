import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://philgood-travels.onrender.com/api/auth/login', formData);
      
      // 1. Show success message
      setMessage(response.data.message);
      setIsError(false);
      
      // 2. Save the "VIP Wristband" (JWT Token) to the browser's local storage
      localStorage.setItem('token', response.data.token);
      
      // 3. Save basic user info to display their name later
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // 4. ⚡ THE FIX: Force a hard refresh to the homepage so the Navbar updates instantly!
      setTimeout(() => {
        window.location.href = '/'; 
      }, 1500);

    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
      setIsError(true);
    }
  };

  return (
    <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '76px' }}>
      <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-secondary border-opacity-25" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-white font-montserrat fw-bold text-center mb-4">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <input 
              type="email" 
              className="form-control-dark w-100" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              className="form-control-dark w-100" 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="btn btn-proceed w-100 mt-3 py-3 text-uppercase font-montserrat fw-bold">Log In</button>
        </form>

        {message && (
          <div className={`mt-4 text-center fw-bold ${isError ? 'text-danger' : 'text-success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;