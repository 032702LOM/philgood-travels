import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="fade-in d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '80vh', paddingTop: '76px' }}>
      <h1 style={{ fontSize: '8rem', color: '#2A9D8F', fontWeight: '900', textShadow: '0 10px 30px rgba(42,157,143,0.3)' }}>404</h1>
      <h3 className="text-white mb-3 font-montserrat fw-bold">Oops! You've wandered off the trail.</h3>
      <p className="text-white-50 mb-5 max-w-500">The destination you are looking for doesn't exist, has been moved, or is currently uncharted territory.</p>
      <Link to="/" className="btn btn-proceed px-5 py-3 text-uppercase font-montserrat fw-bold shadow-lg">
        Return to Basecamp <i className="fa-solid fa-compass ms-2"></i>
      </Link>
    </div>
  );
};

export default NotFound;