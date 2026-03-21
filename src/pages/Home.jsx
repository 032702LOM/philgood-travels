import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { regions, tourPackages } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext';

import islandParadiseImg from '../assets/img/island_paradise.png'; 
import manOnCliffImg from '../assets/img/man on cliff.png'; 
import sunbathingImg from '../assets/img/sunbathing.png'; 
import swimImg from '../assets/img/swim.png';
import promoVideo from '../assets/video/home.mp4'; 

const Home = () => {
  const navigate = useNavigate();
  const { t, formatPrice } = usePreferences();
  
  const initialPositions = ['pos-hidden', 'pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];
  const [destPositions, setDestPositions] = useState(initialPositions);
  const [pkgPositions, setPkgPositions] = useState(initialPositions);

  const [showPromo, setShowPromo] = useState(true);

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

  const handleCardClick = (position, url, type) => {
    if (window.innerWidth <= 991) {
        navigate(url);
    } else {
        if (position === 'pos-center') {
            navigate(url);
        } else {
            const isRight = position === 'pos-right' || position === 'pos-far-right';
            rotateStack(type, isRight ? 'next' : 'prev');
        }
    }
  };

  // --- SWIPE LOGIC ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50; 

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEndDest = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) rotateStack('dest', 'next'); 
    if (distance < -minSwipeDistance) rotateStack('dest', 'prev'); 
  };

  const onTouchEndPkg = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) rotateStack('pkg', 'next'); 
    if (distance < -minSwipeDistance) rotateStack('pkg', 'prev'); 
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fade-in">
        
        <style>
            {`
                /* ⚡ NEW MOBILE STYLES FOR SCENE SECTIONS ⚡ */
                @media (max-width: 991px) {
                    .scene-section {
                        /* Remove background image on mobile */
                        background-image: none !important;
                        background-color: var(--bg-dark); 
                        padding: 2rem 0 !important;
                        min-height: auto;
                    }
                    
                    /* The container for the image on mobile */
                    .mobile-scene-img {
                        display: block !important;
                        width: 100%;
                        height: 300px;
                        background-size: cover;
                        background-position: center;
                        border-radius: 12px;
                        margin-top: 2rem;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    }

                    .scene-content {
                        padding-right: 0 !important;
                    }
                }

                /* Hide the mobile image containers on desktop */
                @media (min-width: 992px) {
                    .mobile-scene-img {
                        display: none !important;
                    }
                }
            `}
        </style>

        {showPromo && (
            <div className="top-alert" id="specialOfferBanner">
                <span><i className="fa-solid fa-sun me-2"></i> {t('promo_banner', 'MONSOON SPECIAL: 30% OFF on all Palawan packages!')}</span>
                <i className="fa-solid fa-xmark close-alert" onClick={() => setShowPromo(false)}></i>
            </div>
        )}

        {/* --- STATIC HERO SECTION --- */}
        <section id="home" className="fade-in" style={{ marginTop: 0 }}>
            <div className="home-hero w-100 position-relative" style={{ backgroundImage: `url(${islandParadiseImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="hero-overlay w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center"></div>
            </div>

            {/* PROMO VIDEO OVERLAP */}
            <div className="container position-relative text-center scroll-reveal" style={{ zIndex: 10, marginTop: '-150px', marginBottom: '80px' }}>
                <div className="shadow-lg rounded-4 overflow-hidden mx-auto" style={{ maxWidth: '800px', border: '6px solid white', backgroundColor: '#000' }}>
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        controls
                        className="w-100 h-auto" 
                        style={{ display: 'block', maxHeight: '450px', objectFit: 'cover' }}
                    >
                        <source src={promoVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            {/* STATS SECTION */}
            <div className="container pb-5">
                <div className="stats-container row text-center g-4">
                    <div className="col-md-4">
                        <div className="stat-card scroll-reveal">
                            <i className="fa-solid fa-user-group"></i>
                            <h3 className="stat-number">12,000+</h3>
                            <span className="stat-label">{t('stats_clients', 'SATISFIED CLIENTS')}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card scroll-reveal delay-1">
                            <i className="fa-regular fa-calendar-check"></i>
                            <h3 className="stat-number">3,500+</h3>
                            <span className="stat-label">{t('stats_tours', 'TOURS ORGANIZED')}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card scroll-reveal delay-2">
                            <i className="fa-solid fa-location-dot"></i>
                            <h3 className="stat-number">50+</h3>
                            <span className="stat-label">{t('stats_dest', 'DESTINATIONS')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* SCENE 1: MAN ON CLIFF */}
        <section className="scene-section trail-makers-bg" style={{ backgroundImage: `url("${manOnCliffImg}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="container">
                <div className="row align-items-center scene-block scroll-reveal">
                    <div className="col-lg-6 trail-makers-text-col">
                        <div className="scene-content pe-lg-5">
                            <span className="section-subtitle">{t('perspective', 'PERSPECTIVE')}</span>
                            <h2 className="scene-title wave-text">{t('trail_makers', 'The Trail Makers')}</h2>
                            <p className="scene-text">{t('trail_desc1', 'Sometimes the best view comes after the hardest climb. Take a moment to sit, breathe, and appreciate the world from a new perspective.')}</p>     
                            <p className="scene-text">{t('trail_desc2', 'A breathtaking panoramic view from a mountain summit at sunset. A lone hiker is sitting on a rocky ledge, silhouette against a vibrant orange and purple sky, looking out over a sea of clouds and distant peaks.')}</p>             
                            <Link to="/destinations" className="btn-text-link">{t('explore_mountains', 'Explore Mountains')} <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                        <div className="mobile-scene-img" style={{ backgroundImage: `url("${manOnCliffImg}")` }}></div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- POPULAR DESTINATIONS --- */}
        <section className="py-5 destinations-bg position-relative" style={{ 
            backgroundImage: `url("https://philippineshiddengems.com/wp-content/uploads/2025/01/docked-small-boats-at-palawan-philippines.jpg")`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundAttachment: 'fixed' 
        }}> 
            <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
                <div className="section-header scroll-reveal">
                    <span className="section-subtitle" style={{ color: '#FF9F1C', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                        {t('regional', 'Regional')}
                    </span>
                    <h2 className="section-title wave-text force-white-text" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
                        {t('pop_dest', 'Most Popular Destinations')}
                    </h2>
                    <p className="section-desc fw-bold force-white-text" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                        {t('pop_dest_desc', 'Discover the key regions and landmarks the Philippines has to offer.')}
                    </p>
                </div>
                
                <div className="fanned-stack-container scroll-reveal mt-4" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndDest}>
                    <button className="stack-nav-btn prev-btn shadow-lg" onClick={() => rotateStack('dest', 'prev')}><i className="fa-solid fa-chevron-left"></i></button>
                    <button className="stack-nav-btn next-btn shadow-lg" onClick={() => rotateStack('dest', 'next')}><i className="fa-solid fa-chevron-right"></i></button>
                    
                    {regions.slice(0, 6).map((region, index) => (
                        <div key={region.id} className={`fanned-card-wrapper ${destPositions[index]}`}>
                            <div className="card shadow" onClick={() => handleCardClick(destPositions[index], `/destinations?region=${region.id}`, 'dest')} style={{ cursor: 'pointer' }}>
                                <div className="card-img-wrapper">
                                    <span className="card-badge">{region.typeBadge || 'View'}</span>
                                    <img src={region.image} className="card-img-top" alt={region.name} />
                                </div>
                                <div className="card-body">
                                    <div className="card-location"><i className="fa-solid fa-location-dot"></i> {region.locationLabel || 'Philippines'}</div>
                                    <h5 className="card-title"><span className="region-text">{region.name}</span></h5>
                                    <p className="card-text text-white-50">{region.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-5 scroll-reveal">
                    <Link to="/destinations" className="hero-btn shadow-lg">{t('view_all_dest', 'View All Destinations')}</Link>
                </div>
            </div>
        </section>

        {/* --- SCENE 2: BASK UNDER THE SUN --- */}
        <section className="scene-section bask-sun-bg" style={{ backgroundImage: `url("${sunbathingImg}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="container">
                <div className="row align-items-center scene-block scroll-reveal">
                    <div className="col-lg-6">
                        <div className="scene-content pe-lg-5">
                            <span className="section-subtitle">{t('relaxation', 'RELAXATION')}</span>
                            <h2 className="scene-title wave-text">{t('bask_sun', 'Bask Under the Sun')}</h2>
                            <p className="scene-text">{t('sun_desc1', "Feel the warmth of the tropical sun on your skin as you unwind on some of the world's most beautiful, powdery white sand beaches.")}</p>
                            <p className="scene-text">{t('sun_desc2', 'Let the gentle rhythm of the waves wash your worries away. Whether you are sipping a fresh coconut under a swaying palm tree or wading into crystal-clear turquoise waters, paradise is waiting.')}</p>
                            <Link to="/destinations?search=beach" className="btn-text-link mt-3 d-inline-block">{t('book_beach', 'Book a Beach Resort')} <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                        <div className="mobile-scene-img" style={{ backgroundImage: `url("${sunbathingImg}")` }}></div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- TOP PACKAGES --- */}
        <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
            <div className="container py-5">
                <div className="section-header scroll-reveal">
                    <span className="section-subtitle">{t('packages', 'Packages')}</span>
                    <h2 className="section-title wave-text">{t('top_pkg', 'Top Packages That Fit You')}</h2>
                </div>
                
                <div className="fanned-stack-container scroll-reveal mt-4" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndPkg}>
                    <button className="stack-nav-btn prev-btn shadow-lg" onClick={() => rotateStack('pkg', 'prev')}><i className="fa-solid fa-chevron-left"></i></button>
                    <button className="stack-nav-btn next-btn shadow-lg" onClick={() => rotateStack('pkg', 'next')}><i className="fa-solid fa-chevron-right"></i></button>
                    
                    {tourPackages.slice(0, 6).map((pkg, index) => (
                        <div key={pkg.id} className={`fanned-card-wrapper ${pkgPositions[index]}`}>
                            <div className="card shadow" onClick={() => handleCardClick(pkgPositions[index], '/tours', 'pkg')} style={{ cursor: 'pointer' }}>
                                <div className="card-img-wrapper">
                                    <span className="card-badge">{pkg.duration || '3 Days / 2 Nights'}</span>
                                    <img src={pkg.img} className="card-img-top" alt={pkg.name} />
                                </div>
                                <div className="card-body">
                                    <div className="card-location"><i className="fa-solid fa-location-dot"></i> {pkg.locationLabel || pkg.region || 'Philippines'}</div>
                                    <h5 className="card-title"><span className="region-text">{pkg.name}</span></h5>
                                    <p className="card-text text-white-50">{pkg.desc || pkg.type || 'Experience the beauty of the Philippines.'}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3" style={{borderColor: 'var(--border-color)'}}>
                                        <span className="fw-bold fs-5" style={{ color: '#2A9D8F' }}>{formatPrice(pkg.price)}</span>
                                        <Link to="/tours" className="btn btn-view-details" onClick={(e) => e.stopPropagation()}>{t('view_details', 'View Details')}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-5 scroll-reveal">
                    <Link to="/tours" className="hero-btn shadow-lg">{t('explore_all_tours', 'Explore All Tours')}</Link>
                </div>
            </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
            <div className="container py-5">
                <div className="section-header scroll-reveal">
                    <span className="section-subtitle">{t('testimonials', 'Testimonials')}</span>
                    <h2 className="section-title wave-text">{t('what_clients_say', 'What Our Clients Say')}</h2>
                </div>
                <div className="row g-4">
                    <div className="col-md-4 scroll-reveal">
                        <div className="testimonial-item">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" className="testimonial-img" alt="Client" />
                            <h5 className="client-name">Mario Santos</h5>
                            <p className="client-loc">Manila</p>
                            <div className="stars">
                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                            </div>
                            <p className="quote">{t('quote1', '"PhilGood Travels made our El Nido trip absolutely unforgettable! The team was professional and the experiences were beyond amazing."')}</p>
                        </div>
                    </div>
                    <div className="col-md-4 scroll-reveal delay-1">
                        <div className="testimonial-item">
                            <img src="https://randomuser.me/api/portraits/men/45.jpg" className="testimonial-img" alt="Client" />
                            <h5 className="client-name">John Reyes</h5>
                            <p className="client-loc">Cebu</p>
                            <div className="stars">
                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
                            </div>
                            <p className="quote">{t('quote2', '"The Chocolate Hills tour was breathtaking! Everything was well-organized and our guide was incredibly knowledgeable."')}</p>
                        </div>
                    </div>
                    <div className="col-md-4 scroll-reveal delay-2">
                        <div className="testimonial-item">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" className="testimonial-img" alt="Client" />
                            <h5 className="client-name">Sarah Chen</h5>
                            <p className="client-loc">Singapore</p>
                            <div className="stars">
                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                            </div>
                            <p className="quote">{t('quote3', '"As a first-time visitor to the Philippines, I was impressed by the service and beautiful destinations. Highly recommend!"')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- CTA --- */}
        <section className="cta-section scroll-reveal">
            <div className="container text-center py-5">
                <h2 className="section-title mb-3 wave-text">{t('ready_adventure', 'Ready for Your Next Adventure?')}</h2>
                <p className="section-desc mb-4">{t('ready_desc', 'Book your dream Philippine vacation today and create memories that will last a lifetime.')}</p>
                <Link to="/booking" className="hero-btn">{t('start_journey', 'START YOUR JOURNEY')}</Link>
            </div>
        </section>

        {/* SCENE 3: READY FOR YOUR NEXT DIVE */}
        <section className="scene-section dive-bg" style={{ backgroundImage: `url("${swimImg}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="container">
                <div className="row align-items-center scene-block scroll-reveal">
                    <div className="col-lg-6">
                        <div className="scene-content pe-lg-5">
                            <span className="section-subtitle">{t('underwater', 'UNDERWATER')}</span>
                            <h2 className="scene-title wave-text">{t('next_dive', 'Ready for Your Next Dive?')}</h2>
                            <p className="scene-text">{t('dive_desc1', 'Descend into the deep blue. Discover vibrant coral reefs, swim alongside majestic sea turtles, and explore the mysteries of the ocean floor.')}</p>
                            <p className="scene-text">{t('dive_desc2', 'Beyond the technicolor gardens of coral lies a world frozen in time. Navigate through haunting shipwrecks and silent underwater caverns where history rests beneath the tides.')}</p>
                            <Link to="/tours?search=diving" className="btn-text-link mt-3 d-inline-block">{t('view_diving', 'View Diving Packages')} <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                        <div className="mobile-scene-img" style={{ backgroundImage: `url("${swimImg}")` }}></div>
                    </div>
                </div>
            </div>
        </section>

    </div>
  );
};

export default Home;