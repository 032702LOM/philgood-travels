import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { regions, tourPackages } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext';

import islandParadiseImg from '../assets/img/island_paradise.png'; 
import seashellsImg from '../assets/img/seashells.png'; 
import sunbathingImg from '../assets/img/sunbathing.png'; 
import swimImg from '../assets/img/swim.png';

const Home = () => {
  const navigate = useNavigate();
  const { t, formatPrice } = usePreferences();
  
  const initialPositions = ['pos-hidden', 'pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];
  const [destPositions, setDestPositions] = useState(initialPositions);
  const [pkgPositions, setPkgPositions] = useState(initialPositions);

  const [showPromo, setShowPromo] = useState(false);
  const [isPromoClosed, setIsPromoClosed] = useState(false);

  const rotateStack = (type, direction) => {
    const setFunction = type === 'dest' ? setDestPositions : setPkgPositions;
    setFunction((current) => {
      const next = [...current];
      if (direction === 'next') {
        next.push(next.shift());
      } else {
        next.unshift(next.pop());
      }
      return next;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('visible');
            }
        });

        if (window.scrollY > 300) {
            setShowPromo(true);
        } else {
            setShowPromo(false);
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fade-in">
        
        {/* ⚡ FLOATING PROMO POPUP ⚡ */}
        {showPromo && !isPromoClosed && (
            <div className="fade-in shadow-lg" style={{
                position: 'fixed',
                bottom: '30px',
                left: '30px',
                background: 'linear-gradient(135deg, var(--accent-color), #FF4500)',
                color: '#fff',
                padding: '20px',
                borderRadius: '12px',
                zIndex: 1050,
                maxWidth: '300px',
                border: 'none'
            }}>
                <button 
                    onClick={() => setIsPromoClosed(true)} 
                    className="btn-close btn-close-white position-absolute top-0 end-0 m-2 shadow-none" 
                    style={{ fontSize: '0.8rem' }}
                    aria-label="Close"
                ></button>
                <h6 className="text-white fw-bold mb-2 font-montserrat">
                    <i className="fa-solid fa-sun me-2"></i>MONSOON SPECIAL
                </h6>
                <p className="text-white small mb-0 opacity-75">
                    <strong>30% OFF</strong> on all Palawan packages! Limited time only!
                </p>
            </div>
        )}

        {/* --- HERO SECTION CAROUSEL --- */}
        <section id="home" style={{ marginTop: '0', backgroundColor: 'var(--bg-dark)' }}>
            <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="4000">
                <div className="carousel-inner">
                    <div className="carousel-item active" style={{ 
                        backgroundImage: `url(${islandParadiseImg})`, 
                        backgroundPosition: 'bottom center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: 'transparent'
                    }}>
                        <div className="hero-overlay" style={{ background: 'transparent' }}>
                            <div className="container scroll-reveal visible d-flex flex-column align-items-center justify-content-center h-100">
                                <div className="mt-5 pt-5 text-center">
                                    <p className="hero-subtitle text-navy fw-bold mt-5" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8)', fontSize: '1.2rem' }}>
                                        Relax on pristine white sand beaches
                                    </p>
                                    <Link to="/booking" className="hero-btn shadow-lg mt-2">{t('book_now', 'BOOK NOW')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="carousel-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1707730088436-0e55e78843d8?q=80&w=1310&auto=format&fit=crop')" }}>
                        <div className="hero-overlay">
                            <div className="container">
                                <h1 className="hero-title">{t('hero_adv', 'ADVENTURE AWAITS')}</h1>
                                <p className="hero-subtitle text-white">Experience the Chocolate Hills of Bohol</p>
                                <Link to="/tours" className="hero-btn">VIEW TOURS</Link>
                            </div>
                        </div>
                    </div>

                    <div className="carousel-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564425230164-1e63b4922d3f?q=80&w=735&auto=format&fit=crop')" }}>
                        <div className="hero-overlay">
                            <div className="container">
                                <h1 className="hero-title">{t('hero_trail', 'FIND YOUR TRAIL')}</h1>
                                <p className="hero-subtitle text-white">Discover nature in the Philippines</p>
                                <Link to="/destinations" className="hero-btn">EXPLORE DESTINATIONS</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon"></span></button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next"><span className="carousel-control-next-icon"></span></button>
            </div>

            <div className="container py-5">
                <div className="stats-container row text-center g-4">
                    <div className="col-md-4">
                        <div className="stat-card scroll-reveal visible">
                            <i className="fa-solid fa-user-group"></i>
                            <h3 className="stat-number text-navy">12,000+</h3>
                            <span className="stat-label text-grey">SATISFIED CLIENTS</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card scroll-reveal visible">
                            <i className="fa-regular fa-calendar-check"></i>
                            <h3 className="stat-number text-navy">3,500+</h3>
                            <span className="stat-label text-grey">TOURS ORGANIZED</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card scroll-reveal visible">
                            <i className="fa-solid fa-location-dot"></i>
                            <h3 className="stat-number text-navy">50+</h3>
                            <span className="stat-label text-grey">DESTINATIONS</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ⚡ SCENE 1: SEASHELLS WITH UPDATED TEXT ⚡ */}
        <section className="scene-section trail-makers-bg" style={{ 
            backgroundColor: 'var(--bg-dark)', 
            backgroundImage: `url("${seashellsImg}")`,
            backgroundBlendMode: 'multiply' 
        }}>
            <div className="container">
                <div className="row align-items-center scene-block scroll-reveal visible">
                    <div className="col-lg-6">
                        <div className="scene-content pe-lg-5">
                            <span className="section-subtitle">DISCOVER</span>
                            <h2 className="scene-title text-navy wave-text">Seashell Treasures</h2>
                            <p className="scene-text text-grey">As the tide retreats, a kaleidoscope of shapes and hues emerges from the surf. From the delicate spiral of a whelk to the iridescent shimmer of a conch, each find is a tiny masterpiece crafted by time and the currents.</p>     
                            <p className="scene-text text-grey">Pause to breathe in the salt-tinged air as the horizon glows with the warmth of a setting sun. This isn't just a walk; it’s a chance to reconnect with the earth’s rhythm and find beauty in the smallest of details.</p>             
                            <Link to="/destinations" className="btn-text-link mt-3 d-inline-block">Explore Beaches <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- POPULAR DESTINATIONS (Fanned Stack) --- */}
        <section className="py-5 destinations-bg"> 
            <div className="container py-5">
                <div className="section-header scroll-reveal visible">
                    <span className="section-subtitle">Regional</span>
                    <h2 className="section-title text-navy wave-text">{t('pop_dest', 'Most Popular Destinations')}</h2>
                    <p className="section-desc text-grey">Discover the key regions and landmarks the Philippines has to offer.</p>
                </div>
                <div className="fanned-stack-container scroll-reveal visible mt-4">
                    <button className="stack-nav-btn prev-btn" onClick={() => rotateStack('dest', 'prev')}><i className="fa-solid fa-chevron-left"></i></button>
                    <button className="stack-nav-btn next-btn" onClick={() => rotateStack('dest', 'next')}><i className="fa-solid fa-chevron-right"></i></button>
                    {regions.map((region, index) => (
                        <div 
                            key={region.id} 
                            className={`fanned-card-wrapper ${destPositions[index]}`} 
                            onClick={() => {
                                if (destPositions[index] === 'pos-center') {
                                    navigate(`/destinations?region=${region.id}`);
                                } else {
                                    rotateStack('dest', destPositions[index].includes('right') ? 'next' : 'prev');
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card h-100">
                                <div className="card-img-wrapper">
                                    <span className="card-badge">{region.typeBadge || 'View'}</span>
                                    <img src={region.image} className="card-img-top" alt={region.name} />
                                </div>
                                <div className="card-body">
                                    <div className="card-location text-primary-dark"><i className="fa-solid fa-location-dot"></i> {region.locationLabel || 'Philippines'}</div>
                                    <h5 className="card-title text-navy">{region.name}</h5>
                                    <p className="card-text text-grey">{region.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-5 scroll-reveal visible">
                    <Link to="/destinations" className="btn-outline-custom">View All Destinations</Link>
                </div>
            </div>
        </section>

        {/* ⚡ SCENE 2: SUNBATHING ⚡ */}
        <section className="scene-section sleep-bg" style={{ 
            backgroundColor: 'var(--bg-dark)', 
            backgroundImage: `
                radial-gradient(ellipse at bottom left, var(--bg-dark) 5%, transparent 35%),
                radial-gradient(ellipse at bottom right, var(--bg-dark) 5%, transparent 35%),
                url("${sunbathingImg}")
            `
        }}>
            <div className="container">
                <div className="row align-items-center scene-block scroll-reveal visible">
                    <div className="col-lg-6">
                        <div className="scene-content pe-lg-5">
                            <span className="section-subtitle">RELAXATION</span>
                            <h2 className="scene-title text-navy wave-text">Soak in the Sun</h2>
                            <p className="scene-text text-grey">Unwind under the tropical canopy. Feel the warmth of the sun on your skin and the gentle island breeze.</p>
                            <p className="scene-text text-grey">As the tide retreats, a kaleidoscope of shapes and hues emerges from the surf. From the delicate spiral of a whelk to the iridescent shimmer of a conch, each find is a tiny masterpiece crafted by time and the currents.</p>
                            <p className="scene-text text-grey">Pause to breathe in the salt-tinged air as the horizon glows with the warmth of a setting sun. This isn't just a walk; it’s a chance to reconnect with the earth’s rhythm and find beauty in the smallest of details.</p>
                            <Link to="/destinations?search=beach" className="btn-text-link mt-3 d-inline-block">Book a Resort Stay <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- TOP PACKAGES (Fanned Stack 2) --- */}
        <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
            <div className="container py-5">
                <div className="section-header scroll-reveal visible">
                    <span className="section-subtitle">Packages</span>
                    <h2 className="section-title text-navy wave-text">{t('top_pkg', 'Top Packages That Fit You')}</h2>
                </div>
                <div className="fanned-stack-container scroll-reveal visible mt-4">
                    <button className="stack-nav-btn prev-btn" onClick={() => rotateStack('pkg', 'prev')}><i className="fa-solid fa-chevron-left"></i></button>
                    <button className="stack-nav-btn next-btn" onClick={() => rotateStack('pkg', 'next')}><i className="fa-solid fa-chevron-right"></i></button>
                    {tourPackages.map((pkg, index) => (
                        <div key={pkg.id} className={`fanned-card-wrapper ${pkgPositions[index]}`} onClick={() => rotateStack('pkg', 'next')}>
                            <div className="card h-100">
                                <div className="card-img-wrapper">
                                    <span className="card-badge">{pkg.duration}</span>
                                    <img src={pkg.img} className="card-img-top" alt={pkg.name} />
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title text-navy">{pkg.name}</h5>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="fw-bold fs-5" style={{color: 'var(--accent-color)'}}>{formatPrice(pkg.price)}</span>
                                        <Link to="/tours" className="btn btn-view-details" style={{fontSize: '0.8rem'}}>{t('view_details', 'View')}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-5 scroll-reveal visible">
                    <Link to="/tours" className="hero-btn">Explore All Tours</Link>
                </div>
            </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
            <div className="container py-5">
                <div className="section-header scroll-reveal visible">
                    <span className="section-subtitle">Testimonials</span>
                    <h2 className="section-title text-navy wave-text">What Our Clients Say</h2>
                </div>
                <div className="row g-4">
                    <div className="col-md-4 scroll-reveal visible">
                        <div className="testimonial-item">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" className="testimonial-img" alt="Client" />
                            <h5 className="client-name text-navy">Mario Santos</h5>
                            <p className="client-loc text-primary-dark">Manila</p>
                            <div className="stars"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                            <p className="quote text-grey">"PhilGood Travels made our El Nido trip absolutely unforgettable! The team was professional and the experiences were beyond amazing."</p>
                        </div>
                    </div>
                    <div className="col-md-4 scroll-reveal visible">
                        <div className="testimonial-item">
                            <img src="https://randomuser.me/api/portraits/men/45.jpg" className="testimonial-img" alt="Client" />
                            <h5 className="client-name text-navy">John Reyes</h5>
                            <p className="client-loc text-primary-dark">Cebu</p>
                            <div className="stars"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i></div>
                            <p className="quote text-grey">"The Chocolate Hills tour was breathtaking! Everything was well-organized and our guide was incredibly knowledgeable."</p>
                        </div>
                    </div>
                     <div className="col-md-4 scroll-reveal visible">
                        <div className="testimonial-item">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" className="testimonial-img" alt="Client" />
                            <h5 className="client-name text-navy">Sarah Chen</h5>
                            <p className="client-loc text-primary-dark">Singapore</p>
                            <div className="stars"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                            <p className="quote text-grey">"As a first-time visitor to the Philippines, I was impressed by the service and beautiful destinations. Highly recommend!"</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- CTA --- */}
        <section className="cta-section scroll-reveal visible" style={{ backgroundColor: 'var(--bg-dark)' }}>
            <div className="container text-center py-5">
                <h2 className="section-title text-navy mb-3 wave-text">Ready for Your Next Adventure?</h2>
                <p className="section-desc text-grey mb-4">Book your dream Philippine vacation today and create memories that will last a lifetime.</p>
                <Link to="/booking" className="hero-btn">START YOUR JOURNEY</Link>
            </div>
        </section>

        {/* ⚡ SCENE 3: READY FOR YOUR NEXT DIVE ⚡ */}
        <section className="scene-section dive-bg" style={{ 
            backgroundColor: 'var(--bg-dark)', 
            backgroundImage: `url("${swimImg}")`
        }}>
            <div className="container">
                <div className="row align-items-center scene-block scroll-reveal visible">
                    <div className="col-lg-6">
                        <div className="scene-content pe-lg-5">
                            <span className="section-subtitle">UNDERWATER</span>
                            <h2 className="scene-title text-navy wave-text">Ready for Your Next Dive?</h2>
                            <p className="scene-text text-grey">Descend into the deep blue. Discover vibrant coral reefs, swim alongside majestic sea turtles, and explore the mysteries of the ocean floor.</p>
                            <p className="scene-text text-grey">Beyond the technicolor gardens of coral lies a world frozen in time. Navigate through haunting shipwrecks and silent underwater caverns where history rests beneath the tides.</p>
                            <Link to="/tours?search=diving" className="btn-text-link mt-3 d-inline-block">View Diving Packages <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
  );
};

export default Home;