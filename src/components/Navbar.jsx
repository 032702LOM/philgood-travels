import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  // Modal State
  const [showPrefModal, setShowPrefModal] = useState(false);
  const [activeTab, setActiveTab] = useState('language'); // 'language' or 'currency'

  const { 
      language, setLanguage, currency, setCurrency, 
      theme, setTheme, 
      t, availableCurrencies, availableLanguages 
  } = usePreferences();

  // ==========================================
  // --- AUTHENTICATION STATE ---
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('');

  // Check if the user has a VIP Wristband when the Navbar loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      setIsLoggedIn(true);
      const userObj = JSON.parse(userStr);
      setFirstName(userObj.name.split(' ')[0]); // Grab just their first name
    }
  }, []);

  // Function to securely log out
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/'; // Refresh the page to clear everything
  };
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (tab) => {
      setActiveTab(tab);
      setShowPrefModal(true);
  };

  return (
    <>
        <nav className={`navbar navbar-expand-lg fixed-top navbar-dark ${scrolled ? 'scrolled' : ''}`} id="mainNav">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" alt="PhilGood Logo" className="navbar-logo-img" />
                </Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto align-items-center">
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/" end>{t('nav_home')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/destinations">{t('nav_dest')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/tours">{t('nav_tours')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/gallery">{t('nav_gallery')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/connect">{t('nav_connect')}</NavLink>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex gap-2">
                            {/* --- THEME TOGGLE BUTTON --- */}
                            <button 
                                className="btn btn-sm btn-outline-secondary text-white border-0 d-flex align-items-center justify-content-center" 
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                                title="Toggle Theme"
                            >
                                <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-warning' : 'fa-moon text-dark'}`}></i>
                            </button>

                            {/* --- CURRENCY & LANGUAGE BUTTONS --- */}
                            <button className="btn btn-sm btn-outline-secondary text-white border-0 d-flex align-items-center gap-2" onClick={() => openModal('currency')}>
                                <span className="fw-bold">{currency}</span>
                            </button>
                            <button className="btn btn-sm btn-outline-secondary text-white border-0 d-flex align-items-center gap-2" onClick={() => openModal('language')}>
                                <i className="fa-solid fa-globe"></i>
                                <span className="text-uppercase">{language}</span>
                            </button>
                        </div>

                      {/* 👉 SMART AUTH BUTTONS (LOGIN / SIGN UP / LOGOUT) */}
{isLoggedIn ? (
    <div className="d-none d-lg-flex align-items-center me-3 gap-3">
        {/* 👉 UPDATED: Made the name a clickable link to the Dashboard! */}
        <Link to="/profile" className="text-white fw-bold font-montserrat text-decoration-none social-hover" style={{ color: '#2A9D8F' }}>
            Hi, {firstName}!
        </Link>
        <button onClick={handleLogout} className="btn text-white fw-bold" style={{ textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 16px', borderRadius: '4px', background: 'transparent' }}>
            LOGOUT
        </button>
    </div>
) : (
                            <div className="d-none d-lg-flex align-items-center me-3 gap-2">
                                <Link to="/login" className="btn text-white fw-bold" style={{ textDecoration: 'none' }}>
                                    LOGIN
                                </Link>
                                <Link to="/register" className="btn text-white fw-bold" style={{ textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 16px', borderRadius: '4px' }}>
                                    SIGN UP
                                </Link>
                            </div>
                        )}

                        <Link to="/booking" className="btn-book-nav d-none d-lg-block">{t('nav_book')}</Link>
                    </div>
                </div>
            </div>
        </nav>

        {/* --- GLOBAL PREFERENCES MODAL --- */}
        {showPrefModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(2, 22, 37, 0.85)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                <div className="modal-dialog modal-dialog-centered modal-lg"> 
                    <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: '#03233B', borderRadius: '16px' }}>
                        
                        <div className="modal-header border-bottom border-secondary border-opacity-25 pb-3">
                            <h5 className="modal-title text-white font-montserrat fw-bold">Regional Settings</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowPrefModal(false)}></button>
                        </div>

                        <div className="modal-body p-0">
                            {/* TABS */}
                            <div className="d-flex border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-25">
                                <button className={`pref-tab flex-grow-1 ${activeTab === 'language' ? 'active' : ''}`} onClick={() => setActiveTab('language')}>
                                    <i className="fa-solid fa-language me-2"></i> Language
                                </button>
                                <button className={`pref-tab flex-grow-1 ${activeTab === 'currency' ? 'active' : ''}`} onClick={() => setActiveTab('currency')}>
                                    <i className="fa-solid fa-coins me-2"></i> Currency
                                </button>
                            </div>

                            {/* GRID CONTENT */}
                            <div className="p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                <div className="row g-3">
                                    
                                    {activeTab === 'language' && availableLanguages.map((lang) => (
                                        <div className="col-6 col-md-4 col-lg-3" key={lang.code}>
                                            <div className={`pref-grid-item ${language === lang.code ? 'active' : ''}`} onClick={() => { setLanguage(lang.code); setShowPrefModal(false); }}>
                                                <div className="d-flex flex-column text-start">
                                                    <span className="text-white fw-bold" style={{ fontSize: '0.9rem' }}>{lang.native}</span>
                                                    <span className="text-white-50" style={{ fontSize: '0.75rem' }}>{lang.name}</span>
                                                </div>
                                                {language === lang.code && <i className="fa-solid fa-check text-accent ms-auto"></i>}
                                            </div>
                                        </div>
                                    ))}

                                    {activeTab === 'currency' && availableCurrencies.map((curr) => (
                                        <div className="col-6 col-md-4 col-lg-4" key={curr.code}>
                                            <div className={`pref-grid-item ${currency === curr.code ? 'active' : ''}`} onClick={() => { setCurrency(curr.code); setShowPrefModal(false); }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="text-white-50 bg-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', fontSize: '0.85rem' }}>
                                                        {curr.symbol}
                                                    </div>
                                                    <div className="d-flex flex-column text-start">
                                                        <span className="text-white fw-bold" style={{ fontSize: '0.9rem' }}>{curr.code}</span>
                                                        <span className="text-white-50" style={{ fontSize: '0.75rem' }}>{curr.name}</span>
                                                    </div>
                                                </div>
                                                {currency === curr.code && <i className="fa-solid fa-check text-accent ms-auto"></i>}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default Navbar;