import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // ⚡ NEW: Newsletter Subscribe Logic ⚡
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ loading: true, message: '', type: '' });

    try {
        const response = await axios.post('https://philgood-travels.onrender.com/api/contact/subscribe', { email });
        setStatus({ loading: false, message: response.data.message, type: 'success' });
        setEmail(''); // Clear input on success
        
        // Hide success message after 3 seconds
        setTimeout(() => setStatus({ loading: false, message: '', type: '' }), 3000);
    } catch (error) {
        const errorMsg = error.response?.data?.error || "Failed to subscribe. Please try again.";
        setStatus({ loading: false, message: errorMsg, type: 'danger' });
        setTimeout(() => setStatus({ loading: false, message: '', type: '' }), 3000);
    }
  };

  return (
    <>
      <footer>
          <div className="waves-container">
              <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                  <defs>
                      <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                  </defs>
                  <g className="parallax">
                      <use xlinkHref="#gentle-wave" x="48" y="0" />
                      <use xlinkHref="#gentle-wave" x="48" y="3" />
                      <use xlinkHref="#gentle-wave" x="48" y="5" />
                      <use xlinkHref="#gentle-wave" x="48" y="7" />
                  </g>
              </svg>
          </div>

          <div className="container">
              <div className="row gy-5">
                  <div className="col-lg-4 col-md-6">
                      <Link className="footer-brand" to="/">
                          <img src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" alt="PhilGood Logo" className="footer-logo-img" />
                      </Link>
                      <p className="mb-4 text-white-50" style={{ maxWidth: '300px' }}>
                          Your gateway to unforgettable Philippine adventures. Discover pristine beaches, majestic mountains, and vibrant culture.
                      </p>
                      <div className="social-links">
                          <a href="#" className="social-btn"><i className="fa-brands fa-facebook-f"></i></a>
                          <a href="#" className="social-btn"><i className="fa-brands fa-instagram"></i></a>
                          <a href="#" className="social-btn"><i className="fa-brands fa-twitter"></i></a>
                      </div>
                  </div>
                  <div className="col-lg-2 col-md-6">
                      <h5 className="footer-heading text-white">Quick Links</h5>
                      <ul className="footer-links">
                          <li><Link to="/destinations">Destinations</Link></li>
                          <li><Link to="/tours">Tour Packages</Link></li>
                          <li><Link to="/gallery">Gallery</Link></li>
                          <li><Link to="/booking">Book Now</Link></li>
                      </ul>
                  </div>
                  <div className="col-lg-3 col-md-6">
                      <h5 className="footer-heading text-white">Contact</h5>
                      <ul className="footer-links contact-list text-white-50">
                          <li><i className="fa-solid fa-location-dot contact-icon text-accent me-2"></i> 123 Travel Street, Manila</li>
                          <li><i className="fa-solid fa-phone contact-icon text-accent me-2"></i> +63 123 456 7890</li>
                          <li><i className="fa-solid fa-envelope contact-icon text-accent me-2"></i> hello@philgoodtravels.com</li>
                      </ul>
                  </div>
                  <div className="col-lg-3 col-md-6">
                      <h5 className="footer-heading text-white">Newsletter</h5>
                      <p className="mb-3 text-white-50">Subscribe for exclusive deals!</p>
                      
                      {/* ⚡ UPDATED FORM ⚡ */}
                      <form onSubmit={handleSubscribe} className="position-relative">
                          <input 
                              type="email" 
                              className="footer-input" 
                              placeholder="Your email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                          />
                          <button type="submit" className="footer-subscribe-btn" disabled={status.loading}>
                              {status.loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                          </button>
                          
                          {/* Alert message directly underneath the form */}
                          {status.message && (
                              <div className={`text-${status.type} fw-bold small mt-2`}>
                                  {status.type === 'success' ? <i className="fa-solid fa-check me-1"></i> : <i className="fa-solid fa-circle-exclamation me-1"></i>}
                                  {status.message}
                              </div>
                          )}
                      </form>
                  </div>
              </div>
              <div className="text-center mt-5 pt-4 border-top border-white border-opacity-25">
                  <small className="text-white-50">&copy; 2024 PhilGood Travels. All rights reserved.</small>
              </div>
          </div>
      </footer>

      {/* --- FLOATING CHAT WIDGET (OVERLAY) --- */}
      <div className="chat-widget-container">
          <div className={`chat-popup ${isChatOpen ? 'show' : ''}`}>
              <div className="chat-popup-header">
                  <h6 className="text-white mb-1 fw-bold font-montserrat">Need Help?</h6>
                  <small className="text-white-50" style={{ fontSize: '0.8rem' }}>Chat directly with our team</small>
              </div>
              <div className="chat-popup-body">
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="chat-platform-btn text-navy">
                      <div className="platform-icon" style={{ backgroundColor: '#25D366' }}><i className="fa-brands fa-whatsapp text-white"></i></div>
                      <span className="fw-bold font-montserrat" style={{ fontSize: '0.9rem' }}>WhatsApp</span>
                  </a>
                  <a href="viber://chat?number=%2B1234567890" target="_blank" rel="noopener noreferrer" className="chat-platform-btn text-navy">
                      <div className="platform-icon" style={{ backgroundColor: '#7360F2' }}><i className="fa-brands fa-viber text-white"></i></div>
                      <span className="fw-bold font-montserrat" style={{ fontSize: '0.9rem' }}>Viber</span>
                  </a>
              </div>
          </div>
          <button className="chat-btn-main" onClick={toggleChat}>
              <i className={`fa-solid ${isChatOpen ? 'fa-xmark' : 'fa-comment-dots'}`}></i>
          </button>
      </div>
    </>
  );
};

export default Footer;