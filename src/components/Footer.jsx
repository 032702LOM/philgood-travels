import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
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
                    <p className="mb-4" style={{ maxWidth: '300px' }}>
                        Your gateway to unforgettable Philippine adventures. Discover pristine beaches, majestic mountains, and vibrant culture.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-btn"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="social-btn"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#" className="social-btn"><i className="fa-brands fa-twitter"></i></a>
                    </div>
                </div>
                <div className="col-lg-2 col-md-6">
                    <h5 className="footer-heading">Quick Links</h5>
                    <ul className="footer-links">
                        <li><Link to="/destinations">Destinations</Link></li>
                        <li><Link to="/tours">Tour Packages</Link></li>
                        <li><Link to="/gallery">Gallery</Link></li>
                        <li><Link to="/booking">Book Now</Link></li>
                    </ul>
                </div>
                <div className="col-lg-3 col-md-6">
                    <h5 className="footer-heading">Contact</h5>
                    <ul className="footer-links contact-list">
                        <li><i className="fa-solid fa-location-dot contact-icon"></i> 123 Travel Street, Manila</li>
                        <li><i className="fa-solid fa-phone contact-icon"></i> +63 123 456 7890</li>
                        <li><i className="fa-solid fa-envelope contact-icon"></i> hello@philgoodtravels.com</li>
                    </ul>
                </div>
                <div className="col-lg-3 col-md-6">
                    <h5 className="footer-heading">Newsletter</h5>
                    <p className="mb-3">Subscribe for exclusive deals!</p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="email" className="footer-input" placeholder="Your email" />
                        <button type="submit" className="footer-subscribe-btn">SUBSCRIBE</button>
                    </form>
                </div>
            </div>
            <div className="text-center mt-5 pt-4 border-top border-secondary border-opacity-25">
                <small className="text-secondary">&copy; 2024 PhilGood Travels. All rights reserved.</small>
            </div>
        </div>
    </footer>
  );
};

export default Footer;