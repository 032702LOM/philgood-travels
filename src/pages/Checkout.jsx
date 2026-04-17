import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';
import axios from 'axios';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  
  // Retrieve the data passed from the Profile page
  const { bookingId, paymentIndex, amountDue, packageName } = location.state || {};

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
        const response = await axios.post('https://philgood-travels.onrender.com/api/bookings/paymongo/checkout', {
            bookingId,
            paymentIndex,
            method: selectedMethod, // 'card', 'gcash', or 'maya'
            amount: amountDue
        });
        
        // Redirect the user to the real PayMongo page
        window.location.href = response.data.checkoutUrl;

    } catch (error) {
        console.error(error);
        alert("Failed to initialize payment gateway. Check console for details.");
        setIsProcessing(false);
    }
  };

  return (
    <div className="fade-in" style={{ minHeight: '80vh', paddingTop: '100px', paddingBottom: '60px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="container">
        
        <div className="row justify-content-center">
          <div className="col-lg-6">
            
            <button className="btn btn-link text-navy fw-bold text-decoration-none p-0 mb-4 opacity-75" onClick={() => navigate(-1)}>
              <i className="fa-solid fa-arrow-left me-2"></i> Back to Dashboard
            </button>

            <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
              
              <div className="text-center mb-4 border-bottom border-primary border-opacity-10 pb-4">
                <h4 className="text-navy font-montserrat fw-bold mb-1">Complete Your Payment</h4>
                <p className="text-grey mb-3">{packageName}</p>
                <h1 className="text-accent font-montserrat fw-bold mb-0" style={{ fontSize: '3rem' }}>
                  {formatPrice(amountDue)}
                </h1>
              </div>

              <h6 className="text-navy font-montserrat fw-bold mb-3">Select Payment Method</h6>
              
              <div className="d-flex flex-column gap-3 mb-4">
                
                {/* DEBIT / CREDIT CARD */}
                <label className={`p-3 rounded-3 border ${selectedMethod === 'card' ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: selectedMethod === 'card' ? 'rgba(0, 180, 216, 0.1)' : 'var(--input-bg)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div className="d-flex align-items-center">
                    <input type="radio" name="paymentMethod" className="form-check-input mt-0 me-3" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} />
                    <i className="fa-solid fa-credit-card fs-4 text-primary me-3"></i>
                    <span className="text-navy fw-bold flex-grow-1">Debit / Credit Card</span>
                    <span className="badge bg-secondary opacity-50">Powered by Paymongo</span>
                  </div>
                </label>

                {/* GCASH */}
                <label className={`p-3 rounded-3 border ${selectedMethod === 'gcash' ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: selectedMethod === 'gcash' ? 'rgba(0, 180, 216, 0.1)' : 'var(--input-bg)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div className="d-flex align-items-center">
                    <input type="radio" name="paymentMethod" className="form-check-input mt-0 me-3" checked={selectedMethod === 'gcash'} onChange={() => setSelectedMethod('gcash')} />
                    <i className="fa-solid fa-wallet fs-4 text-primary me-3" style={{ color: '#0052fe' }}></i>
                    <span className="text-navy fw-bold flex-grow-1">GCash</span>
                  </div>
                </label>

                {/* MAYA */}
                <label className={`p-3 rounded-3 border ${selectedMethod === 'maya' ? 'border-primary' : 'border-primary border-opacity-25'}`} style={{ backgroundColor: selectedMethod === 'maya' ? 'rgba(0, 180, 216, 0.1)' : 'var(--input-bg)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div className="d-flex align-items-center">
                    <input type="radio" name="paymentMethod" className="form-check-input mt-0 me-3" checked={selectedMethod === 'maya'} onChange={() => setSelectedMethod('maya')} />
                    <i className="fa-solid fa-mobile-screen fs-4 text-primary me-3" style={{ color: '#1a1a1a' }}></i>
                    <span className="text-navy fw-bold flex-grow-1">Maya</span>
                  </div>
                </label>

              </div>

              <button 
                className="btn btn-proceed w-100 py-3 text-uppercase font-montserrat fw-bold shadow" 
                onClick={handlePayment}
                disabled={isProcessing || !selectedMethod}
              >
                {isProcessing ? (
                    <><i className="fa-solid fa-spinner fa-spin me-2"></i> Processing...</>
                ) : (
                    <><i className="fa-solid fa-lock me-2"></i> Secure Checkout</>
                )}
              </button>

              <div className="text-center mt-3">
                <small className="text-grey"><i className="fa-solid fa-shield-halved text-success me-1"></i> Your transaction is secure and encrypted.</small>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;