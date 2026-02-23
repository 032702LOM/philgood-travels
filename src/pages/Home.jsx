import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { regions, tourPackages } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext'; // <-- IMPORT CONTEXT

const Home = () => {
  const navigate = useNavigate();
  const { t, formatPrice } = usePreferences(); // <-- PULL IN TOOLS
  
  const initialPositions = ['pos-hidden', 'pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];
  const [destPositions, setDestPositions] = useState(initialPositions);
  const [pkgPositions, setPkgPositions] = useState(initialPositions);

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

  return (
    <div className="fade-in">
        {/* --- TOP ALERT BANNER --- */}
        <div className="top-alert" id="specialOfferBanner">
            <span className="text-navy fw-bold"><i className="fa-solid fa-sun me-2 text-navy"></i> MONSOON SPECIAL: 30% OFF on all Palawan packages! Limited time only!</span>
            <i className="fa-solid fa-xmark close-alert text-navy" onClick={(e) => e.target.parentElement.style.display='none'}></i>
        </div>
        
        {/* --- HERO SECTION CAROUSEL --- */}
        <section id="home" style={{ marginTop: '0', backgroundColor: 'var(--bg-dark)' }}>
            <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="4000">
                <div className="carousel-inner">
                    <div className="carousel-item active" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606676366299-fdec90590467?q=80&w=1170&auto=format&fit=crop')" }}>
                        <div className="hero-overlay">
                            <div className="container scroll-reveal visible">
                                <h1 className="hero-title">{t('hero_island', 'ISLAND PARADISE')}</h1>
                                <p className="hero-subtitle text-white">Relax on pristine white sand beaches</p>
                                <Link to="/booking" className="hero-btn">{t('book_now', 'BOOK NOW')}</Link>
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

        {/* --- SCENE 1: TRAIL MAKERS --- */}
        <section className="scene-section trail-makers-bg" style={{ backgroundColor: 'var(--bg-dark)', backgroundImage: "url('https://i.postimg.cc/9MkYFcs3/man_on_the_cliff.png')" }}>
            <div className="container">
                <div className="row align-items-center scene-block scroll-reveal visible">
                    <div className="col-lg-6">
                        <div className="scene-content pe-lg-5">
                            <span className="section-subtitle">PERSPECTIVE</span>
                            <h2 className="scene-title text-navy">The Trail Makers</h2>
                            <p className="scene-text text-grey">Sometimes the best view comes after the hardest climb. Take a moment to sit, breathe, and appreciate the world from a new perspective.</p>     
                            <p className="scene-text text-grey">A breathtaking panoramic view from a mountain summit at sunset. A lone hiker is sitting on a rocky ledge, silhouette against a vibrant orange and purple sky, looking out over a sea of clouds and distant peaks.</p>             
                            <Link to="/destinations" className="btn-text-link">Explore Mountains <i className="fa-solid fa-arrow-right"></i></Link>
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
                    <h2 className="section-title text-navy">{t('pop_dest', 'Most Popular Destinations')}</h2>
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

        {/* --- SCENE 2: SLEEP UNDER THE STARS --- */}
        <section className="scene-section sleep-bg" style={{ backgroundColor: 'var(--bg-dark)', backgroundImage: "url('https://i.postimg.cc/jqyq9xMK/man_on_cliff.png')" }}>
            <div className="container">
                <div className="row align-items-center scene-block scroll-reveal visible">
                    <div className="col-lg-6">
                        <div className="scene-content pe-lg-5">
                            <span className="section-subtitle">IMMERSION</span>
                            <h2 className="scene-title text-navy">Sleep Under the Stars</h2>
                            <p className="scene-text text-grey">Disconnect to reconnect. Experience the serenity of a night in the wild, with nothing but the crackle of a campfire and the starry sky above.</p>
                            <Link to="/destinations?search=camping" className="btn-text-link">Book a Camping Trip <i className="fa-solid fa-arrow-right"></i></Link>
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
                    <h2 className="section-title text-navy">{t('top_pkg', 'Top Packages That Fit You')}</h2>
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

        {/* --- TESTIMONIALS (Restored!) --- */}
        <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
            <div className="container py-5">
                <div className="section-header scroll-reveal visible">
                    <span className="section-subtitle">Testimonials</span>
                    <h2 className="section-title text-navy">What Our Clients Say</h2>
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
                <h2 className="section-title text-navy mb-3">Ready for Your Next Adventure?</h2>
                <p className="section-desc text-grey mb-4">Book your dream Philippine vacation today and create memories that will last a lifetime.</p>
                <Link to="/booking" className="hero-btn">START YOUR JOURNEY</Link>
            </div>
        </section>

        {/* --- SCENE 3: READY FOR YOUR NEXT DIVE --- (Restored!) */}
        <section className="scene-section dive-bg" style={{ backgroundColor: 'var(--bg-dark)', backgroundImage: "url('https://i.postimg.cc/rshH22yZ/dive.png')" }}>
            <div className="container">
                <div className="row align-items-center scene-block scroll-reveal visible">
                    <div className="col-lg-6">
                        <div className="scene-content pe-lg-5">
                            <span className="section-subtitle">UNDERWATER</span>
                            <h2 className="scene-title text-navy">Ready for Your Next Dive?</h2>
                            <p className="scene-text text-grey">Descend into the deep blue. Discover vibrant coral reefs, swim alongside majestic sea turtles, and explore the mysteries of the ocean floor.</p>
                            <p className="scene-text text-grey">Beyond the technicolor gardens of coral lies a world frozen in time. Navigate through haunting shipwrecks and silent underwater caverns where history rests beneath the tides.</p>
                            <Link to="/tours?search=diving" className="btn-text-link">View Diving Packages <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
  );
};

export default Home;