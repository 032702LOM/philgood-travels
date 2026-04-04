import React, { useState } from 'react';
import axios from 'axios';
import { usePreferences } from '../context/PreferencesContext';
import connectBgImg from '../assets/img/Letsconnect.png';

const Connect = () => {
  const { t } = usePreferences();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        // ⚡ NEW: Send the form data to our backend API!
        await axios.post('https://philgood-travels.onrender.com/api/contact/send', formData);
        
        alert(`Thank you, ${formData.name}! Your message has been sent successfully.`);
        setFormData({ name: '', email: '', subject: '', message: '' }); 
    } catch (error) {
        alert("Sorry, there was an error sending your message. Please try again later.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in position-relative connect-page-bg" style={{ backgroundColor: '#023E8A', backgroundImage: `url(${connectBgImg})` }}>
      
      <div className="container position-relative" style={{ zIndex: 10, paddingTop: '150px', paddingBottom: '100px' }}>
          
          <div className="text-center mb-5 scroll-reveal visible">
              <h1 className="hero-title transparent-text" style={{ fontSize: '4rem', textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
                {t('conn_title', 'Let us Connect')}
              </h1>
          </div>

          <div className="row g-5 justify-content-center">
            
            <div className="col-lg-5 scroll-reveal visible">
              <div className="bg-card-dark p-5 rounded-4 shadow-lg h-100 border border-primary border-opacity-25" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'var(--card-bg)' }}>
                <h3 className="text-navy font-montserrat fw-bold mb-4">{t('contact_info', 'Contact Information')}</h3>
                <p className="text-grey mb-5">{t('contact_desc', 'Our travel experts are ready to assist you. Reach out to us via email, phone, or visit our office.')}</p>
                
                <div className="d-flex align-items-center mb-4 pb-2">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                    <i className="fa-solid fa-location-dot fs-4" style={{ color: 'var(--primary-color)' }}></i>
                  </div>
                  <div>
                    <h5 className="text-navy fw-bold mb-1">{t('head_office', 'Head Office')}</h5>
                    <p className="text-grey mb-0">123 Travel Street, Bonifacio Global City<br/>Taguig, Metro Manila, Philippines</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4 pb-2">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                    <i className="fa-solid fa-phone fs-4" style={{ color: 'var(--primary-color)' }}></i>
                  </div>
                  <div>
                    <h5 className="text-navy fw-bold mb-1">{t('phone', 'Phone Number')}</h5>
                    <p className="text-grey mb-0">+63 2 1234 5678<br/>+63 917 123 4567</p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                    <i className="fa-solid fa-envelope fs-4" style={{ color: 'var(--primary-color)' }}></i>
                  </div>
                  <div>
                    <h5 className="text-navy fw-bold mb-1">{t('email_addr', 'Email Address')}</h5>
                    <p className="text-grey mb-0">hello@philgoodtravels.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7 scroll-reveal visible delay-1">
              <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-25" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'var(--card-bg)' }}>
                <h3 className="text-navy font-montserrat fw-bold mb-4">{t('send_msg', 'Send Us a Message')}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                        <label className="text-grey fw-bold small mb-2">{t('your_name', 'Your Name')}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control-dark w-100 shadow-none" placeholder="Juan Dela Cruz" required />
                    </div>
                    <div className="col-md-6">
                        <label className="text-grey fw-bold small mb-2">{t('your_email', 'Your Email')}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control-dark w-100 shadow-none" placeholder="juan@example.com" required />
                    </div>
                    <div className="col-12">
                        <label className="text-grey fw-bold small mb-2">{t('subject', 'Subject')}</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-control-dark w-100 shadow-none" placeholder={t('placeholder_help', 'How can we help?')} required />
                    </div>
                    <div className="col-12">
                        <label className="text-grey fw-bold small mb-2">{t('message', 'Message')}</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} className="form-control-dark w-100 shadow-none" style={{ minHeight: '150px' }} placeholder={t('placeholder_msg', 'Write your message here...')} required></textarea>
                    </div>
                    <div className="col-12 mt-4 pt-2">
                        <button type="submit" className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold shadow" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : t('btn_send', 'SEND MESSAGE')}
                        </button>
                    </div>
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