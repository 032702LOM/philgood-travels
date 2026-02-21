import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { allPlaces, regions } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext';

const Destinations = () => {
  const location = useLocation();
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

  const hotelsForDropdown = selectedRegion === 'All' ? allPlaces : allPlaces.filter(p => p.region === selectedRegion);
  const isDefaultView = selectedRegion === 'All' && selectedHotel === '' && searchKeyword === '' && activeCheckboxes.length === 0;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const regionParam = params.get('region'); 
    if (searchParam) { setSearchKeyword(searchParam); setSelectedRegion('All'); } 
    if (regionParam) {
      const valueMap = { 'Banaue': 'Ifugao', 'Boracay': 'Boracay' };
      setSelectedRegion(valueMap[regionParam] || regionParam);
      setSearchKeyword(''); setSelectedHotel(''); setActiveCheckboxes([]);
      window.scrollTo(0, 0); 
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
    if (selectedRegion !== 'All' && p.region !== selectedRegion) match = false;
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
    if (view === 'detail' && selectedPlace && selectedPlace.panorama) {
      if (window.myPannellumViewer) window.myPannellumViewer.destroy();
      setTimeout(() => {
        if (document.getElementById('panorama') && window.pannellum) {
          window.myPannellumViewer = window.pannellum.viewer('panorama', { "type": "equirectangular", "panorama": selectedPlace.panorama, "autoLoad": true, "compass": true, "title": selectedPlace.name });
        }
      }, 100);
    }
    return () => { if (window.myPannellumViewer) { window.myPannellumViewer.destroy(); window.myPannellumViewer = null; } };
  }, [view, selectedPlace]);

  const handleToggleCheckbox = (val) => { setActiveCheckboxes(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]); };
  
  const fetchWeather = async (lat, lon) => {
    try {
      // 1. Grab the secure key from your .env file
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY; 
      
      // 2. Inject it into the URL dynamically
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      const data = await response.json();
      setWeather(Math.round(data.main.temp) + '°C');
    } catch (err) { 
      setWeather('--°C'); 
    }
  };

  const handleRefreshWeather = async () => { if (selectedPlace && selectedPlace.lat) { setIsRefreshing(true); await fetchWeather(selectedPlace.lat, selectedPlace.lon); setTimeout(() => setIsRefreshing(false), 800); } };
  const handleOpenDetail = (place) => { setSelectedPlace(place); setView('detail'); if (place.lat && place.lon) fetchWeather(place.lat, place.lon); window.scrollTo(0, 0); };
  const handleCloseDetail = () => { setView('main'); window.scrollTo(0, 0); };

  if (view === 'detail' && selectedPlace) {
    return (
      <div id="destination-detail-view" className="fade-in" style={{ paddingTop: '76px' }}>
        <div className="detail-hero" id="detailHeroBg" style={{ backgroundImage: `linear-gradient(to bottom, rgba(2, 26, 46, 0.4), var(--bg-dark)), url('${selectedPlace.img}')`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '100px 0 50px' }}>
            <div className="container pt-5 pb-5">
                <button className="back-link mb-3 d-inline-block border-0 bg-transparent text-white text-decoration-underline" onClick={handleCloseDetail} style={{cursor: 'pointer'}}>← Back to All Places</button>
                <h1 className="hero-title mb-3" id="detailTitle">{selectedPlace.name}</h1>
                <div className="d-flex gap-3 align-items-center">
                    <span className="badge rounded-pill text-dark" style={{ backgroundColor: '#FF8C73' }} id="detailType">{selectedPlace.type}</span>
                    <span className="text-white-50 font-montserrat"><i className="fa-solid fa-location-dot me-1"></i> <span id="detailRegion">{selectedPlace.region}</span></span>
                </div>
            </div>
        </div>
        <div className="container py-5">
            <div className="row g-5">
                <div className="col-lg-8">
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box teal-hover-box">
                        <h6 className="text-accent fw-bold mb-3 font-montserrat">PAYMENT & OFFERS</h6>
                        <ul className="row list-unstyled text-white-50 m-0">
                            {[...(selectedPlace.payment || []), ...(selectedPlace.roomOffers || [])].map((item, idx) => (<li key={idx} className="col-md-6 mb-2"><i className="fa-solid fa-check text-accent me-2"></i>{item}</li>))}
                        </ul>
                    </div>
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box teal-hover-box">
                        <h6 className="text-accent fw-bold mb-3 font-montserrat">FACILITIES</h6>
                        <ul className="row list-unstyled text-white-50 m-0">
                            {(selectedPlace.facilities || []).map((fac, idx) => (<li key={idx} className="col-md-6 mb-2"><i className="fa-solid fa-check text-accent me-2"></i>{fac}</li>))}
                        </ul>
                    </div>
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box teal-hover-box">
                        <h6 className="text-accent fw-bold mb-3 font-montserrat">DETAILS</h6>
                        <ul className="list-unstyled text-white-50 m-0">
                            {selectedPlace.bed && <li className="mb-2"><strong>Bed Type:</strong> {selectedPlace.bed.join(', ')}</li>}
                            {selectedPlace.bedrooms && <li className="mb-2"><strong>Bedrooms:</strong> {selectedPlace.bedrooms.join(', ')}</li>}
                            {selectedPlace.beachAccess && <li className="mb-2"><strong>Beach Access:</strong> {selectedPlace.beachAccess}</li>}
                            {selectedPlace.travelStyle && selectedPlace.travelStyle.includes('Hiking/Mountaineering') && <li className="mb-2"><strong>Hiking:</strong> Yes</li>}
                            {selectedPlace.distance && <li className="mb-2"><strong>Distance:</strong> {selectedPlace.distance}</li>}
                            {selectedPlace.family && <li className="mb-2"><strong>Family:</strong> {selectedPlace.family}</li>}
                        </ul>
                    </div>
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box teal-hover-box">
                        <h6 className="text-accent fw-bold mb-3 font-montserrat">360° VIEW</h6>
                        <div id="panorama" className="rounded-3 border border-secondary border-opacity-25 shadow" style={{ width: '100%', height: '400px', backgroundColor: '#000' }}></div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box text-center teal-hover-box">
                        <h6 className="text-white-50 small mb-2">Starting at</h6>
                        <h2 className="fw-bold mb-0" style={{ color: '#FF8C73' }}>{formatPrice(selectedPlace.price)}</h2>
                        <small className="text-white-50">/ night</small>
                    </div>

                    <div className="bg-card-dark p-4 rounded-4 mb-4 detail-box text-center teal-hover-box">
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                            <i className="fa-solid fa-cloud text-white-50"></i>
                            <h6 className="text-white font-montserrat fw-bold m-0">Weather</h6>
                            <button className="btn btn-sm btn-link p-0 ms-2 text-white-50" onClick={handleRefreshWeather} title="Refresh Weather"><i className={`fa-solid fa-rotate-right ${isRefreshing ? 'fa-spin' : ''}`}></i></button>
                        </div>
                        <h1 className="fw-bold mb-1" style={{ fontSize: '3.5rem', color: '#FF8C73' }} id="weatherTemp">{weather}</h1>
                    </div>
                    <a href={`/booking?package=${encodeURIComponent(selectedPlace.name)}`} className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold mb-3 text-decoration-none text-center d-block">{t('book_now', 'Book Now')}</a>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div id="destinations-main-view" className="fade-in">
        <section className="destinations-hero">
            <div className="container text-center mb-4 scroll-reveal visible">
                <h1 className="hero-title" style={{ fontSize: '4rem' }}>{t('dest_title', 'FIND YOUR PLACE')}</h1>
                <p className="section-desc mb-0">Browse the best accommodations in the Philippines</p>
            </div>
            
            <div className="container pb-4 scroll-reveal visible delay-1">
                <div className="search-filter-bar p-4 rounded-4 mx-auto" style={{ maxWidth: '900px' }}>
                    <div className="row g-3 align-items-center">
                        <div className="col-md-4"><label className="text-white-50 small mb-1">Region</label><div className="input-with-icon"><i className="fa-solid fa-map-location-dot"></i><select className="form-control-dark w-100" value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedHotel(''); }}><option value="All">All Regions</option><option value="Bohol">Bohol</option><option value="Palawan">Palawan</option><option value="Boracay">Aklan (Boracay)</option><option value="Ifugao">Ifugao (Banaue)</option><option value="Manila">Manila</option><option value="Cebu">Cebu</option></select></div></div>
                        <div className="col-md-4"><label className="text-white-50 small mb-1">Accommodation</label><div className="input-with-icon"><i className="fa-solid fa-hotel"></i><select className="form-control-dark w-100" value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}><option value="">All Accommodations</option>{hotelsForDropdown.map(hotel => (<option key={hotel.id} value={hotel.id}>{hotel.name}</option>))}</select></div></div>
                        <div className="col-md-4"><label className="text-white-50 small mb-1">Keyword Search</label><div className="input-with-icon"><i className="fa-solid fa-magnifying-glass"></i><input type="text" className="form-control-dark w-100" placeholder="Type to search..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/></div></div>
                    </div>
                </div>
            </div>
        </section>

        <section id="destinations" className="fade-in mb-5" style={{ marginTop: '40px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-xl-3 mb-4 scroll-reveal visible">
                        <div className="d-lg-none mb-3"><button className="btn w-100 d-flex justify-content-between align-items-center p-3 rounded-3 border border-secondary border-opacity-25 shadow-sm text-white" type="button" data-bs-toggle="collapse" data-bs-target="#filterSidebar" style={{ backgroundColor: '#03233B' }}><span className="font-montserrat fw-bold"><i className="fa-solid fa-sliders text-accent me-2"></i> Filters {activeCheckboxes.length > 0 ? `(${activeCheckboxes.length})` : ''}</span><i className="fa-solid fa-chevron-down"></i></button></div>
                        <div className="collapse d-lg-block" id="filterSidebar">
                            <div className="sidebar-filter-container bg-card-dark p-4 rounded-4 border border-secondary border-opacity-25 sticky-top" style={{ top: '100px', maxHeight: '80vh', overflowY: 'auto' }}>
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3"><h5 className="text-white fw-bold font-montserrat m-0 d-none d-lg-block"><i className="fa-solid fa-sliders text-accent me-2"></i> Filters</h5>{activeCheckboxes.length > 0 && (<button className="btn btn-sm btn-link text-white-50 p-0 text-decoration-none" onClick={() => setActiveCheckboxes([])}>Clear All</button>)}</div>
                                {filterCategories.map(category => (
                                    <div className="filter-section mb-4" key={category.title}>
                                        <h6 className="filter-title fw-bold text-white-50 mb-3" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{category.title}</h6>
                                        {category.options.map(option => {
                                            const count = getCount(option); const isActive = activeCheckboxes.includes(option);
                                            if (count === 0 && !isActive) return null; 
                                            return (
                                                <div className="form-check mb-2" key={option}><input className="form-check-input filter-checkbox" type="checkbox" onChange={() => handleToggleCheckbox(option)} checked={isActive} id={`filter-${option.replace(/[^a-zA-Z0-9]/g, '-')}`} style={{ cursor: 'pointer', accentColor: '#2A9D8F' }}/><label className="form-check-label w-100 d-flex justify-content-between align-items-center text-white" htmlFor={`filter-${option.replace(/[^a-zA-Z0-9]/g, '-')}`} style={{ cursor: 'pointer', fontSize: '0.85rem' }}><span className={isActive ? 'text-accent fw-bold' : ''}>{option}</span><span className="badge bg-secondary bg-opacity-25 rounded-pill text-white-50">{count}</span></label></div>
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
                                <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="text-white font-montserrat fw-bold mb-0">Explore Regions</h4><span className="text-white-50 small">6 Major Regions</span></div>
                                <div className="fanned-stack-container mt-4" style={{ height: '500px', position: 'relative' }}>
                                    <button className="stack-nav-btn prev-btn" onClick={() => rotateRegionStack('prev')}><i className="fa-solid fa-chevron-left"></i></button><button className="stack-nav-btn next-btn" onClick={() => rotateRegionStack('next')}><i className="fa-solid fa-chevron-right"></i></button>
                                    {regions.map((region, index) => (
                                        <div key={region.id} className={`fanned-card-wrapper ${regionPositions[index]}`} onClick={() => { if(regionPositions[index] === 'pos-center') { const valueMap = { 'Manila': 'Manila', 'Cebu': 'Cebu', 'Palawan': 'Palawan', 'Bohol': 'Bohol', 'Boracay': 'Boracay', 'Banaue': 'Ifugao' }; setSelectedRegion(valueMap[region.id] || region.id); window.scrollTo({ top: 400, behavior: 'smooth' }); } else if(regionPositions[index].includes('right')) { rotateRegionStack('next'); } else { rotateRegionStack('prev'); } }}>
                                            <div className="card h-100"><div className="card-img-wrapper"><span className="card-badge">{region.typeBadge}</span><img src={region.image} className="card-img-top" alt={region.name} /></div><div className="card-body"><div className="card-location"><i className="fa-solid fa-location-dot"></i> {region.locationLabel}</div><h5 className="card-title">{region.name}</h5><p className="card-text">{region.desc}</p><div className="mt-auto pt-3 border-top border-secondary border-opacity-25 text-center"><span className="btn-text-link m-0" style={{ fontSize: '0.8rem' }}>View Accommodations <i className="fa-solid fa-arrow-right"></i></span></div></div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="fade-in">
                                <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="text-white font-montserrat fw-bold mb-0">{selectedRegion === 'All' ? 'Search Results' : (selectedRegion === 'Boracay' ? 'Aklan (Boracay)' : (selectedRegion === 'Ifugao' ? 'Ifugao (Banaue)' : selectedRegion))}</h4><span className="text-white-50 small">{filteredPlaces.length} destination{filteredPlaces.length !== 1 ? 's' : ''} found</span></div>
                                <div className="row g-4">
                                    {filteredPlaces.length === 0 ? (
                                        <div className="col-12 text-center text-white-50 py-5 border border-secondary border-opacity-25 border-dashed rounded-4"><i className="fa-solid fa-filter-circle-xmark fs-1 mb-3 opacity-50"></i><h5>No matching accommodations</h5><p className="small mb-0">Try removing some of your active filters from the sidebar.</p></div>
                                    ) : (
                                        filteredPlaces.map((place) => (
                                            <div key={place.id} className="col-md-6 scroll-reveal visible">
                                                <div className="card h-100 teal-hover-box" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <div className="card-img-wrapper"><span className="card-badge">{place.type ? place.type.split('/')[0].trim() : 'Place'}</span><img src={place.img} className="card-img-top" alt={place.name} /></div>
                                                    <div className="card-body">
                                                        <div className="card-location"><i className="fa-solid fa-location-dot"></i> {place.region}</div><h5 className="card-title">{place.name}</h5><p className="card-text text-white-50 small mb-2">{place.type} • {place.distance || 'Various'}</p>
                                                        <div className="d-flex flex-wrap gap-2 mb-3">{(place.facilities || []).slice(0, 3).map(fac => (<span key={fac} className="badge bg-secondary bg-opacity-25 text-white fw-normal">{fac}</span>))}</div>
                                                        <button className="explore-link border-0 bg-transparent p-0 text-start" onClick={() => handleOpenDetail(place)}>{t('view_details', 'View Details')} &rarr;</button>
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
