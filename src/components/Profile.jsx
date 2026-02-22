import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { usePreferences } from '../context/PreferencesContext';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { formatPrice } = usePreferences();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);

      axios.get(`https://philgood-travels.onrender.com/api/bookings/user/${parsedUser.id}`)
        .then(response => {
            setBookings(response.data);
        })
        .catch(err => console.error("Failed to fetch bookings", err));
    }

    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
        alert("✅ Payment successful! Your dashboard will update shortly.");
    }
  }, [navigate, location]);

  // ⚡ INVOICE GENERATOR ⚡
  const handleDownloadInvoice = (booking) => {
    let actualPaid = booking.payments?.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.amountDue, 0) || 0;
    const actualDue = booking.totalPrice - actualPaid;

    const invoiceWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${booking.packageName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; margin: 0; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 20px; }
          .title { font-size: 32px; font-weight: bold; letter-spacing: 2px; }
          .company { text-align: right; font-size: 14px; line-height: 1.5; color: #555; }
          .meta { display: flex; justify-content: space-between; margin-top: 30px; }
          .box { width: 48%; }
          .box h3 { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px;}
          .box p { font-size: 14px; margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 40px; }
          th { text-align: left; padding: 12px 8px; border-bottom: 1px solid #111; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;}
          td { padding: 16px 8px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; }
          .totals { width: 100%; display: flex; justify-content: flex-end; margin-top: 30px; }
          .totals-table { width: 300px; border-collapse: collapse; }
          .totals-table td { padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 14px; }
          .totals-table tr:last-child td { font-weight: bold; border-bottom: none; border-top: 2px solid #111; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">INVOICE</div>
          <div class="company"><strong>PhilGood Travels</strong><br/>Travel Street, Manila<br/>hello@philgoodtravels.com</div>
        </div>
        <div class="meta">
          <div class="box"><h3>Client Details</h3><p><strong>${user.name}</strong></p><p>${user.email}</p></div>
          <div class="box"><h3>Order Info</h3><p><strong>ORDER NO:</strong> #${booking._id.substring(0, 8).toUpperCase()}</p><p><strong>DATE:</strong> ${new Date(booking.createdAt || Date.now()).toLocaleDateString()}</p></div>
        </div>
        <table>
          <thead><tr><th>Item</th><th>Payment</th><th style="text-align: right;">Total</th></tr></thead>
          <tbody><tr><td><strong>${booking.packageName}</strong></td><td>${booking.paymentMethod}</td><td style="text-align: right;">${formatPrice(booking.totalPrice)}</td></tr></tbody>
        </table>
        <div class="totals">
          <table class="totals-table">
            <tr><td>SUB TOTAL</td><td style="text-align: right;">${formatPrice(booking.totalPrice)}</td></tr>
            <tr><td>PAID</td><td style="text-align: right;">${formatPrice(actualPaid)}</td></tr>
            <tr><td>AMOUNT DUE</td><td style="text-align: right;">${formatPrice(actualDue)}</td></tr>
          </table>
        </div>
      </body>
      </html>
    `;
    invoiceWindow.document.write(htmlContent);
    invoiceWindow.document.close();
    setTimeout(() => { invoiceWindow.print(); }, 250);
  };

  if (!user) return null; 

  return (
    <div className="fade-in" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div className="container">
        <div className="row g-4">
          
          {/* Profile Sidebar */}
          <div className="col-lg-4">
            <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-secondary border-opacity-25 text-center h-100">
              <div className="text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow" 
                style={{ width: '80px', height: '80px', fontSize: '2.5rem', backgroundColor: '#2A9D8F' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-white font-montserrat fw-bold mb-1">{user.name}</h4>
              <p className="text-white-50 mb-4">{user.email}</p>
              <hr className="border-secondary border-opacity-25" />
              <p className="text-white-50 small mb-0"><i className="fa-solid fa-shield-halved text-success me-2"></i> Secure Verified Account</p>
            </div>
          </div>

          {/* Bookings List */}
          <div className="col-lg-8">
            <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-secondary border-opacity-25 h-100">
              <h4 className="text-white font-montserrat fw-bold border-bottom border-secondary border-opacity-25 pb-3 mb-4">
                <i className="fa-solid fa-suitcase-rolling text-accent me-2"></i> My Bookings
              </h4>
              
              {bookings.length === 0 ? (
                <div className="text-center py-5 border border-secondary border-opacity-25 border-dashed rounded-3">
                  <p className="text-white-50">No bookings yet.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {bookings.map((booking) => {
                    const totalPaid = booking.payments?.reduce((acc, p) => p.status === 'Paid' ? acc + p.amountDue : acc, 0) || 0;
                    const progressPercent = Math.round((totalPaid / booking.totalPrice) * 100);

                    return (
                      <div key={booking._id} className="p-4 border border-secondary border-opacity-25 rounded-4 shadow-sm" style={{ backgroundColor: '#021625' }}>
                        
                        {/* Header & Invoice */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center gap-3">
                              <h5 className="text-white fw-bold m-0" style={{ color: '#FF8C73' }}>{booking.packageName}</h5>
                              {booking.bookingStatus === 'Confirmed' ? (
                                  <span className="badge bg-success"><i className="fa-solid fa-check me-1"></i> Fully Paid</span>
                              ) : (
                                  <span className="badge text-dark" style={{ backgroundColor: '#FFD166' }}>{progressPercent}% Collected</span>
                              )}
                          </div>
                          <button className="btn btn-sm btn-outline-light" onClick={() => handleDownloadInvoice(booking)}>
                              <i className="fa-solid fa-download me-2"></i> Invoice
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-1">
                                <span className="text-white-50 small">Group Payment Progress</span>
                                <span className="text-accent small fw-bold">{formatPrice(totalPaid)} / {formatPrice(booking.totalPrice)}</span>
                            </div>
                            <div className="progress rounded-pill" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated rounded-pill" 
                                     style={{ width: `${progressPercent}%`, backgroundColor: '#2A9D8F' }}></div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <p className="text-white-50 small mb-1"><i className="fa-regular fa-calendar text-accent me-2"></i> {booking.travelDate}</p>
                                <p className="text-white-50 small mb-0"><i className="fa-solid fa-user-group text-accent me-2"></i> {booking.guests.adults} Adults, {booking.guests.children} Children</p>
                            </div>
                            <div className="col-md-6 text-end">
                                <span className="text-white-50 small d-block">Method: {booking.paymentMethod}</span>
                                <h4 className="text-white fw-bold m-0">{formatPrice(booking.totalPrice)}</h4>
                            </div>
                        </div>
                        
                        {/* Individual Payment Links */}
                        {booking.payments && booking.payments.length > 0 && (
                          <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(42, 157, 143, 0.2)' }}>
                              <h6 className="text-white-50 mb-3" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Individual Shares</h6>
                              <div className="d-flex flex-column gap-2">
                                  {booking.payments.map((payment, index) => (
                                      <div key={index} className="d-flex justify-content-between align-items-center p-2 rounded border border-secondary border-opacity-10" style={{ backgroundColor: '#021A2E' }}>
                                          <div>
                                              <span className="text-white-50 small d-block">{payment.payerEmail}</span>
                                              <span className="text-white fw-bold">{formatPrice(payment.amountDue)}</span>
                                          </div>
                                          {payment.status === 'Paid' ? (
                                              <span className="text-success small fw-bold"><i className="fa-solid fa-circle-check me-1"></i> PAID</span>
                                          ) : (
                                              <a href={payment.paymentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm text-white shadow-sm" style={{ backgroundColor: '#2A9D8F' }}>
                                                  Pay Share <i className="fa-solid fa-arrow-up-right-from-square ms-1" style={{ fontSize: '0.6rem' }}></i>
                                              </a>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;