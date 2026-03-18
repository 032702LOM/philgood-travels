import React, { useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';

const Connect = () => {
  const { t } = usePreferences();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent successfully. Our team will get back to you shortly.`);
    setFormData({ name: '', email: '', subject: '', message: '' }); 
  };

  return (
   <div className="fade-in position-relative" style={{ 
        minHeight: '100vh', 
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=100&w=2560&auto=format&fit=crop')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        /* ⚡ FIX: This pulls the footer up so the waves overlap the background image seamlessly! ⚡ */
        marginBottom: '-100px',
        paddingBottom: '100px'
    }}>
      
      {/* A subtle dark overlay ensures the text and cards pop against the bright image */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 31, 63, 0.4)', zIndex: 1 }}></div>

      {/* Container pushes content safely below the navbar and gives it room to breathe */}
      <div className="container position-relative" style={{ zIndex: 10, paddingTop: '150px', paddingBottom: '100px' }}>
          
          <div className="text-center mb-5 scroll-reveal visible">
              <h1 className="hero-title transparent-text" style={{ fontSize: '4rem', textShadow: '2px 2px 10px rgba(0,0,0,0.6)' }}>{t('conn_title', 'Let us Connect')}</h1>
              <p className="section-desc mb-0 force-white-text fw-bold" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.9)' }}>We're here to help you plan your perfect escape.</p>
          </div>

          <div className="row g-5 justify-content-center">
            
            <div className="col-lg-5 scroll-reveal visible">
              {/* backdropFilter adds a frosted glass effect to the cards so they blend beautifully with the bg image */}
              <div className="bg-card-dark p-5 rounded-4 shadow-lg h-100 border border-primary border-opacity-25" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'var(--card-bg)' }}>
                <h3 className="text-navy font-montserrat fw-bold mb-4">Contact Information</h3>
                <p className="text-grey mb-5">Our travel experts are ready to assist you. Reach out to us via email, phone, or visit our office.</p>
                
                <div className="d-flex align-items-center mb-4 pb-2">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                    <i className="fa-solid fa-location-dot fs-4" style={{ color: 'var(--primary-color)' }}></i>
                  </div>
                  <div>
                    <h5 className="text-navy fw-bold mb-1">Head Office</h5>
                    <p className="text-grey mb-0">123 Travel Street, Bonifacio Global City<br/>Taguig, Metro Manila, Philippines</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4 pb-2">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                    <i className="fa-solid fa-phone fs-4" style={{ color: 'var(--primary-color)' }}></i>
                  </div>
                  <div>
                    <h5 className="text-navy fw-bold mb-1">Phone Number</h5>
                    <p className="text-grey mb-0">+63 2 1234 5678<br/>+63 917 123 4567</p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                    <i className="fa-solid fa-envelope fs-4" style={{ color: 'var(--primary-color)' }}></i>
                  </div>
                  <div>
                    <h5 className="text-navy fw-bold mb-1">Email Address</h5>
                    <p className="text-grey mb-0">hello@philgoodtravels.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7 scroll-reveal visible delay-1">
              <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-25" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'var(--card-bg)' }}>
                <h3 className="text-navy font-montserrat fw-bold mb-4">Send Us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6"><label className="text-grey fw-bold small mb-2">Your Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control-dark w-100 shadow-none" placeholder="Juan Dela Cruz" required /></div>
                    <div className="col-md-6"><label className="text-grey fw-bold small mb-2">Your Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control-dark w-100 shadow-none" placeholder="juan@example.com" required /></div>
                    <div className="col-12"><label className="text-grey fw-bold small mb-2">Subject</label><input type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-control-dark w-100 shadow-none" placeholder="How can we help?" required /></div>
                    <div className="col-12"><label className="text-grey fw-bold small mb-2">Message</label><textarea name="message" value={formData.message} onChange={handleChange} className="form-control-dark w-100 shadow-none" style={{ minHeight: '150px' }} placeholder="Write your message here..." required></textarea></div>
                    <div className="col-12 mt-4 pt-2"><button type="submit" className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold shadow">Send Message</button></div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
    </div>
  );
};

export default Connect;