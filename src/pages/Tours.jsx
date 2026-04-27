import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { tourPackages, regions } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext';
import heroImg from '../assets/img/Tours__Packages.png';

// ⚡ BACK TO LEAFLET: 100% Free, no watermarks! ⚡
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ⚡ GPS Coordinates for every region and tour package
const regionCoords = {
  // --- MAIN REGIONS ---
  'Manila': [14.5995, 120.9842],
  'Metro Manila': [14.5995, 120.9842],
  'Palawan': [9.8349, 118.7384],
  'Bohol': [9.8500, 124.1435],
  'Boracay': [11.9674, 121.9248],
  'Boracay (Aklan)': [11.9674, 121.9248],
  'Aklan': [11.9674, 121.9248],
  'Aklan (Boracay)': [11.9674, 121.9248],
  'Cebu': [10.3157, 123.8854],
  'Ifugao': [16.9140, 121.0564],
  'Banaue': [16.9140, 121.0564],
  'Ifugao (Banaue)': [16.9140, 121.0564],

  // --- SPECIFIC SPOTS ---
  'El Nido': [11.1795, 119.3941],
  'Coron': [11.9997, 120.2030],
  'Puerto Princesa': [9.7392, 118.7353],
  'Chocolate Hills': [9.8296, 124.1654],
  'Panglao Island': [9.5855, 123.7744],
  'Loboc River': [9.6384, 124.0202],
  'White Beach': [11.9546, 121.9240],
  'Puka Shell Beach': [11.9754, 121.9168],
  'Diniwid': [11.9701, 121.9137],
  'Moalboal': [9.9324, 123.4005],
  'Oslob': [9.5204, 123.3768],
  'Bantayan Island': [11.2144, 123.7380],
  'Intramuros': [14.5896, 120.9747],
  'Rizal Park': [14.5826, 120.9787],
  'BGC': [14.5492, 121.0476],
  'Batad Terraces': [16.9333, 121.1340],
  'Banaue Viewpoint': [16.9248, 121.0567],
  'Tappiya Falls': [16.9287, 121.1354],

  // --- TOUR PACKAGES ---
  'Bohol Adventure Package': [9.8296, 124.1654], // Drops on Chocolate Hills
  'El Nido Island Paradise': [11.1795, 119.3941], // Drops on El Nido
  'Boracay Beach Escape': [11.9546, 121.9240], // Drops on White Beach
  'Manila City Escape': [14.5896, 120.9747], // Drops on Intramuros
  'Cebu Canyoneering': [9.8130, 123.3756], // Drops near Badian/South Cebu
  'Banaue Heritage Tour': [16.9333, 121.1340] // Drops on Batad
};
// ⚡ Custom map marker function to generate blue numbered circles
const createCustomIcon = (number) => {
  return L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: var(--primary-color, #00B4D8); color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-family: Montserrat, sans-serif;">${number}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
  });
};

