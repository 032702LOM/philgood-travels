import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="fade-in d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '80vh', paddingTop: '76px', backgroundColor: 'var(--bg-dark)' }}>
      <h1 style={{ fontSize: '8rem', color: 'var(--accent-color)', fontWeight: '900', textShadow: '0 10px 30px rgba(255, 159, 28, 0.3)' }}>404</h1>
      <h3 className="text-navy mb-3 font-montserrat fw-bold">Oops! You've wandered off the trail.</h3>
      <p className="text-grey mb-5 max-w-500">The destination you are looking for doesn't exist, has been moved, or is currently uncharted territory.</p>
      <Link to="/" className="btn btn-proceed px-5 py-3 text-uppercase font-montserrat fw-bold shadow-lg">
        Return to Basecamp <i className="fa-solid fa-compass ms-2"></i>
      </Link>
    </div>
  );
};

export default NotFound;