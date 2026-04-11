import React from 'react';

const Terms = () => {
  return (
    <div className="fade-in" style={{ minHeight: '80vh', paddingTop: '100px', paddingBottom: '60px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="bg-card-dark p-5 rounded-4 shadow-lg border border-primary border-opacity-10" style={{ backgroundColor: 'var(--card-bg)' }}>
          
          <div className="text-center mb-5">
            <img 
              src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" 
              alt="PhilGood Travels Logo" 
              style={{ height: '60px', width: 'auto', marginBottom: '1rem' }} 
            />
            <h1 className="text-navy font-montserrat fw-bold text-uppercase">Terms and Conditions</h1>
            <p className="text-grey">Last Updated: April 11, 2026</p>
          </div>

          <div className="text-grey" style={{ lineHeight: '1.8' }}>
            {/* ⚡ FIX: Changed text-white to text-navy for all headers below ⚡ */}
            <h4 className="text-navy font-montserrat fw-bold mt-4 mb-3">1. Account Registration and Security</h4>
            <ul className="mb-4">
              <li><strong>Account Creation:</strong> To book a trip, you must register for an account. You agree to provide accurate, current, and complete information.</li>
              <li><strong>Email Verification:</strong> For security purposes, your account will remain inactive until you verify your email address.</li>
              <li><strong>Account Security:</strong> You are responsible for safeguarding your password. We utilize secure, cryptographically hashed passwords and time-sensitive recovery tokens to protect your data.</li>
            </ul>

            <h4 className="text-navy font-montserrat fw-bold mt-4 mb-3">2. Booking and Payments</h4>
            <ul className="mb-4">
              <li><strong>Dynamic Pricing:</strong> Prices are dynamically calculated based on guest tiers, accommodation class, and selected add-ons. All totals include a mandatory 12% Value Added Tax (VAT).</li>
              <li><strong>Carbon Offset:</strong> Users have the option to add a voluntary monetary offset to their total based on our dynamic CO2 emissions calculator.</li>
              <li><strong>Split Payments:</strong> For group bookings, our platform allows the total cost to be divided. The system will generate secure, individual Stripe checkout links for each member.</li>
            </ul>

            <h4 className="text-navy font-montserrat fw-bold mt-4 mb-3">3. Cancellations, Postponements, and Refunds</h4>
            <ul className="mb-4">
              <li><strong>The 48-Hour Rule:</strong> You may not cancel, postpone, or modify a booking if your scheduled travel date is less than 48 hours away.</li>
              <li><strong>Postponement Limits:</strong> You are allowed a maximum of two (2) postponements per booking.</li>
              <li><strong>Rebooking Window:</strong> If you cancel a trip, you must rebook within one (1) month of the original cancellation date.</li>
            </ul>

            <h4 className="text-navy font-montserrat fw-bold mt-4 mb-3">4. User Conduct</h4>
            <p className="mb-4">
              Our real-time Live Chat widget is provided for customer support. You agree not to use the chat to transmit any abusive, harassing, or malicious content. We reserve the right to terminate chat sessions or suspend accounts that violate this policy.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Terms;