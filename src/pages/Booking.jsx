import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tourPackages, allPlaces, regions } from '../data/placesData'; 
import { usePreferences } from '../context/PreferencesContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; 
import axios from 'axios';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, formatPrice } = usePreferences();
  const { user } = useAuth(); 

  const [selectedPackage, setSelectedPackage] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [accClass, setAccClass] = useState('standard');
  const [addons, setAddons] = useState({ airportTransfer: false, insurance: false, romanticDinner: false, carbonOffset: false });
  const [splitPayment, setSplitPayment] = useState(1);
  const [emails, setEmails] = useState(['']);
  
  const [leadGuest, setLeadGuest] = useState({ name: '', email: '', phone: '', specialRequests: '' });
  const [phoneCode, setPhoneCode] = useState('+63');

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); 
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleApplyPromo = async () => {
      if (!promoCode.trim()) return;
      
      if (!selectedPackage) {
          return toast.error("Please select a destination package first.");
      }
      
      if (!leadGuest.email) {
          return toast.error("Please enter the Lead Guest Email Address first to verify eligibility.");
      }
      
      setIsApplyingPromo(true);
      try {
          if (promoCode.toUpperCase().startsWith('WELCOME-')) {
               setAppliedDiscount(0.10); 
               toast.success("10% Welcome Discount Applied! 🎉");
               setIsApplyingPromo(false);
               return;
          }

          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/promo/validate`, { 
              code: promoCode,
              email: leadGuest.email,
              packageName: selectedPackage
          });

          setAppliedDiscount(response.data.discount); 
          toast.success(response.data.message || "Promo Code Applied! 🎉");
          
      } catch (error) {
          setAppliedDiscount(0);
          toast.error(error.response?.data?.error || "Invalid or already used promo code.");
      } finally {
          setIsApplyingPromo(false);
      }
  };

  // Price Calculations
  const allOptions = [...tourPackages, ...allPlaces];
  const pkgData = allOptions.find(p => p.name === selectedPackage) || { price: 0 };
  const basePrice = pkgData.price;
  
  const totalHeads = guests.adults + guests.children + guests.infants;
  const chargeablePax = guests.adults + guests.children;
  
  const baseTotalAdults = guests.adults * basePrice;
  const baseTotalChildren = guests.children * (basePrice * 0.5); 
  const baseTotal = baseTotalAdults + baseTotalChildren;
  
  const accMultipliers = { standard: 0, deluxe: 0.30, luxury: 0.70 };
  const accTotal = baseTotal * accMultipliers[accClass];

  const addonPrices = { airportTransfer: 1500, insurance: 800, romanticDinner: 3500, carbonOffset: 500 };
  
  const transferTotal = addons.airportTransfer ? addonPrices.airportTransfer : 0;
  const dinnerTotal = addons.romanticDinner ? addonPrices.romanticDinner : 0;
  const insuranceTotal = addons.insurance ? (addonPrices.insurance * totalHeads) : 0; 
  const carbonTotal = addons.carbonOffset ? (addonPrices.carbonOffset * chargeablePax) : 0;

  const subtotal = baseTotal + accTotal + transferTotal + insuranceTotal + dinnerTotal + carbonTotal;
  const vatTotal = subtotal * 0.12;
  
  const rawGrandTotal = subtotal + vatTotal;
  const discountTotal = rawGrandTotal * appliedDiscount;
  const grandTotal = rawGrandTotal - discountTotal;

  const handleConfirmBooking = async () => {
    if (!selectedPackage || !travelDate || !leadGuest.name || !leadGuest.email) {
        toast.error("Please fill in all required fields (Package, Date, Name, Email).");
        return;
    }

    if (!user) {
        toast.error("Please log in to save your planned trip.");
        navigate('/login');
        return;
    }

    const payload = {
        userId: user.id || user._id,
        packageName: selectedPackage,
        packageId: pkgData.id, 
        travelDate: travelDate,
        splitBetween: splitPayment,
        friendEmails: emails.filter(e => e.trim() !== ''),
        contactInfo: {
            ...leadGuest,
            phone: leadGuest.phone ? `${phoneCode} ${leadGuest.phone}` : ''
        },
        guests: guests,
        accClass: accClass,
        addons: addons,
        specialRequests: leadGuest.specialRequests,
        appliedPromoCode: appliedDiscount > 0 ? promoCode : null, 
    };

    setIsSubmitting(true);
    const toastId = toast.loading("Saving to My Planned Trips...");

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/create`, payload);
        toast.success("Trip successfully added!", { id: toastId });
        navigate('/profile?tab=unpaid'); 
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || "Failed to save trip.", { id: toastId });
    } finally {
        setIsSubmitting(false);
    }
  };

  const StepHeader = ({ number, title, icon }) => (
    <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-primary border-opacity-10">
        <div className="d-flex align-items-center justify-content-center rounded-circle text-white shadow-sm me-3" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {number}
        </div>
        <h4 className="text-navy font-montserrat fw-bold m-0"><i className={`fa-solid ${icon} text-accent me-2 opacity-75`}></i> {title}</h4>
    </div>
  );

  return (
    <div className="fade-in">
        <style>
        {`
            /* ⚡ UNIFIED: Using var(--primary-color) for highlights */
            .hover-teal { transition: all 0.3s ease; outline: none; }
            .hover-teal:hover, .hover-teal:focus-within { 
                border-color: var(--primary-color) !important; 
                box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.15) !important; 
            }
            
            .hover-coral { transition: all 0.3s ease !important; }
            .hover-coral:hover, .hover-coral:focus {
                background-color: var(--accent-color, #F69928) !important;
                border-color: var(--accent-color, #F69928) !important;
                color: white !important;
                opacity: 1 !important;
            }
            .hover-coral:active, .active-coral {
                background-color: var(--accent-color, #F69928) !important;
                border-color: var(--accent-color, #F69928) !important;
                color: white !important;
                box-shadow: 0 0 0 3px rgba(246, 153, 40, 0.4) !important; 
                opacity: 1 !important;
            }

            .unselected-teal {
                background-color: var(--bg-dark) !important;
                color: var(--text-grey) !important;
                border: 1px solid rgba(0, 59, 92, 0.2) !important;
            }

            .phone-select {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
            }

            .custom-select-wrapper { position: relative; }
            
            .custom-select-wrapper select,
            .custom-select-wrapper input {
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                padding-left: 45px !important;
                background-color: #F8FAFC !important; 
                color: var(--navy-color, #003B5C) !important;
            }
            
            .custom-select-wrapper select {
                padding-right: 40px !important;
            }

            .custom-select-icon-left {
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--primary-color);
                pointer-events: none;
                z-index: 5;
            }

            .custom-select-icon-right {
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--primary-color);
                pointer-events: none;
                z-index: 5;
            }

            optgroup {
                font-weight: 900;
                color: var(--accent-color, #F69928);
                background-color: #fff;
                letter-spacing: 1px;
            }

            .disabled-region-label {
                font-weight: bold !important;
                color: var(--navy-color, #003B5C) !important;
                background-color: rgba(0, 59, 92, 0.05) !important;
            }
            
            option {
                color: var(--navy-color, #003B5C);
                font-weight: 500;
                background-color: #fff;
            }
        `}
        </style>

        <section className="py-5" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', paddingTop: '120px' }}>
            <div className="container">
                
                <div className="text-center mb-5 mt-4">
                    <h1 className="section-title wave-text mb-2 text-navy" style={{ fontSize: '3.5rem' }}>{t('booking_title', 'Secure Your Spot')}</h1>
                    <p className="text-grey fw-bold fs-5">{t('booking_desc', 'Complete your details and get ready to pack your bags.')}</p>
                </div>

                <div className="row g-5">
                    
                    {/* LEFT COLUMN - FORM */}
                    <div className="col-lg-8">
                        
                        {/* 1. Trip Details */}
                        <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-sm mb-4 border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <StepHeader number="1" title={t('trip_details', 'Trip Details')} icon="fa-map-location-dot" />
                            
                            <div className="row g-4 mb-5">
                                <div className="col-md-7">
                                    <label className="text-primary fw-bold small mb-2 text-uppercase letter-spacing-1">{t('dest_pkg', 'Destination / Package')} <span className="text-danger">*</span></label>
                                    
                                    <div className="custom-select-wrapper">
                                        <i className="fa-solid fa-map-location-dot custom-select-icon-left"></i>
                                        
                                        <select className="form-control form-control-lg w-100 border-primary border-opacity-25 shadow-sm hover-teal" value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} style={{ fontSize: '1rem' }}>
                                            <option value="">{t('select_pkg', '-- Select a Destination --')}</option>
                                            
                                            <optgroup label="🗺️ GUIDED TOUR PACKAGES">
                                                {regions.map(region => {
                                                    const regionTours = tourPackages.filter(pkg => {
                                                        if (region.id === 'Palawan' && pkg.id.includes('ElNido')) return true;
                                                        if (region.id === 'Bohol' && pkg.id.includes('Bohol')) return true;
                                                        if (region.id === 'Aklan' && pkg.id.includes('Boracay')) return true;
                                                        if (region.id === 'Cebu' && pkg.id.includes('Cebu')) return true;
                                                        if (region.id === 'Manila' && pkg.id.includes('Manila')) return true;
                                                        if (region.id === 'Banaue' && pkg.id.includes('Banaue')) return true;
                                                        return false;
                                                    });

                                                    if (regionTours.length === 0) return null;

                                                    return (
                                                        <React.Fragment key={`tour-${region.id}`}>
                                                            <option disabled className="disabled-region-label">{region.name.toUpperCase()}</option>
                                                            {regionTours.map(pkg => (
                                                                <option key={pkg.id} value={pkg.name}>&nbsp;&nbsp;&nbsp;&nbsp;{pkg.name}</option>
                                                            ))}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </optgroup>

                                            <optgroup label="🏨 ACCOMMODATIONS & RESORTS">
                                                {regions.map(region => {
                                                    const regionPlaces = allPlaces.filter(place => place.region === region.id || (region.id === 'Banaue' && place.region === 'Ifugao'));
                                                    if (regionPlaces.length === 0) return null;

                                                    return (
                                                        <React.Fragment key={`acc-${region.id}`}>
                                                            <option disabled className="disabled-region-label">{region.name.toUpperCase()}</option>
                                                            {regionPlaces.map(place => (
                                                                <option key={place.id} value={place.name}>&nbsp;&nbsp;&nbsp;&nbsp;{place.name}</option>
                                                            ))}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </optgroup>

                                        </select>
                                        <i className="fa-solid fa-chevron-down custom-select-icon-right"></i>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <label className="text-primary fw-bold small mb-2 text-uppercase letter-spacing-1">{t('travel_date', 'Travel Date')} <span className="text-danger">*</span></label>
                                    <div className="custom-select-wrapper">
                                        <i className="fa-regular fa-calendar custom-select-icon-left"></i>
                                        <input type="date" className="form-control form-control-lg w-100 border-primary border-opacity-25 shadow-sm hover-teal text-navy" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} style={{ fontSize: '1rem' }} />
                                    </div>
                                </div>
                            </div>

                            <label className="text-primary fw-bold small mb-3 text-uppercase letter-spacing-1">{t('num_guests', 'Number of Guests')}</label>
                            <div className="row g-3 mb-5">
                                <div className="col-md-4">
                                    <div className="d-flex flex-column align-items-center rounded-4 p-3 border border-primary border-opacity-25 text-center shadow-sm hover-teal" style={{ backgroundColor: '#fff' }}>
                                        <i className="fa-solid fa-user text-accent fs-2 mb-2"></i>
                                        <span className="d-block text-navy fw-bold fs-5">{t('adults', 'Adults')}</span>
                                        <small className="text-grey opacity-75 fw-bold mb-3">{t('adults_desc', '12+ years')}</small>
                                        <div className="d-flex align-items-center justify-content-center gap-3 w-100 bg-light rounded-pill p-2">
                                            <button type="button" className="btn btn-sm btn-white rounded-circle shadow-sm hover-coral" style={{ width: '32px', height: '32px', padding: 0 }} onClick={() => handleGuestChange('adults', 'sub')} disabled={guests.adults <= 1}><i className="fa-solid fa-minus"></i></button>
                                            <span className="text-navy fw-bold fs-5" style={{ minWidth: '24px' }}>{guests.adults}</span>
                                            <button type="button" className="btn btn-sm btn-white rounded-circle shadow-sm hover-coral text-primary" style={{ width: '32px', height: '32px', padding: 0 }} onClick={() => handleGuestChange('adults', 'add')}><i className="fa-solid fa-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex flex-column align-items-center rounded-4 p-3 border border-primary border-opacity-25 text-center shadow-sm hover-teal" style={{ backgroundColor: '#fff' }}>
                                        <i className="fa-solid fa-child-reaching text-accent fs-2 mb-2"></i>
                                        <span className="d-block text-navy fw-bold fs-5">{t('children', 'Children')}</span>
                                        <span className="fw-bold lh-1 mt-1 text-primary" style={{ fontSize: '0.85rem' }}>{t('children_discount', '50% Off')}</span>
                                        <small className="text-grey opacity-75 fw-bold mb-2" style={{ fontSize: '0.75rem' }}>{t('children_age', '2-11 years old')}</small>
                                        <div className="d-flex align-items-center justify-content-center gap-3 w-100 bg-light rounded-pill p-2">
                                            <button type="button" className="btn btn-sm btn-white rounded-circle shadow-sm hover-coral" style={{ width: '32px', height: '32px', padding: 0 }} onClick={() => handleGuestChange('children', 'sub')} disabled={guests.children === 0}><i className="fa-solid fa-minus"></i></button>
                                            <span className="text-navy fw-bold fs-5" style={{ minWidth: '24px' }}>{guests.children}</span>
                                            <button type="button" className="btn btn-sm btn-white rounded-circle shadow-sm hover-coral text-primary" style={{ width: '32px', height: '32px', padding: 0 }} onClick={() => handleGuestChange('children', 'add')}><i className="fa-solid fa-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex flex-column align-items-center rounded-4 p-3 border border-primary border-opacity-25 text-center shadow-sm hover-teal" style={{ backgroundColor: '#fff' }}>
                                        <i className="fa-solid fa-baby text-accent fs-2 mb-2"></i>
                                        <span className="d-block text-navy fw-bold fs-5">{t('infants', 'Infants')}</span>
                                        <span className="fw-bold lh-1 mt-1 text-primary" style={{ fontSize: '0.85rem' }}>{t('infants_discount', 'Free')}</span>
                                        <small className="text-grey opacity-75 fw-bold mb-2" style={{ fontSize: '0.75rem' }}>{t('infants_age', 'Under 2 years old')}</small>
                                        <div className="d-flex align-items-center justify-content-center gap-3 w-100 bg-light rounded-pill p-2">
                                            <button type="button" className="btn btn-sm btn-white rounded-circle shadow-sm hover-coral" style={{ width: '32px', height: '32px', padding: 0 }} onClick={() => handleGuestChange('infants', 'sub')} disabled={guests.infants === 0}><i className="fa-solid fa-minus"></i></button>
                                            <span className="text-navy fw-bold fs-5" style={{ minWidth: '24px' }}>{guests.infants}</span>
                                            <button type="button" className="btn btn-sm btn-white rounded-circle shadow-sm hover-coral text-primary" style={{ width: '32px', height: '32px', padding: 0 }} onClick={() => handleGuestChange('infants', 'add')}><i className="fa-solid fa-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <label className="text-primary fw-bold small mb-3 text-uppercase letter-spacing-1">{t('acc_class', 'Accommodation Class')}</label>
                            <div className="row g-3">
                                {[
                                    { id: 'standard', icon: 'fa-bed', title: t('std_class', 'Standard'), desc: t('std_desc', 'Included') },
                                    { id: 'deluxe', icon: 'fa-hot-tub-person', title: t('deluxe_class', 'Deluxe'), desc: `+30% (${formatPrice(baseTotal * 0.30)})`, highlight: true },
                                    { id: 'luxury', icon: 'fa-crown', title: t('lux_class', 'Luxury'), desc: `+70% (${formatPrice(baseTotal * 0.70)})`, highlight: true }
                                ].map(cls => (
                                    <div className="col-md-4" key={cls.id}>
                                        <label className={`w-100 h-100 rounded-4 p-3 border text-center position-relative shadow-sm hover-teal ${accClass === cls.id ? 'border-primary bg-primary bg-opacity-10' : 'border-primary border-opacity-25 bg-white'}`} style={{ cursor: 'pointer' }}>
                                            <input type="radio" name="accClass" value={cls.id} checked={accClass === cls.id} onChange={(e) => setAccClass(e.target.value)} className="position-absolute opacity-0" />
                                            {accClass === cls.id && <i className="fa-solid fa-circle-check position-absolute top-0 end-0 m-2 fs-5 text-primary"></i>}
                                            <i className={`fa-solid ${cls.icon} fs-2 mb-2 ${accClass === cls.id ? '' : 'opacity-50'}`} style={{ color: accClass === cls.id ? 'var(--primary-color)' : 'var(--navy-color)' }}></i>
                                            <h6 className="fw-bold text-navy m-0">{cls.title}</h6>
                                            <small className={cls.highlight ? 'fw-bold text-primary' : 'text-grey fw-bold'}>{cls.desc}</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Lead Guest Details */}
                        <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-sm mb-4 border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <StepHeader number="2" title={t('lead_guest', 'Lead Guest Details')} icon="fa-user-check" />
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="text-primary fw-bold small mb-2 text-uppercase letter-spacing-1">{t('full_name', 'Full Name')} <span className="text-danger">*</span></label>
                                    <div className="custom-select-wrapper">
                                        <i className="fa-regular fa-user custom-select-icon-left opacity-75"></i>
                                        <input type="text" className="form-control form-control-lg bg-light border-primary border-opacity-25 shadow-sm hover-teal text-navy" placeholder="Juan Dela Cruz" value={leadGuest.name} onChange={(e) => setLeadGuest({...leadGuest, name: e.target.value})} style={{ fontSize: '0.95rem' }} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-primary fw-bold small mb-2 text-uppercase letter-spacing-1">{t('email_addr', 'Email Address')} <span className="text-danger">*</span></label>
                                    <div className="custom-select-wrapper">
                                        <i className="fa-regular fa-envelope custom-select-icon-left opacity-75"></i>
                                        <input type="email" className="form-control form-control-lg bg-light border-primary border-opacity-25 shadow-sm hover-teal text-navy" placeholder="juan@example.com" value={leadGuest.email} onChange={(e) => setLeadGuest({...leadGuest, email: e.target.value})} style={{ fontSize: '0.95rem' }} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-primary fw-bold small mb-2 text-uppercase letter-spacing-1">{t('phone', 'Phone Number')}</label>
                                    <div className="input-group input-group-lg shadow-sm hover-teal rounded-3" style={{ border: '1px solid rgba(0, 119, 182, 0.25)', overflow: 'hidden' }}>
                                        <span className="input-group-text border-0 pe-2" style={{ backgroundColor: '#F8FAFC' }}>
                                            <i className="fa-solid fa-phone opacity-75 text-primary"></i>
                                        </span>
                                        <select 
                                            className="form-select border-0 fw-bold text-navy px-1 phone-select" 
                                            style={{ maxWidth: '90px', cursor: 'pointer', fontSize: '0.95rem', boxShadow: 'none', backgroundColor: '#F8FAFC' }}
                                            value={phoneCode}
                                            onChange={(e) => setPhoneCode(e.target.value)}
                                        >
                                            <option value="+63">🇵🇭 +63</option>
                                            <option value="+1">🇺🇸 +1</option>
                                            <option value="+44">🇬🇧 +44</option>
                                            <option value="+61">🇦🇺 +61</option>
                                            <option value="+65">🇸🇬 +65</option>
                                            <option value="+971">🇦🇪 +971</option>
                                            <option value="+81">🇯🇵 +81</option>
                                            <option value="+82">🇰🇷 +82</option>
                                            <option value="+86">🇨🇳 +86</option>
                                            <option value="+91">🇮🇳 +91</option>
                                            <option value="+33">🇫🇷 +33</option>
                                            <option value="+49">🇩🇪 +49</option>
                                            <option value="+34">🇪🇸 +34</option>
                                            <option value="+39">🇮🇹 +39</option>
                                        </select>
                                        <input 
                                            type="tel" 
                                            className="form-control border-0 text-navy" 
                                            placeholder="912 345 6789" 
                                            value={leadGuest.phone} 
                                            onChange={(e) => setLeadGuest({...leadGuest, phone: e.target.value})} 
                                            style={{ fontSize: '0.95rem', boxShadow: 'none', backgroundColor: '#F8FAFC' }} 
                                        />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="text-primary fw-bold small mb-2 text-uppercase letter-spacing-1">Special Requests</label>
                                    <div className="custom-select-wrapper">
                                        <i className="fa-regular fa-comment-dots custom-select-icon-left opacity-75" style={{ top: '24px', transform: 'none' }}></i>
                                        <textarea className="form-control form-control-lg bg-light border-primary border-opacity-25 shadow-sm hover-teal text-navy" rows="3" placeholder="Allergies, late check-in, special occasions, etc." value={leadGuest.specialRequests} onChange={(e) => setLeadGuest({...leadGuest, specialRequests: e.target.value})} style={{ paddingLeft: '45px', fontSize: '0.95rem' }}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Add-ons & Extras */}
                        <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-sm mb-4 border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <StepHeader number="3" title={t('optional_addons', 'Optional Add-ons')} icon="fa-layer-group" />
                            </div>
                            
                            <div className="d-flex flex-column gap-3 mb-4">
                                {[
                                    { id: 'airportTransfer', title: t('transfer', 'Roundtrip Airport Transfer'), desc: t('transfer_desc', 'Hassle-free pick up and drop off.'), price: addonPrices.airportTransfer, icon: 'fa-van-shuttle' },
                                    { id: 'insurance', title: t('insurance', 'Travel Insurance'), desc: t('insurance_desc', 'Full coverage per guest.'), price: addonPrices.insurance * totalHeads, icon: 'fa-shield-heart' },
                                    { id: 'romanticDinner', title: t('dinner', 'Romantic Dinner Setup'), desc: t('dinner_desc', 'Candlelit dinner by the beach.'), price: addonPrices.romanticDinner, icon: 'fa-champagne-glasses' }
                                ].map(addon => (
                                    <div key={addon.id} className={`p-3 p-md-4 rounded-4 border hover-teal ${addons[addon.id] ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-secondary border-opacity-25 bg-white shadow-none'}`} style={{ cursor: 'pointer' }} onClick={() => toggleAddon(addon.id)}>
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '24px', height: '24px', border: '2px solid', borderRadius: '6px', borderColor: addons[addon.id] ? 'var(--primary-color)' : 'var(--primary-color)', opacity: addons[addon.id] ? 1 : 0.5, backgroundColor: addons[addon.id] ? 'var(--primary-color)' : 'transparent', transition: 'all 0.2s ease' }}>
                                                <i className="fa-solid fa-check text-white" style={{ fontSize: '0.8rem', opacity: addons[addon.id] ? 1 : 0 }}></i>
                                            </div>
                                            <div className="me-auto">
                                                <h6 className="text-navy fw-bold m-0 d-flex align-items-center"><i className={`fa-solid ${addon.icon} me-2 ${addons[addon.id] ? '' : 'opacity-50'}`} style={{ color: addons[addon.id] ? 'var(--primary-color)' : 'var(--navy-color)' }}></i> {addon.title}</h6>
                                                <p className="text-grey small m-0 mt-1">{addon.desc}</p>
                                            </div>
                                            <div className="text-end ms-3">
                                                <span className="fw-bold fs-6 text-primary" style={{ opacity: addons[addon.id] ? 1 : 0.6 }}>+{formatPrice(addon.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CARBON OFFSET SECTION */}
                            <div className="p-4 rounded-4 position-relative overflow-hidden" style={{ backgroundColor: 'rgba(0, 180, 216, 0.05)', border: '1px solid rgba(0, 180, 216, 0.3)' }}>
                                <div className="position-absolute top-0 end-0 opacity-10 p-3"><i className="fa-solid fa-leaf text-primary" style={{ fontSize: '5rem' }}></i></div>
                                <div className="position-relative z-1">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fa-solid fa-leaf fs-4 me-2 text-primary"></i>
                                        <h5 className="text-navy font-montserrat fw-bold m-0">{t('carbon_footprint', 'Carbon Footprint - Forest Foundation Philippines')}</h5>
                                    </div>
                                    <p className="text-grey small mb-4" style={{ maxWidth: '90%' }}>{t('carbon_desc', 'Air travel and ground transport generate emissions. The estimated footprint for')} {chargeablePax} {t('carbon_desc2', 'traveler(s) is')} <strong className="text-navy">{chargeablePax * 150}kg CO₂</strong>. {t('carbon_desc3', 'Help us offset this by contributing to local Philippine reforestation projects.')}</p>
                                    
                                    <div className={`p-3 p-md-4 rounded-4 border hover-teal ${addons.carbonOffset ? 'bg-white shadow-sm border-primary' : 'border-secondary border-opacity-25 bg-white shadow-none'}`} style={{ cursor: 'pointer' }} onClick={() => toggleAddon('carbonOffset')}>
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '24px', height: '24px', border: '2px solid', borderRadius: '6px', borderColor: 'var(--primary-color)', opacity: addons.carbonOffset ? 1 : 0.5, backgroundColor: addons.carbonOffset ? 'var(--primary-color)' : 'transparent', transition: 'all 0.2s ease' }}>
                                                <i className="fa-solid fa-check text-white" style={{ fontSize: '0.8rem', opacity: addons.carbonOffset ? 1 : 0 }}></i>
                                            </div>
                                            <div className="me-auto">
                                                <h6 className="fw-bold m-0 text-primary">{t('offset_carbon', 'Offset My Carbon Footprint')}</h6>
                                                <p className="text-grey small m-0 mt-1">{formatPrice(500)} {t('per_person', 'per person')}</p>
                                            </div>
                                            <div className="text-end ms-3">
                                                <span className="fw-bold fs-6 text-primary" style={{ opacity: addons.carbonOffset ? 1 : 0.6 }}>+{formatPrice(addonPrices.carbonOffset * chargeablePax)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Payment Details */}
                        <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-sm mb-4 border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <StepHeader number="4" title={t('payment_details', 'Payment Details')} icon="fa-credit-card" />
                            
                            <label className="text-primary fw-bold small mb-3 text-uppercase letter-spacing-1">{t('how_paying', 'How are we paying?')}</label>
                            
                            <div className="d-flex flex-wrap gap-2 mb-4 bg-light p-2 rounded-4 border border-primary border-opacity-10">
                                <button type="button" className={`btn flex-grow-1 rounded-pill fw-bold hover-coral ${splitPayment === 1 ? 'active-coral shadow-sm' : 'unselected-teal'}`} onClick={() => setSplitPayment(1)}>
                                    {t('split_1', 'Just me (Pay in full)')}
                                </button>
                                {[2, 3, 4, 5].map(num => (
                                    <button type="button" key={num} className={`btn flex-grow-1 rounded-pill fw-bold hover-coral ${splitPayment === num ? 'active-coral shadow-sm' : 'unselected-teal'}`} onClick={() => setSplitPayment(num)}>
                                        {t('split_ways', 'Split')} {num}
                                    </button>
                                ))}
                            </div>

                            {splitPayment > 1 && (
                                <div className="p-4 rounded-4 shadow-sm border border-primary border-opacity-25 fade-in bg-white">
                                    <h6 className="text-navy fw-bold mb-3"><i className="fa-solid fa-envelope-open-text text-accent me-2"></i> {t('invoice_emails', 'Email Addresses for Invoices:')}</h6>
                                    <div className="row g-3">
                                        {emails.map((email, index) => (
                                            <div className="col-md-6" key={index}>
                                                <label className="text-primary fw-bold small mb-1 text-uppercase letter-spacing-1">{index === 0 ? t('lead_email', "Lead Booker's Email") : `${t('friend_email', 'Friend')} ${index}'s ${t('friend_email2', 'Email')}`}</label>
                                                <div className="custom-select-wrapper">
                                                    <i className="fa-regular fa-envelope custom-select-icon-left opacity-75"></i>
                                                    <input type="email" className="form-control bg-light border-primary border-opacity-25 hover-teal text-navy" value={email} onChange={(e) => handleEmailChange(index, e.target.value)} required />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-center p-3 rounded-3 border border-primary border-opacity-10" style={{ backgroundColor: 'rgba(0, 119, 182, 0.05)' }}>
                                        <p className="text-navy fw-bold m-0">{t('each_pays', 'Each person will pay')} <span className="text-accent fs-4 mx-1">{formatPrice(grandTotal / splitPayment)}</span></p>
                                        <small className="text-primary opacity-75 fw-bold">{t('invoices_tied', 'Secure payment links will be generated for each email.')}</small>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN - SUMMARY */}
                    <div className="col-lg-4">
                        <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-primary border-opacity-10 sticky-top" style={{ backgroundColor: 'var(--card-bg)', top: '100px' }}>
                            <h4 className="text-navy font-montserrat fw-bold mb-4 pb-2 border-bottom border-primary border-opacity-10">{t('price_summary', 'Price Summary')}</h4>
                            
                            {!selectedPackage ? (
                                <div className="text-center py-5 opacity-50">
                                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 border border-primary border-opacity-25" style={{ width: '80px', height: '80px' }}>
                                        <i className="fa-solid fa-file-invoice-dollar fs-1 text-primary opacity-50"></i>
                                    </div>
                                    <p className="text-grey fw-bold">{t('select_summary', 'Select a package to see summary')}</p>
                                </div>
                            ) : (
                                <div className="fade-in">
                                    <div className="mb-4 bg-light p-3 rounded-3 border border-primary border-opacity-25">
                                        <h6 className="text-navy fw-bold mb-1 fs-5">{selectedPackage}</h6>
                                        <p className="text-grey fw-bold small m-0"><i className="fa-regular fa-calendar text-accent me-2"></i> {travelDate || 'Select Date'}</p>
                                    </div>
                                    
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-grey small fw-bold">Adults (x{guests.adults})</span>
                                        <span className="fw-bold text-primary">{formatPrice(baseTotalAdults)}</span>
                                    </div>
                                    {guests.children > 0 && (
                                        <div className="d-flex justify-content-between mb-2 fade-in">
                                            <span className="text-grey small fw-bold">Children (x{guests.children})</span>
                                            <span className="fw-bold text-primary">{formatPrice(baseTotalChildren)}</span>
                                        </div>
                                    )}
                                    
                                    {accTotal > 0 && (
                                        <div className="d-flex justify-content-between mb-2 fade-in">
                                            <span className="text-grey small fw-bold">{accClass.charAt(0).toUpperCase() + accClass.slice(1)} Upgrade</span>
                                            <span className="fw-bold text-primary">{formatPrice(accTotal)}</span>
                                        </div>
                                    )}
                                    
                                    {addons.airportTransfer && (
                                        <div className="d-flex justify-content-between mb-2 fade-in">
                                            <span className="text-grey small fw-bold">Airport Transfer</span>
                                            <span className="fw-bold text-primary">{formatPrice(transferTotal)}</span>
                                        </div>
                                    )}
                                    {addons.insurance && (
                                        <div className="d-flex justify-content-between mb-2 fade-in">
                                            <span className="text-grey small fw-bold">Travel Insurance</span>
                                            <span className="fw-bold text-primary">{formatPrice(insuranceTotal)}</span>
                                        </div>
                                    )}
                                    {addons.romanticDinner && (
                                        <div className="d-flex justify-content-between mb-2 fade-in">
                                            <span className="text-grey small fw-bold">Romantic Dinner</span>
                                            <span className="fw-bold text-primary">{formatPrice(dinnerTotal)}</span>
                                    </div>
                                    )}
                                    {addons.carbonOffset && (
                                        <div className="d-flex justify-content-between mb-2 fade-in">
                                            <span className="small fw-bold text-primary">Carbon Offset</span>
                                            <span className="fw-bold text-primary">{formatPrice(carbonTotal)}</span>
                                        </div>
                                    )}
                                    
                                    <div className="d-flex justify-content-between mb-4 pb-3 border-bottom border-primary border-opacity-10 mt-2">
                                        <span className="text-grey small fw-bold">VAT (12%)</span>
                                        <span className="fw-bold text-primary">{formatPrice(vatTotal)}</span>
                                    </div>
                                    
                                    <div className="mb-4 p-3 rounded-4" style={{ backgroundColor: '#F8F9FA', border: '1px dashed #ced4da' }}>
                                        <label className="text-navy fw-bold small mb-2 d-block"><i className="fa-solid fa-tag text-accent me-2"></i>Have a Promo Code?</label>
                                        <div className="d-flex gap-2">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm text-uppercase fw-bold text-center letter-spacing-1 hover-teal" 
                                                placeholder="ENTER CODE" 
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                disabled={appliedDiscount > 0 || isApplyingPromo}
                                            />
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm px-3 fw-bold hover-coral ${appliedDiscount > 0 ? 'active-coral' : 'btn-outline-primary'}`} 
                                                onClick={handleApplyPromo}
                                                disabled={appliedDiscount > 0 || !promoCode || isApplyingPromo}
                                            >
                                                {isApplyingPromo ? <i className="fa-solid fa-spinner fa-spin"></i> : appliedDiscount > 0 ? <i className="fa-solid fa-check"></i> : 'APPLY'}
                                            </button>
                                        </div>
                                        {appliedDiscount > 0 && (
                                            <small className="fw-bold mt-2 d-block fade-in text-center text-primary">
                                                Code Applied!
                                            </small>
                                        )}
                                    </div>

                                    {/* ⚡ UNIFIED: Clean box to make the Primary Blue price pop */}
                                    <div className="p-4 rounded-4 shadow-sm position-relative overflow-hidden bg-white border border-primary">
                                        
                                        {appliedDiscount > 0 && (
                                            <div className="d-flex justify-content-between mb-2 fade-in position-relative z-1 border-bottom pb-2 mb-3">
                                                <span className="small text-grey fw-bold">Welcome Discount</span>
                                                <span className="fw-bold text-accent">-{formatPrice(discountTotal)}</span>
                                            </div>
                                        )}

                                        <div className="d-flex justify-content-between align-items-center position-relative z-1">
                                            <h6 className="fw-bold m-0 text-grey text-uppercase letter-spacing-1">{t('total', 'Total Due')}</h6>
                                            <h3 className="fw-bold m-0 font-montserrat text-primary" style={{ fontSize: '2.2rem' }}>{formatPrice(grandTotal)}</h3>
                                        </div>
                                    </div>
                                    
                                    {splitPayment > 1 && (
                                        <div className="text-center mt-3 p-2 rounded-pill border border-primary border-opacity-25 fade-in bg-light">
                                            <span className="text-navy small fw-bold"><i className="fa-solid fa-users me-1 text-accent"></i> Split {splitPayment} ways:</span>
                                            <span className="fw-bold ms-2 text-primary">{formatPrice(grandTotal / splitPayment)} <span className="small text-grey fw-normal">/ each person</span></span>
                                        </div>
                                    )}
                                    
                                    <button type="button" className="btn btn-proceed w-100 mt-4 py-3 text-uppercase font-montserrat fw-bold shadow-lg fs-6 hover-coral" onClick={handleConfirmBooking} disabled={!selectedPackage || !travelDate || isSubmitting}>
                                        {isSubmitting ? <><i className="fa-solid fa-spinner fa-spin me-2"></i> Processing...</> : <>{t('add_to_planned_trips', 'Add to My Planned Trips')} <i className="fa-solid fa-arrow-right ms-2"></i></>}
                                    </button>
                                    
                                    <div className="text-center mt-3 text-grey">
                                        <small className="fw-bold"><i className="fa-solid fa-lock me-1 text-primary"></i> Secure Encrypted Payment</small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
  );
};

export default Booking;