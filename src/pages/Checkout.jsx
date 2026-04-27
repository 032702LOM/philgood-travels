import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';
import axios from 'axios';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  
  // ⚡ 1. Pull data from location.state (if coming from Profile) OR Session Storage (if coming back from PayMongo)
  let checkoutData = location.state;
  if (!checkoutData) {
      const storedData = sessionStorage.getItem('philgoodCheckout');
      if (storedData) checkoutData = JSON.parse(storedData);
  }

  const { bookingId, paymentIndex, amountDue, packageName, invoiceDetails, splitBetween } = checkoutData || {};

  // ⚡ 2. Save the data to Session Storage so it survives the trip to PayMongo
  useEffect(() => {
      if (checkoutData && amountDue) {
          sessionStorage.setItem('philgoodCheckout', JSON.stringify(checkoutData));
      }
  }, [checkoutData, amountDue]);

  // Setup safe defaults for the invoice breakdown
  const safeInvoice = invoiceDetails || {};
  const split = splitBetween || 1;
  const splitText = split > 1 ? ` (Split ${split} ways)` : '';

  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Guardrail: If someone navigates here directly without data, send them back
  if (!amountDue) {
    return (
      <div className="fade-in d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
        <h3 className="text-navy font-montserrat fw-bold">No payment data found.</h3>
        <button className="btn btn-proceed mt-3" onClick={() => navigate('/profile')}>Return to Dashboard</button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!selectedMethod) return alert("Please select a payment method first.");
    
    setIsProcessing(true);
    
    try {
        // 🚀 LIVE CONNECTION 🚀
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/paymongo/checkout`, {
            bookingId,
            paymentIndex,
            method: selectedMethod, 
            amount: amountDue
        });
        
        // Redirect the user to the actual PayMongo portal
        if (response.data.checkoutUrl) {
            window.location.href = response.data.checkoutUrl;
        } else {
            throw new Error("No checkout URL returned");
        }

    } catch (error) {
        console.error("Payment Error:", error.response?.data || error.message);
        alert("Failed to initialize payment. Check your Render logs for details.");
        setIsProcessing(false);
    }
  };

  return (
    <div className="fade-in" style={{ minHeight: '80vh', paddingTop: '100px', paddingBottom: '60px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="container">
        
        <button className="btn btn-link text-navy fw-bold text-decoration-none p-0 mb-4 opacity-75" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left me-2"></i> Back to Dashboard
        </button>

        <div className="row g-5">
          
          {/* =========================================
              LEFT COLUMN: PAYMENT METHODS
          ========================================= */}
          <div className="col-lg-7">
            <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-lg border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
              
              <h3 className="text-navy font-montserrat fw-bold mb-4 border-bottom border-primary border-opacity-10 pb-3">
                  Select Payment Method
              </h3>
              
              <div className="d-flex flex-column gap-3 mb-5">
                
                {/* DEBIT / CREDIT CARD */}
                <label className={`p-4 rounded-4 border ${selectedMethod === 'card' ? 'border-primary shadow-sm' : 'border-primary border-opacity-25'}`} 
                       style={{ backgroundColor: selectedMethod === 'card' ? 'rgba(0, 180, 216, 0.05)' : 'var(--input-bg)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div className="d-flex align-items-center">
                    <input type="radio" name="paymentMethod" className="form-check-input mt-0 me-3" 
                           style={{ transform: 'scale(1.2)' }}
                           checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} />
                    <i className="fa-solid fa-credit-card fs-3 text-primary me-3"></i>
                    <div className="flex-grow-1">
                        <span className="text-navy fw-bold d-block" style={{ fontSize: '1.1rem' }}>Debit / Credit Card</span>
                        <span className="text-grey small">Visa, Mastercard, JCB</span>
                    </div>
                    <span className="badge bg-secondary opacity-50 ms-auto">Paymongo</span>
                  </div>
                </label>

                {/* GCASH */}
                <label className={`p-4 rounded-4 border ${selectedMethod === 'gcash' ? 'border-primary shadow-sm' : 'border-primary border-opacity-25'}`} 
                       style={{ backgroundColor: selectedMethod === 'gcash' ? 'rgba(0, 180, 216, 0.05)' : 'var(--input-bg)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div className="d-flex align-items-center">
                    <input type="radio" name="paymentMethod" className="form-check-input mt-0 me-3" 
                           style={{ transform: 'scale(1.2)' }}
                           checked={selectedMethod === 'gcash'} onChange={() => setSelectedMethod('gcash')} />
                    <i className="fa-solid fa-wallet fs-3 me-3" style={{ color: '#0052fe' }}></i>
                    <div className="flex-grow-1">
                        <span className="text-navy fw-bold d-block" style={{ fontSize: '1.1rem' }}>GCash</span>
                        <span className="text-grey small">Pay using your GCash wallet</span>
                    </div>
                  </div>
                </label>

                {/* MAYA */}
                <label className={`p-4 rounded-4 border ${selectedMethod === 'maya' ? 'border-primary shadow-sm' : 'border-primary border-opacity-25'}`} 
                       style={{ backgroundColor: selectedMethod === 'maya' ? 'rgba(0, 180, 216, 0.05)' : 'var(--input-bg)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div className="d-flex align-items-center">
                    <input type="radio" name="paymentMethod" className="form-check-input mt-0 me-3" 
                           style={{ transform: 'scale(1.2)' }}
                           checked={selectedMethod === 'maya'} onChange={() => setSelectedMethod('maya')} />
                    <i className="fa-solid fa-mobile-screen fs-3 me-3" style={{ color: '#1a1a1a' }}></i>
                    <div className="flex-grow-1">
                        <span className="text-navy fw-bold d-block" style={{ fontSize: '1.1rem' }}>Maya</span>
                        <span className="text-grey small">Pay using your Maya account</span>
                    </div>
                  </div>
                </label>

              </div>

              <button 
                className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold shadow-lg" 
                style={{ fontSize: '1.1rem' }}
                onClick={handlePayment}
                disabled={isProcessing || !selectedMethod}
              >
                {isProcessing ? (
                    <><i className="fa-solid fa-spinner fa-spin me-2"></i> Processing Securely...</>
                ) : (
                    <><i className="fa-solid fa-lock me-2"></i> Pay {formatPrice(amountDue)}</>
                )}
              </button>
              
              <div className="text-center mt-4">
                <small className="text-grey"><i className="fa-solid fa-shield-halved text-success me-1"></i> Payments are processed securely via PayMongo.</small>
              </div>

            </div>
          </div>

          {/* =========================================
              RIGHT COLUMN: ORDER DETAILS
          ========================================= */}
          <div className="col-lg-5">
            <div className="bg-card-dark p-4 p-md-5 rounded-4 shadow-sm border border-primary border-opacity-10 sticky-top" 
                 style={{ backgroundColor: 'var(--card-bg)', top: '100px' }}>
              
              <h4 className="text-navy font-montserrat fw-bold mb-4">Order Details</h4>
              
              <div className="mb-4">
                  <p className="text-grey small mb-1 text-uppercase fw-bold letter-spacing-1">Package</p>
                  <h5 className="text-primary-dark fw-bold mb-0">{packageName}</h5>
              </div>

              <div className="mb-4">
                  <p className="text-grey small mb-1 text-uppercase fw-bold letter-spacing-1">Booking Reference</p>
                  <p className="text-navy font-monospace bg-light p-2 rounded-2 border border-secondary mb-0" style={{ fontSize: '0.9rem' }}>
                      {bookingId}
                  </p>
              </div>

              <hr className="border-primary border-opacity-10 my-4" />

              {/* ITEMIZED BREAKDOWN */}
              {safeInvoice.basePriceTotal > 0 && (
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-grey small">Base Price{splitText}</span>
                    <span className="text-navy fw-bold">{formatPrice(safeInvoice.basePriceTotal / split)}</span>
                </div>
              )}
              {safeInvoice.accClassTotal > 0 && (
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-grey small">{safeInvoice.accClassText || 'Room Upgrade'}{splitText}</span>
                    <span className="text-navy fw-bold">{formatPrice(safeInvoice.accClassTotal / split)}</span>
                </div>
              )}
              {safeInvoice.transferTotal > 0 && (
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-grey small">Airport Transfer{splitText}</span>
                    <span className="text-navy fw-bold">{formatPrice(safeInvoice.transferTotal / split)}</span>
                </div>
              )}
              {safeInvoice.insuranceTotal > 0 && (
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-grey small">Travel Insurance{splitText}</span>
                    <span className="text-navy fw-bold">{formatPrice(safeInvoice.insuranceTotal / split)}</span>
                </div>
              )}
              {safeInvoice.dinnerTotal > 0 && (
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-grey small">Romantic Dinner{splitText}</span>
                    <span className="text-navy fw-bold">{formatPrice(safeInvoice.dinnerTotal / split)}</span>
                </div>
              )}
              {safeInvoice.carbonTotal > 0 && (
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-success small">Carbon Offset{splitText}</span>
                    <span className="text-success fw-bold">{formatPrice(safeInvoice.carbonTotal / split)}</span>
                </div>
              )}
              {safeInvoice.vatTotal > 0 && (
                <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-primary border-opacity-10">
                    <span className="text-grey small">VAT (12%){splitText}</span>
                    <span className="text-navy fw-bold">{formatPrice(safeInvoice.vatTotal / split)}</span>
                </div>
              )}

              {/* FALLBACK IF NO INVOICE DETAILS */}
              {Object.keys(safeInvoice).length === 0 && (
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-grey small">Subtotal</span>
                    <span className="text-navy fw-bold">{formatPrice(amountDue)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-3 mt-3">
                  <span className="text-grey small">Platform Fees</span>
                  <span className="text-success fw-bold small">Free</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                  <span className="text-navy fw-bold fs-5">Total Due</span>
                  <span className="fw-bold text-accent font-montserrat" style={{ fontSize: '2.5rem', lineHeight: '1' }}>
                      {formatPrice(amountDue)}
                  </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;