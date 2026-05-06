import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { usePreferences } from '../context/PreferencesContext';
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { formatPrice } = usePreferences();
  
  const { user, loading: authLoading } = useAuth(); 
  
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [activeTab, setActiveTab] = useState('planned'); 
  // ⚡ NEW: State for the sub-tabs under 'My Planned Trips'
  const [paymentFilter, setPaymentFilter] = useState('All');

  useEffect(() => {
    if (authLoading) return; 

    if (!user) {
      navigate('/login'); 
      return;
    }

    axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/user/${user.id || user._id}`)
      .then(response => {
          setBookings(response.data);
          setLoadingBookings(false);
      })
      .catch(err => {
          console.error("Failed to fetch bookings", err);
          setLoadingBookings(false);
          toast.error("Failed to load your bookings.");
      });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
        setTimeout(() => { toast.success("Payment successful! Your dashboard will update shortly."); }, 500);
        window.history.replaceState(null, '', window.location.pathname);
    }
  }, [location]);

  const canModify = (travelDate) => {
      const tripDate = new Date(travelDate);
      const today = new Date();
      return (tripDate.getTime() - today.getTime()) / (1000 * 3600 * 24) >= 2;
  };

  const isWithinRebookWindow = (cancelledAt) => {
      if (!cancelledAt) return true;
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(cancelledAt) > oneMonthAgo;
  };

  const handleArchive = async (bookingId) => {
    if (window.confirm("Move this trip to your Archives?")) {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/archive`);
            setBookings(prev => prev.map(b => b._id === bookingId ? response.data.booking : b));
            toast.success("Trip moved to Archives!");
        } catch (error) {
            toast.error("Failed to archive booking.");
        }
    }
  };

  const handleRetrieve = async (bookingId) => {
      try {
          const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/retrieve`);
          setBookings(prev => prev.map(b => b._id === bookingId ? response.data.booking : b));
          toast.success("Trip retrieved successfully!");
      } catch (error) {
          toast.error("Failed to retrieve booking.");
      }
  };

  const handleDelete = async (bookingId) => {
      if (window.confirm("PERMANENTLY delete this record? This cannot be undone.")) {
          try {
              await axios.delete(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`);
              setBookings(prev => prev.filter(b => b._id !== bookingId));
              toast.success("Record permanently deleted.");
          } catch (error) {
              toast.error("Failed to delete booking.");
          }
      }
  };

  const handleCancel = async (bookingId, travelDate) => {
      if (!canModify(travelDate)) return toast.error("Sorry, you can only cancel at least 2 days before your trip.");
      if (window.confirm("Are you sure you want to cancel this trip?")) {
          try {
              const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/cancel/${bookingId}`);
              setBookings(prev => prev.map(b => b._id === bookingId ? response.data.booking : b));
              toast.success("Trip cancelled successfully.");
          } catch (error) { toast.error(error.response?.data?.error || "Failed to cancel."); }
      }
  };

  const handlePostpone = async (bookingId, travelDate) => {
      if (!canModify(travelDate)) return toast.error("Sorry, you can only postpone at least 2 days before your trip.");
      const newDate = window.prompt("Enter your new travel date (YYYY-MM-DD):");
      if (newDate) {
          if (window.confirm(`Are you sure you want to move your trip to ${newDate}?`)) {
              try {
                  const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/postpone/${bookingId}`, { newDate });
                  setBookings(prev => prev.map(b => b._id === bookingId ? response.data.booking : b));
                  toast.success("Trip postponed successfully.");
              } catch (error) { toast.error(error.response?.data?.error || "Failed to postpone."); }
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
                  toast.success("Trip rebooked successfully!");
              } catch (error) { toast.error(error.response?.data?.error || "Failed to rebook."); }
          }
      }
  };

  const handleDownloadInvoice = (booking) => {
      try {
          const doc = new jsPDF();
          
          const safeInvoice = booking.invoiceDetails || {};

          doc.setFontSize(22);
          doc.setTextColor(0, 59, 92); 
          doc.text("PHILGOOD TRAVELS", 105, 20, { align: "center" });
          
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text("123 Travel Street, Bonifacio Global City, Taguig", 105, 28, { align: "center" });
          doc.text("hello@philgoodtravels.com | +63 917 123 4567", 105, 34, { align: "center" });

          doc.setDrawColor(0, 180, 216);
          doc.setLineWidth(0.5);
          doc.line(14, 40, 196, 40);

          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.text("INVOICE", 14, 52);

          doc.setFontSize(10);
          doc.text(`Booking Ref: #${booking._id.substring(0, 8).toUpperCase()}`, 14, 60);
          doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 14, 66);
          doc.text(`Status: ${booking.bookingStatus}`, 14, 72);

          doc.text("Billed To:", 130, 52);
          doc.setFont(undefined, 'bold');
          doc.text(`${booking.contactInfo?.name || booking.userId?.name || 'Customer'}`, 130, 58);
          doc.setFont(undefined, 'normal');
          doc.text(`${booking.contactInfo?.email || booking.userId?.email || 'N/A'}`, 130, 64);
          if (booking.contactInfo?.phone) {
              doc.text(`${booking.contactInfo.phone}`, 130, 70);
          }

          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("Trip Details", 14, 88);
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          doc.text(`Destination: ${booking.packageName}`, 14, 96);
          doc.text(`Travel Date: ${booking.travelDate}`, 14, 102);
          doc.text(`Guests: ${booking.guests?.adults || 0} Adults, ${booking.guests?.children || 0} Children, ${booking.guests?.infants || 0} Infants`, 14, 108);

          const tableData = [];
          const split = booking.splitBetween || 1;
          const splitText = split > 1 ? ` (Split ${split} ways)` : '';

          if (safeInvoice.basePriceTotal > 0) tableData.push([`Base Price${splitText}`, formatPrice(safeInvoice.basePriceTotal / split)]);
          if (safeInvoice.accClassTotal > 0) tableData.push([`${safeInvoice.accClassText || 'Room Upgrade'}${splitText}`, formatPrice(safeInvoice.accClassTotal / split)]);
          if (safeInvoice.transferTotal > 0) tableData.push([`Airport Transfer${splitText}`, formatPrice(safeInvoice.transferTotal / split)]);
          if (safeInvoice.insuranceTotal > 0) tableData.push([`Travel Insurance${splitText}`, formatPrice(safeInvoice.insuranceTotal / split)]);
          if (safeInvoice.dinnerTotal > 0) tableData.push([`Romantic Dinner${splitText}`, formatPrice(safeInvoice.dinnerTotal / split)]);
          if (safeInvoice.carbonTotal > 0) tableData.push([`Carbon Offset${splitText}`, formatPrice(safeInvoice.carbonTotal / split)]);
          if (safeInvoice.vatTotal > 0) tableData.push([`VAT (12%)${splitText}`, formatPrice(safeInvoice.vatTotal / split)]);
          if (safeInvoice.discountTotal < 0) tableData.push([`Welcome Discount (10%)${splitText}`, formatPrice(safeInvoice.discountTotal / split)]);

          if (tableData.length === 0) {
              tableData.push([`Package Price`, formatPrice(booking.totalPrice / split)]);
          }

          autoTable(doc, {
              startY: 120,
              head: [['Description', 'Amount']],
              body: tableData,
              theme: 'striped',
              headStyles: { fillColor: [0, 180, 216], textColor: 255, fontStyle: 'bold' },
              columnStyles: { 1: { halign: 'right' } },
              margin: { top: 10, left: 14, right: 14 }
          });

          const finalY = doc.lastAutoTable.finalY + 10;
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("Grand Total:", 130, finalY);
          doc.text(formatPrice(booking.totalPrice / split), 196, finalY, { align: "right" });

          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text("Payment Tracking:", 14, finalY + 15);
          
          const paymentData = (booking.payments || []).map(p => [
              p.payerEmail, 
              formatPrice(p.amountDue), 
              p.status
          ]);

          autoTable(doc, {
              startY: finalY + 20,
              head: [['Payer Email', 'Amount Due', 'Status']],
              body: paymentData,
              theme: 'plain',
              headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
              columnStyles: { 1: { halign: 'right' }, 2: { halign: 'center' } },
              margin: { left: 14, right: 14 }
          });

          const footerY = doc.lastAutoTable.finalY + 20;
          doc.setFontSize(9);
          doc.setTextColor(150);
          doc.text("Thank you for choosing PhilGood Travels!", 105, footerY, { align: "center" });
          doc.text("This is a computer-generated document. No signature is required.", 105, footerY + 6, { align: "center" });

          doc.save(`PhilGood_Invoice_${booking._id.substring(0, 8)}.pdf`);
      } catch (error) {
          console.error("Invoice Generation Error:", error);
          toast.error("Failed to generate invoice. Please try again.");
      }
  };

  if (authLoading || loadingBookings) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading Profile...</span></div>
      </div>
    );
  }

  if (!user) return null;

  // ⚡ UPDATED: Filter logic to handle both Main Tabs and Sub Tabs
  const displayedBookings = bookings.filter(b => {
      // 1. If we are viewing Archives, only show archived bookings (ignore payment filters)
      if (activeTab === 'archives') return b.isArchived;

      // 2. If we are viewing Planned Trips, hide archived bookings
      if (b.isArchived) return false;

      // 3. If "All" is selected, show everything planned
      if (paymentFilter === 'All') return true;

      // 4. Calculate the specific payment status for this booking
      const totalPaid = b.payments?.reduce((acc, p) => p.status === 'Paid' ? acc + p.amountDue : acc, 0) || 0;
      let statusStr = 'Unpaid';
      
      if (totalPaid >= (b.totalPrice || 1) || b.bookingStatus === 'Confirmed') {
          statusStr = 'Fully Paid';
      } else if (totalPaid > 0) {
          statusStr = 'Partially Paid';
      }

      // 5. Match against the selected sub-tab
      return statusStr === paymentFilter;
  });

  return (
    <div className="fade-in" style={{ paddingTop: '100px', minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="row g-4">
          
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

          <div className="col-lg-8">
            <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-10 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
              
              {/* MAIN TABS */}
              <div className="d-flex gap-3 mb-4 border-bottom border-primary border-opacity-10 pb-3">
                  <button 
                      className={`btn fw-bold font-montserrat ${activeTab === 'planned' ? 'btn-proceed shadow-sm' : 'btn-outline-custom border-0'}`}
                      onClick={() => { setActiveTab('planned'); setPaymentFilter('All'); }}
                  >
                      <i className="fa-solid fa-suitcase-rolling me-2"></i> My Planned Trips
                  </button>
                  <button 
                      className={`btn fw-bold font-montserrat ${activeTab === 'archives' ? 'btn-proceed shadow-sm' : 'btn-outline-custom border-0'}`}
                      onClick={() => setActiveTab('archives')}
                  >
                      <i className="fa-solid fa-box-archive me-2"></i> Archives
                  </button>
              </div>

              {/* ⚡ NEW: PAYMENT STATUS SUB-TABS (Only visible on Planned Trips) */}
              {activeTab === 'planned' && (
                  <div className="d-flex flex-wrap gap-2 mb-4 fade-in">
                      {['All', 'Fully Paid', 'Partially Paid', 'Unpaid'].map(tab => (
                          <button 
                              key={tab}
                              className={`btn btn-sm rounded-pill fw-bold px-3 ${paymentFilter === tab ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted border border-secondary border-opacity-25'}`}
                              onClick={() => setPaymentFilter(tab)}
                              style={{ transition: 'all 0.2s ease' }}
                          >
                              {tab}
                          </button>
                      ))}
                  </div>
              )}
              
              {displayedBookings.length === 0 ? (
                <div className="text-center py-5 border border-primary border-opacity-25 border-dashed rounded-3 mt-4">
                  <p className="text-grey mb-0">
                      {activeTab === 'planned' 
                          ? paymentFilter === 'All' ? 'No planned trips yet.' : `You have no ${paymentFilter.toLowerCase()} trips.` 
                          : 'Your archives are empty.'}
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {displayedBookings.map((booking) => {
                    const totalPaid = booking.payments?.reduce((acc, p) => p.status === 'Paid' ? acc + p.amountDue : acc, 0) || 0;
                    const progressPercent = Math.round((totalPaid / (booking.totalPrice || 1)) * 100);
                    const postponeCount = booking.postponeCount || 0;

                    return (
                      <div key={booking._id} className={`p-4 border border-primary border-opacity-10 rounded-4 shadow-sm ${booking.isArchived ? 'opacity-75' : ''}`} style={{ backgroundColor: '#F4FAFC' }}>
                        
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
                          
                          {!booking.isArchived && booking.bookingStatus !== 'Cancelled' && (
                              <button className="btn btn-sm btn-outline-custom" onClick={() => handleDownloadInvoice(booking)}>
                                  <i className="fa-solid fa-file-pdf me-1"></i> Invoice
                              </button>
                          )}
                        </div>

                        {!booking.isArchived && booking.bookingStatus !== 'Cancelled' && (
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
                        
                        {!booking.isArchived && booking.bookingStatus !== 'Cancelled' && booking.payments && booking.payments.length > 0 && (
                          <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(0, 119, 182, 0.1)' }}>
                              <p className="text-navy fw-bold small mb-2"><i className="fa-solid fa-link text-accent me-2"></i> Payment Links:</p>
                              {booking.payments.map((payment, idx) => (
                                  <div key={idx} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-primary border-opacity-10 last-child-no-border">
                                      <span className="text-grey small">{payment.payerEmail}</span>
                                      <div className="d-flex align-items-center gap-3">
                                          <span className="fw-bold text-navy">{formatPrice(payment.amountDue)}</span>
                                          {payment.status === 'Paid' ? (
                                              <span className="badge bg-success"><i className="fa-solid fa-check me-1"></i> Paid</span>
                                          ) : (
                                              <button 
                                                  className="btn btn-sm btn-proceed px-3"
                                                  onClick={() => navigate('/checkout', { 
                                                      state: { 
                                                          bookingId: booking._id, 
                                                          paymentIndex: idx, 
                                                          amountDue: payment.amountDue,
                                                          packageName: booking.packageName,
                                                          invoiceDetails: booking.invoiceDetails,
                                                          splitBetween: booking.splitBetween
                                                      } 
                                                  })}
                                              >
                                                  Pay Now
                                              </button>
                                          )}
                                      </div>
                                  </div>
                              ))}
                          </div>
                        )}

                        <div className="d-flex flex-wrap justify-content-end gap-2 mt-4 pt-3 border-top border-primary border-opacity-10">
                            {booking.isArchived ? (
                                <>
                                    <button className="btn btn-sm btn-success fw-bold px-4" onClick={() => handleRetrieve(booking._id)}>
                                        <i className="fa-solid fa-rotate-left me-2"></i> Retrieve
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(booking._id)}>
                                        <i className="fa-solid fa-trash me-2"></i> Permanent Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    {booking.bookingStatus === 'Cancelled' && isWithinRebookWindow(booking.cancelledAt) && (
                                        <button className="btn btn-sm btn-outline-success" onClick={() => handleRebook(booking._id)}>Rebook</button>
                                    )}
                                    {canModify(booking.travelDate) && booking.bookingStatus !== 'Cancelled' && postponeCount < 2 && (
                                        <button className="btn btn-sm btn-outline-warning" onClick={() => handlePostpone(booking._id, booking.travelDate)}>Postpone</button>
                                    )}
                                    {canModify(booking.travelDate) && booking.bookingStatus !== 'Cancelled' && (
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(booking._id, booking.travelDate)}>Cancel Trip</button>
                                    )}
                                    <button className="btn btn-sm btn-danger px-3" onClick={() => handleArchive(booking._id)}>
                                        <i className="fa-solid fa-box-archive me-1"></i> Archive
                                    </button>
                                </>
                            )}
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