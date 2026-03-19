import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); 
  
  // Modal State
  const [showPrefModal, setShowPrefModal] = useState(false);
  const [activeTab, setActiveTab] = useState('language');

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      setIsLoggedIn(true);
      const userObj = JSON.parse(userStr);
      setFirstName(userObj.name.split(' ')[0]); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/'; 
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

  const currentPath = location.pathname.toLowerCase();
  
  const isLightPage = currentPath.includes('/booking') || 
                      currentPath.includes('/login') || 
                      currentPath.includes('/register') || 
                      currentPath.includes('/profile');
  
  const isLightNav = isLightPage && !scrolled;

  return (
    <>
        <style>
            {`
                nav#mainNav.light-nav-mode .navbar-nav .nav-link,
                nav#mainNav.light-nav-mode .nav-action-btn,
                nav#mainNav.light-nav-mode .nav-action-btn i,
                nav#mainNav.light-nav-mode .btn-auth {
                    color: #023E8A !important; 
                    text-shadow: none !important;
                    font-weight: 800 !important;
                }
                
                nav#mainNav.light-nav-mode .navbar-nav .nav-link:hover,
                nav#mainNav.light-nav-mode .navbar-nav .nav-link.active {
                    color: #FF9F1C !important; 
                }

                nav#mainNav.light-nav-mode .navbar-toggler-icon {
                    filter: brightness(0) saturate(100%) invert(18%) sepia(50%) saturate(3015%) hue-rotate(193deg) brightness(97%) contrast(98%) !important;
                }

                /* ⚡ NEW: Fixes the blinking cursor and blue focus box on mobile hamburger menu ⚡ */
                .navbar-toggler {
                    caret-color: transparent !important; 
                    user-select: none !important;
                }
                .navbar-toggler:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }
            `}
        </style>

        <nav className={`navbar navbar-expand-lg fixed-top ${isLightNav ? 'navbar-light light-nav-mode' : 'navbar-dark'} ${scrolled ? 'scrolled' : ''}`} id="mainNav">
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
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/" end>{t('nav_home', 'Home')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/destinations">{t('nav_dest', 'Destinations')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/tours">{t('nav_tours', 'Tour Packages')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/gallery">{t('nav_gallery', 'Gallery')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/connect">{t('nav_connect', 'Connect')}</NavLink>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex gap-2">
                            {/* --- THEME TOGGLE BUTTON --- */}
                            <button 
                                className="btn btn-sm btn-outline-secondary border-0 d-flex align-items-center justify-content-center" 
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                                title="Toggle Theme"
                            >
                                <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-warning' : `fa-moon ${isLightNav ? 'text-navy' : 'text-white'}`}`}></i>
                            </button>

                            {/* --- CURRENCY & LANGUAGE BUTTONS --- */}
                            <button className="btn btn-sm btn-outline-secondary nav-action-btn border-0 d-flex align-items-center gap-2" onClick={() => openModal('currency')}>
                                <span className="fw-bold">{currency}</span>
                            </button>
                            <button className="btn btn-sm btn-outline-secondary nav-action-btn border-0 d-flex align-items-center gap-2" onClick={() => openModal('language')}>
                                <i className="fa-solid fa-globe"></i>
                                <span className="text-uppercase">{language}</span>
                            </button>
                        </div>

                        {/* 👉 SMART AUTH BUTTONS (LOGIN / SIGN UP / LOGOUT) */}
                        {isLoggedIn ? (
                            <div className="d-none d-lg-flex align-items-center me-3 gap-3">
                                <Link to="/profile" className="btn-auth fw-bold font-montserrat text-decoration-none">
                                    Hi, {firstName}!
                                </Link>
                                <button onClick={handleLogout} className="btn btn-auth fw-bold no-border-btn" style={{ textDecoration: 'none', padding: '6px 16px', borderRadius: '4px' }}>
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <div className="d-none d-lg-flex align-items-center me-3 gap-2">
                                <Link to="/login" className="btn btn-auth fw-bold" style={{ textDecoration: 'none' }}>
                                    LOGIN
                                </Link>
                                <Link to="/register" className="btn btn-auth fw-bold no-border-btn" style={{ textDecoration: 'none', padding: '6px 16px', borderRadius: '4px' }}>
                                    SIGN UP
                                </Link>
                            </div>
                        )}

                        <Link to="/booking" className="btn-book-nav d-none d-lg-block">{t('nav_book', 'BOOK NOW')}</Link>
                    </div>
                </div>
            </div>
        </nav>

        {/* ==========================================
            GLOBAL PREFERENCES MODAL
            ========================================== */}
        {showPrefModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 31, 63, 0.7)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                <div className="modal-dialog modal-dialog-centered modal-lg"> 
                    <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px' }}>
                        
                        <div className="modal-header border-bottom border-primary border-opacity-10 pb-3">
                            <h5 className="modal-title text-navy font-montserrat fw-bold">Regional Settings</h5>
                            <button type="button" className="btn-close" onClick={() => setShowPrefModal(false)}></button>
                        </div>

                        <div className="modal-body p-0">
                            <div className="d-flex border-bottom border-primary border-opacity-10 bg-primary bg-opacity-10">
                                <button className={`pref-tab flex-grow-1 ${activeTab === 'language' ? 'active' : ''}`} onClick={() => setActiveTab('language')}>
                                    <i className="fa-solid fa-language me-2"></i> Language
                                </button>
                                <button className={`pref-tab flex-grow-1 ${activeTab === 'currency' ? 'active' : ''}`} onClick={() => setActiveTab('currency')}>
                                    <i className="fa-solid fa-coins me-2"></i> Currency
                                </button>
                            </div>

                            <div className="p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                <div className="row g-3">
                                    
                                    {activeTab === 'language' && availableLanguages.map((lang) => (
                                        <div className="col-6 col-md-4 col-lg-3" key={lang.code}>
                                            <div className={`pref-grid-item ${language === lang.code ? 'active' : ''}`} onClick={() => { setLanguage(lang.code); setShowPrefModal(false); }}>
                                                <div className="d-flex flex-column text-start">
                                                    <span className="text-navy fw-bold" style={{ fontSize: '0.9rem' }}>{lang.native}</span>
                                                    <span className="text-grey" style={{ fontSize: '0.75rem' }}>{lang.name}</span>
                                                </div>
                                                {language === lang.code && <i className="fa-solid fa-check text-accent ms-auto"></i>}
                                            </div>
                                        </div>
                                    ))}

                                    {activeTab === 'currency' && availableCurrencies.map((curr) => (
                                        <div className="col-6 col-md-4 col-lg-4" key={curr.code}>
                                            <div className={`pref-grid-item ${currency === curr.code ? 'active' : ''}`} onClick={() => { setCurrency(curr.code); setShowPrefModal(false); }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="text-navy bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '35px', height: '35px', fontSize: '0.85rem' }}>
                                                        {curr.symbol}
                                                    </div>
                                                    <div className="d-flex flex-column text-start">
                                                        <span className="text-navy fw-bold" style={{ fontSize: '0.9rem' }}>{curr.code}</span>
                                                        <span className="text-grey" style={{ fontSize: '0.75rem' }}>{curr.name}</span>
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