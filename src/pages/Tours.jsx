import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { tourPackages, regions } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext';

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

  return (
    <div className="fade-in" style={{ paddingTop: '76px', backgroundColor: 'var(--bg-dark)' }}>
        <section className="tours-hero" style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 119, 182, 0.4), var(--bg-dark)), url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2000&auto=format&fit=crop')" }}>
            <div className="container text-center mb-4 scroll-reveal visible">
                <h1 className="hero-title" style={{ fontSize: '4rem' }}>{t('tours_title', 'TOUR PACKAGES')}</h1>
                <p className="section-desc mb-0 text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>Curated experiences for your perfect vacation</p>
            </div>
        </section>

        <section id="tours" className="fade-in pb-5" style={{ marginTop: '0' }}>
            <div className="container">
                {searchQuery && (
                    <div className="d-flex justify-content-between align-items-center mb-4 bg-card-dark p-3 rounded-3 border border-primary border-opacity-25" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h5 className="text-navy font-montserrat fw-bold m-0">Showing results for: <span className="text-accent">"{searchQuery}"</span></h5>
                        <Link to="/tours" className="btn btn-outline-custom btn-sm rounded-pill px-3">Clear Filter</Link>
                    </div>
                )}

                <div className="row g-4 mb-5">
                    {filteredTours.length === 0 ? (
                        <div className="col-12 text-center text-grey py-5 fw-bold">No tour packages match your search. Try clearing the filter!</div>
                    ) : (
                        filteredTours.map((pkg) => (
                            <div key={pkg.id} className="col-md-4 scroll-reveal visible">
                                <div className="card h-100 border border-primary border-opacity-10 shadow-sm teal-hover-box">
                                    <div className="card-img-wrapper"><div className="card-badges-container"><span className="badge-item"><i className="fa-regular fa-clock text-accent"></i> {pkg.duration}</span><span className="badge-item"><i className="fa-solid fa-tag text-accent"></i> {pkg.type || 'Guided'}</span></div><img src={pkg.img} className="card-img-top" alt={pkg.name} /></div>
                                    <div className="card-body">
                                        <h5 className="card-title text-navy">{pkg.name}</h5>
                                        <p className="card-text text-grey mb-3 small">Explore the breathtaking sights, immersive culture, and hidden gems of this destination.</p>
                                        <div className="includes-label">INCLUDES:</div>
                                        <ul className="includes-list"><li><i className="fa-solid fa-check text-accent"></i> Hotel Accommodation</li><li><i className="fa-solid fa-check text-accent"></i> Guided Tours</li><li><i className="fa-solid fa-check text-accent"></i> Selected Meals</li></ul>
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

                <div className="bg-card-dark p-5 rounded-4 border border-primary border-opacity-10 shadow-sm scroll-reveal visible" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="row g-5">
                        <div className="col-md-6">
                            <h3 className="fw-bold mb-3 text-navy font-montserrat"><i className="fa-solid fa-map-location-dot text-accent me-2"></i> Build Your Own Itinerary</h3>
                            <p className="text-grey small mb-4">Select destinations to create your perfect custom route across the Philippines.</p>
                            <div className="d-flex gap-2 mb-4"><select className="form-control-dark form-select form-select-lg w-100" value={selectedDest} onChange={(e) => setSelectedDest(e.target.value)}><option value="">-- Choose a destination --</option>{regions.map(r => (<option key={r.id} value={r.name} disabled={itinerary.includes(r.name)}>{r.name} {itinerary.includes(r.name) ? '(Added)' : ''}</option>))}</select><button className="btn btn-proceed px-4" onClick={addToItinerary} disabled={!selectedDest}>Add</button></div>
                            <div className="itinerary-list mb-4">
                                {itinerary.length === 0 ? (
                                    <div className="text-center p-4 rounded-3 border border-2 border-primary border-opacity-25 text-grey" style={{ borderStyle: 'dashed !important', backgroundColor: '#F4FAFC' }}><i className="fa-solid fa-route fs-3 mb-2 opacity-50 text-primary"></i><p className="mb-0 fw-bold">Your itinerary is empty. Add your first stop above!</p></div>
                                ) : (
                                    <ul className="list-group shadow-sm">
                                        {itinerary.map((item, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center p-3 border-primary border-opacity-25" style={{ backgroundColor: '#F4FAFC' }}><div className="d-flex align-items-center gap-3"><span className="badge rounded-pill text-navy fw-bold shadow-sm" style={{ backgroundColor: 'var(--primary-color)', color: 'white', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{index + 1}</span><span className="fw-bold text-navy font-montserrat">{item}</span></div><div className="btn-group btn-group-sm"><button className="btn btn-outline-primary" onClick={() => moveItem(index, -1)} disabled={index === 0} title="Move Up"><i className="fa-solid fa-arrow-up"></i></button><button className="btn btn-outline-primary" onClick={() => moveItem(index, 1)} disabled={index === itinerary.length - 1} title="Move Down"><i className="fa-solid fa-arrow-down"></i></button><button className="btn btn-outline-danger" onClick={() => removeItem(index)} title="Remove"><i className="fa-solid fa-trash"></i></button></div></li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button className="btn btn-outline-custom w-100" onClick={handleSaveItinerary} disabled={itinerary.length === 0}><i className="fa-solid fa-floppy-disk me-2"></i> Save Itinerary</button>
                        </div>
                        <div className="col-md-6 d-none d-md-block">
                            <div className="position-relative h-100 min-vh-100 overflow-hidden shadow-sm border border-primary border-opacity-10" style={{ minHeight: '400px', backgroundColor: '#F4FAFC', borderRadius: '16px', backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/8/87/Relief_Map_of_the_Philippines.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                <div className="position-absolute top-0 start-0 m-3 z-3"><span className="badge bg-primary text-white px-3 py-2 shadow"><i className="fa-solid fa-map me-1"></i> Live Preview</span></div>
                                <div className="position-absolute w-100 h-100 top-0 start-0 d-flex flex-column align-items-center justify-content-center gap-2 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(3px)' }}>
                                    {itinerary.length === 0 ? (
                                        <span className="text-navy fw-bold bg-white px-4 py-2 rounded-pill shadow-sm border border-primary border-opacity-10">Map is blank</span>
                                    ) : (
                                        itinerary.map((item, index) => (
                                            <div key={index} className="badge bg-white text-navy shadow px-3 py-2 border border-primary border-opacity-25 d-flex align-items-center gap-2" style={{ animation: 'fadeIn 0.3s ease-in' }}><span className="badge rounded-circle text-white shadow-sm" style={{ backgroundColor: 'var(--primary-color)' }}>{index + 1}</span> <span className="fw-bold font-montserrat text-navy">{item}</span></div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {showModal && selectedTour && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'var(--dark-navy)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                <div className="modal-dialog modal-dialog-centered calculate-modal-dialog"> 
                    <div className="modal-content calculate-modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <div className="modal-header border-0 pb-1"><h4 className="modal-title text-navy fw-bold" id="calculateModalLabel">{t('calc_price', 'CALCULATE TOTAL PRICE')}</h4></div>
                        <div className="modal-body pt-1">
                            <h5 id="modalPackageName" className="text-primary-dark fw-bold mb-1 font-montserrat text-uppercase">{selectedTour.name}</h5>
                            <p id="modalDuration" className="text-grey fw-bold small mb-4">{selectedTour.duration}</p>
                            <div className="mb-4"><label className="text-navy fw-bold small mb-2 d-block">Number of People</label><input type="number" className="form-control-dark w-100 border-primary border-opacity-25" value={pax} min="1" onChange={(e) => setPax(parseInt(e.target.value) || 1)} /></div>
                            <div className="d-flex justify-content-between align-items-center mb-2"><div className="text-grey fw-bold small">Price per person</div><div className="text-navy fw-bold">{formatPrice(selectedTour.price)}</div></div>
                            <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-primary border-opacity-10"><div className="text-grey fw-bold small">Number of people</div><div className="text-navy fw-bold">× {pax}</div></div>
                            <div className="d-flex justify-content-between align-items-center mb-4"><div className="text-navy fw-bold fs-5">{t('total', 'Total Price')}</div><div className="fw-bold fs-2 text-accent" id="modalTotalPrice">{formatPrice(selectedTour.price * pax)}</div></div>
                        </div>
                        <div className="modal-footer border-0 pt-0 d-flex gap-3">
                            <button type="button" className="btn-cancel flex-grow-1" onClick={handleCloseModal}>Cancel</button>
                            <button type="button" className="btn-proceed flex-grow-1" onClick={() => window.location.href=`/booking?package=${encodeURIComponent(selectedTour.name)}&pax=${pax}`}>Proceed to Booking</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Tours;