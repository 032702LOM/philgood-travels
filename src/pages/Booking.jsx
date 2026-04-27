import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tourPackages, allPlaces } from '../data/placesData';
import { usePreferences } from '../context/PreferencesContext';
import toast from 'react-hot-toast';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const allBookableItems = [...tourPackages, ...allPlaces];
  
  const { formatPrice, t } = usePreferences();

  const [selectedPackage, setSelectedPackage] = useState('');
  const [date, setDate] = useState('');
const [personalInfo, setPersonalInfo] = useState({ 
      name: '', 
      email: '', 
      phone: '', 
      countryCode: '+63', // Default to PH
      specialRequests: '' // New state for instructions
  });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [accClass, setAccClass] = useState('Standard'); 
  const [addons, setAddons] = useState({ airportTransfer: false, insurance: false, romanticDinner: false, carbonOffset: false });
  
  const [splitBetween, setSplitBetween] = useState(1);
  const [payerEmails, setPayerEmails] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  
  // 50% Child Discount for Accommodation Class
  const adultAccTotal = accClassRates[accClass] * guests.adults;
  const childAccTotal = (accClassRates[accClass] * 0.5) * guests.children;
  const accClassTotal = adultAccTotal + childAccTotal;
  
  const transferTotal = addons.airportTransfer ? addonPrices.airportTransfer : 0;
  const insuranceTotal = addons.insurance ? (addonPrices.insurance * totalHeads) : 0; 
  const dinnerTotal = addons.romanticDinner ? addonPrices.romanticDinner : 0;
  const carbonTotal = addons.carbonOffset ? (addonPrices.carbonOffset * totalHeads) : 0;
  
  const subTotal = packageTotal + accClassTotal + transferTotal + insuranceTotal + dinnerTotal + carbonTotal;
  const vatTotal = subTotal * 0.12;
  const grandTotal = subTotal + vatTotal;

  const handleInfoChange = (e) => setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  const toggleAddon = (addonName) => setAddons({ ...addons, [addonName]: !addons[addonName] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !date) { toast("Please select a destination and a travel date."); return; }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
        toast.error("You must be logged in to book a trip!");
        navigate('/login');
        return;
    }
    
    setIsSubmitting(true);
    const user = JSON.parse(userStr);

    const invoiceDetails = {
        basePriceTotal: adultTotal + childTotal,
        accClassText: `${accClass} Class`,
        accClassTotal: accClassTotal,
        transferTotal: transferTotal,
        insuranceTotal: insuranceTotal,
        dinnerTotal: dinnerTotal,
        carbonTotal: carbonTotal,
        vatTotal: vatTotal
    };

    const bookingData = {
    userId: user.id,
    packageId: currentItem.id, // ⚡ Use the ID so the backend can look up the real price
    travelDate: date,
    guests: guests,           // Includes adults, children, infants
    accClass: accClass,       // 'Standard', 'Deluxe', or 'Luxury'
    addons: addons,           // The object containing your booleans (insurance, etc.)
    paymentMethod: 'Pending Checkout', 
    splitBetween: parseInt(splitBetween), 
    friendEmails: payerEmails,
    contactInfo: {
        name: personalInfo.name,
        email: personalInfo.email,
        phone: `${personalInfo.countryCode} ${personalInfo.phone}`
    },
    specialRequests: personalInfo.specialRequests
    // 🛡️ NOTICE: We removed totalPrice! The backend will calculate this itself.
};

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/create/`, bookingData);
        
        if (splitBetween > 1) {
            toast("Trip added successfully!\n\nYour split payment links have been generated. Please proceed to your dashboard to pay your share.");
        } else {
            toast("Trip added successfully!\n\nPlease proceed to your dashboard to complete the payment.");
        }
        
        navigate('/profile');
        
    } catch (err) {
        console.error(err);
        toast.error("❌ Failed to process booking.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
  <div className="fade-in">
      <section className="py-5" style={{ minHeight: '500px', backgroundColor: 'var(--bg-dark)', paddingTop: '100px' }}>
        <div className="container">
          
          <div className="text-center mb-5 mt-4 scroll-reveal visible">
              <h1 className="section-title wave-text" style={{ fontSize: '3.5rem' }}>{t('booking_title', 'Secure Your Spot')}</h1>
              <p className="section-desc fw-bold">{t('booking_desc', 'Complete your booking and pack your bags')}</p>
          </div>

          <form onSubmit={handleSubmit} className="row g-5">
            
            <div className="col-lg-8 scroll-reveal visible">
              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-suitcase-rolling text-accent me-2"></i> {t('trip_details', 'Trip Details')}</h4>
                <div className="row g-4">
                  <div className="col-md-12">
                    <label className="text-grey fw-bold small mb-2">{t('dest_pkg', 'Destination / Package')}</label>
                    <div className="input-with-icon position-relative">
                        <i className="fa-solid fa-map-location-dot position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', zIndex: 1 }}></i>
                        <select className="form-control-dark w-100" value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} style={{ paddingLeft: '45px' }} required>
                            <option value="">{t('select_pkg', '-- Select a Package --')}</option>
                            <optgroup label="Tour Packages">{tourPackages.map(pkg => <option key={pkg.id} value={pkg.name}>{pkg.name}</option>)}</optgroup>
                            <optgroup label="Accommodations">{allPlaces.map(place => <option key={place.id} value={place.name}>{place.name}</option>)}</optgroup>
                        </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="text-grey fw-bold small mb-2">{t('travel_date', 'Travel Date')}</label>
                    <div className="input-with-icon position-relative">
                        <i className="fa-solid fa-calendar-days position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', zIndex: 1 }}></i>
                        <input type="date" className="form-control-dark w-100" value={date} onChange={(e) => setDate(e.target.value)} style={{ paddingLeft: '45px' }} required />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="text-grey fw-bold small mb-2">{t('num_guests', 'Number of Guests')}</label>
                    <div className="d-flex flex-wrap gap-3">
                        <div className="d-flex align-items-center rounded-3 px-3 py-2 border border-primary border-opacity-25 flex-grow-1" style={{ backgroundColor: '#F4FAFC' }}>
                            <div className="me-auto"><span className="d-block text-navy fw-bold">{t('adults', 'Adults')}</span><small className="text-grey" style={{ fontSize: '0.75rem' }}>{t('adults_desc', '12+ years')}</small></div>
                            <div className="d-flex align-items-center gap-3"><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('adults', 'sub')}><i className="fa-solid fa-minus"></i></button><span className="text-navy fw-bold fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>{guests.adults}</span><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('adults', 'add')}><i className="fa-solid fa-plus"></i></button></div>
                        </div>
                        <div className="d-flex align-items-center rounded-3 px-3 py-2 border border-primary border-opacity-25 flex-grow-1" style={{ backgroundColor: '#F4FAFC' }}>
                            <div className="me-auto"><span className="d-block text-navy fw-bold">{t('children', 'Children')}</span><small className="text-accent fw-bold" style={{ fontSize: '0.75rem' }}>{t('children_desc', '50% Off (2-11 yrs)')}</small></div>
                            <div className="d-flex align-items-center gap-3"><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('children', 'sub')} disabled={guests.children === 0}><i className="fa-solid fa-minus"></i></button><span className="text-navy fw-bold fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>{guests.children}</span><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('children', 'add')}><i className="fa-solid fa-plus"></i></button></div>
                        </div>
                        <div className="d-flex align-items-center rounded-3 px-3 py-2 border border-primary border-opacity-25 flex-grow-1" style={{ backgroundColor: '#F4FAFC' }}>
                            <div className="me-auto"><span className="d-block text-navy fw-bold">{t('infants', 'Infants')}</span><small className="text-success fw-bold" style={{ fontSize: '0.75rem' }}>{t('infants_desc', 'Free (Under 2)')}</small></div>
                            <div className="d-flex align-items-center gap-3"><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('infants', 'sub')} disabled={guests.infants === 0}><i className="fa-solid fa-minus"></i></button><span className="text-navy fw-bold fs-5" style={{ minWidth: '20px', textAlign: 'center' }}>{guests.infants}</span><button type="button" className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }} onClick={() => handleGuestChange('infants', 'add')}><i className="fa-solid fa-plus"></i></button></div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-bed text-accent me-2"></i> {t('acc_class', 'Accommodation Class')}</h4>
                <div className="row g-3">
                    <div className="col-md-4"><div className={`p-3 rounded-3 border text-center ${accClass === 'Standard' ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: accClass === 'Standard' ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAccClass('Standard')}><h6 className="text-navy fw-bold mb-1">{t('std_class', 'Standard')}</h6><p className="text-grey small mb-0">{t('std_desc', 'Included')}</p></div></div>
                    <div className="col-md-4"><div className={`p-3 rounded-3 border text-center ${accClass === 'Deluxe' ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: accClass === 'Deluxe' ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAccClass('Deluxe')}><h6 className="text-navy fw-bold mb-1">{t('deluxe_class', 'Deluxe')}</h6><p className="text-accent fw-bold small mb-0">+{formatPrice(2500)} <span className="text-grey fw-normal">{t('pax', '/pax')}</span></p></div></div>
                    <div className="col-md-4"><div className={`p-3 rounded-3 border text-center ${accClass === 'Luxury' ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: accClass === 'Luxury' ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAccClass('Luxury')}><h6 className="text-navy fw-bold mb-1">{t('lux_class', 'Luxury')}</h6><p className="text-accent fw-bold small mb-0">+{formatPrice(5000)} <span className="text-grey fw-normal">{t('pax', '/pax')}</span></p></div></div>
                </div>
              </div>

              {/* --- LEAD GUEST DETAILS SECTION --- */}
              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-address-card text-accent me-2"></i> {t('lead_guest', 'Lead Guest Details')}</h4>
                <div className="row g-3">
                  <div className="col-md-12"><label className="text-grey fw-bold small mb-2">{t('full_name', 'Full Name')}</label><input type="text" name="name" className="form-control-dark w-100" placeholder="Juan Dela Cruz" value={personalInfo.name} onChange={handleInfoChange} style={{ paddingLeft: '20px' }} required /></div>
                  <div className="col-md-6"><label className="text-grey fw-bold small mb-2">{t('email_addr', 'Email Address')}</label><input type="email" name="email" className="form-control-dark w-100" placeholder="juan@example.com" value={personalInfo.email} onChange={handleInfoChange} style={{ paddingLeft: '20px' }} required /></div>
                  
                  {/* ⚡ UPDATED: PHONE NUMBER WITH COUNTRY CODE ⚡ */}
                  <div className="col-md-6">
                    <label className="text-grey fw-bold small mb-2">{t('phone', 'Phone Number')}</label>
                    <div className="d-flex">
                        <select 
                            className="form-control-dark border-end-0" 
                            style={{ width: '110px', paddingLeft: '10px', paddingRight: '10px', borderTopRightRadius: '0', borderBottomRightRadius: '0' }}
                            value={personalInfo.countryCode}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, countryCode: e.target.value })}
                        >
                            <option value="+63">+63 (PH)</option>
                            <option value="+1">+1 (US/CA)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+61">+61 (AU)</option>
                            <option value="+81">+81 (JP)</option>
                            <option value="+65">+65 (SG)</option>
                            <option value="+971">+971 (AE)</option>
                        </select>
                        <input 
                            type="tel" 
                            name="phone" 
                            className="form-control-dark w-100" 
                            placeholder="900 000 0000" 
                            value={personalInfo.phone} 
                            onChange={handleInfoChange} 
                            style={{ paddingLeft: '15px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} 
                            required 
                        />
                    </div>
                  </div>
                </div>
              </div>

              {/* ⚡ NEW: SPECIAL REQUESTS SECTION ⚡ */}
              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-3 font-montserrat text-navy"><i className="fa-solid fa-bell-concierge text-accent me-2"></i> Special Requests & Instructions</h4>
                <div className="row">
                    <div className="col-md-12">
                        <textarea 
                            name="specialRequests" 
                            className="form-control-dark w-100" 
                            placeholder="E.g. Vegetarian/Halal food requirements, wheelchair accessibility, allergies, or special celebrations..." 
                            value={personalInfo.specialRequests} 
                            onChange={handleInfoChange} 
                            rows="3"
                            style={{ resize: 'none', padding: '15px' }}
                        ></textarea>
                        <p className="text-grey mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
                            <i className="fa-solid fa-circle-info text-primary-dark me-1"></i> 
                            <strong>Note:</strong> We will do our absolute best to accommodate dietary restrictions (such as full Halal or Vegetarian meals). However, please be aware that full availability is subject to the specific destination and our local tour partners.
                        </p>
                    </div>
                </div>
              </div>

              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box" style={{ borderLeft: '4px solid #4CAF50 !important' }}>
                <h4 className="fw-bold mb-2 font-montserrat text-navy">
                  <i className="fa-solid fa-leaf text-success me-2"></i> 
                  <a 
                    href="https://www.forestfoundation.ph/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: '#4CAF50' }}
                    title="Visit Forest Foundation Philippines"
                  >
                    {t('carbon_footprint', 'Carbon Footprint - go to Forest Foundation Philippines')}
                  </a>
                </h4>
                <p className="text-grey small mb-3">{t('carbon_desc', 'Air travel and ground transport generate emissions. The estimated footprint for')} {totalHeads} {t('carbon_desc2', 'traveler(s) is')} <strong className="text-navy">{totalHeads * 150}kg CO₂</strong>. {t('carbon_desc3', 'Help us offset this by contributing to local Philippine reforestation projects.')}</p>
                <div className={`p-3 rounded-3 border ${addons.carbonOffset ? 'border-success' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.carbonOffset ? 'rgba(76, 175, 80, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('carbonOffset')}>
                    <div className="form-check d-flex justify-content-between align-items-center m-0 p-0">
                        <div>
                            <input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.carbonOffset} readOnly style={{ cursor: 'pointer', accentColor: '#4CAF50' }} />
                            <label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>{t('offset_carbon', 'Offset My Carbon Footprint')}</label>
                            <p className="text-grey small m-0 ms-4 ps-2">{formatPrice(500)} {t('per_person', 'per person')}</p>
                        </div>
                        <span className="text-success fw-bold">+{formatPrice(addonPrices.carbonOffset * totalHeads)}</span>
                    </div>
                </div>
              </div>

              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-puzzle-piece text-accent me-2"></i> {t('optional_addons', 'Optional Add-ons')}</h4>
                <div className={`p-3 rounded-3 mb-3 border ${addons.airportTransfer ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.airportTransfer ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('airportTransfer')}><div className="form-check d-flex justify-content-between align-items-center m-0 p-0"><div><input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.airportTransfer} readOnly style={{ cursor: 'pointer' }} /><label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>{t('transfer', 'Roundtrip Airport Transfer')}</label><p className="text-grey small m-0 ms-4 ps-2">{t('transfer_desc', 'Hassle-free pick up and drop off.')}</p></div><span className="text-accent fw-bold">+{formatPrice(1500)}</span></div></div>
                <div className={`p-3 rounded-3 mb-3 border ${addons.insurance ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.insurance ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('insurance')}><div className="form-check d-flex justify-content-between align-items-center m-0 p-0"><div><input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.insurance} readOnly style={{ cursor: 'pointer' }} /><label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>{t('insurance', 'Travel Insurance')}</label><p className="text-grey small m-0 ms-4 ps-2">{t('insurance_desc', 'Full coverage per guest.')}</p></div><span className="text-accent fw-bold">+{formatPrice(950)} <small className="text-grey fw-normal">/head</small></span></div></div>
                <div className={`p-3 rounded-3 border ${addons.romanticDinner ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: addons.romanticDinner ? 'rgba(0, 180, 216, 0.1)' : '#F4FAFC', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => toggleAddon('romanticDinner')}><div className="form-check d-flex justify-content-between align-items-center m-0 p-0"><div><input className="form-check-input me-3 ms-0 mt-0" type="checkbox" checked={addons.romanticDinner} readOnly style={{ cursor: 'pointer' }} /><label className="form-check-label text-navy fw-bold d-inline" style={{ cursor: 'pointer' }}>{t('dinner', 'Romantic Dinner Setup')}</label><p className="text-grey small m-0 ms-4 ps-2">{t('dinner_desc', 'Candlelit dinner by the beach.')}</p></div><span className="text-accent fw-bold">+{formatPrice(2500)}</span></div></div>
              </div>

              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 mb-4 teal-hover-box">
                <h4 className="fw-bold mb-4 font-montserrat text-navy"><i className="fa-solid fa-people-arrows text-accent me-2"></i> {t('payment_details', 'Payment Details')}</h4>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="text-grey fw-bold small mb-2">{t('how_paying', 'How are we paying?')}</label>
                    <div className="input-with-icon position-relative">
                        <i className="fa-solid fa-users position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', zIndex: 1 }}></i>
                        <select className="form-control-dark w-100" value={splitBetween} onChange={(e) => {
                            setSplitBetween(e.target.value);
                            setPayerEmails(Array(parseInt(e.target.value)).fill(''));
                        }} style={{ paddingLeft: '45px' }}>
                            <option value="1">{t('split_1', 'Just me (Pay in full)')}</option>
                            <option value="2">{t('split_ways', 'Split')} 2 {t('split_ways2', 'ways')}</option>
                            <option value="3">{t('split_ways', 'Split')} 3 {t('split_ways2', 'ways')}</option>
                            <option value="4">{t('split_ways', 'Split')} 4 {t('split_ways2', 'ways')}</option>
                            <option value="5">{t('split_ways', 'Split')} 5 {t('split_ways2', 'ways')}</option>
                        </select>
                    </div>
                  </div>

                  <div className="col-md-12 mt-3">
                      <label className="text-grey fw-bold small mb-2">{t('invoice_emails', 'Email Addresses for Invoices:')}</label>
                      {Array.from({ length: splitBetween }).map((_, index) => (
                          <div key={index} className="mb-2 input-with-icon position-relative">
                              <i className="fa-regular fa-envelope position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', zIndex: 1 }}></i>
                              <input 
                                  type="email" 
                                  className="form-control-dark w-100" 
                                  style={{ paddingLeft: '45px' }}
                                  placeholder={index === 0 ? t('lead_email', "Lead Booker's Email") : `${t('friend_email', 'Friend')} ${index}${t('friend_email2', "'s Email")}`}
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
                          <p className="text-accent small mb-0"><i className="fa-solid fa-circle-info me-1"></i> {t('each_pays', 'Each person will pay')} <strong className="text-navy">{formatPrice(grandTotal / splitBetween)}</strong>. {t('invoices_tied', 'Invoices will be tied to the emails above.')}</p>
                      </div>
                  )}
                </div>
              </div>

            </div>

            <div className="col-lg-4 scroll-reveal visible">
              <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 sticky-top teal-hover-box" style={{ top: '100px' }}>
                <h4 className="fw-bold mb-4 font-montserrat text-navy border-bottom border-primary border-opacity-10 pb-3">{t('price_summary', 'Price Summary')}</h4>
                
                {selectedPackage ? (
                    <>
                        <h6 className="text-primary-dark fw-bold mb-1">{selectedPackage}</h6>
                        <p className="text-grey small mb-4">{guests.adults} {t('adults', 'Adults')}, {guests.children} {t('children', 'Children')}, {guests.infants} {t('infants', 'Infants')} {date && ` • ${date}`}</p>
                        
                        <div className="d-flex justify-content-between mb-2"><span className="text-grey small">Base Price (x{guests.adults})</span><span className="text-navy fw-bold">{formatPrice(adultTotal)}</span></div>
                        {guests.children > 0 && (<div className="d-flex justify-content-between mb-2"><span className="text-accent small">Children (50% Off)</span><span className="text-navy fw-bold">{formatPrice(childTotal)}</span></div>)}
                        
                        {accClass !== 'Standard' && (<div className="d-flex justify-content-between mb-2"><span className="text-accent small">{t('acc_class', 'Class')} (x{guests.adults})</span><span className="text-navy fw-bold">{formatPrice(adultAccTotal)}</span></div>)}
                        {accClass !== 'Standard' && guests.children > 0 && (<div className="d-flex justify-content-between mb-2"><span className="text-accent small">{t('acc_class', 'Class')} Child (50% Off)</span><span className="text-navy fw-bold">{formatPrice(childAccTotal)}</span></div>)}
                        
                        {addons.airportTransfer && (<div className="d-flex justify-content-between mb-2"><span className="text-grey small">{t('transfer', 'Airport Transfer')}</span><span className="text-navy fw-bold">{formatPrice(transferTotal)}</span></div>)}
                        {addons.insurance && (<div className="d-flex justify-content-between mb-2"><span className="text-grey small">{t('insurance', 'Insurance')} (x{totalHeads})</span><span className="text-navy fw-bold">{formatPrice(insuranceTotal)}</span></div>)}
                        {addons.romanticDinner && (<div className="d-flex justify-content-between mb-2"><span className="text-grey small">{t('dinner', 'Romantic Dinner')}</span><span className="text-navy fw-bold">{formatPrice(dinnerTotal)}</span></div>)}
                        {addons.carbonOffset && (<div className="d-flex justify-content-between mb-2"><span className="text-success small">Carbon Offset (x{totalHeads})</span><span className="text-navy fw-bold">{formatPrice(carbonTotal)}</span></div>)}
                        
                        <div className="border-top border-primary border-opacity-10 mt-3 pt-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-grey small">VAT (12%)</span>
                                <span className="text-navy fw-bold">{formatPrice(vatTotal)}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-grey py-4 border border-primary border-opacity-25 border-dashed rounded-3 mb-4"><small>{t('select_summary', 'Select a package to see summary')}</small></div>
                )}

                <div className="border-top border-primary border-opacity-10 mt-3 pt-3 d-flex justify-content-between align-items-center mb-4"><span className="text-navy fw-bold fs-5">{t('total', 'Total')}</span><span className="fw-bold fs-3 text-accent">{formatPrice(grandTotal)}</span></div>
                
                {splitBetween > 1 && (
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-primary border-opacity-10">
                        <span className="text-grey small">{t('split', 'Split')} {splitBetween} {t('ways', 'ways')}</span>
                        <span className="text-accent fw-bold">{formatPrice(grandTotal / splitBetween)} <small className="text-grey fw-normal">{t('per_person2', '/person')}</small></span>
                    </div>
                )}

                <button type="submit" className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold shadow" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <><i className="fa-solid fa-spinner fa-spin me-2"></i> {t('processing', 'Processing...')}</>
                    ) : (
                        <>{t('add_to_trips', 'Add to My Trips')} <i className="fa-solid fa-arrow-right ms-2"></i></>
                    )}
                </button>

                <p className="text-center text-grey small mt-3 mb-0"><i className="fa-solid fa-lock text-primary-dark me-1"></i> {t('secure_payment', 'Secure Encrypted Payment')}</p>
              </div>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
};

export default Booking;