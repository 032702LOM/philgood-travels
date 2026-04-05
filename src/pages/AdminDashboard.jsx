import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePreferences } from '../context/PreferencesContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ⚡ NEW: State to handle tabs and the details modal
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(userStr);

      if (!parsedUser.isAdmin) {
        alert("🚨 Unauthorized Access. Redirecting to homepage.");
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('https://philgood-travels.onrender.com/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load admin data. Please check your backend connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

    try {
      await axios.put(`https://philgood-travels.onrender.com/api/admin/booking-status/${bookingId}`, { status: newStatus });
      
      setStats(prevStats => ({
        ...prevStats,
        allBookings: prevStats.allBookings.map(b => 
          b._id === bookingId ? { ...b, bookingStatus: newStatus } : b
        )
      }));
      
      alert(`✅ Booking marked as ${newStatus}`);
    } catch (error) {
      alert('❌ Failed to update status.');
    }
  };

  // ⚡ NEW: Delete User Function
  const handleDeleteUser = async (userId, userName) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    // Safety check: Prevent admin from deleting themselves
    if (userId === currentUser.id) {
        return alert("❌ You cannot delete your own admin account!");
    }

    if (!window.confirm(`Are you sure you want to PERMANENTLY delete the user: ${userName}?`)) return;

    try {
      await axios.delete(`https://philgood-travels.onrender.com/api/admin/user/${userId}`);
      
      setStats(prevStats => ({
        ...prevStats,
        allUsers: prevStats.allUsers.filter(u => u._id !== userId),
        totalUsers: prevStats.totalUsers - 1
      }));
      
      alert(`✅ ${userName} has been deleted.`);
    } catch (error) {
      alert('❌ Failed to delete user.');
    }
  };

  if (isLoading) {
    return (
      <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
        <h3 className="text-navy fw-bold font-montserrat"><i className="fa-solid fa-spinner fa-spin text-accent me-2"></i> Loading Dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
        <h3 className="text-danger fw-bold font-montserrat">{error}</h3>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <div className="container pb-5">
        
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="section-title wave-text mb-1" style={{ fontSize: '3rem' }}>Admin Dashboard</h1>
            <p className="text-grey fw-bold m-0">Welcome to mission control. Here is your overview.</p>
          </div>
        </div>

        {/* --- TOP SUMMARY CARDS --- */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-grey font-montserrat fw-bold text-uppercase m-0">Total Revenue</h6>
                <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                  <i className="fa-solid fa-wallet text-success fs-5"></i>
                </div>
              </div>
              <h2 className="text-navy fw-bold font-montserrat m-0">{formatPrice(stats.totalRevenue)}</h2>
              <small className="text-success fw-bold"><i className="fa-solid fa-arrow-trend-up me-1"></i> From confirmed payments</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-grey font-montserrat fw-bold text-uppercase m-0">Total Bookings</h6>
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                  <i className="fa-solid fa-suitcase-rolling text-primary fs-5"></i>
                </div>
              </div>
              <h2 className="text-navy fw-bold font-montserrat m-0">{stats.totalBookings}</h2>
              <small className="text-grey fw-bold">Trips planned</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-grey font-montserrat fw-bold text-uppercase m-0">Registered Users</h6>
                <div className="bg-warning bg-opacity-10 p-2 rounded-circle">
                  <i className="fa-solid fa-users text-warning fs-5"></i>
                </div>
              </div>
              <h2 className="text-navy fw-bold font-montserrat m-0">{stats.totalUsers}</h2>
              <small className="text-grey fw-bold">Active accounts</small>
            </div>
          </div>
        </div>

        {/* ⚡ NEW: TAB NAVIGATION ⚡ */}
        <div className="d-flex gap-3 mb-4">
            <button 
                className={`btn ${activeTab === 'bookings' ? 'btn-proceed shadow' : 'btn-outline-custom'}`} 
                onClick={() => setActiveTab('bookings')}
                style={{ borderRadius: '50px', padding: '10px 25px' }}
            >
                <i className="fa-solid fa-suitcase-rolling me-2"></i> Manage Bookings
            </button>
            <button 
                className={`btn ${activeTab === 'users' ? 'btn-proceed shadow' : 'btn-outline-custom'}`} 
                onClick={() => setActiveTab('users')}
                style={{ borderRadius: '50px', padding: '10px 25px' }}
            >
                <i className="fa-solid fa-users me-2"></i> Manage Users
            </button>
        </div>

        {/* --- DYNAMIC CONTENT AREA --- */}
        <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25" style={{ backgroundColor: 'var(--card-bg)' }}>
          
          {/* TAB 1: BOOKINGS TABLE */}
          {activeTab === 'bookings' && (
              <div className="table-responsive fade-in">
                <table className="table table-hover align-middle" style={{ color: 'var(--text-grey)' }}>
                  <thead style={{ borderBottom: '2px solid var(--primary-color)' }}>
                    <tr>
                      <th className="text-navy font-montserrat">Order ID</th>
                      <th className="text-navy font-montserrat">Client / Email</th>
                      <th className="text-navy font-montserrat">Package & Date</th>
                      <th className="text-navy font-montserrat">Status</th>
                      <th className="text-navy font-montserrat text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.allBookings.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4 text-grey fw-bold">No bookings found in the database.</td></tr>
                    ) : (
                      stats.allBookings.map(booking => (
                        <tr key={booking._id}>
                          <td className="fw-bold" style={{ fontSize: '0.85rem' }}>#{booking._id.substring(0, 8).toUpperCase()}</td>
                          
                          <td>
                            <span className="d-block fw-bold text-navy">{booking.userId?.name || 'Unknown User / Deleted'}</span>
                            <span className="small text-grey">{booking.userId?.email || 'N/A'}</span>
                          </td>
                          
                          <td>
                            <span className="d-block fw-bold text-primary-dark">{booking.packageName}</span>
                            <span className="small text-grey"><i className="fa-regular fa-calendar text-accent me-1"></i> {booking.travelDate}</span>
                          </td>
                          
                          <td>
                            {booking.bookingStatus === 'Confirmed' && <span className="badge bg-success">Confirmed</span>}
                            {booking.bookingStatus === 'Pending' && <span className="badge text-dark" style={{ backgroundColor: '#FFD166' }}>Pending</span>}
                            {booking.bookingStatus === 'Cancelled' && <span className="badge bg-danger">Cancelled</span>}
                            {booking.bookingStatus === 'Postponed' && <span className="badge bg-warning text-dark">Postponed</span>}
                          </td>
                          
                          <td className="text-end">
                            <div className="dropdown">
                              <button className="btn btn-sm btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Manage
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                <li>
                                    <button className="dropdown-item text-primary fw-bold" onClick={() => setSelectedBooking(booking)}>
                                        <i className="fa-solid fa-eye me-2"></i> View Details
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-success fw-bold" onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}><i className="fa-solid fa-check me-2"></i> Mark Confirmed</button></li>
                                <li><button className="dropdown-item text-warning fw-bold" onClick={() => handleStatusUpdate(booking._id, 'Pending')}><i className="fa-solid fa-clock-rotate-left me-2"></i> Mark Pending</button></li>
                                <li><button className="dropdown-item text-danger fw-bold" onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}><i className="fa-solid fa-ban me-2"></i> Cancel Trip</button></li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
          )}

          {/* TAB 2: USERS TABLE */}
          {activeTab === 'users' && (
              <div className="table-responsive fade-in">
                <table className="table table-hover align-middle" style={{ color: 'var(--text-grey)' }}>
                  <thead style={{ borderBottom: '2px solid var(--primary-color)' }}>
                    <tr>
                      <th className="text-navy font-montserrat">User ID</th>
                      <th className="text-navy font-montserrat">Name</th>
                      <th className="text-navy font-montserrat">Email</th>
                      <th className="text-navy font-montserrat">Role</th>
                      <th className="text-navy font-montserrat text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.allUsers.map(user => (
                        <tr key={user._id}>
                          <td className="fw-bold" style={{ fontSize: '0.85rem' }}>...{user._id.substring(18)}</td>
                          <td className="fw-bold text-navy">{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            {user.isAdmin ? (
                                <span className="badge bg-primary"><i className="fa-solid fa-shield-halved me-1"></i> Admin</span>
                            ) : (
                                <span className="badge bg-secondary">Customer</span>
                            )}
                          </td>
                          <td className="text-end">
                            <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => handleDeleteUser(user._id, user.name)}
                                title="Delete User"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          )}

        </div>

      </div>

      {/* ⚡ NEW: FULL BOOKING DETAILS MODAL ⚡ */}
      {selectedBooking && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 31, 63, 0.7)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
              <div className="modal-dialog modal-dialog-centered modal-lg"> 
                  <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px' }}>
                      
                      <div className="modal-header border-bottom border-primary border-opacity-10 pb-3" style={{ backgroundColor: 'var(--primary-dark)', color: 'white', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                          <div>
                              <h4 className="modal-title font-montserrat fw-bold mb-1">Booking Details</h4>
                              <small className="opacity-75">Order #{selectedBooking._id.toUpperCase()}</small>
                          </div>
                          <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button>
                      </div>

                      <div className="modal-body p-4 text-grey">
                          
                          {/* Top Info */}
                          <div className="row mb-4">
                              <div className="col-md-6">
                                  <h6 className="text-primary-dark fw-bold mb-1">Package:</h6>
                                  <p className="fs-5 text-navy fw-bold mb-3">{selectedBooking.packageName}</p>
                                  
                                  <h6 className="text-primary-dark fw-bold mb-1">Travel Date:</h6>
                                  <p className="mb-0"><i className="fa-regular fa-calendar text-accent me-2"></i>{selectedBooking.travelDate}</p>
                              </div>
                              <div className="col-md-6">
                                  <h6 className="text-primary-dark fw-bold mb-1">Client:</h6>
                                  <p className="mb-3">{selectedBooking.userId?.name || 'Deleted User'} ({selectedBooking.userId?.email || 'N/A'})</p>
                                  
                                  <h6 className="text-primary-dark fw-bold mb-1">Guests:</h6>
                                  <p className="mb-0">
                                      <i className="fa-solid fa-users text-accent me-2"></i>
                                      {selectedBooking.guests.adults} Adults, {selectedBooking.guests.children} Children, {selectedBooking.guests.infants} Infants
                                  </p>
                              </div>
                          </div>

                          {/* Split Payments Status */}
                          <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#F4FAFC', border: '1px solid rgba(0, 119, 182, 0.2)' }}>
                              <h6 className="text-navy font-montserrat fw-bold mb-3"><i className="fa-solid fa-file-invoice-dollar text-accent me-2"></i> Payment Tracking ({selectedBooking.paymentMethod})</h6>
                              {selectedBooking.payments.map((payment, idx) => (
                                  <div key={idx} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-primary border-opacity-10">
                                      <span>{payment.payerEmail}</span>
                                      <div>
                                          <span className="fw-bold text-navy me-3">{formatPrice(payment.amountDue)}</span>
                                          {payment.status === 'Paid' ? (
                                              <span className="badge bg-success">Paid</span>
                                          ) : (
                                              <span className="badge bg-warning text-dark">Pending</span>
                                          )}
                                      </div>
                                  </div>
                              ))}
                              <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                                  <h5 className="text-navy fw-bold m-0">Grand Total</h5>
                                  <h5 className="text-accent fw-bold m-0">{formatPrice(selectedBooking.totalPrice)}</h5>
                              </div>
                          </div>

                          {/* Add-ons and Invoice Info */}
                          {selectedBooking.invoiceDetails && (
                              <div>
                                  <h6 className="text-navy font-montserrat fw-bold mb-2">Purchased Upgrades & Add-ons:</h6>
                                  <ul className="list-unstyled mb-0 row">
                                      {selectedBooking.invoiceDetails.accClassTotal > 0 && <li className="col-md-6 mb-1"><i className="fa-solid fa-check text-success me-2"></i>{selectedBooking.invoiceDetails.accClassText}</li>}
                                      {selectedBooking.invoiceDetails.transferTotal > 0 && <li className="col-md-6 mb-1"><i className="fa-solid fa-check text-success me-2"></i>Airport Transfer</li>}
                                      {selectedBooking.invoiceDetails.insuranceTotal > 0 && <li className="col-md-6 mb-1"><i className="fa-solid fa-check text-success me-2"></i>Travel Insurance</li>}
                                      {selectedBooking.invoiceDetails.dinnerTotal > 0 && <li className="col-md-6 mb-1"><i className="fa-solid fa-check text-success me-2"></i>Romantic Dinner</li>}
                                      {selectedBooking.invoiceDetails.carbonTotal > 0 && <li className="col-md-6 mb-1"><i className="fa-solid fa-leaf text-success me-2"></i>Carbon Offset</li>}
                                  </ul>
                              </div>
                          )}

                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default AdminDashboard;