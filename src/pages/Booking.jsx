import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tourPackages, allPlaces } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const allBookableItems = [...tourPackages, ...allPlaces];
  
  const { formatPrice, t } = usePreferences();

  const [selectedPackage, setSelectedPackage] = useState('');
  const [date, setDate] = useState('');
  const [personalInfo, setPersonalInfo] = useState({ name: '', email: '', phone: '' });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [accClass, setAccClass] = useState('Standard'); 
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [addons, setAddons] = useState({ airportTransfer: false, insurance: false, romanticDinner: false, carbonOffset: false });
  
  // ⚡ NEW: Split Payment State ⚡
  const [splitBetween, setSplitBetween] = useState(1);
  const [payerEmails, setPayerEmails] = useState(['']); // 👈 NEW: Tracks all emails

  const accClassRates = { Standard: 0, Deluxe: 2500, Luxury: 5000 };
  const addonPrices = { airportTransfer: 1500, insurance: 950, romanticDinner: 2500, carbonOffset: 500 };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('package')) setSelectedPackage(params.get('package'));
    if (params.get('pax')) setGuests(prev => ({ ...prev, adults: parseInt(params.get('pax')) || 1 }));
  }, [location]);

  const handleGuestChange = (type, operation) => {
    setGuests(prev => {
      const current = prev[type];
      let next = operation === 'add' ? current + 1 : current - 1;
      if (type === 'adults' && next < 1) next = 1;
      if (type !== 'adults' && next < 0) next = 0;
      return { ...prev, [type]: next };
    });
  };

  const currentItem = allBookableItems.find(item => item.name === selectedPackage);
  const basePrice = currentItem?.price || 0; 
  
  const totalHeads = guests.adults + guests.children + guests.infants;
  const chargeablePax = guests.adults + guests.children; 
  
  const adultTotal = basePrice * guests.adults;
  const childTotal = (basePrice * 0.5) * guests.children; 
  const packageTotal = adultTotal + childTotal;
  
  const accClassTotal = accClassRates[accClass] * chargeablePax; 
  const transferTotal = addons.airportTransfer ? addonPrices.airportTransfer : 0;
  const insuranceTotal = addons.insurance ? (addonPrices.insurance * totalHeads) : 0; 
  const dinnerTotal = addons.romanticDinner ? addonPrices.romanticDinner : 0;
  const carbonTotal = addons.carbonOffset ? addonPrices.carbonOffset : 0;
  
  const grandTotal = packageTotal + accClassTotal + transferTotal + insuranceTotal + dinnerTotal + carbonTotal;

  const handleInfoChange = (e) => setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  const toggleAddon = (addonName) => setAddons({ ...addons, [addonName]: !addons[addonName] });

  // ⚡ UPDATED: Sending Split Data to the Backend ⚡
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !date) { alert("Please select a destination and a travel date."); return; }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
        alert("You must be logged in to book a trip!");
        navigate('/login');
        return;
    }
    const user = JSON.parse(userStr);

    const bookingData = {
        userId: user.id,
        packageName: selectedPackage,
        travelDate: date,
        guests: guests,
        totalPrice: grandTotal,
        paymentMethod: paymentMethod,
        splitBetween: parseInt(splitBetween), // Sending the number of splits to Stripe!
        friendEmails: payerEmails
    };

    try {
        await axios.post('https://philgood-travels.onrender.com/api/bookings/create', bookingData);
        alert(splitBetween > 1 
            ? `✅ Group Booking Created!\n\nYour split payment links have been generated and saved to your dashboard.` 
            : `✅ Payment processed securely via ${paymentMethod}!\n\nYour booking has been saved to your dashboard.`);
        navigate('/profile');
    } catch (err) {
        console.error(err);
        alert("❌ Failed to process booking.");
    }
  };

  return (
    <div className="fade-in" style={{ paddingTop: '76px' }}>
      
      <section className="booking-hero" style={{ 
          backgroundImage: "linear-gradient(to bottom, rgba(0, 119, 182, 0.4), var(--bg-dark)), url('https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=2000&auto=format&fit=crop')",
          padding: '130px 0 50px 0', backgroundSize: 'cover', backgroundPosition: 'center 30%'
      }}>
          <div className="container text-center mb-4 scroll-reveal visible">
              <h1 className="hero-title" style={{ fontSize: '4rem' }}>{t('booking_title', 'SECURE YOUR SPOT')}</h1>
              <p className="section-desc mb-0 text-white">{t('booking_desc', 'Complete your booking and pack your bags')}</p>
          </div>
      </section>

      <section className="py-5" style={{ minHeight: '500px', backgroundColor: 'var(--bg-dark)' }}>
        <div className="container">
          <form onSubmit={handleSubmit} className="row g-5">
            
            <div className="col-lg-8 scroll-reveal visible">
              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-suitcase-rolling text-accent me-2"></i> {t('trip_details', 'Trip Details')}</h4>
                <div className="row g-4">
                  <div className="col-md-12">
                    <label className="text-grey fw-bold small mb-2">Destination / Package</label>
                    <div className="input-with-icon position-relative">
                        <i className="fa-solid fa-map-location-dot position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', zIndex: 1 }}></i>
                        <select className="form-control-dark w-100" value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} style={{ paddingLeft: '45px' }} required>
                            <option value="">-- Select a Package --</option>
                            <optgroup label="Tour Packages">{tourPackages.map(pkg => <option key={pkg.id} value={pkg.name}>{pkg.name}</option>)}</optgroup>
                            <optgroup label="Accommodations">{allPlaces.map(place => <option key={place.id} value={place.name}>{place.name}</option>)}</optgroup>
                        </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="text-grey fw-bold small mb-2">Travel Date</label>
                    <div className="input-with-icon position-relative">
                        <i className="fa-solid fa-calendar-days position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', zIndex: 1 }}></i>
                        <input type="date" className="form-control-dark w-100" value={date} onChange={(e) => setDate(e.target.value)} style={{ paddingLeft: '45px' }} required />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="text-grey fw-bold small mb-2">Number of Guests</label>
                    <div className="d-flex flex-wrap gap-3">
                        <div className="d-flex align-items-center rounded-3 px-3 py-2 border border-primary border-opacity-25 flex-grow-1" style={{ backgroundColor: '#F4FAFC' }}>
                            <div className="me-auto"><span className="d-block text-navy fw-bold">Adults</span><small className="text-grey" style={{ fontSize: '0.75rem' }}>12+ years</small></div>
                            <div className="d-flex align-items-center gap-3"><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('adults', 'sub')}><i className="fa-solid fa-minus"></i></button><span className="text-navy fw-bold fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>{guests.adults}</span><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('adults', 'add')}><i className="fa-solid fa-plus"></i></button></div>
                        </div>
                        <div className="d-flex align-items-center rounded-3 px-3 py-2 border border-primary border-opacity-25 flex-grow-1" style={{ backgroundColor: '#F4FAFC' }}>
                            <div className="me-auto"><span className="d-block text-navy fw-bold">Children</span><small className="text-accent fw-bold" style={{ fontSize: '0.75rem' }}>50% Off (2-11 yrs)</small></div>
                            <div className="d-flex align-items-center gap-3"><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('children', 'sub')} disabled={guests.children === 0}><i className="fa-solid fa-minus"></i></button><span className="text-navy fw-bold fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>{guests.children}</span><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('children', 'add')}><i className="fa-solid fa-plus"></i></button></div>
                        </div>
                        <div className="d-flex align-items-center rounded-3 px-3 py-2 border border-primary border-opacity-25 flex-grow-1" style={{ backgroundColor: '#F4FAFC' }}>
                            <div className="me-auto"><span className="d-block text-navy fw-bold">Infants</span><small className="text-success fw-bold" style={{ fontSize: '0.75rem' }}>Free (Under 2)</small></div>
                            <div className="d-flex align-items-center gap-3"><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('infants', 'sub')} disabled={guests.infants === 0}><i className="fa-solid fa-minus"></i></button><span className="text-navy fw-bold fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>{guests.infants}</span><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('infants', 'add')}><i className="fa-solid fa-plus"></i></button></div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-bed text-accent me-2"></i> Accommodation Class</h4>
                <div className="row g-3">
                    <div className="col-md-4"><div className={`p-3 rounded-3 border text-center ${accClass === 'Standard' ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: accClass === 'Standard' ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAccClass('Standard')}><h6 className="text-navy fw-bold mb-1">Standard</h6><p className="text-grey small mb-0">Included</p></div></div>
                    <div className="col-md-4"><div className={`p-3 rounded-3 border text-center ${accClass === 'Deluxe' ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: accClass === 'Deluxe' ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAccClass('Deluxe')}><h6 className="text-navy fw-bold mb-1">Deluxe</h6><p className="text-accent fw-bold small mb-0">+{formatPrice(2500)} <span className="text-grey fw-normal">/pax</span></p></div></div>
                    <div className="col-md-4"><div className={`p-3 rounded-3 border text-center ${accClass === 'Luxury' ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: accClass === 'Luxury' ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAccClass('Luxury')}><h6 className="text-navy fw-bold mb-1">Luxury</h6><p className="text-accent fw-bold small mb-0">+{formatPrice(5000)} <span className="text-grey fw-normal">/pax</span></p></div></div>
                </div>
              </div>

              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-address-card text-accent me-2"></i> Lead Guest Details</h4>
                <div className="row g-3">
                  <div className="col-md-12"><label className="text-grey fw-bold small mb-2">Full Name</label><input type="text" name="name" className="form-control-dark w-100" placeholder="Juan Dela Cruz" value={personalInfo.name} onChange={handleInfoChange} style={{ paddingLeft: '20px' }} required /></div>
                  <div className="col-md-6"><label className="text-grey fw-bold small mb-2">Email Address</label><input type="email" name="email" className="form-control-dark w-100" placeholder="juan@example.com" value={personalInfo.email} onChange={handleInfoChange} style={{ paddingLeft: '20px' }} required /></div>
                  <div className="col-md-6"><label className="text-grey fw-bold small mb-2">Phone Number</label><input type="tel" name="phone" className="form-control-dark w-100" placeholder="+63 900 000 0000" value={personalInfo.phone} onChange={handleInfoChange} style={{ paddingLeft: '20px' }} required /></div>
                </div>
              </div>

              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box" style={{ borderLeft: '4px solid #4CAF50 !important' }}>
                <h4 className="fw-bold mb-2 font-montserrat text-navy"><i className="fa-solid fa-leaf text-success me-2"></i> Carbon Footprint</h4>
                <p className="text-grey small mb-3">Air travel and ground transport generate emissions. The estimated footprint for {totalHeads} traveler(s) is <strong className="text-navy">{totalHeads * 150}kg CO₂</strong>. Help us offset this by contributing to local Philippine reforestation projects.</p>
                <div className={`p-3 rounded-3 border ${addons.carbonOffset ? 'border-success' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.carbonOffset ? 'rgba(76, 175, 80, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('carbonOffset')}>
                    <div className="form-check d-flex justify-content-between align-items-center m-0 p-0"><div><input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.carbonOffset} readOnly style={{ cursor: 'pointer', accentColor: '#4CAF50' }} /><label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>Offset My Carbon Footprint</label></div><span className="text-success fw-bold">+{formatPrice(500)}</span></div>
                </div>
              </div>

              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-puzzle-piece text-accent me-2"></i> Optional Add-ons</h4>
                <div className={`p-3 rounded-3 mb-3 border ${addons.airportTransfer ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.airportTransfer ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('airportTransfer')}><div className="form-check d-flex justify-content-between align-items-center m-0 p-0"><div><input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.airportTransfer} readOnly style={{ cursor: 'pointer' }} /><label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>Roundtrip Airport Transfer</label><p className="text-grey small m-0 ms-4 ps-2">Hassle-free pick up and drop off.</p></div><span className="text-accent fw-bold">+{formatPrice(1500)}</span></div></div>
                <div className={`p-3 rounded-3 mb-3 border ${addons.insurance ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.insurance ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('insurance')}><div className="form-check d-flex justify-content-between align-items-center m-0 p-0"><div><input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.insurance} readOnly style={{ cursor: 'pointer' }} /><label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>Travel Insurance</label><p className="text-grey small m-0 ms-4 ps-2">Full coverage per guest.</p></div><span className="text-accent fw-bold">+{formatPrice(950)} <small className="text-grey fw-normal">/head</small></span></div></div>
                <div className={`p-3 rounded-3 border ${addons.romanticDinner ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.romanticDinner ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('romanticDinner')}><div className="form-check d-flex justify-content-between align-items-center m-0 p-0"><div><input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.romanticDinner} readOnly style={{ cursor: 'pointer' }} /><label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>Romantic Dinner Setup</label><p className="text-grey small m-0 ms-4 ps-2">Candlelit dinner by the beach.</p></div><span className="text-accent fw-bold">+{formatPrice(2500)}</span></div></div>
              </div>

              {/* ⚡ UPGRADED SPLIT PAYMENT COMPONENT ⚡ */}
              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-people-arrows text-accent me-2"></i> Payment Details</h4>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="text-grey fw-bold small mb-2">How are we paying?</label>
                    <div className="input-with-icon position-relative">
                        <i className="fa-solid fa-users position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', zIndex: 1 }}></i>
                        <select className="form-control-dark w-100" value={splitBetween} onChange={(e) => {
                            setSplitBetween(e.target.value);
                            // Adjust the array size based on how many people are paying
                            setPayerEmails(Array(parseInt(e.target.value)).fill(''));
                        }} style={{ paddingLeft: '45px' }}>
                            <option value="1">Just me (Pay in full)</option>
                            <option value="2">Split 2 ways</option>
                            <option value="3">Split 3 ways</option>
                            <option value="4">Split 4 ways</option>
                            <option value="5">Split 5 ways</option>
                        </select>
                    </div>
                  </div>

                  {/* ⚡ DYNAMIC EMAIL INPUTS ⚡ */}
                  <div className="col-md-12 mt-3">
                      <label className="text-grey fw-bold small mb-2">Email Addresses for Invoices:</label>
                      {Array.from({ length: splitBetween }).map((_, index) => (
                          <div key={index} className="mb-2 input-with-icon position-relative">
                              <i className="fa-regular fa-envelope position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', zIndex: 1 }}></i>
                              <input 
                                  type="email" 
                                  className="form-control-dark w-100" 
                                  style={{ paddingLeft: '45px' }}
                                  placeholder={index === 0 ? "Lead Booker's Email" : `Friend ${index}'s Email`}
                                  value={payerEmails[index] || ''}
                                  onChange={(e) => {
                                      const updatedEmails = [...payerEmails];
                                      updatedEmails[index] = e.target.value;
                                      setPayerEmails(updatedEmails);
                                  }}
                                  required
                              />
                          </div>
                      ))}
                  </div>

                  {splitBetween > 1 && (
                      <div className="col-md-12 mt-2">
                          <p className="text-accent small mb-0"><i className="fa-solid fa-circle-info me-1"></i> Each person will pay <strong className="text-navy">{formatPrice(grandTotal / splitBetween)}</strong>. Invoices will be tied to the emails above.</p>
                      </div>
                  )}
                </div>
              </div>

              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-wallet text-accent me-2"></i> Payment Method</h4>
                <div className="d-flex flex-wrap gap-3">
                  {['Card', 'Paypal', 'GCash', 'Maya', 'Stripe'].map((method) => (
                    <div key={method} onClick={() => setPaymentMethod(method)} className={`border rounded-pill px-4 py-2 ${paymentMethod === method ? 'border-primary text-white' : 'border-primary border-opacity-25 text-grey'}`} style={{ backgroundColor: paymentMethod === method ? 'var(--primary-color)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s', fontWeight: paymentMethod === method ? 'bold' : 'normal' }}>
                        {method === 'Card' && <i className="fa-regular fa-credit-card me-2"></i>}{method === 'Paypal' && <i className="fa-brands fa-paypal me-2"></i>}{method === 'Stripe' && <i className="fa-brands fa-stripe-s me-2"></i>}{(method === 'GCash' || method === 'Maya') && <i className="fa-solid fa-mobile-screen me-2"></i>}{method}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="col-lg-4 scroll-reveal visible">
              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 sticky-top teal-hover-box" style={{ top: '100px' }}>
                <h4 className="fw-bold mb-4 font-montserrat text-navy border-bottom border-primary border-opacity-10 pb-3">{t('price_summary', 'Price Summary')}</h4>
                
                {selectedPackage ? (
                    <>
                        <h6 className="text-primary-dark fw-bold mb-1">{selectedPackage}</h6>
                        <p className="text-grey small mb-4">{guests.adults} Adult{guests.adults > 1 ? 's' : ''}{guests.children > 0 && `, ${guests.children} Child${guests.children > 1 ? 'ren' : ''}`}{guests.infants > 0 && `, ${guests.infants} Infant${guests.infants > 1 ? 's' : ''}`}{date && ` • ${date}`}</p>
                        
                        <div className="d-flex justify-content-between mb-2"><span className="text-grey small">Base Price (x{guests.adults})</span><span className="text-navy fw-bold">{formatPrice(adultTotal)}</span></div>
                        {guests.children > 0 && (<div className="d-flex justify-content-between mb-2"><span className="text-accent small">Children (50% Off)</span><span className="text-navy fw-bold">{formatPrice(childTotal)}</span></div>)}
                        {guests.infants > 0 && (<div className="d-flex justify-content-between mb-2"><span className="text-success small">Infants (Free)</span><span className="text-navy fw-bold">{formatPrice(0)}</span></div>)}
                        {accClass !== 'Standard' && (<div className="d-flex justify-content-between mb-2"><span className="text-accent small">{accClass} Class (x{chargeablePax})</span><span className="text-navy fw-bold">{formatPrice(accClassTotal)}</span></div>)}
                        {addons.airportTransfer && (<div className="d-flex justify-content-between mb-2"><span className="text-grey small">Airport Transfer</span><span className="text-navy fw-bold">{formatPrice(transferTotal)}</span></div>)}
                        {addons.insurance && (<div className="d-flex justify-content-between mb-2"><span className="text-grey small">Insurance (x{totalHeads})</span><span className="text-navy fw-bold">{formatPrice(insuranceTotal)}</span></div>)}
                        {addons.romanticDinner && (<div className="d-flex justify-content-between mb-2"><span className="text-grey small">Romantic Dinner</span><span className="text-navy fw-bold">{formatPrice(dinnerTotal)}</span></div>)}
                        {addons.carbonOffset && (<div className="d-flex justify-content-between mb-2"><span className="text-success small">Carbon Offset</span><span className="text-navy fw-bold">{formatPrice(carbonTotal)}</span></div>)}
                    </>
                ) : (
                    <div className="text-center text-grey py-4 border border-primary border-opacity-25 border-dashed rounded-3 mb-4"><small>Select a package to see summary</small></div>
                )}

                <div className="border-top border-primary border-opacity-10 mt-4 pt-3 d-flex justify-content-between align-items-center mb-4"><span className="text-navy fw-bold fs-5">{t('total', 'Total')}</span><span className="fw-bold fs-3 text-accent">{formatPrice(grandTotal)}</span></div>
                
                {/* ⚡ NEW: Show the split amount in the summary ⚡ */}
                {splitBetween > 1 && (
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-primary border-opacity-10">
                        <span className="text-grey small">Split {splitBetween} ways</span>
                        <span className="text-accent fw-bold">{formatPrice(grandTotal / splitBetween)} <small className="text-grey fw-normal">/person</small></span>
                    </div>
                )}

                <div className="text-grey small mb-3 text-center">Payment Method: <strong className="text-navy">{paymentMethod}</strong></div>

                <button type="submit" className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold shadow">{t('confirm', 'Confirm Booking')} <i className="fa-solid fa-arrow-right ms-2"></i></button>
                <p className="text-center text-grey small mt-3 mb-0"><i className="fa-solid fa-lock text-primary-dark me-1"></i> Secure Encrypted Payment</p>
              </div>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
};

export default Booking;