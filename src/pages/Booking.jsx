import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tourPackages } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, formatPrice } = usePreferences();

  const [selectedPackage, setSelectedPackage] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [accClass, setAccClass] = useState('standard');
  const [addons, setAddons] = useState({ airportTransfer: false, insurance: false, romanticDinner: false, carbonOffset: false });
  const [splitPayment, setSplitPayment] = useState(1);
  const [emails, setEmails] = useState(['']);
  
  const [leadGuest, setLeadGuest] = useState({ name: '', email: '', phone: '', specialRequests: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pkgParam = params.get('package');
    const paxParam = params.get('pax');
    if (pkgParam) setSelectedPackage(pkgParam);
    if (paxParam) setGuests(prev => ({ ...prev, adults: parseInt(paxParam) || 1 }));
  }, [location.search]);

  useEffect(() => {
    setEmails(Array(splitPayment).fill(''));
  }, [splitPayment]);

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleGuestChange = (type, operation) => {
    setGuests(prev => {
      const current = prev[type];
      let newVal = operation === 'add' ? current + 1 : current - 1;
      if (newVal < 0) newVal = 0;
      if (type === 'adults' && newVal < 1) newVal = 1;
      return { ...prev, [type]: newVal };
    });
  };

  const toggleAddon = (addon) => { setAddons(prev => ({ ...prev, [addon]: !prev[addon] })); };

  // Price Calculations
  const pkgData = tourPackages.find(p => p.name === selectedPackage) || { price: 0 };
  const basePrice = pkgData.price;
  
  const totalHeads = guests.adults + guests.children + guests.infants;
  const chargeablePax = guests.adults + guests.children;
  
  const baseTotal = (guests.adults * basePrice) + (guests.children * (basePrice * 0.5));
  
  const accMultipliers = { standard: 0, deluxe: 0.3, luxury: 0.7 };
  const accTotal = baseTotal * accMultipliers[accClass];

  const addonPrices = { airportTransfer: 1500, insurance: 800, romanticDinner: 3500, carbonOffset: 500 };
  
  const transferTotal = addons.airportTransfer ? (addonPrices.airportTransfer * chargeablePax) : 0;
  const insuranceTotal = addons.insurance ? (addonPrices.insurance * totalHeads) : 0; 
  const dinnerTotal = addons.romanticDinner ? (addonPrices.romanticDinner * chargeablePax) : 0;
  const carbonTotal = addons.carbonOffset ? (addonPrices.carbonOffset * chargeablePax) : 0;

  const subtotal = baseTotal + accTotal + transferTotal + insuranceTotal + dinnerTotal + carbonTotal;
  const vatTotal = subtotal * 0.12;
  const grandTotal = subtotal + vatTotal;

  const handleConfirmBooking = () => {
    if (!selectedPackage || !travelDate || !leadGuest.name || !leadGuest.email) {
        alert("Please fill in all required fields (Package, Date, Name, Email).");
        return;
    }

    const payload = {
        bookingId: 'BK' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        packageName: selectedPackage,
        travelDate: travelDate,
        totalPrice: grandTotal,
        splitBetween: splitPayment,
        invoiceEmails: emails,
        contactInfo: leadGuest,
        guests: guests,
        amountDue: grandTotal / splitPayment,
        paymentIndex: 0,
        invoiceDetails: {
            basePriceTotal: baseTotal,
            accClassTotal: accTotal,
            accClassText: accClass.charAt(0).toUpperCase() + accClass.slice(1) + " Upgrade",
            transferTotal: transferTotal,
            insuranceTotal: insuranceTotal,
            dinnerTotal: dinnerTotal,
            carbonTotal: carbonTotal,
            vatTotal: vatTotal
        }
    };

    navigate('/checkout', { state: payload });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-dark)' }}>
        {/* ⚡ UPDATED: Removed inline backgroundImage so the CSS Unsplash image takes over */}
        <section className="booking-hero" style={{ marginTop: 0, backgroundSize: 'cover', backgroundPosition: 'center', height: '40vh', minHeight: '300px' }}>
            <div className="hero-overlay w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center p-4">
                <h1 className="hero-title mb-2 mt-5" style={{ fontSize: '3.5rem' }}>{t('booking_title', 'Secure Your Spot')}</h1>
                <p className="section-desc fw-bold text-white">{t('booking_desc', 'Complete your booking and pack your bags.')}</p>
            </div>
        </section>

        <div className="container py-5" style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>
            <div className="row g-5">
                
                <div className="col-lg-8">
                    
                    {/* 1. Trip Details */}
                    <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-sm mb-5 border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h4 className="text-navy font-montserrat fw-bold mb-4 border-bottom border-primary border-opacity-10 pb-3"><i className="fa-solid fa-map-location-dot text-accent me-2"></i> 1. {t('trip_details', 'Trip Details')}</h4>
                        
                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="text-grey fw-bold small mb-2">{t('dest_pkg', 'Destination / Package')} <span className="text-danger">*</span></label>
                                <select className="form-control-dark form-select w-100" value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)}>
                                    <option value="">{t('select_pkg', '-- Select a Package --')}</option>
                                    {tourPackages.map(pkg => (<option key={pkg.id} value={pkg.name}>{pkg.name}</option>))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="text-grey fw-bold small mb-2">{t('travel_date', 'Travel Date')} <span className="text-danger">*</span></label>
                                <input type="date" className="form-control-dark form-control w-100" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
                            </div>
                        </div>

                        <label className="text-grey fw-bold small mb-3">{t('num_guests', 'Number of Guests')}</label>
                        <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                            <div className="d-flex align-items-center rounded-3 px-3 py-2 border border-primary border-opacity-25 flex-grow-1" style={{ backgroundColor: '#F4FAFC' }}>
                                <div className="me-auto">
                                    <span className="d-block text-navy fw-bold">{t('adults', 'Adults')}</span>
                                    <small className="text-grey" style={{ fontSize: '0.75rem' }}>{t('adults_desc', '12+ years')}</small>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('adults', 'sub')} disabled={guests.adults <= 1}><i className="fa-solid fa-minus"></i></button>
                                    <span className="text-navy fw-bold fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>{guests.adults}</span>
                                    <button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('adults', 'add')}><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div className="d-flex align-items-center rounded-3 px-3 py-2 border border-primary border-opacity-25 flex-grow-1" style={{ backgroundColor: '#F4FAFC' }}>
                                <div className="me-auto">
                                    <span className="d-block text-navy fw-bold">{t('children', 'Children')}</span>
                                    <small className="text-accent fw-bold" style={{ fontSize: '0.75rem' }}>{t('children_desc', '50% Off (2-11 yrs)')}</small>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('children', 'sub')} disabled={guests.children === 0}><i className="fa-solid fa-minus"></i></button>
                                    <span className="text-navy fw-bold fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>{guests.children}</span>
                                    <button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('children', 'add')}><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div className="d-flex align-items-center rounded-3 px-3 py-2 border border-primary border-opacity-25 flex-grow-1" style={{ backgroundColor: '#F4FAFC' }}>
                                <div className="me-auto">
                                    <span className="d-block text-navy fw-bold">{t('infants', 'Infants')}</span>
                                    <small className="text-success fw-bold" style={{ fontSize: '0.75rem' }}>{t('infants_desc', 'Free (Under 2 years old)')}</small>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('infants', 'sub')} disabled={guests.infants === 0}><i className="fa-solid fa-minus"></i></button>
                                    <span className="text-navy fw-bold fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>{guests.infants}</span>
                                    <button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('infants', 'add')}><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        </div>

                        <label className="text-grey fw-bold small mb-3">{t('acc_class', 'Accommodation Class')}</label>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="hotel-card">
                                    <input type="radio" name="accClass" value="standard" checked={accClass === 'standard'} onChange={(e) => setAccClass(e.target.value)} />
                                    <div className="hotel-content">
                                        <i className="fa-solid fa-bed"></i>
                                        <h6>{t('std_class', 'Standard')}</h6>
                                        <small>{t('std_desc', 'Included')}</small>
                                    </div>
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="hotel-card">
                                    <input type="radio" name="accClass" value="deluxe" checked={accClass === 'deluxe'} onChange={(e) => setAccClass(e.target.value)} />
                                    <div className="hotel-content">
                                        <i className="fa-solid fa-hot-tub-person"></i>
                                        <h6>{t('deluxe_class', 'Deluxe')}</h6>
                                        <small className="text-accent fw-bold">+30% {t('pax', '/pax')}</small>
                                    </div>
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="hotel-card">
                                    <input type="radio" name="accClass" value="luxury" checked={accClass === 'luxury'} onChange={(e) => setAccClass(e.target.value)} />
                                    <div className="hotel-content">
                                        <i className="fa-solid fa-crown"></i>
                                        <h6>{t('lux_class', 'Luxury')}</h6>
                                        <small className="text-accent fw-bold">+70% {t('pax', '/pax')}</small>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 2. Lead Guest Details */}
                    <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-sm mb-5 border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h4 className="text-navy font-montserrat fw-bold mb-4 border-bottom border-primary border-opacity-10 pb-3"><i className="fa-solid fa-user-check text-accent me-2"></i> 2. {t('lead_guest', 'Lead Guest Details')}</h4>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="text-grey fw-bold small mb-2">{t('full_name', 'Full Name')} <span className="text-danger">*</span></label>
                                <input type="text" className="form-control-dark form-control w-100" placeholder="Juan Dela Cruz" value={leadGuest.name} onChange={(e) => setLeadGuest({...leadGuest, name: e.target.value})} required />
                            </div>
                            <div className="col-md-6">
                                <label className="text-grey fw-bold small mb-2">{t('email_addr', 'Email Address')} <span className="text-danger">*</span></label>
                                <input type="email" className="form-control-dark form-control w-100" placeholder="juan@example.com" value={leadGuest.email} onChange={(e) => setLeadGuest({...leadGuest, email: e.target.value})} required />
                            </div>
                            <div className="col-md-6">
                                <label className="text-grey fw-bold small mb-2">{t('phone', 'Phone Number')}</label>
                                <input type="tel" className="form-control-dark form-control w-100" placeholder="+63 912 345 6789" value={leadGuest.phone} onChange={(e) => setLeadGuest({...leadGuest, phone: e.target.value})} />
                            </div>
                            <div className="col-12">
                                <label className="text-grey fw-bold small mb-2">Special Requests</label>
                                <textarea className="form-control-dark form-control w-100" rows="3" placeholder="Allergies, late check-in, etc." value={leadGuest.specialRequests} onChange={(e) => setLeadGuest({...leadGuest, specialRequests: e.target.value})}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* 3. Add-ons & Extras */}
                    <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-sm mb-5 border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom border-primary border-opacity-10 pb-3 mb-4">
                            <h4 className="text-navy font-montserrat fw-bold m-0"><i className="fa-solid fa-layer-group text-accent me-2"></i> 3. {t('optional_addons', 'Optional Add-ons')}</h4>
                            <span className="badge bg-primary bg-opacity-10 text-primary-dark">Enhance your trip</span>
                        </div>
                        
                        <div className="d-flex flex-column gap-3 mb-4">
                            <div className={`p-3 rounded-3 border addon-item ${addons.airportTransfer ? 'border-primary shadow-sm' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.airportTransfer ? 'rgba(0, 180, 216, 0.05)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('airportTransfer')}>
                                <div className="form-check d-flex justify-content-between align-items-center m-0 p-0">
                                    <div>
                                        <input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.airportTransfer} readOnly style={{ cursor: 'pointer' }} />
                                        <label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>{t('transfer', 'Roundtrip Airport Transfer')}</label>
                                        <p className="text-grey small m-0 ms-4 ps-2">{t('transfer_desc', 'Hassle-free pick up and drop off.')}</p>
                                    </div>
                                    <span className="text-navy fw-bold">+{formatPrice(addonPrices.airportTransfer * chargeablePax)}</span>
                                </div>
                            </div>

                            <div className={`p-3 rounded-3 border addon-item ${addons.insurance ? 'border-primary shadow-sm' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.insurance ? 'rgba(0, 180, 216, 0.05)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('insurance')}>
                                <div className="form-check d-flex justify-content-between align-items-center m-0 p-0">
                                    <div>
                                        <input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.insurance} readOnly style={{ cursor: 'pointer' }} />
                                        <label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>{t('insurance', 'Travel Insurance')}</label>
                                        <p className="text-grey small m-0 ms-4 ps-2">{t('insurance_desc', 'Full coverage per guest.')}</p>
                                    </div>
                                    <span className="text-navy fw-bold">+{formatPrice(addonPrices.insurance * totalHeads)}</span>
                                </div>
                            </div>

                            <div className={`p-3 rounded-3 border addon-item ${addons.romanticDinner ? 'border-primary shadow-sm' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.romanticDinner ? 'rgba(0, 180, 216, 0.05)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('romanticDinner')}>
                                <div className="form-check d-flex justify-content-between align-items-center m-0 p-0">
                                    <div>
                                        <input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.romanticDinner} readOnly style={{ cursor: 'pointer' }} />
                                        <label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>{t('dinner', 'Romantic Dinner Setup')}</label>
                                        <p className="text-grey small m-0 ms-4 ps-2">{t('dinner_desc', 'Candlelit dinner by the beach.')}</p>
                                    </div>
                                    <span className="text-navy fw-bold">+{formatPrice(addonPrices.romanticDinner * chargeablePax)}</span>
                                </div>
                            </div>
                        </div>

                        {/* CARBON OFFSET SECTION */}
                        <div className="p-4 rounded-4" style={{ backgroundColor: 'rgba(76, 175, 80, 0.05)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                            <div className="d-flex align-items-center mb-2">
                                <i className="fa-solid fa-leaf text-success fs-4 me-2"></i>
                                <h6 className="text-navy font-montserrat fw-bold m-0">{t('carbon_footprint', 'Carbon Footprint - Forest Foundation Philippines')}</h6>
                            </div>
                            <p className="text-grey small mb-3">{t('carbon_desc', 'Air travel and ground transport generate emissions. The estimated footprint for')} {chargeablePax} {t('carbon_desc2', 'traveler(s) is')} <strong className="text-navy">{chargeablePax * 150}kg CO₂</strong>. {t('carbon_desc3', 'Help us offset this by contributing to local Philippine reforestation projects.')}</p>
                            
                            <div className={`p-3 rounded-3 border ${addons.carbonOffset ? 'border-success' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.carbonOffset ? 'rgba(76, 175, 80, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('carbonOffset')}>
                                <div className="form-check d-flex justify-content-between align-items-center m-0 p-0">
                                    <div>
                                        <input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.carbonOffset} readOnly style={{ cursor: 'pointer', accentColor: '#4CAF50' }} />
                                        <label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>{t('offset_carbon', 'Offset My Carbon Footprint')}</label>
                                        <p className="text-grey small m-0 ms-4 ps-2">{formatPrice(500)} {t('per_person', 'per person')}</p>
                                    </div>
                                    <span className="text-success fw-bold">+{formatPrice(addonPrices.carbonOffset * chargeablePax)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Payment Details */}
                    <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-sm mb-5 border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom border-primary border-opacity-10 pb-3 mb-4">
                            <h4 className="text-navy font-montserrat fw-bold m-0"><i className="fa-solid fa-credit-card text-accent me-2"></i> 4. {t('payment_details', 'Payment Details')}</h4>
                            <i className="fa-brands fa-cc-visa fs-3 text-muted"></i>
                        </div>
                        
                        <label className="text-grey fw-bold small mb-3">{t('how_paying', 'How are we paying?')}</label>
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            <button className={`btn ${splitPayment === 1 ? 'btn-proceed' : 'btn-outline-custom'}`} onClick={() => setSplitPayment(1)}>
                                {t('split_1', 'Just me (Pay in full)')}
                            </button>
                            {[2, 3, 4, 5].map(num => (
                                <button key={num} className={`btn ${splitPayment === num ? 'btn-proceed' : 'btn-outline-custom'}`} onClick={() => setSplitPayment(num)}>
                                    {t('split_ways', 'Split')} {num} {t('split_ways2', 'ways')}
                                </button>
                            ))}
                        </div>

                        {splitPayment > 1 && (
                            <div className="p-4 rounded-3 border border-primary border-opacity-25 fade-in" style={{ backgroundColor: '#F4FAFC' }}>
                                <h6 className="text-navy fw-bold mb-3"><i className="fa-solid fa-users text-accent me-2"></i> {t('invoice_emails', 'Email Addresses for Invoices:')}</h6>
                                <div className="row g-3">
                                    {emails.map((email, index) => (
                                        <div className="col-md-6" key={index}>
                                            <label className="text-grey small fw-bold mb-1">{index === 0 ? t('lead_email', "Lead Booker's Email") : `${t('friend_email', 'Friend')} ${index}'s ${t('friend_email2', 'Email')}`}</label>
                                            <input type="email" className="form-control-dark form-control w-100" value={email} onChange={(e) => handleEmailChange(index, e.target.value)} required />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(0, 119, 182, 0.1)' }}>
                                    <p className="text-navy fw-bold m-0">{t('each_pays', 'Each person will pay')} <span className="text-accent fs-5 mx-1">{formatPrice(grandTotal / splitPayment)}</span></p>
                                    <small className="text-grey">{t('invoices_tied', 'Invoices will be tied to the emails above.')}</small>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                <div className="col-lg-4">
                    <div className="bg-card-dark p-4 rounded-4 shadow-sm border border-primary border-opacity-10 sticky-top" style={{ backgroundColor: 'var(--card-bg)', top: '100px' }}>
                        <h4 className="text-navy font-montserrat fw-bold mb-4">{t('price_summary', 'Price Summary')}</h4>
                        
                        {!selectedPackage ? (
                            <div className="text-center py-4 opacity-50">
                                <i className="fa-solid fa-file-invoice-dollar fs-1 text-grey mb-3"></i>
                                <p className="text-grey fw-bold">{t('select_summary', 'Select a package to see summary')}</p>
                            </div>
                        ) : (
                            <div className="fade-in">
                                <h6 className="text-primary-dark fw-bold mb-1">{selectedPackage}</h6>
                                <p className="text-grey small mb-4"><i className="fa-regular fa-calendar text-accent me-2"></i> {travelDate || 'Date Not Selected'}</p>
                                
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-grey small">Base Price (x{totalHeads})</span>
                                    <span className="text-navy fw-bold">{formatPrice(baseTotal)}</span>
                                </div>
                                
                                {accTotal > 0 && (
                                    <div className="d-flex justify-content-between mb-2 fade-in">
                                        <span className="text-grey small">{accClass.charAt(0).toUpperCase() + accClass.slice(1)} Upgrade</span>
                                        <span className="text-navy fw-bold">{formatPrice(accTotal)}</span>
                                    </div>
                                )}
                                
                                {addons.airportTransfer && (
                                    <div className="d-flex justify-content-between mb-2 fade-in">
                                        <span className="text-grey small">Airport Transfer (x{chargeablePax})</span>
                                        <span className="text-navy fw-bold">{formatPrice(transferTotal)}</span>
                                    </div>
                                )}
                                {addons.insurance && (
                                    <div className="d-flex justify-content-between mb-2 fade-in">
                                        <span className="text-grey small">Travel Insurance (x{totalHeads})</span>
                                        <span className="text-navy fw-bold">{formatPrice(insuranceTotal)}</span>
                                    </div>
                                )}
                                {addons.romanticDinner && (
                                    <div className="d-flex justify-content-between mb-2 fade-in">
                                        <span className="text-grey small">Romantic Dinner (x{chargeablePax})</span>
                                        <span className="text-navy fw-bold">{formatPrice(dinnerTotal)}</span>
                                    </div>
                                )}
                                {addons.carbonOffset && (
                                    <div className="d-flex justify-content-between mb-2 fade-in">
                                        <span className="text-success small">Carbon Offset (x{chargeablePax})</span>
                                        <span className="text-success fw-bold">{formatPrice(carbonTotal)}</span>
                                    </div>
                                )}
                                
                                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom border-primary border-opacity-10">
                                    <span className="text-grey small">VAT (12%)</span>
                                    <span className="text-navy fw-bold">{formatPrice(vatTotal)}</span>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="text-navy fw-bold m-0">{t('total', 'Total')}</h5>
                                    <h4 className="text-accent fw-bold m-0">{formatPrice(grandTotal)}</h4>
                                </div>
                                
                                {splitPayment > 1 && (
                                    <div className="d-flex justify-content-between align-items-center mt-2 p-2 rounded bg-primary bg-opacity-10 fade-in">
                                        <span className="text-navy small fw-bold"><i className="fa-solid fa-users me-1 text-accent"></i> {t('split', 'Split')} {splitPayment} {t('ways', 'ways')}</span>
                                        <span className="text-navy fw-bold">{formatPrice(grandTotal / splitPayment)} <span className="small text-grey fw-normal">{t('per_person2', '/person')}</span></span>
                                    </div>
                                )}
                                
                                <button className="btn btn-proceed w-100 mt-4 py-3 text-uppercase font-montserrat fw-bold shadow" onClick={handleConfirmBooking} disabled={!selectedPackage || !travelDate}>
                                    <i className="fa-solid fa-lock me-2"></i> {t('confirm', 'Confirm Booking')}
                                </button>
                                
                                <div className="text-center mt-3">
                                    <small className="text-grey"><i className="fa-solid fa-shield-halved text-success me-1"></i> {t('secure_payment', 'Secure Encrypted Payment')}</small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default Booking;