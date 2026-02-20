import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top navbar-dark ${scrolled ? 'scrolled' : ''}`} id="mainNav">
        <div className="container">
            <Link className="navbar-brand" to="/">
                <img src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" alt="PhilGood Logo" className="navbar-logo-img" />
            </Link>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
                {/* Replaced Link with NavLink for automatic active state highlighting */}
                <ul className="navbar-nav mx-auto align-items-center">
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/" end>Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/destinations">Destinations</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/tours">Featured Tours</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/gallery">Gallery</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/connect">Connect</NavLink>
                    </li>
                </ul>

                <div className="d-flex align-items-center">
                    {/* The Orange Book Now Button on the right */}
                    <Link to="/booking" className="btn-book-nav d-none d-lg-block">BOOK NOW</Link>
                    
                    <div className="navbar-socials">
                        <a href="#" className="social-nav-link"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="social-nav-link"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#" className="social-nav-link"><i className="fa-brands fa-tiktok"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;