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
    setFirstName('');
    window.location.href = '/'; 
  };

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

  return (
    <>
        <nav className={`navbar navbar-expand-lg ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                
                <Link className="navbar-brand" to="/">
                    <img src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" alt="PhilGood Logo" className="navbar-logo-img" />
                </Link>
                
                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <i className="fa-solid fa-bars text-white fs-2"></i>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" end>{t('nav_home', 'Home')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/destinations">{t('nav_dest', 'Destinations')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/tours">{t('nav_tours', 'Tour Packages')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/gallery">{t('nav_gallery', 'Gallery')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/connect">{t('nav_connect', 'Connect')}</NavLink>
                        </li>
                    </ul>
                    
                    <div className="d-flex align-items-center gap-2">
                        
                        {/* Preferences Button */}
                        <button className="btn btn-link text-white text-decoration-none ms-2" onClick={() => setShowPrefModal(true)} title="Preferences">
                            <i className="fa-solid fa-globe fs-5"></i>
                        </button>

                        {/* AUTHENTICATION UI */}
                        {isLoggedIn ? (
                            <div className="nav-item dropdown ms-2">
                                <button className="btn btn-outline-light fw-bold font-montserrat rounded-pill px-4 py-2 dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '25px', height: '25px', fontSize: '0.8rem' }}>
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    {firstName}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end border-primary border-opacity-10 shadow-lg mt-2" style={{ backgroundColor: 'var(--card-bg)' }}>
                                    <li><Link className="dropdown-item text-navy py-2 fw-bold" to="/profile"><i className="fa-solid fa-address-card me-2 text-primary"></i> My Dashboard</Link></li>
                                    <li><hr className="dropdown-divider border-primary border-opacity-10" /></li>
                                    <li><button className="dropdown-item text-accent py-2 fw-bold" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket me-2"></i> Log Out</button></li>
                                </ul>
                            </div>
                        ) : (
                            <Link className="btn btn-outline-light ms-2 fw-bold font-montserrat rounded-3 px-4 py-2" to="/login">
                                Log In
                            </Link>
                        )}
                        
                    </div>
                </div>
            </div>
        </nav>

        {/* ==========================================
            PREFERENCES MODAL (Tropical Light Theme)
            ========================================== */}
        {showPrefModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'var(--dark-navy)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg p-0 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px' }}>
                        
                        {/* Header */}
                        <div className="modal-header border-0 pb-0 pt-4 px-4">
                            <h4 className="modal-title font-montserrat fw-bold text-navy">Preferences</h4>
                            <button className="bg-transparent border-0 text-navy" onClick={() => setShowPrefModal(false)}>
                                <i className="fa-solid fa-xmark fs-4"></i>
                            </button>
                        </div>

                        <div className="modal-body p-4">
                            
                            {/* Theme Toggle */}
                            <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4 border border-primary border-opacity-10" style={{ backgroundColor: '#F4FAFC' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className={`fa-solid ${theme === 'light' ? 'fa-sun text-accent' : 'fa-moon text-primary'} fs-5`}></i>
                                    </div>
                                    <div>
                                        <h6 className="text-navy fw-bold mb-0">Appearance</h6>
                                        <small className="text-grey">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</small>
                                    </div>
                                </div>
                                <div className="form-check form-switch fs-4 m-0">
                                    <input className="form-check-input shadow-none" type="checkbox" role="switch" checked={theme === 'dark'} onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ cursor: 'pointer' }} />
                                </div>
                            </div>

                            {/* Custom CSS Tabs */}
                            <div className="d-flex border-bottom border-primary border-opacity-10 mb-3">
                                <button className={`pref-tab flex-grow-1 ${activeTab === 'language' ? 'active' : ''}`} onClick={() => setActiveTab('language')}>Language</button>
                                <button className={`pref-tab flex-grow-1 ${activeTab === 'currency' ? 'active' : ''}`} onClick={() => setActiveTab('currency')}>Currency</button>
                            </div>

                            {/* Tab Content */}
                            <div className="tab-content" style={{ minHeight: '250px', maxHeight: '300px', overflowY: 'auto' }}>
                                
                                {/* Language Grid */}
                                <div className={`row g-2 ${activeTab === 'language' ? 'd-flex' : 'd-none'}`}>
                                    {availableLanguages.map((lang) => (
                                        <div className="col-6" key={lang.code}>
                                            <div className={`pref-grid-item ${language === lang.code ? 'active' : ''}`} onClick={() => { setLanguage(lang.code); setTimeout(() => setShowPrefModal(false), 300); }}>
                                                <div className="d-flex align-items-center gap-3 w-100">
                                                    <span className="fs-4">{lang.flag}</span>
                                                    <div className="d-flex flex-column text-start flex-grow-1">
                                                        <span className="text-navy fw-bold" style={{ fontSize: '0.9rem' }}>{lang.name}</span>
                                                        <span className="text-grey" style={{ fontSize: '0.75rem' }}>{lang.nativeName}</span>
                                                    </div>
                                                    {language === lang.code && <i className="fa-solid fa-check text-accent ms-auto"></i>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Currency Grid */}
                                <div className={`row g-2 ${activeTab === 'currency' ? 'd-flex' : 'd-none'}`}>
                                    {availableCurrencies.map((curr) => (
                                        <div className="col-6" key={curr.code}>
                                            <div className={`pref-grid-item ${currency === curr.code ? 'active' : ''}`} onClick={() => { setCurrency(curr.code); setTimeout(() => setShowPrefModal(false), 300); }}>
                                                <div className="d-flex align-items-center gap-3 w-100">
                                                    <div className="text-navy bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '35px', height: '35px', fontSize: '0.85rem' }}>
                                                        {curr.symbol}
                                                    </div>
                                                    <div className="d-flex flex-column text-start flex-grow-1">
                                                        <span className="text-navy fw-bold" style={{ fontSize: '0.9rem' }}>{curr.code}</span>
                                                        <span className="text-grey" style={{ fontSize: '0.75rem' }}>{curr.name}</span>
                                                    </div>
                                                    {currency === curr.code && <i className="fa-solid fa-check text-accent ms-auto"></i>}
                                                </div>
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