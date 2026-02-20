import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { tourPackages, regions } from '../data/placesData';

const Tours = () => {
  const location = useLocation();

  // --- SEARCH FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [pax, setPax] = useState(1);

  // --- ITINERARY BUILDER STATE ---
  const [itinerary, setItinerary] = useState([]);
  const [selectedDest, setSelectedDest] = useState('');

  // --- CHECK URL FOR SEARCH TERMS ON LOAD ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    
    if (searchParam) {
      setSearchQuery(searchParam.toLowerCase());
    } else {
      setSearchQuery(''); // Reset if no param
    }
  }, [location.search]);

  // --- FILTER THE PACKAGES ---
  const filteredTours = tourPackages.filter(pkg => {
    if (!searchQuery) return true;
    return pkg.name.toLowerCase().includes(searchQuery) ||
           (pkg.type && pkg.type.toLowerCase().includes(searchQuery));
  });

  // --- MODAL FUNCTIONS ---
  const handleOpenModal = (tour) => {
    setSelectedTour(tour);
    setPax(1); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // --- ITINERARY FUNCTIONS ---
  const addToItinerary = () => {
    if (selectedDest && !itinerary.includes(selectedDest)) {
      setItinerary([...itinerary, selectedDest]);
      setSelectedDest(''); 
    }
  };

  const moveItem = (index, direction) => {
    const newItinerary = [...itinerary];
    const targetIndex = index + direction;
    const temp = newItinerary[targetIndex];
    newItinerary[targetIndex] = newItinerary[index];
    newItinerary[index] = temp;
    setItinerary(newItinerary);
  };

  const removeItem = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const handleSaveItinerary = () => {
    alert(`Your custom route has been saved!\n\nStops:\n${itinerary.map((item, i) => `${i + 1}. ${item}`).join('\n')}`);
  };

  return (
    <div className="fade-in" style={{ paddingTop: '76px' }}>
        
        {/* --- HERO SECTION --- */}
        <section className="tours-hero" style={{ 
            backgroundImage: "linear-gradient(to bottom, rgba(2, 26, 46, 0.6), #021A2E), url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2000&auto=format&fit=crop')" 
        }}>
            <div className="container text-center mb-4 scroll-reveal visible">
                <h1 className="hero-title" style={{ fontSize: '4rem' }}>TOUR PACKAGES</h1>
                <p className="section-desc mb-0">Curated experiences for your perfect vacation</p>
            </div>
        </section>

        {/* --- TOURS GRID --- */}
        <section id="tours" className="fade-in mb-5" style={{ marginTop: '40px' }}>
            <div className="container">
                
                {/* Search Active Notification */}
                {searchQuery && (
                    <div className="d-flex justify-content-between align-items-center mb-4 bg-card-dark p-3 rounded-3 border border-secondary border-opacity-25">
                        <h5 className="text-white font-montserrat fw-bold m-0">Showing results for: <span className="text-accent">"{searchQuery}"</span></h5>
                        <Link to="/tours" className="btn btn-outline-light btn-sm rounded-pill px-3">Clear Filter</Link>
                    </div>
                )}

                <div className="row g-4 mb-5">
                    {filteredTours.length === 0 ? (
                        <div className="col-12 text-center text-white-50 py-5">
                            No tour packages match your search. Try clearing the filter!
                        </div>
                    ) : (
                        filteredTours.map((pkg) => (
                            <div key={pkg.id} className="col-md-4 scroll-reveal visible">
                                <div className="card h-100">
                                    <div className="card-img-wrapper">
                                        <div className="card-badges-container">
                                            <span className="badge-item"><i className="fa-regular fa-clock"></i> {pkg.duration}</span>
                                            {/* Beautifully displaying the Type dynamically here! */}
                                            <span className="badge-item"><i className="fa-solid fa-tag"></i> {pkg.type || 'Guided'}</span>
                                        </div>
                                        <img src={pkg.img} className="card-img-top" alt={pkg.name} />
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{pkg.name}</h5>
                                        <p className="card-text mb-3">Explore the breathtaking sights, immersive culture, and hidden gems of this destination.</p>
                                        
                                        <div className="includes-label">INCLUDES:</div>
                                        <ul className="includes-list">
                                            <li><i className="fa-solid fa-check"></i> Hotel Accommodation</li>
                                            <li><i className="fa-solid fa-check"></i> Guided Tours</li>
                                            <li><i className="fa-solid fa-check"></i> Selected Meals</li>
                                        </ul>

                                        <div className="price-section">
                                            <div>
                                                <span className="price-large">₱{pkg.price.toLocaleString()}</span>
                                                <span className="price-per-person">per person</span>
                                            </div>
                                            <button className="btn btn-view-details" onClick={() => handleOpenModal(pkg)}>Select</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* --- BUILD YOUR ITINERARY BANNER --- */}
                <div className="bg-white p-5 rounded-4 border shadow-sm scroll-reveal visible">
                    <div className="row g-5">
                        
                        <div className="col-md-6">
                            <h3 className="fw-bold mb-3 text-dark font-montserrat">
                                <i className="fa-solid fa-map-location-dot text-accent me-2"></i> 
                                Build Your Own Itinerary
                            </h3>
                            <p className="text-muted small mb-4">Select destinations to create your perfect custom route across the Philippines.</p>
                            
                            <div className="d-flex gap-2 mb-4">
                                <select 
                                    className="form-select form-select-lg border-secondary border-opacity-25" 
                                    style={{ backgroundColor: '#f8f9fa', color: '#333' }}
                                    value={selectedDest} 
                                    onChange={(e) => setSelectedDest(e.target.value)}
                                >
                                    <option value="">-- Choose a destination --</option>
                                    {regions.map(r => (
                                        <option key={r.id} value={r.name} disabled={itinerary.includes(r.name)}>
                                            {r.name} {itinerary.includes(r.name) ? '(Added)' : ''}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    className="btn text-white fw-bold px-4" 
                                    style={{ backgroundColor: '#2A9D8F' }} 
                                    onClick={addToItinerary}
                                    disabled={!selectedDest}
                                >
                                    Add
                                </button>
                            </div>

                            <div className="itinerary-list mb-4">
                                {itinerary.length === 0 ? (
                                    <div className="text-center p-4 rounded-3 border border-2 border-secondary border-opacity-25 text-muted" style={{ borderStyle: 'dashed !important' }}>
                                        <i className="fa-solid fa-route fs-3 mb-2 opacity-50"></i>
                                        <p className="mb-0">Your itinerary is empty. Add your first stop above!</p>
                                    </div>
                                ) : (
                                    <ul className="list-group shadow-sm">
                                        {itinerary.map((item, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center p-3 border-secondary border-opacity-25">
                                                <div className="d-flex align-items-center gap-3">
                                                    <span className="badge rounded-pill text-white" style={{ backgroundColor: '#E76F51', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {index + 1}
                                                    </span>
                                                    <span className="fw-bold text-dark font-montserrat">{item}</span>
                                                </div>
                                                
                                                <div className="btn-group btn-group-sm">
                                                    <button className="btn btn-outline-secondary" onClick={() => moveItem(index, -1)} disabled={index === 0} title="Move Up"><i className="fa-solid fa-arrow-up"></i></button>
                                                    <button className="btn btn-outline-secondary" onClick={() => moveItem(index, 1)} disabled={index === itinerary.length - 1} title="Move Down"><i className="fa-solid fa-arrow-down"></i></button>
                                                    <button className="btn btn-outline-danger" onClick={() => removeItem(index)} title="Remove"><i className="fa-solid fa-trash"></i></button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button className="btn btn-outline-custom w-100" onClick={handleSaveItinerary} disabled={itinerary.length === 0}>
                                <i className="fa-solid fa-floppy-disk me-2"></i> Save Itinerary
                            </button>
                        </div>

                        <div className="col-md-6 d-none d-md-block">
                            <div className="position-relative h-100 min-vh-100 overflow-hidden shadow-sm" style={{ minHeight: '400px', backgroundColor: '#e9ecef', borderRadius: '16px', backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/8/87/Relief_Map_of_the_Philippines.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                <div className="position-absolute top-0 start-0 m-3 z-3">
                                    <span className="badge bg-dark px-3 py-2 opacity-75 shadow"><i className="fa-solid fa-map"></i> Live Preview</span>
                                </div>
                                <div className="position-absolute w-100 h-100 top-0 start-0 d-flex flex-column align-items-center justify-content-center gap-2 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)' }}>
                                    {itinerary.length === 0 ? (
                                        <span className="text-dark fw-bold bg-white px-4 py-2 rounded-pill shadow-sm opacity-75">Map is blank</span>
                                    ) : (
                                        itinerary.map((item, index) => (
                                            <div key={index} className="badge bg-white text-dark shadow px-3 py-2 border border-secondary border-opacity-25 d-flex align-items-center gap-2" style={{ animation: 'fadeIn 0.3s ease-in' }}>
                                                <span className="badge rounded-circle text-white" style={{ backgroundColor: '#E76F51' }}>{index + 1}</span> 
                                                <span className="fw-bold font-montserrat">{item}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        {/* --- CALCULATE PRICE MODAL --- */}
        {showModal && selectedTour && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(2, 22, 37, 0.85)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                <div className="modal-dialog modal-dialog-centered calculate-modal-dialog"> 
                    <div className="modal-content calculate-modal-content border-0 shadow-lg" style={{ backgroundColor: '#03233B' }}>
                        <div className="modal-header border-0 pb-1">
                            <h4 className="modal-title text-white fw-bold">CALCULATE TOTAL PRICE</h4>
                        </div>
                        <div className="modal-body pt-1">
                            <h5 id="modalPackageName" className="text-white fw-bold mb-1" style={{ color: '#2A9D8F' }}>{selectedTour.name}</h5>
                            <p id="modalDuration" className="text-white-50 small mb-4">{selectedTour.duration}</p>

                            <div className="mb-4">
                                <label className="text-white-50 small mb-2 d-block">Number of People</label>
                                <input type="number" className="form-control-dark w-100" value={pax} min="1" onChange={(e) => setPax(parseInt(e.target.value) || 1)} />
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="text-white-50 small">Price per person</div>
                                <div className="text-white fw-bold">₱{selectedTour.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-secondary">
                                <div className="text-white-50 small">Number of people</div>
                                <div className="text-white fw-bold">× {pax}</div>
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="text-white fw-bold fs-5">Total Price</div>
                                <div className="fw-bold fs-2" style={{ color: '#FF8C73' }}>
                                    ₱{(selectedTour.price * pax).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0 d-flex gap-3">
                            <button type="button" className="btn-cancel flex-grow-1" onClick={handleCloseModal}>Cancel</button>
                            <button type="button" className="btn-proceed flex-grow-1" onClick={() => window.location.href=`/booking?package=${encodeURIComponent(selectedTour.name)}&pax=${pax}`}>
                                Proceed to Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default Tours;