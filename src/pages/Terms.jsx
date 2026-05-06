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
            <p className="text-grey">Last Updated: May 6, 2026</p>
          </div>

          <div className="text-grey" style={{ lineHeight: '1.8' }}>
            <h4 className="text-navy font-montserrat fw-bold mt-4 mb-3">1. Account Registration and Security</h4>
            <ul className="mb-4">
              <li><strong>Account Creation:</strong> To book a trip, you must register for an account. You agree to provide accurate, current, and complete information, including a valid international phone number.</li>
              <li><strong>Email Verification:</strong> For security purposes, your account will remain inactive until you verify your email address.</li>
              <li><strong>Account Security:</strong> You are responsible for safeguarding your password. We utilize secure, cryptographically hashed passwords and time-sensitive recovery tokens to protect your data.</li>
            </ul>

            <h4 className="text-navy font-montserrat fw-bold mt-4 mb-3">2. Booking, Pricing, and Promotions</h4>
            <ul className="mb-4">
              <li><strong>Guest Tiers:</strong> Prices are calculated dynamically. Children (ages 2-11) receive a 50% discount on base fares and accommodation upgrades. Infants (under 2 years old) travel for free but may not be provided with dedicated seating or beds.</li>
              <li><strong>Add-ons and Extras:</strong> Add-ons are priced differently depending on the service:
                <ul>
                  <li><em>Per Passenger:</em> Services like Travel Insurance and Carbon Offsets are charged per individual (excluding infants).</li>
                  <li><em>Flat Rate:</em> Services such as Airport Transfers (per vehicle) and Romantic Dinner Setups are charged as a single flat rate, regardless of guest count.</li>
                </ul>
              </li>
              <li><strong>Promo Codes & Discounts:</strong> Promo codes are restricted to <strong>one-time use per customer email address</strong>. 
                <ul>
                  <li><em>Welcome Discount:</em> New subscribers receive a unique, single-use 10% discount code applicable to their first booking.</li>
                  <li><em>Campaign Codes:</em> Codes associated with specific campaigns (e.g., PALAWAN30) are strictly validated by our servers and may only be applied to qualifying destination packages.</li>
                </ul>
              </li>
              <li><strong>Split Payments:</strong> For group bookings, our platform allows the total cost to be divided evenly. The system will generate secure, individual PayMongo checkout links for each member. A trip is only considered "Confirmed" once all split shares are marked as "Paid."</li>
              <li><strong>Taxes:</strong> All totals include a mandatory 12% Value Added Tax (VAT).</li>
            </ul>

            <h4 className="text-navy font-montserrat fw-bold mt-4 mb-3">3. Cancellations, Postponements, and Refunds</h4>
            <ul className="mb-4">
              <li><strong>The 48-Hour Rule:</strong> You may not cancel, postpone, or modify a booking if your scheduled travel date is less than 48 hours away.</li>
              <li><strong>Postponement Limits:</strong> You are allowed a maximum of two (2) postponements per booking.</li>
              <li><strong>Rebooking Window:</strong> If you cancel a trip, you must rebook within one (1) month of the original cancellation date. Failure to do so will result in the forfeiture of any payments made.</li>
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