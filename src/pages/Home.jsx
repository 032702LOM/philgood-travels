import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';
import { tourPackages, allPlaces, regions } from '../data/placesData';

const Home = () => {
    const { t, formatPrice } = usePreferences();
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % tourPackages.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + tourPackages.length) % tourPackages.length);

    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll('.scroll-reveal');
            elements.forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                    el.classList.add('visible');
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            {/* HERO SECTION - Text remains white over dark image gradient */}
            <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="4000">
                <div className="carousel-inner">
                    <div className="carousel-item active" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2000&auto=format&fit=crop')" }}>
                        <div className="hero-overlay">
                            <div className="container fade-in">
                                <span className="section-subtitle text-white mb-2 d-block">{t('hero_island', 'ISLAND PARADISE')}</span>
                                <h1 className="hero-title display-1">Discover Palawan</h1>
                                <p className="lead text-white-50 mb-4 fw-light font-montserrat">Voted the best island in the world.</p>
                                <Link to="/destinations" className="hero-btn">Explore Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="carousel-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2000&auto=format&fit=crop')" }}>
                        <div className="hero-overlay">
                            <div className="container fade-in">
                                <span className="section-subtitle text-white mb-2 d-block">{t('hero_adv', 'ADVENTURE AWAITS')}</span>
                                <h1 className="hero-title display-1">Dive into Cebu</h1>
                                <p className="lead text-white-50 mb-4 fw-light font-montserrat">Swim with gentle giants and explore vibrant reefs.</p>
                                <Link to="/tours" className="hero-btn">View Tours</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOP PACKAGES (FANNED STACK) - Text inside cards updated via CSS, Background updated */}
            <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
                <div className="container mt-5">
                    <div className="section-header scroll-reveal">
                        <span className="section-subtitle">{t('tours_title', 'TOUR PACKAGES')}</span>
                        <h2 className="section-title text-navy">{t('top_pkg', 'Top Packages That Fit You')}</h2>
                        <p className="section-desc text-grey">Curated experiences designed to give you the ultimate Philippine adventure.</p>
                    </div>

                    <div className="fanned-stack-container scroll-reveal delay-1">
                        <button className="stack-nav-btn prev-btn" onClick={handlePrev}><i className="fa-solid fa-chevron-left"></i></button>
                        
                        {tourPackages.map((tour, index) => {
                            let positionClass = '';
                            if (index === activeIndex) positionClass = 'pos-center';
                            else if (index === (activeIndex - 1 + tourPackages.length) % tourPackages.length) positionClass = 'pos-left';
                            else if (index === (activeIndex + 1) % tourPackages.length) positionClass = 'pos-right';
                            else if (index === (activeIndex - 2 + tourPackages.length) % tourPackages.length) positionClass = 'pos-far-left';
                            else if (index === (activeIndex + 2) % tourPackages.length) positionClass = 'pos-far-right';
                            else positionClass = 'pos-hidden';

                            return (
                                <div key={tour.id} className={`fanned-card-wrapper ${positionClass}`} onClick={() => { if (positionClass !== 'pos-center') setActiveIndex(index); }}>
                                    <div className="card border-0">
                                        <div className="card-img-wrapper" style={{ height: '220px' }}>
                                            <span className="card-badge"><i className="fa-regular fa-clock me-1"></i> {tour.duration}</span>
                                            <img src={tour.img} className="card-img-top" alt={tour.name} loading="lazy" />
                                        </div>
                                        <div className="card-body">
                                            <span className="card-location"><i className="fa-solid fa-map-location-dot"></i> {tour.type}</span>
                                            <h4 className="card-title text-navy">{tour.name}</h4>
                                            <div className="price-section mt-auto">
                                                <div>
                                                    <span className="price-large">{formatPrice(tour.price)}</span>
                                                    <span className="price-per-person">per person</span>
                                                </div>
                                                <Link to={`/booking?tour=${tour.id}`} className="btn btn-sm btn-outline-custom">Book</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        <button className="stack-nav-btn next-btn" onClick={handleNext}><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                    
                    <div className="text-center mt-4 scroll-reveal delay-2">
                        <Link to="/tours" className="btn-view-details">View All Packages <i className="fa-solid fa-arrow-right ms-2"></i></Link>
                    </div>
                </div>
            </section>

            {/* QUICK STATS - Background changed to var(--bg-dark), cards updated to light format */}
            <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
                <div className="container">
                    <div className="row g-4 text-center">
                        <div className="col-md-3 col-6 scroll-reveal">
                            <div className="stat-card">
                                <i className="fa-solid fa-map-location-dot"></i>
                                <div className="stat-number font-anton text-navy">7,641</div>
                                <div className="stat-label font-montserrat fw-bold text-grey">Islands</div>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 scroll-reveal delay-1">
                            <div className="stat-card">
                                <i className="fa-solid fa-sun"></i>
                                <div className="stat-number font-anton text-navy">300+</div>
                                <div className="stat-label font-montserrat fw-bold text-grey">Sunny Days</div>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 scroll-reveal delay-2">
                            <div className="stat-card">
                                <i className="fa-solid fa-face-smile-beam"></i>
                                <div className="stat-number font-anton text-navy">100%</div>
                                <div className="stat-label font-montserrat fw-bold text-grey">Friendly Locals</div>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 scroll-reveal delay-3">
                            <div className="stat-card">
                                <i className="fa-solid fa-camera"></i>
                                <div className="stat-number font-anton text-navy">∞</div>
                                <div className="stat-label font-montserrat fw-bold text-grey">Memories</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISUAL SCENES - Replaced hardcoded #021A2E background with --bg-dark */}
            <section className="scene-section">
                <div className="container">
                    
                    <div className="row align-items-center scene-block trail-makers-bg scroll-reveal">
                        <div className="col-lg-5 col-md-8 scene-content pe-lg-5">
                            <h2 className="scene-title text-navy">Trail Makers</h2>
                            <p className="scene-text">Scale the majestic peaks of the Cordilleras or navigate the verdant trails of Mt. Apo. The Philippines offers untamed wilderness for those who seek to conquer the heights.</p>
                            <Link to="/tours" className="btn-text-link">Explore Hiking Tours <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                    </div>

                    <div className="row align-items-center scene-block dive-bg flex-row-reverse scroll-reveal delay-1">
                        <div className="col-lg-5 col-md-8 scene-content ps-lg-5 text-lg-end text-md-start">
                            <h2 className="scene-title text-navy">Your Next Dive</h2>
                            <p className="scene-text">Plunge into the epicenter of marine biodiversity. From the historic wrecks of Coron to the vibrant reefs of Tubbataha, an underwater cosmos awaits.</p>
                            <Link to="/destinations" className="btn-text-link">Discover Dive Spots <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                    </div>

                    <div className="row align-items-center scene-block sleep-bg scroll-reveal delay-2">
                        <div className="col-lg-5 col-md-8 scene-content pe-lg-5">
                            <h2 className="scene-title text-navy">Sleep Under the Stars</h2>
                            <p className="scene-text">Pitch a tent on a secluded beach or glamp in the highlands. Disconnect from the noise and let the rhythmic sounds of tropical nature lull you to sleep.</p>
                            <Link to="/gallery" className="btn-text-link">View Gallery <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* EXPLORE REGIONS - Re-colored the section header */}
            <section className="destinations-bg pt-5 pb-5">
                <div className="container pt-5">
                    <div className="section-header scroll-reveal">
                        <span className="section-subtitle text-white">DESTINATIONS</span>
                        <h2 className="section-title text-white">Explore Regions</h2>
                        <p className="section-desc text-white-50">From bustling cities to hidden lagoons, find your perfect escape.</p>
                    </div>

                    <div className="row g-4">
                        {regions.map((region, index) => (
                            <div key={region.id} className={`col-lg-4 col-md-6 scroll-reveal delay-${index % 3 + 1}`}>
                                <Link to="/destinations" className="text-decoration-none">
                                    <div className="card h-100 border-0 overflow-hidden shadow">
                                        <div className="card-img-wrapper" style={{ height: '250px' }}>
                                            <div className="badge-item position-absolute" style={{ top: '15px', left: '15px', zIndex: 2 }}>
                                                <i className="fa-solid fa-map-pin"></i> {region.locationLabel}
                                            </div>
                                            <img src={region.image} className="card-img-top w-100 h-100 object-fit-cover" alt={region.name} loading="lazy" />
                                        </div>
                                        <div className="card-body text-center p-4">
                                            <h4 className="card-title text-navy mb-2">{region.name}</h4>
                                            <p className="card-text text-grey small mb-3">{region.desc}</p>
                                            <span className="text-accent fw-bold font-montserrat small text-uppercase" style={{ letterSpacing: '1px' }}>{region.typeBadge}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS - Light Cards */}
            <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
                <div className="container mt-5 mb-5">
                    <div className="section-header scroll-reveal">
                        <span className="section-subtitle">TESTIMONIALS</span>
                        <h2 className="section-title text-navy">What Travelers Say</h2>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4 scroll-reveal delay-1">
                            <div className="testimonial-item bg-white">
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="testimonial-img" />
                                <h5 className="client-name text-navy">Sarah Jenkins</h5>
                                <div className="client-loc text-primary-dark">UK • Visited Palawan</div>
                                <div className="stars">★★★★★</div>
                                <p className="quote text-grey">"The El Nido tour was organized flawlessly. The lagoons were breathtaking and our guide made sure we beat the crowds. Highly recommend PhilGood Travels!"</p>
                            </div>
                        </div>
                        <div className="col-md-4 scroll-reveal delay-2">
                            <div className="testimonial-item bg-white">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="testimonial-img" />
                                <h5 className="client-name text-navy">Marko Silva</h5>
                                <div className="client-loc text-primary-dark">Spain • Visited Cebu</div>
                                <div className="stars">★★★★★</div>
                                <p className="quote text-grey">"Canyoneering in Cebu was the highlight of my year. The team handled all logistics, leaving me to just enjoy the adrenaline rush. A 10/10 experience."</p>
                            </div>
                        </div>
                        <div className="col-md-4 scroll-reveal delay-3">
                            <div className="testimonial-item bg-white">
                                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="testimonial-img" />
                                <h5 className="client-name text-navy">Elena Rostova</h5>
                                <div className="client-loc text-primary-dark">USA • Visited Bohol</div>
                                <div className="stars">★★★★★</div>
                                <p className="quote text-grey">"A perfect blend of luxury and nature. The resort in Bohol was stunning, and the river cruise was so peaceful. Everything was taken care of."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;