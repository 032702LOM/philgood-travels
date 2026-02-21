import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sends the data to your Node.js backend on port 5000!
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(response.data.message);
      setIsError(false);
      setFormData({ name: '', email: '', password: '' }); // Clears the form on success
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
      setIsError(true);
    }
  };

  return (
    <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '76px' }}>
      <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-secondary border-opacity-25" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-white font-montserrat fw-bold text-center mb-4">Join PhilGood Travels</h2>
        
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <input 
              type="text" 
              className="form-control-dark w-100" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
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
              placeholder="Create Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="btn btn-proceed w-100 mt-3 py-3 text-uppercase font-montserrat fw-bold">Sign Up</button>
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

export default Register;