const Tours = () => {
  const location = useLocation();
  const { t, formatPrice } = usePreferences();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [pax, setPax] = useState(1);
  const [itinerary, setItinerary] = useState([]);
  const [selectedDest, setSelectedDest] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) { setSearchQuery(searchParam.toLowerCase()); } else { setSearchQuery(''); }
  }, [location.search]);

  const filteredTours = tourPackages.filter(pkg => {
    if (!searchQuery) return true;
    return pkg.name.toLowerCase().includes(searchQuery) || (pkg.type && pkg.type.toLowerCase().includes(searchQuery));
  });

  const handleOpenModal = (tour) => { setSelectedTour(tour); setPax(1); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); };

  const addToItinerary = () => { if (selectedDest && !itinerary.includes(selectedDest)) { setItinerary([...itinerary, selectedDest]); setSelectedDest(''); } };
  const moveItem = (index, direction) => { const newItinerary = [...itinerary]; const targetIndex = index + direction; const temp = newItinerary[targetIndex]; newItinerary[targetIndex] = newItinerary[index]; newItinerary[index] = temp; setItinerary(newItinerary); };
  const removeItem = (index) => { setItinerary(itinerary.filter((_, i) => i !== index)); };
  const handleSaveItinerary = () => { alert(`Your custom route has been saved!\n\nStops:\n${itinerary.map((item, i) => `${i + 1}. ${item}`).join('\n')}`); };

  // Flatten regions and tour packages so users can add EVERYTHING to their map
  const itineraryOptions = Array.from(new Set([
      ...regions.map(r => r.name),
      ...tourPackages.map(t => t.name),
      // Adding all the specific tourist spots we mapped out:
      'El Nido', 'Coron', 'Puerto Princesa',
      'Chocolate Hills', 'Panglao Island', 'Loboc River',
      'White Beach', 'Puka Shell Beach', 'Diniwid',
      'Moalboal', 'Oslob', 'Bantayan Island',
      'Intramuros', 'Rizal Park', 'BGC',
      'Batad Terraces', 'Banaue Viewpoint', 'Tappiya Falls'
  ])).sort();

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-dark)' }}>
       <section className="tours-hero" style={{ marginTop: 0, backgroundImage: `url("${heroImg}")` }}>
            <div className="container text-center mb-4 scroll-reveal visible">
                <h1 className="hero-title transparent-text" style={{ fontSize: '4rem' }}>{t('tours_title', 'Tour Packages')}</h1>
            </div>
        </section>

        <section id="tours" className="fade-in pb-5" style={{ marginTop: '0' }}>
            <div className="container">
                {searchQuery && (
                    <div className="d-flex justify-content-between align-items-center mb-4 bg-card-dark p-3 rounded-3 border border-primary border-opacity-25" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h5 className="text-navy font-montserrat fw-bold m-0">{t('showing_results', 'Showing results for:')} <span className="text-accent">"{searchQuery}"</span></h5>
                        <Link to="/tours" className="btn btn-outline-custom btn-sm rounded-pill px-3">{t('clear_filter', 'Clear Filter')}</Link>
                    </div>
                )}

                <div className="row g-4 mb-5">
                    {filteredTours.length === 0 ? (
                        <div className="col-12 text-center text-grey py-5 fw-bold">{t('no_tours', 'No tour packages match your search. Try clearing the filter!')}</div>
                    ) : (
                        filteredTours.map((pkg) => (
                            <div key={pkg.id} className="col-md-6 col-lg-4 scroll-reveal visible">
                                <div className="card h-100 border border-primary border-opacity-10 shadow-sm teal-hover-box">
                                    <div className="card-img-wrapper">
                                        <div className="card-badges-container">
                                            <span className="badge-item"><i className="fa-regular fa-clock text-accent"></i> {pkg.duration}</span>
                                            <span className="badge-item"><i className="fa-solid fa-tag text-accent"></i> {pkg.type || 'Guided'}</span>
                                        </div>
                                        <img src={pkg.img} className="card-img-top" alt={pkg.name} />
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title text-navy">{pkg.name}</h5>
                                        <p className="card-text text-grey mb-3 small">{t('explore_sights', 'Explore the breathtaking sights, immersive culture, and hidden gems of this destination.')}</p>
                                        <div className="includes-label">{t('includes', 'INCLUDES:')}</div>
                                        <ul className="includes-list">
                                            <li><i className="fa-solid fa-check text-accent"></i> {t('hotel_acc', 'Hotel Accommodation')}</li>
                                            <li><i className="fa-solid fa-check text-accent"></i> {t('guided_tours', 'Guided Tours')}</li>
                                            <li><i className="fa-solid fa-check text-accent"></i> {t('selected_meals', 'Selected Meals')}</li>
                                        </ul>
                                        <div className="price-section border-top border-primary border-opacity-10 pt-3">
                                            <div>
                                                <span className="price-large text-accent">{formatPrice(pkg.price)}</span>
                                                <span className="price-per-person text-grey">{t('per_person', 'per person')}</span>
                                            </div>
                                            <button className="btn btn-view-details" onClick={() => handleOpenModal(pkg)}>{t('select', 'Select')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* --- BUILD YOUR OWN ITINERARY SECTION --- */}
                <div className="bg-card-dark p-5 rounded-4 border border-primary border-opacity-10 shadow-sm scroll-reveal visible" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="row g-5">
                        
                        {/* LEFT COLUMN: The List Builder */}
                        <div className="col-md-6">
                            <h3 className="fw-bold mb-3 text-navy font-montserrat"><i className="fa-solid fa-map-location-dot text-accent me-2"></i> {t('build_itinerary', 'Build Your Own Itinerary')}</h3>
                            <p className="text-grey small mb-4">{t('build_desc', 'Select destinations to create your perfect custom route across the Philippines.')}</p>
                            
                            <div className="d-flex gap-2 mb-4">
                                <select className="form-control-dark form-select form-select-lg w-100" value={selectedDest} onChange={(e) => setSelectedDest(e.target.value)}>
                                    <option value="">{t('choose_dest', '-- Choose a destination --')}</option>
                                    {itineraryOptions.map(optionName => (
                                        <option key={optionName} value={optionName} disabled={itinerary.includes(optionName)}>
                                            {optionName} {itinerary.includes(optionName) ? t('added', '(Added)') : ''}
                                        </option>
                                    ))}
                                </select>
                                <button className="btn btn-proceed px-4" onClick={addToItinerary} disabled={!selectedDest}>{t('add_btn', 'Add')}</button>
                            </div>
                            
                            <div className="itinerary-list mb-4">
                                {itinerary.length === 0 ? (
                                    <div className="text-center p-4 rounded-3 border border-2 border-primary border-opacity-25 text-grey" style={{ borderStyle: 'dashed !important', backgroundColor: '#F4FAFC' }}>
                                        <i className="fa-solid fa-route fs-3 mb-2 opacity-50 text-primary"></i>
                                        <p className="mb-0 fw-bold">{t('itinerary_empty', 'Your itinerary is empty. Add your first stop above!')}</p>
                                    </div>
                                ) : (
                                    <ul className="list-group shadow-sm">
                                        {itinerary.map((item, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center p-3 border-primary border-opacity-25" style={{ backgroundColor: '#F4FAFC' }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <span className="badge rounded-pill text-navy fw-bold shadow-sm" style={{ backgroundColor: 'var(--primary-color)', color: 'white', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {index + 1}
                                                    </span>
                                                    <span className="fw-bold text-navy font-montserrat">{item}</span>
                                                </div>
                                                <div className="btn-group btn-group-sm">
                                                    <button className="btn btn-outline-primary" onClick={() => moveItem(index, -1)} disabled={index === 0} title={t('move_up', 'Move Up')}><i className="fa-solid fa-arrow-up"></i></button>
                                                    <button className="btn btn-outline-primary" onClick={() => moveItem(index, 1)} disabled={index === itinerary.length - 1} title={t('move_down', 'Move Down')}><i className="fa-solid fa-arrow-down"></i></button>
                                                    <button className="btn btn-outline-danger" onClick={() => removeItem(index)} title={t('remove', 'Remove')}><i className="fa-solid fa-trash"></i></button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button className="btn btn-outline-custom w-100" onClick={handleSaveItinerary} disabled={itinerary.length === 0}>
                                <i className="fa-solid fa-floppy-disk me-2"></i> {t('save_itinerary', 'Save Itinerary')}
                            </button>
                        </div>
                        
                        {/* RIGHT COLUMN: Interactive Leaflet Map */}
                        <div className="col-md-6 d-none d-md-block">
                            <div className="position-relative h-100 overflow-hidden shadow-sm border border-primary border-opacity-10" style={{ minHeight: '500px', backgroundColor: '#F4FAFC', borderRadius: '16px' }}>
                                <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 1000 }}>
                                    <span className="badge bg-primary text-white px-3 py-2 shadow">
                                        <i className="fa-solid fa-map me-1"></i> {t('live_preview', 'Live Preview')}
                                    </span>
                                </div>
                                
                                <MapContainer 
                                    center={[12.8797, 121.7740]} 
                                    zoom={5} 
                                    minZoom={5} 
                                    maxBounds={[
                                        [4.0, 116.0], // South-West boundary limit
                                        [22.0, 127.0] // North-East boundary limit
                                    ]} 
                                    maxBoundsViscosity={1.0} // Creates a solid "bounce back" wall
                                    scrollWheelZoom={true} 
                                    style={{ height: '100%', width: '100%', minHeight: '500px', zIndex: 1 }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    
                                    {itinerary.map((item, index) => {
                                        const coords = regionCoords[item] || [12.8797, 121.7740]; 
                                        return (
                                            <Marker key={index} position={coords} icon={createCustomIcon(index + 1)}>
                                                <Popup>
                                                    <strong>Stop {index + 1}:</strong> {item}
                                                </Popup>
                                            </Marker>
                                        );
                                    })}
                                </MapContainer>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        {/* MODAL FOR PRICE CALCULATION */}
        {showModal && selectedTour && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'transparent', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                <div className="modal-dialog modal-dialog-centered calculate-modal-dialog"> 
                    <div className="modal-content calculate-modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <div className="modal-header border-0 pb-1">
                            <h4 className="modal-title text-navy fw-bold" id="calculateModalLabel">{t('calc_price', 'CALCULATE TOTAL PRICE')}</h4>
                        </div>
                        <div className="modal-body pt-1">
                            <h5 id="modalPackageName" className="text-primary-dark fw-bold mb-1 font-montserrat text-uppercase">{selectedTour.name}</h5>
                            <p id="modalDuration" className="text-grey fw-bold small mb-4">{selectedTour.duration}</p>
                            {selectedTour.itinerary && (
        <div className="mb-4 p-3 rounded-3 border border-primary border-opacity-25" style={{ backgroundColor: 'rgba(0, 180, 216, 0.05)' }}>
            <h6 className="fw-bold text-navy mb-2" style={{ fontSize: '0.85rem' }}><i className="fa-solid fa-utensils text-accent me-2"></i>Meals Included:</h6>
            <p className="small text-grey mb-3">{selectedTour.foodDetails}</p>

            <h6 className="fw-bold text-navy mb-2" style={{ fontSize: '0.85rem' }}><i className="fa-solid fa-map-location-dot text-accent me-2"></i>Itinerary Overview:</h6>
            <ul className="list-unstyled small text-grey mb-0" style={{ fontSize: '0.8rem' }}>
                {selectedTour.itinerary.map((item, i) => (
                    <li key={i} className="mb-1"><strong>{item.day}:</strong> {item.desc}</li>
                ))}
            </ul>
        </div>
    )}
                            
                            <div className="mb-4">
                                <label className="text-navy fw-bold small mb-2 d-block">{t('num_people', 'Number of People')}</label>
                                <input type="number" className="form-control-dark w-100 border-primary border-opacity-25" value={pax} min="1" onChange={(e) => setPax(parseInt(e.target.value) || 1)} />
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="text-grey fw-bold small">{t('price_per_person', 'Price per person')}</div>
                                <div className="text-navy fw-bold">{formatPrice(selectedTour.price)}</div>
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-primary border-opacity-10">
                                <div className="text-grey fw-bold small">{t('num_people', 'Number of People')}</div>
                                <div className="text-navy fw-bold">× {pax}</div>
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="text-navy fw-bold fs-5">{t('total_price', 'Total Price')}</div>
                                <div className="fw-bold fs-2 text-accent" id="modalTotalPrice">{formatPrice(selectedTour.price * pax)}</div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0 d-flex gap-3">
                            <button type="button" className="btn-cancel flex-grow-1" onClick={handleCloseModal}>{t('cancel', 'Cancel')}</button>
                            <button type="button" className="btn-proceed flex-grow-1" onClick={() => window.location.href=`/booking?package=${encodeURIComponent(selectedTour.name)}&pax=${pax}`}>{t('proceed_booking', 'Proceed to Booking')}</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Tours;