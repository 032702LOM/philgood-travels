import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewsletterPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if the user has already seen or interacted with the popup
    const hasSeenPopup = localStorage.getItem('hasSeenNewsletterPopup');
    const isSubscribed = localStorage.getItem('isSubscribedToNewsletter');

    // If they haven't seen it and aren't subscribed, show it after a short delay
    if (!hasSeenPopup && !isSubscribed) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000); // Pops up after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    // Mark as seen so it doesn't pop up again on refresh or next visit
    localStorage.setItem('hasSeenNewsletterPopup', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact/subscribe`, { email });
      
      toast.success("Success! Check your email for your 10% OFF code 🎉");
      
      // Save subscription status to local storage
      localStorage.setItem('isSubscribedToNewsletter', 'true');
      localStorage.setItem('hasSeenNewsletterPopup', 'true'); // Also mark as seen
      
      setShowPopup(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fade-in" style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 31, 63, 0.7)', // Dark navy overlay
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-lg position-relative text-center mx-3" style={{ maxWidth: '500px', backgroundColor: 'var(--card-bg)', border: '1px solid rgba(0, 180, 216, 0.2)' }}>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="btn btn-sm btn-outline-secondary position-absolute rounded-circle"
          style={{ top: '15px', right: '15px', width: '32px', height: '32px', padding: 0 }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(246, 153, 40, 0.1)' }}>
                <i className="fa-solid fa-envelope-open-text fs-1 text-accent"></i>
            </div>
            <h2 className="text-navy font-montserrat fw-bold mb-2">Get 10% OFF!</h2>
            <p className="text-grey mb-0">Join the PhilGood family and receive a <strong className="text-accent">10% discount code</strong> for your first booking, plus exclusive travel deals.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-with-icon position-relative text-start">
              <i className="fa-regular fa-envelope position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }}></i>
              <input 
                type="email" 
                className="form-control-dark form-control w-100 py-3" 
                placeholder="Enter your email address"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ paddingLeft: '45px' }}
                required 
              />
          </div>
          <button 
            type="submit" 
            className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold shadow"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Code..." : "Send My 10% OFF Code"}
          </button>
        </form>

        <button className="btn btn-link text-muted small mt-3 text-decoration-none" onClick={handleClose}>
          No thanks, I'll pay full price
        </button>

      </div>
    </div>
  );
};

export default NewsletterPopup;