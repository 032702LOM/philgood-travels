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

  // Fetch all admin data on load
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      // ⚡ SECURITY CHECK 1: Are they logged in?
      if (!token || !userStr) {
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(userStr);

      // ⚡ SECURITY CHECK 2: Are they an Admin? (The Bouncer)
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

        {/* --- BOOKINGS MANAGEMENT TABLE --- */}
        <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h4 className="text-navy font-montserrat fw-bold mb-4">
            <i className="fa-solid fa-table-list text-accent me-2"></i> Recent Bookings
          </h4>
          
          <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ color: 'var(--text-grey)' }}>
              <thead style={{ borderBottom: '2px solid var(--primary-color)' }}>
                <tr>
                  <th className="text-navy font-montserrat">Order ID</th>
                  <th className="text-navy font-montserrat">Client / Email</th>
                  <th className="text-navy font-montserrat">Package & Date</th>
                  <th className="text-navy font-montserrat">Total Price</th>
                  <th className="text-navy font-montserrat">Status</th>
                  <th className="text-navy font-montserrat text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.allBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-grey fw-bold">No bookings found in the database.</td>
                  </tr>
                ) : (
                  stats.allBookings.map(booking => (
                    <tr key={booking._id}>
                      <td className="fw-bold" style={{ fontSize: '0.85rem' }}>#{booking._id.substring(0, 8).toUpperCase()}</td>
                      
                      <td>
                        <span className="d-block fw-bold text-navy">{booking.userId?.name || 'Unknown User'}</span>
                        <span className="small text-grey">{booking.userId?.email || 'N/A'}</span>
                      </td>
                      
                      <td>
                        <span className="d-block fw-bold text-primary-dark">{booking.packageName}</span>
                        <span className="small text-grey"><i className="fa-regular fa-calendar text-accent me-1"></i> {booking.travelDate}</span>
                      </td>
                      
                      <td className="fw-bold">{formatPrice(booking.totalPrice)}</td>
                      
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
                            <li><button className="dropdown-item text-success fw-bold" onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}><i className="fa-solid fa-check me-2"></i> Mark Confirmed</button></li>
                            <li><button className="dropdown-item text-warning fw-bold" onClick={() => handleStatusUpdate(booking._id, 'Pending')}><i className="fa-solid fa-clock-rotate-left me-2"></i> Mark Pending</button></li>
                            <li><hr className="dropdown-divider" /></li>
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
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;