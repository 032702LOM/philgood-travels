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
    <div className="fade-in" style={{ paddingTop: '76px' }}>
      
      {/* --- FOOLPROOF HERO SECTION --- */}
      <section className="contact-hero" style={{ 
          backgroundImage: "linear-gradient(to bottom, rgba(2, 26, 46, 0.4), #021A2E), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop')",
          padding: '130px 0 50px 0', backgroundSize: 'cover', backgroundPosition: 'center 30%'
      }}>
          <div className="container text-center mb-4 scroll-reveal visible">
              <h1 className="hero-title" style={{ fontSize: '4rem' }}>{t('conn_title', 'GET IN TOUCH')}</h1>
              <p className="section-desc mb-0">{t('conn_desc', 'We are here to help you plan your dream vacation')}</p>
          </div>
      </section>

      <section className="py-5" style={{ minHeight: '500px' }}>
        <div className="container">
          <div className="row g-5">
            
            <div className="col-lg-5 scroll-reveal visible">
              <h3 className="fw-bold mb-4 font-montserrat text-white">Contact Information</h3>
              <p className="text-white-50 mb-5">Have questions about our tour packages or need help building your custom itinerary? Reach out to our team of travel experts!</p>
              
              <div className="d-flex align-items-start mb-4"><div className="icon-box me-3 mt-1" style={{ fontSize: '1.5rem', color: '#E76F51' }}><i className="fa-solid fa-location-dot"></i></div><div><h5 className="font-montserrat fw-bold text-white mb-1">Our Office</h5><p className="text-white-50 mb-0">123 Travel Street<br/>Makati City, Metro Manila<br/>Philippines</p></div></div>
              <div className="d-flex align-items-start mb-4"><div className="icon-box me-3 mt-1" style={{ fontSize: '1.5rem', color: '#E76F51' }}><i className="fa-solid fa-phone"></i></div><div><h5 className="font-montserrat fw-bold text-white mb-1">Phone</h5><p className="text-white-50 mb-0">+63 123 456 7890<br/>+63 098 765 4321</p></div></div>
              <div className="d-flex align-items-start mb-4"><div className="icon-box me-3 mt-1" style={{ fontSize: '1.5rem', color: '#E76F51' }}><i className="fa-solid fa-envelope"></i></div><div><h5 className="font-montserrat fw-bold text-white mb-1">Email</h5><p className="text-white-50 mb-0">hello@philgoodtravels.com<br/>support@philgoodtravels.com</p></div></div>
              <hr className="border-secondary my-5 border-opacity-25" />
              <h5 className="font-montserrat fw-bold text-white mb-3">Follow Us</h5>
              <div className="d-flex gap-3">
                  <a href="#" className="social-btn" style={{ width: '45px', height: '45px', backgroundColor: '#03233B', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="#" className="social-btn" style={{ width: '45px', height: '45px', backgroundColor: '#03233B', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><i className="fa-brands fa-instagram"></i></a>
                  <a href="#" className="social-btn" style={{ width: '45px', height: '45px', backgroundColor: '#03233B', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><i className="fa-brands fa-tiktok"></i></a>
              </div>
            </div>

            <div className="col-lg-7 scroll-reveal visible">
              <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-secondary border-opacity-25">
                <h3 className="fw-bold mb-4 font-montserrat text-white">Send us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6"><label className="text-white-50 small mb-2">Your Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control-dark w-100 shadow-none" placeholder="Juan Dela Cruz" required /></div>
                    <div className="col-md-6"><label className="text-white-50 small mb-2">Your Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control-dark w-100 shadow-none" placeholder="juan@example.com" required /></div>
                    <div className="col-12"><label className="text-white-50 small mb-2">Subject</label><input type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-control-dark w-100 shadow-none" placeholder="How can we help?" required /></div>
                    <div className="col-12"><label className="text-white-50 small mb-2">Message</label><textarea name="message" value={formData.message} onChange={handleChange} className="form-control-dark w-100 shadow-none" style={{ minHeight: '150px' }} placeholder="Write your message here..." required></textarea></div>
                    <div className="col-12 mt-4 pt-2"><button type="submit" className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold">Send Message</button></div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Connect;