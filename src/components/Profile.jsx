import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { usePreferences } from '../context/PreferencesContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { formatPrice } = usePreferences();
  
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        // Fixed the 'aaxios' typo here ⚡
        axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/user/${parsedUser.id || parsedUser._id}`)
          .then(response => {
              setBookings(response.data);
              setLoading(false);
          })
          .catch(err => {
              console.error("Failed to fetch bookings", err);
              setLoading(false);
          });
      } catch (error) {
        console.error("Auth error", error);
        navigate('/login');
      }
    }

    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
        setTimeout(() => {
            toast.success("Payment successful! Your dashboard will update shortly.");
        }, 500);
        window.history.replaceState(null, '', window.location.pathname);
    }
  }, [navigate, location]);

  const canModify = (travelDate) => {
      const tripDate = new Date(travelDate);
      const today = new Date();
      const diffTime = tripDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays >= 2;
  };

  const isWithinRebookWindow = (cancelledAt) => {
      if (!cancelledAt) return true;
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(cancelledAt) > oneMonthAgo;
  };

  const handleDelete = async (bookingId) => {
      if (window.confirm("Are you sure you want to permanently delete this booking?")) {
          try {
              await axios.delete(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`);
              setBookings(prev => prev.filter(b => b._id !== bookingId));
              toast.success("Booking deleted!");
          } catch (error) {
              toast.error("Failed to delete booking.");
          }
      }
  };

  const handleCancel = async (bookingId, travelDate) => {
      if (!canModify(travelDate)) {
         return toast.error("Sorry, you can only cancel at least 2 days before your trip.");
      }
      if (window.confirm("Are you sure you want to cancel this trip?")) {
          try {
              const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/cancel/${bookingId}`);
              setBookings(prev => prev.map(b => b._id === bookingId ? response.data.booking : b));
              toast.success("Trip cancelled successfully.");
          } catch (error) {
              toast.error(error.response?.data?.error || "Failed to cancel.");
          }
      }
  };

  const handlePostpone = async (bookingId, travelDate) => {
      if (!canModify(travelDate)) {
          return alert("Sorry, you can only postpone at least 2 days before your trip.");
      }
      const newDate = window.prompt("Enter your new travel date (YYYY-MM-DD):");
      if (newDate) {
          if (window.confirm(`Are you sure you want to move your trip to ${newDate}?`)) {
              try {
                  const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/postpone/${bookingId}`, { newDate });
                  setBookings(prev => prev.map(b => b._id === bookingId ? response.data.booking : b));
                  alert("Trip postponed successfully.");
              } catch (error) {
                  alert(error.response?.data?.error || "Failed to postpone.");
              }
          }
      }
  };

  const handleRebook = async (bookingId) => {
      const newDate = window.prompt("Enter your new travel date (YYYY-MM-DD):");
      if (newDate) {
          if (window.confirm(`Are you sure you want to rebook this trip to ${newDate}?`)) {
              try {
                  const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/rebook/${bookingId}`, { newDate });
                  setBookings(prev => prev.map(b => b._id === bookingId ? response.data.booking : b));
                  alert("Trip rebooked successfully!");
              } catch (error) {
                  alert(error.response?.data?.error || "Failed to rebook.");
              }
          }
      }
  };

  const handleDownloadInvoice = (booking) => {
    let actualPaid = booking.payments?.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.amountDue, 0) || 0;
    const actualDue = booking.totalPrice - actualPaid;
    const inv = booking.invoiceDetails || {};

    let itemizedRows = `<tr><td><strong>Base Price</strong></td><td></td><td style="text-align: right;">${formatPrice(inv.basePriceTotal || booking.totalPrice)}</td></tr>`;
    
    if (inv.accClassTotal) itemizedRows += `<tr><td>${inv.accClassText || 'Room Upgrade'}</td><td></td><td style="text-align: right;">${formatPrice(inv.accClassTotal)}</td></tr>`;
    if (inv.transferTotal) itemizedRows += `<tr><td>Airport Transfer</td><td></td><td style="text-align: right;">${formatPrice(inv.transferTotal)}</td></tr>`;
    if (inv.insuranceTotal) itemizedRows += `<tr><td>Travel Insurance</td><td></td><td style="text-align: right;">${formatPrice(inv.insuranceTotal)}</td></tr>`;
    if (inv.dinnerTotal) itemizedRows += `<tr><td>Romantic Dinner</td><td></td><td style="text-align: right;">${formatPrice(inv.dinnerTotal)}</td></tr>`;
    if (inv.carbonTotal) itemizedRows += `<tr><td>Carbon Offset</td><td></td><td style="text-align: right;">${formatPrice(inv.carbonTotal)}</td></tr>`;
    if (inv.vatTotal) itemizedRows += `<tr><td>VAT (12%)</td><td></td><td style="text-align: right;">${formatPrice(inv.vatTotal)}</td></tr>`;

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
          <div class="box"><h3>Client Details</h3><p><strong>${user?.name}</strong></p><p>${user?.email}</p></div>
          <div class="box"><h3>Order Info</h3><p><strong>PACKAGE:</strong> ${booking.packageName}</p><p><strong>ORDER NO:</strong> #${booking._id.substring(0, 8).toUpperCase()}</p><p><strong>DATE:</strong> ${new Date(booking.createdAt || Date.now()).toLocaleDateString()}</p></div>
        </div>
        <table>
          <thead><tr><th>Item</th><th>Status</th><th style="text-align: right;">Cost</th></tr></thead>
          <tbody>${itemizedRows}</tbody>
        </table>
        <div class="totals">
          <table class="totals-table">
            <tr><td>GRAND TOTAL</td><td style="text-align: right;">${formatPrice(booking.totalPrice)}</td></tr>
            <tr><td>PAID TO DATE</td><td style="text-align: right;">${formatPrice(actualPaid)}</td></tr>
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Profile...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="fade-in" style={{ paddingTop: '100px', minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="row g-4">
          
          {/* Profile Sidebar */}
          <div className="col-lg-4">
            <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-10 text-center h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow" 
                style={{ width: '80px', height: '80px', fontSize: '2.5rem', backgroundColor: 'var(--primary-color)' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-navy font-montserrat fw-bold mb-1">{user.name}</h4>
              <p className="text-grey mb-4">{user.email}</p>
              <hr className="border-primary border-opacity-10" />
              <p className="text-grey small mb-0"><i className="fa-solid fa-shield-halved text-success me-2"></i> Secure Verified Account</p>
            </div>
          </div>

          {/* Bookings List */}
          <div className="col-lg-8">
            <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-10 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
              <h4 className="text-navy font-montserrat fw-bold border-bottom border-primary border-opacity-10 pb-3 mb-4">
                <i className="fa-solid fa-suitcase-rolling text-accent me-2"></i> My Bookings
              </h4>
              
              {bookings.length === 0 ? (
                <div className="text-center py-5 border border-primary border-opacity-25 border-dashed rounded-3">
                  <p className="text-grey mb-0">No bookings yet.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {bookings.map((booking) => {
                    const totalPaid = booking.payments?.reduce((acc, p) => p.status === 'Paid' ? acc + p.amountDue : acc, 0) || 0;
                    const progressPercent = Math.round((totalPaid / (booking.totalPrice || 1)) * 100);
                    const postponeCount = booking.postponeCount || 0;

                    return (
                      <div key={booking._id} className="p-4 border border-primary border-opacity-10 rounded-4 shadow-sm" style={{ backgroundColor: '#F4FAFC' }}>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center gap-3 flex-wrap">
                              <h5 className="fw-bold m-0" style={{ color: 'var(--accent-color)' }}>{booking.packageName}</h5>
                              
                              {booking.bookingStatus === 'Cancelled' ? (
                                  <span className="badge bg-danger">Cancelled</span>
                              ) : booking.bookingStatus === 'Postponed' ? (
                                  <span className="badge bg-warning text-dark">Postponed ({postponeCount}/2)</span>
                              ) : booking.bookingStatus === 'Confirmed' ? (
                                  <span className="badge bg-success">Fully Paid</span>
                              ) : (
                                  <span className="badge text-dark" style={{ backgroundColor: '#FFD166' }}>{progressPercent}% Collected</span>
                              )}
                          </div>
                          
                          {booking.bookingStatus !== 'Cancelled' && (
                              <button className="btn btn-sm btn-outline-custom" onClick={() => handleDownloadInvoice(booking)}>
                                  Invoice
                              </button>
                          )}
                        </div>

                        {booking.bookingStatus !== 'Cancelled' && (
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-grey small">Group Payment Progress</span>
                                    <span className="text-accent small fw-bold">{formatPrice(totalPaid)} / {formatPrice(booking.totalPrice)}</span>
                                </div>
                                <div className="progress rounded-pill" style={{ height: '8px', backgroundColor: 'rgba(0, 119, 182, 0.1)' }}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated rounded-pill" 
                                         style={{ width: `${progressPercent}%`, backgroundColor: 'var(--primary-color)' }}></div>
                                </div>
                            </div>
                        )}

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <p className="text-grey small mb-1"><i className="fa-regular fa-calendar text-accent me-2"></i> {booking.travelDate}</p>
                                <p className="text-grey small mb-0"><i className="fa-solid fa-user-group text-accent me-2"></i> {booking.guests?.adults || 0} Adults, {booking.guests?.children || 0} Children</p>
                            </div>
                            <div className="col-md-6 text-md-end mt-2 mt-md-0">
                                <span className="text-grey small d-block">Total Cost</span>
                                <h4 className="text-navy fw-bold m-0" style={{ textDecoration: booking.bookingStatus === 'Cancelled' ? 'line-through' : 'none' }}>
                                    {formatPrice(booking.totalPrice)}
                                </h4>
                            </div>
                        </div>
                        
                        {booking.bookingStatus !== 'Cancelled' && booking.payments && booking.payments.length > 0 && (
                          <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(0, 119, 182, 0.1)' }}>
                              <h6 className="text-grey mb-3" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Payment Links</h6>
                              <div className="d-flex flex-column gap-2">
                                  {booking.payments.map((payment, index) => (
                                      <div key={index} className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-3 rounded-3 border border-primary border-opacity-10 gap-3" style={{ backgroundColor: '#ffffff' }}>
                                          <div>
                                              <span className="text-grey small d-block mb-1">{payment.payerEmail}</span>
                                              <span className="text-navy fw-bold fs-5">{formatPrice(payment.amountDue)}</span>
                                          </div>
                                          {payment.status === 'Paid' ? (
                                              <span className="badge bg-success py-2 px-3 fw-bold fs-6">PAID</span>
                                          ) : (
                                            <button onClick={() => window.location.href = payment.paymentUrl} className="btn btn-proceed fw-bold py-2 px-4 shadow">Pay Share</button>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>
                        )}

                        <div className="d-flex flex-wrap justify-content-end gap-2 mt-4 pt-3 border-top border-primary border-opacity-10">
                            {booking.bookingStatus === 'Cancelled' && isWithinRebookWindow(booking.cancelledAt) && (
                                <button className="btn btn-sm btn-outline-success" onClick={() => handleRebook(booking._id)}>Rebook</button>
                            )}
                            {canModify(booking.travelDate) && booking.bookingStatus !== 'Cancelled' && postponeCount < 2 && (
                                <button className="btn btn-sm btn-outline-warning" onClick={() => handlePostpone(booking._id, booking.travelDate)}>Postpone</button>
                            )}
                            {canModify(booking.travelDate) && booking.bookingStatus !== 'Cancelled' && (
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(booking._id, booking.travelDate)}>Cancel Trip</button>
                            )}
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(booking._id)}>Delete Record</button>
                        </div>
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