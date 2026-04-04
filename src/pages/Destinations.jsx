import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { allPlaces, regions } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext';
import heroImg from '../assets/img/Find Your Place.png';

const Destinations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, formatPrice } = usePreferences();

  const [view, setView] = useState('main'); 
  const [filteredPlaces, setFilteredPlaces] = useState(allPlaces);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCheckboxes, setActiveCheckboxes] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [weather, setWeather] = useState('--°C');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initialPositions = ['pos-hidden', 'pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];
  const [regionPositions, setRegionPositions] = useState(initialPositions);

  const tourRef = useRef(null);

  const filterCategories = [
    { title: 'Payment Options', field: 'payment', options: ['Free cancellation', 'Pay at the hotel', 'Book now, pay later', 'Pay now', 'Book without credit card'] },
    { title: 'Travel Style', field: 'travelStyle', options: ['Mountains', 'Hiking/Mountaineering', 'Camping', 'National Park', 'Resort Hotel', 'City'] },
    { title: 'Room Offers', field: 'roomOffers', options: ['Breakfast included', 'Airport transfer', 'Exercise bike', 'Outside food delivery allowed', 'Treadmill', 'Dinner included', 'Lunch included', 'Early check-in', 'Vegetarian', 'Espresso machine with pods', 'Car rental', 'Gluten-free', 'Vegan', 'Dumbbells', 'Bottle of wine', 'Delivery from nearby convenience store', 'Recreation area access with conditions'] },
    { title: 'Property Facilities', field: 'facilities', options: ['Swimming pool', 'Internet', 'Car park', 'Airport transfer', 'Gym/fitness', 'Front desk [24-hour]', 'Family/child friendly', 'Non-smoking', 'Spa/sauna', 'Restaurants', 'Smoking area', 'Pets allowed', 'Nightclub', 'Facilities for disabled guests', 'Business facilities', 'Golf course [on-site]'] },
    { title: 'Popular with Families', field: 'family', options: ['Kids stay for free'] },
    { title: 'Distance to center', field: 'distance', options: ['Inside city center', '<2 km to center', '2-5 km to center', '5-10 km to center', '>10 km to center'] },
    { title: 'Bed Type', field: 'bed', options: ['Double', 'Queen', 'Single/twin', 'Bunk bed', 'King'] },
    { title: 'Number of Bedrooms', field: 'bedrooms', options: ['1 bedroom/studio', '2 bedrooms', '3+ bedrooms'] },
    { title: 'Beach Access', field: 'beachAccess', options: ['Public beach', 'Private beach'] }
  ];

  const hotelsForDropdown = selectedRegion === 'All' ? allPlaces : allPlaces.filter(p => p.region.toLowerCase().trim() === selectedRegion.toLowerCase().trim());
  const isDefaultView = selectedRegion === 'All' && selectedHotel === '' && searchKeyword === '' && activeCheckboxes.length === 0;

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50; 

  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndDest = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) rotateRegionStack('next'); 
    if (distance < -minSwipeDistance) rotateRegionStack('prev'); 
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const regionParam = params.get('region'); 
    
    if (searchParam) { setSearchKeyword(searchParam); setSelectedRegion('All'); } 
    
    if (regionParam) {
      let mappedRegion = regionParam;
      if (regionParam.toLowerCase() === 'boracay') mappedRegion = 'Aklan';
      if (regionParam.toLowerCase() === 'banaue') mappedRegion = 'Ifugao';
      setSelectedRegion(mappedRegion); setSearchKeyword(''); setSelectedHotel(''); setActiveCheckboxes([]); window.scrollTo(0, 0); 
    }
  }, [location.search]);

  const rotateRegionStack = (direction) => {
    setRegionPositions((current) => {
      const newPos = [...current];
      direction === 'next' ? newPos.push(newPos.shift()) : newPos.unshift(newPos.pop());
      return newPos;
    });
  };

  const baseFilteredPlaces = allPlaces.filter(p => {
    let match = true;
    if (selectedRegion !== 'All' && p.region.toLowerCase().trim() !== selectedRegion.toLowerCase().trim()) match = false;
    if (selectedHotel !== '' && p.id !== selectedHotel) match = false;
    if (searchKeyword) {
      const lowerKw = searchKeyword.toLowerCase();
      match = match && (p.name.toLowerCase().includes(lowerKw) || p.type.toLowerCase().includes(lowerKw) || p.region.toLowerCase().includes(lowerKw) || (p.facilities && p.facilities.some(f => f.toLowerCase().includes(lowerKw))));
    }
    return match;
  });
  
  useEffect(() => {
    let result = baseFilteredPlaces;
    if (activeCheckboxes.length > 0) {
      result = result.filter(place => {
        const placeAttribs = [...(place.payment || []), ...(place.travelStyle || []), ...(place.roomOffers || []), ...(place.facilities || []), ...(place.bed || []), ...(place.bedrooms || []), place.family, place.distance, place.beachAccess].filter(Boolean); 
        return activeCheckboxes.every(filter => placeAttribs.includes(filter));
      });
    }
    setFilteredPlaces(result);
  }, [baseFilteredPlaces, activeCheckboxes]);

  const getCount = (option) => {
    return baseFilteredPlaces.filter(place => {
        const placeAttribs = [...(place.payment || []), ...(place.travelStyle || []), ...(place.roomOffers || []), ...(place.facilities || []), ...(place.bed || []), ...(place.bedrooms || []), place.family, place.distance, place.beachAccess].filter(Boolean);
        return placeAttribs.includes(option);
    }).length;
  };

  useEffect(() => {
    const isExternalTour = selectedPlace?.virtualTourUrl || (selectedPlace?.name && selectedPlace.name.includes('Okada'));
    if (view === 'detail' && selectedPlace && selectedPlace.panorama && !isExternalTour) {
      if (window.myPannellumViewer) window.myPannellumViewer.destroy();
      setTimeout(() => {
        if (document.getElementById('panorama') && window.pannellum) { window.myPannellumViewer = window.pannellum.viewer('panorama', { "type": "equirectangular", "panorama": selectedPlace.panorama, "autoLoad": true, "compass": true, "title": selectedPlace.name }); }
      }, 100);
    }
    return () => { if (window.myPannellumViewer) { window.myPannellumViewer.destroy(); window.myPannellumViewer = null; } };
  }, [view, selectedPlace]);

  const handleToggleCheckbox = (val) => { setActiveCheckboxes(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]); };
  
  const fetchWeather = async (lat, lon) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY; 
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      const data = await response.json();
      setWeather(Math.round(data.main.temp) + '°C');
    } catch (err) { setWeather('--°C'); }
  };

  const handleRefreshWeather = async () => { if (selectedPlace && selectedPlace.lat) { setIsRefreshing(true); await fetchWeather(selectedPlace.lat, selectedPlace.lon); setTimeout(() => setIsRefreshing(false), 800); } };
  const handleOpenDetail = (place) => { setSelectedPlace(place); setView('detail'); if (place.lat && place.lon) fetchWeather(place.lat, place.lon); window.scrollTo(0, 0); };
  const handleCloseDetail = () => { setView('main'); window.scrollTo(0, 0); };

  const handleFullScreen = () => {
    const elem = tourRef.current;
    if (!elem) return;
    if (elem.requestFullscreen) { elem.requestFullscreen(); } 
    else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); } 
    else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); }
  };

  if (view === 'detail' && selectedPlace) {
    return (
      <div id="destination-detail-view" className="fade-in" style={{ paddingTop: '76px' }}>
        <div className="detail-hero" id="detailHeroBg" style={{ backgroundImage: `linear-gradient(to bottom, rgba(2, 26, 46, 0.4), var(--bg-dark)), url('${selectedPlace.img}')`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '100px 0 50px' }}>
            <div className="container pt-5 pb-5">
                <a href="#" className="back-link mb-3 d-inline-block text-decoration-none fw-bold" style={{ color: '#FF7F50' }} onClick={(e) => { e.preventDefault(); handleCloseDetail(); }}>{t('back_places', '← Back to All Places')}</a>
                <h1 className="hero-title mb-3" id="detailTitle">{selectedPlace.name}</h1>
                <div className="d-flex gap-3 align-items-center">
                    <span className="badge rounded-pill text-dark" style={{ backgroundColor: '#FF8C73' }} id="detailType">{selectedPlace.type}</span>
                    <span className="text-grey font-montserrat"><i className="fa-solid fa-location-dot me-1"></i> <span id="detailRegion">{selectedPlace.region}</span></span>
                </div>
            </div>
        </div>
        <div className="container py-5">
            <div className="row g-5">
                <div className="col-lg-8">
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box">
                        <h6 className="text-accent fw-bold mb-3 font-montserrat">{t('pay_offers', 'PAYMENT & OFFERS')}</h6>
                        <ul className="row list-unstyled text-grey m-0">{[...(selectedPlace.payment || []), ...(selectedPlace.roomOffers || [])].map((item, idx) => (<li key={idx} className="col-md-6 mb-2"><i className="fa-solid fa-check text-accent me-2"></i>{item}</li>))}</ul>
                    </div>
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box">
                        <h6 className="text-accent fw-bold mb-3 font-montserrat">{t('facilities', 'FACILITIES')}</h6>
                        <ul className="row list-unstyled text-grey m-0">{(selectedPlace.facilities || []).map((fac, idx) => (<li key={idx} className="col-md-6 mb-2"><i className="fa-solid fa-check text-accent me-2"></i>{fac}</li>))}</ul>
                    </div>
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box">
                        <h6 className="text-accent fw-bold mb-3 font-montserrat">{t('details', 'DETAILS')}</h6>
                        <ul className="list-unstyled text-grey m-0">
                            {selectedPlace.bed && <li className="mb-2"><strong>{t('bed_type', 'Bed Type')}:</strong> {selectedPlace.bed.join(', ')}</li>}
                            {selectedPlace.bedrooms && <li className="mb-2"><strong>{t('num_bedrooms', 'Bedrooms')}:</strong> {selectedPlace.bedrooms.join(', ')}</li>}
                            {selectedPlace.beachAccess && <li className="mb-2"><strong>{t('beach_access', 'Beach Access')}:</strong> {selectedPlace.beachAccess}</li>}
                            {selectedPlace.travelStyle && selectedPlace.travelStyle.includes('Hiking/Mountaineering') && <li className="mb-2"><strong>{t('hiking', 'Hiking')}:</strong> Yes</li>}
                            {selectedPlace.distance && <li className="mb-2"><strong>{t('distance', 'Distance')}:</strong> {selectedPlace.distance}</li>}
                            {selectedPlace.family && <li className="mb-2"><strong>{t('family', 'Family')}:</strong> {selectedPlace.family}</li>}
                        </ul>
                    </div>
                    
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-accent fw-bold m-0 font-montserrat">{t('view_360', '360° VIEW')}</h6>
                            <button className="btn btn-sm btn-outline-custom" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={handleFullScreen}><i className="fa-solid fa-expand me-1"></i> {t('full_screen', 'Full Screen')}</button>
                        </div>
                        {selectedPlace.virtualTourUrl || (selectedPlace.name && selectedPlace.name.includes('Okada')) ? (
                            <iframe ref={tourRef} src={selectedPlace.virtualTourUrl || 'https://tours.exsight360.com/okada/index.html'} className="rounded-3 border border-secondary border-opacity-25 shadow" style={{ width: '100%', height: '400px', border: 'none', backgroundColor: '#000' }} allow="xr-spatial-tracking; vr; gyroscope; accelerometer; fullscreen" allowFullScreen title={`${selectedPlace.name} 360 Tour`}></iframe>
                        ) : (<div ref={tourRef} id="panorama" className="rounded-3 border border-secondary border-opacity-25 shadow" style={{ width: '100%', height: '400px', backgroundColor: '#000' }}></div>)}
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box text-center">
                        <h6 className="text-grey small mb-2">{t('starting_at', 'Starting at')}</h6>
                        <h2 className="fw-bold mb-0 text-accent">{formatPrice(selectedPlace.price)}</h2>
                        <small className="text-grey">{t('per_night', '/ night')}</small>
                    </div>

                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box text-center">
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                            <i className="fa-solid fa-cloud text-grey"></i>
                            <h6 className="text-navy font-montserrat fw-bold m-0">{t('weather', 'Weather')}</h6>
                            <button className="btn btn-sm btn-link p-0 ms-2 text-grey" onClick={handleRefreshWeather} title="Refresh Weather"><i className={`fa-solid fa-rotate-right ${isRefreshing ? 'fa-spin' : ''}`}></i></button>
                        </div>
                        <h1 className="fw-bold mb-1" style={{ fontSize: '3.5rem', color: '#FF8C73' }} id="weatherTemp">{weather}</h1>
                    </div>
                    <a href={`/booking?package=${encodeURIComponent(selectedPlace.name)}`} className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold mb-3 d-block text-center text-decoration-none">{t('book_now', 'Book Now')}</a>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div id="destinations-main-view" className="fade-in">
        <section className="destinations-hero" style={{ backgroundColor: '#023E8A', backgroundImage: `url("${heroImg}")`, marginTop: 0 }}>
            <div className="container text-center mb-4 scroll-reveal visible">
                <h1 className="hero-title transparent-text" style={{ fontSize: '4rem' }}>{t('dest_title', 'Find Your Place')}</h1>
            </div>
        </section>

        <section id="destinations" className="fade-in py-5" style={{ minHeight: '500px', backgroundColor: 'var(--bg-dark)' }}>
            <div className="container">
                
                <div className="search-filter-bar p-4 rounded-4 mx-auto mb-5 shadow-sm scroll-reveal visible" style={{ maxWidth: '900px', zIndex: 10, position: 'relative' }}>
                    <div className="row g-3 align-items-center">
                        <div className="col-md-4">
                            <label className="text-primary-dark fw-bold small mb-1">{t('region', 'Region')}</label>
                            <div className="input-with-icon">
                                <i className="fa-solid fa-map-location-dot"></i>
                                <select className="form-control-dark form-select w-100" value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedHotel(''); }}>
                                    <option value="All">{t('all_regions', 'All Regions')}</option>
                                    <option value="Bohol">Bohol</option>
                                    <option value="Palawan">Palawan</option>
                                    <option value="Aklan">Aklan (Boracay)</option>
                                    <option value="Ifugao">Ifugao (Banaue)</option>
                                    <option value="Manila">Manila</option>
                                    <option value="Cebu">Cebu</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="text-primary-dark fw-bold small mb-1">{t('accommodation', 'Accommodation')}</label>
                            <div className="input-with-icon">
                                <i className="fa-solid fa-hotel"></i>
                                <select className="form-control-dark form-select w-100" value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                                    <option value="">{t('all_acc', 'All Accommodations')}</option>
                                    {hotelsForDropdown.map(hotel => (<option key={hotel.id} value={hotel.id}>{hotel.name}</option>))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="text-primary-dark fw-bold small mb-1">{t('keyword_search', 'Keyword Search')}</label>
                            <div className="input-with-icon">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input type="text" className="form-control-dark form-control w-100" placeholder={t('search_placeholder', 'Type to search...')} value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-xl-3 mb-4 scroll-reveal visible">
                        <div className="d-lg-none mb-3"><button className="btn w-100 d-flex justify-content-between align-items-center p-3 rounded-3 shadow-sm text-navy" type="button" data-bs-toggle="collapse" data-bs-target="#filterSidebar" style={{ backgroundColor: 'var(--card-bg)' }}><span className="font-montserrat fw-bold"><i className="fa-solid fa-sliders text-accent me-2"></i> {t('filters', 'Filters')} {activeCheckboxes.length > 0 ? `(${activeCheckboxes.length})` : ''}</span><i className="fa-solid fa-chevron-down"></i></button></div>
                        <div className="collapse d-lg-block" id="filterSidebar">
                            <div className="sidebar-filter-container sticky-top bg-card-dark" style={{ top: '100px', maxHeight: '80vh', overflowY: 'auto' }}>
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-primary border-opacity-10 pb-3">
                                    <h5 className="text-navy fw-bold font-montserrat m-0 d-none d-lg-block"><i className="fa-solid fa-sliders text-accent me-2"></i> {t('filters', 'Filters')}</h5>
                                    {activeCheckboxes.length > 0 && (<button className="btn btn-sm btn-link text-grey p-0 text-decoration-none" onClick={() => setActiveCheckboxes([])}>{t('clear_all', 'Clear All')}</button>)}
                                </div>
                                {filterCategories.map(category => (
                                    <div className="filter-section mb-4" key={category.title}>
                                        <h6 className="filter-title text-navy">{category.title}</h6>
                                        {category.options.map(option => {
                                            const count = getCount(option); 
                                            const isActive = activeCheckboxes.includes(option);
                                            if (count === 0 && !isActive) return null; 
                                            return (
                                                <div className="form-check mb-2" key={option}>
                                                    <input className="form-check-input filter-checkbox" type="checkbox" onChange={() => handleToggleCheckbox(option)} checked={isActive} id={`filter-${option.replace(/[^a-zA-Z0-9]/g, '-')}`} />
                                                    <label className="form-check-label w-100 d-flex justify-content-between align-items-center text-grey" htmlFor={`filter-${option.replace(/[^a-zA-Z0-9]/g, '-')}`}><span className={isActive ? 'text-primary-dark fw-bold' : ''}>{option}</span><span className="badge" style={{ backgroundColor: 'var(--primary-dark)', color: '#FFFFFF' }}>{count}</span></label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 col-xl-9">
                        {isDefaultView ? (
                            <div className="fade-in">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-navy font-montserrat fw-bold mb-0">{t('explore_regions', 'Explore Regions')}</h4>
                                    <span className="text-grey small fw-bold">{t('major_regions', '6 Major Regions')}</span>
                                </div>
                                
                                <div className="fanned-stack-container mt-4" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndDest}>
                                    <button className="stack-nav-btn prev-btn shadow" onClick={() => rotateRegionStack('prev')}><i className="fa-solid fa-chevron-left"></i></button>
                                    <button className="stack-nav-btn next-btn shadow" onClick={() => rotateRegionStack('next')}><i className="fa-solid fa-chevron-right"></i></button>
                                    {regions.map((region, index) => (
                                        <div key={region.id} className={`fanned-card-wrapper ${regionPositions[index]}`} onClick={() => { 
                                            if(window.innerWidth <= 991 || regionPositions[index] === 'pos-center') { 
                                                let rId = region.id; if (rId.toLowerCase() === 'boracay') rId = 'Aklan'; if (rId.toLowerCase() === 'banaue') rId = 'Ifugao';
                                                setSelectedRegion(rId); window.scrollTo({ top: 400, behavior: 'smooth' }); 
                                            } else if(regionPositions[index].includes('right')) { rotateRegionStack('next'); } else { rotateRegionStack('prev'); } 
                                        }}>
                                            <div className="card">
                                                <div className="card-img-wrapper"><span className="card-badge">{region.typeBadge}</span><img src={region.image} className="card-img-top" alt={region.name} /></div>
                                                <div className="card-body">
                                                    <div className="card-location"><i className="fa-solid fa-location-dot"></i> {region.locationLabel}</div>
                                                    <h5 className="card-title"><span className="region-text">{region.name}</span></h5>
                                                    <p className="card-text text-grey">{region.desc}</p>
                                                    <div className="mt-auto"><span className="btn-text-link m-0" style={{ fontSize: '0.8rem' }}>{t('view_acc', 'View Accommodations')} <i className="fa-solid fa-arrow-right text-accent ms-1"></i></span></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="fade-in">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-navy font-montserrat fw-bold mb-0">
                                        {selectedRegion === 'All' ? t('search_results', 'Search Results') : (selectedRegion.toLowerCase() === 'aklan' || selectedRegion.toLowerCase() === 'boracay' ? 'Aklan (Boracay)' : (selectedRegion.toLowerCase() === 'ifugao' || selectedRegion.toLowerCase() === 'banaue' ? 'Ifugao (Banaue)' : selectedRegion))}
                                    </h4>
                                    <span className="text-grey small fw-bold" id="destCount">{filteredPlaces.length} {t('dest_found', 'destination(s) found')}</span>
                                </div>
                                <div className="row g-4" id="cardsContainer">
                                    {filteredPlaces.length === 0 ? (
                                        <div className="col-12 text-center text-grey py-5">
                                            <i className="fa-solid fa-filter-circle-xmark fs-1 mb-3 opacity-50"></i>
                                            <h5 className="text-navy fw-bold">{t('no_match', 'No matching accommodations')}</h5>
                                            <p className="small mb-0">{t('no_match_desc', 'Try removing some of your active filters from the sidebar.')}</p>
                                        </div>
                                    ) : (
                                        filteredPlaces.map((place) => (
                                            <div key={place.id} className="col-md-6 destination-card scroll-reveal visible">
                                                <div className="card h-100">
                                                    <div className="card-img-wrapper"><span className="card-badge">{place.type ? place.type.split('/')[0].trim() : 'Place'}</span><img src={place.img} className="card-img-top" alt={place.name} /></div>
                                                    <div className="card-body">
                                                        <div className="card-location"><i className="fa-solid fa-location-dot"></i> {place.region}</div>
                                                        <h5 className="card-title">{place.name}</h5>
                                                        <p className="card-text text-grey small mb-2">{place.type} • {place.distance || 'Various'}</p>
                                                        <div className="d-flex flex-wrap gap-2 mb-3">{(place.facilities || []).slice(0, 3).map(fac => (<span key={fac} className="badge bg-primary bg-opacity-10 fw-bold" style={{ color: '#023E8A' }}>{fac}</span>))}</div>
                                                        <div className="mt-auto"><a href="#" className="explore-link border-0 bg-transparent p-0 text-start w-100 d-flex justify-content-between align-items-center" onClick={(e) => { e.preventDefault(); handleOpenDetail(place); }}><span>{t('view_details', 'View Details')}</span> <i className="fa-solid fa-arrow-right text-accent"></i></a></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
};

export default Destinations;