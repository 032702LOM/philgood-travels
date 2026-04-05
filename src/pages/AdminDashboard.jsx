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
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // ==========================================
  // ⚡ NEW: ADVANCED FILTER & PAGINATION STATE ⚡
  // ==========================================
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [filterPackage, setFilterPackage] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 bookings per page

  // Reset page to 1 whenever a filter changes
  useEffect(() => { setCurrentPage(1); }, [searchKeyword, filterStatus, filterPayment, filterPackage, dateFrom, dateTo]);

  // ==========================================
  // FETCH DATA
  // ==========================================
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

  // ==========================================
  // ACTIONS
  // ==========================================
  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;
    try {
      await axios.put(`https://philgood-travels.onrender.com/api/admin/booking-status/${bookingId}`, { status: newStatus });
      setStats(prevStats => ({
        ...prevStats,
        allBookings: prevStats.allBookings.map(b => b._id === bookingId ? { ...b, bookingStatus: newStatus } : b)
      }));
    } catch (error) { alert('❌ Failed to update status.'); }
  };

  const handleDeleteUser = async (userId, userName) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (userId === currentUser.id) return alert("❌ You cannot delete your own admin account!");
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete: ${userName}?`)) return;

    try {
      await axios.delete(`https://philgood-travels.onrender.com/api/admin/user/${userId}`);
      setStats(prevStats => ({
        ...prevStats,
        allUsers: prevStats.allUsers.filter(u => u._id !== userId),
        totalUsers: prevStats.totalUsers - 1
      }));
    } catch (error) { alert('❌ Failed to delete user.'); }
  };

  const handleReadMessage = async (msg) => {
      setSelectedMessage(msg);
      if (msg.status === 'Unread') {
          try {
              await axios.put(`https://philgood-travels.onrender.com/api/admin/message/${msg._id}`);
              setStats(prevStats => ({ ...prevStats, allMessages: prevStats.allMessages.map(m => m._id === msg._id ? { ...m, status: 'Read' } : m) }));
          } catch (e) { console.error("Failed to mark as read", e); }
      }
  };

  const handleDeleteMessage = async (msgId) => {
      if (!window.confirm("Delete this message permanently?")) return;
      try {
          await axios.delete(`https://philgood-travels.onrender.com/api/admin/message/${msgId}`);
          setStats(prevStats => ({ ...prevStats, allMessages: prevStats.allMessages.filter(m => m._id !== msgId) }));
          setSelectedMessage(null);
      } catch (e) { alert("Failed to delete message"); }
  };

  const clearFilters = () => {
      setSearchKeyword(''); setFilterStatus('All'); setFilterPayment('All'); setFilterPackage('All'); setDateFrom(''); setDateTo('');
  };

  // ==========================================
  // ⚡ NEW: FILTER & PAGINATION LOGIC ⚡
  // ==========================================
  let filteredBookings = [];
  let uniquePackages = [];
  let paginatedBookings = [];
  let totalPages = 1;

  if (stats && stats.allBookings) {
      // 1. Extract unique packages for the dropdown filter
      uniquePackages = [...new Set(stats.allBookings.map(b => b.packageName))];

      // 2. Apply Filters
      filteredBookings = stats.allBookings.filter(b => {
          // Keyword Search
          const kw = searchKeyword.toLowerCase();
          const matchSearch = !kw || b._id.toLowerCase().includes(kw) || (b.userId?.name || '').toLowerCase().includes(kw) || (b.userId?.email || '').toLowerCase().includes(kw);
          
          // Booking Status
          const matchStatus = filterStatus === 'All' || b.bookingStatus === filterStatus;
          
          // Payment Status
          const totalPaid = b.payments?.reduce((sum, p) => p.status === 'Paid' ? sum + p.amountDue : sum, 0) || 0;
          const kw = searchKeyword.toLowerCase().replace('#', '');
          const matchPayment = filterPayment === 'All' || (filterPayment === 'Fully Paid' && isFullyPaid) || (filterPayment === 'Pending/Partial' && !isFullyPaid);
          
          // Package Name
          const matchPackage = filterPackage === 'All' || b.packageName === filterPackage;

          // Travel Date Range
          let matchDate = true;
          if (dateFrom || dateTo) {
              const tripDate = new Date(b.travelDate);
              if (dateFrom && tripDate < new Date(dateFrom)) matchDate = false;
              if (dateTo && tripDate > new Date(dateTo)) matchDate = false;
          }

          return matchSearch && matchStatus && matchPayment && matchPackage && matchDate;
      });

      // 3. Apply Pagination
      totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
      paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }

  // ==========================================
  // RENDER
  // ==========================================
  if (isLoading) return <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}><h3 className="text-navy fw-bold font-montserrat"><i className="fa-solid fa-spinner fa-spin text-accent me-2"></i> Loading Dashboard...</h3></div>;
  if (error) return <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}><h3 className="text-danger fw-bold font-montserrat">{error}</h3></div>;

  const unreadCount = stats.allMessages?.filter(m => m.status === 'Unread').length || 0;

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
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-grey font-montserrat fw-bold text-uppercase m-0">Total Revenue</h6>
                <div className="bg-success bg-opacity-10 p-2 rounded-circle"><i className="fa-solid fa-wallet text-success fs-5"></i></div>
              </div>
              <h2 className="text-navy fw-bold font-montserrat m-0">{formatPrice(stats.totalRevenue)}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-grey font-montserrat fw-bold text-uppercase m-0">Total Bookings</h6>
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle"><i className="fa-solid fa-suitcase-rolling text-primary fs-5"></i></div>
              </div>
              <h2 className="text-navy fw-bold font-montserrat m-0">{stats.totalBookings}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-grey font-montserrat fw-bold text-uppercase m-0">Registered Users</h6>
                <div className="bg-warning bg-opacity-10 p-2 rounded-circle"><i className="fa-solid fa-users text-warning fs-5"></i></div>
              </div>
              <h2 className="text-navy fw-bold font-montserrat m-0">{stats.totalUsers}</h2>
            </div>
          </div>
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="d-flex gap-3 mb-4 flex-wrap pb-3 border-bottom border-primary border-opacity-10">
            <button className={`btn ${activeTab === 'bookings' ? 'btn-proceed shadow' : 'btn-outline-custom'}`} onClick={() => setActiveTab('bookings')} style={{ borderRadius: '50px', padding: '10px 25px' }}>
                <i className="fa-solid fa-suitcase-rolling me-2"></i> Orders / Bookings
            </button>
            <button className={`btn ${activeTab === 'users' ? 'btn-proceed shadow' : 'btn-outline-custom'}`} onClick={() => setActiveTab('users')} style={{ borderRadius: '50px', padding: '10px 25px' }}>
                <i className="fa-solid fa-users me-2"></i> Manage Users
            </button>
            <button className={`btn ${activeTab === 'inbox' ? 'btn-proceed shadow' : 'btn-outline-custom'}`} onClick={() => setActiveTab('inbox')} style={{ borderRadius: '50px', padding: '10px 25px', position: 'relative' }}>
                <i className="fa-solid fa-envelope me-2"></i> Inbox
                {unreadCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">{unreadCount}</span>}
            </button>
        </div>

        {/* --- DYNAMIC CONTENT AREA --- */}
        <div className="rounded-4 shadow-lg border border-primary border-opacity-25 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
          
          {/* ⚡ TAB 1: ADVANCED BOOKINGS VIEW (SIDEBAR + TABLE) ⚡ */}
          {activeTab === 'bookings' && (
              <div className="row g-0 fade-in">
                  
                  {/* DATA TABLE (Left Side - 9 Cols) */}
                  <div className="col-lg-9 p-4 border-end border-primary border-opacity-10">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-navy font-montserrat fw-bold m-0"><i className="fa-solid fa-table-list text-accent me-2"></i> All Orders</h4>
                        <span className="text-grey small fw-bold">{filteredBookings.length} results found</span>
                    </div>

                    <div className="table-responsive" style={{ minHeight: '400px' }}>
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
                          {paginatedBookings.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-5 text-grey fw-bold">No bookings match your exact filters.</td></tr>
                          ) : (
                            paginatedBookings.map(booking => {
                                const totalPaid = booking.payments?.reduce((sum, p) => p.status === 'Paid' ? sum + p.amountDue : sum, 0) || 0;
                                const isFullyPaid = totalPaid >= booking.totalPrice;

                                return (
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
                                        <span className="d-block fw-bold">{formatPrice(booking.totalPrice)}</span>
                                        <span className={`small fw-bold ${isFullyPaid ? 'text-success' : 'text-warning'}`}>{isFullyPaid ? 'PAID' : 'PENDING'}</span>
                                    </td>
                                    <td>
                                      {booking.bookingStatus === 'Confirmed' && <span className="badge bg-success">Confirmed</span>}
                                      {booking.bookingStatus === 'Pending' && <span className="badge text-dark" style={{ backgroundColor: '#FFD166' }}>Pending</span>}
                                      {booking.bookingStatus === 'Cancelled' && <span className="badge bg-danger">Cancelled</span>}
                                      {booking.bookingStatus === 'Postponed' && <span className="badge bg-warning text-dark">Postponed</span>}
                                    </td>
                                    <td className="text-end">
                                      <div className="dropdown">
                                        <button className="btn btn-sm btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">Manage</button>
                                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                          <li><button className="dropdown-item text-primary fw-bold" onClick={() => setSelectedBooking(booking)}><i className="fa-solid fa-eye me-2"></i> View Details</button></li>
                                          <li><hr className="dropdown-divider" /></li>
                                          <li><button className="dropdown-item text-success fw-bold" onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}><i className="fa-solid fa-check me-2"></i> Mark Confirmed</button></li>
                                          <li><button className="dropdown-item text-warning fw-bold" onClick={() => handleStatusUpdate(booking._id, 'Pending')}><i className="fa-solid fa-clock-rotate-left me-2"></i> Mark Pending</button></li>
                                          <li><button className="dropdown-item text-danger fw-bold" onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}><i className="fa-solid fa-ban me-2"></i> Cancel Trip</button></li>
                                        </ul>
                                      </div>
                                    </td>
                                  </tr>
                                );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4 border-top border-primary border-opacity-10 pt-3">
                            <span className="text-grey small fw-bold">Page {currentPage} of {totalPages}</span>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-outline-custom px-3 py-1" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><i className="fa-solid fa-chevron-left"></i></button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} className={`btn btn-sm px-3 py-1 ${currentPage === i + 1 ? 'btn-proceed shadow-sm' : 'btn-outline-custom'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                ))}
                                <button className="btn btn-sm btn-outline-custom px-3 py-1" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><i className="fa-solid fa-chevron-right"></i></button>
                            </div>
                        </div>
                    )}
                  </div>

                  {/* FILTERS SIDEBAR (Right Side - 3 Cols) */}
                  <div className="col-lg-3 p-4" style={{ backgroundColor: 'rgba(0, 180, 216, 0.03)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                          <h5 className="text-navy font-montserrat fw-bold m-0">Filters</h5>
                          <button className="btn btn-sm text-accent fw-bold p-0 text-decoration-underline" onClick={clearFilters}>Reset</button>
                      </div>

                      <div className="mb-3">
                          <label className="text-grey small fw-bold mb-1">Search ID, Name, Email</label>
                          <input type="text" className="form-control-dark w-100" placeholder="Type here..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                      </div>

                      <div className="mb-3">
                          <label className="text-grey small fw-bold mb-1">Booking Status</label>
                          <select className="form-control-dark w-100" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                              <option value="All">All</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Pending">Pending</option>
                              <option value="Postponed">Postponed</option>
                              <option value="Cancelled">Cancelled</option>
                          </select>
                      </div>

                      <div className="mb-3">
                          <label className="text-grey small fw-bold mb-1">Payment Status</label>
                          <select className="form-control-dark w-100" value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
                              <option value="All">All</option>
                              <option value="Fully Paid">Fully Paid</option>
                              <option value="Pending/Partial">Pending / Partial</option>
                          </select>
                      </div>

                      <div className="mb-3">
                          <label className="text-grey small fw-bold mb-1">Destination / Package</label>
                          <select className="form-control-dark w-100" value={filterPackage} onChange={(e) => setFilterPackage(e.target.value)}>
                              <option value="All">All Packages</option>
                              {uniquePackages.map(pkg => (
                                  <option key={pkg} value={pkg}>{pkg}</option>
                              ))}
                          </select>
                      </div>

                      <div className="mb-3">
                          <label className="text-grey small fw-bold mb-1">Travel Date From</label>
                          <input type="date" className="form-control-dark w-100" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                      </div>

                      <div className="mb-3">
                          <label className="text-grey small fw-bold mb-1">Travel Date To</label>
                          <input type="date" className="form-control-dark w-100" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                      </div>
                  </div>

              </div>
          )}

          {/* TAB 2: USERS TABLE */}
          {activeTab === 'users' && (
              <div className="table-responsive fade-in p-4">
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
                          <td>{user.isAdmin ? <span className="badge bg-primary"><i className="fa-solid fa-shield-halved me-1"></i> Admin</span> : <span className="badge bg-secondary">Customer</span>}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user._id, user.name)} title="Delete User"><i className="fa-solid fa-trash"></i></button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          )}

          {/* TAB 3: INBOX (MESSAGES) */}
          {activeTab === 'inbox' && (
              <div className="table-responsive fade-in p-4">
                <table className="table table-hover align-middle" style={{ color: 'var(--text-grey)' }}>
                  <thead style={{ borderBottom: '2px solid var(--primary-color)' }}>
                    <tr>
                      <th className="text-navy font-montserrat">Status</th>
                      <th className="text-navy font-montserrat">Date</th>
                      <th className="text-navy font-montserrat">From</th>
                      <th className="text-navy font-montserrat">Subject</th>
                      <th className="text-navy font-montserrat text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!stats.allMessages || stats.allMessages.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4 text-grey fw-bold">No messages in your inbox.</td></tr>
                    ) : (
                        stats.allMessages.map(msg => (
                        <tr key={msg._id} className={msg.status === 'Unread' ? 'bg-primary bg-opacity-10' : ''} style={{ cursor: 'pointer' }} onClick={() => handleReadMessage(msg)}>
                          <td>{msg.status === 'Unread' ? <span className="badge bg-danger">New</span> : <span className="badge bg-secondary">Read</span>}</td>
                          <td className="small">{new Date(msg.createdAt).toLocaleDateString()}</td>
                          <td className={`text-navy ${msg.status === 'Unread' ? 'fw-bold' : ''}`}>{msg.name}</td>
                          <td className={`${msg.status === 'Unread' ? 'fw-bold text-dark' : 'text-grey'}`}>{msg.subject}</td>
                          <td className="text-end">
                              <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg._id); }} title="Delete Message"><i className="fa-solid fa-trash"></i></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
          )}

        </div>

      </div>

      {/* FULL BOOKING DETAILS MODAL */}
      {selectedBooking && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 31, 63, 0.7)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
              <div className="modal-dialog modal-dialog-centered modal-lg"> 
                  <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px' }}>
                      <div className="modal-header border-bottom border-primary border-opacity-10 pb-3" style={{ backgroundColor: 'var(--primary-dark)', color: 'white', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                          <div><h4 className="modal-title font-montserrat fw-bold mb-1">Booking Details</h4><small className="opacity-75">Order #{selectedBooking._id.toUpperCase()}</small></div>
                          <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button>
                      </div>
                      <div className="modal-body p-4 text-grey">
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
                                  <p className="mb-0"><i className="fa-solid fa-users text-accent me-2"></i>{selectedBooking.guests.adults} Adults, {selectedBooking.guests.children} Children, {selectedBooking.guests.infants} Infants</p>
                              </div>
                          </div>
                          <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#F4FAFC', border: '1px solid rgba(0, 119, 182, 0.2)' }}>
                              <h6 className="text-navy font-montserrat fw-bold mb-3"><i className="fa-solid fa-file-invoice-dollar text-accent me-2"></i> Payment Tracking ({selectedBooking.paymentMethod})</h6>
                              {selectedBooking.payments.map((payment, idx) => (
                                  <div key={idx} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-primary border-opacity-10">
                                      <span>{payment.payerEmail}</span>
                                      <div>
                                          <span className="fw-bold text-navy me-3">{formatPrice(payment.amountDue)}</span>
                                          {payment.status === 'Paid' ? <span className="badge bg-success">Paid</span> : <span className="badge bg-warning text-dark">Pending</span>}
                                      </div>
                                  </div>
                              ))}
                              <div className="d-flex justify-content-between align-items-center mt-3 pt-2"><h5 className="text-navy fw-bold m-0">Grand Total</h5><h5 className="text-accent fw-bold m-0">{formatPrice(selectedBooking.totalPrice)}</h5></div>
                          </div>
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

      {/* MESSAGE READING MODAL */}
      {selectedMessage && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 31, 63, 0.7)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
              <div className="modal-dialog modal-dialog-centered"> 
                  <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px' }}>
                      
                      <div className="modal-header border-bottom border-primary border-opacity-10 pb-3">
                          <h4 className="modal-title font-montserrat fw-bold text-navy">
                              <i className="fa-solid fa-envelope-open-text text-accent me-2"></i> Read Message
                          </h4>
                          <button type="button" className="btn-close" onClick={() => setSelectedMessage(null)}></button>
                      </div>
                      
                      <div className="modal-body p-4 text-grey">
                          <div className="mb-3 border-bottom border-primary border-opacity-10 pb-3">
                              <h6 className="text-navy fw-bold mb-1">{selectedMessage.subject}</h6>
                              <div className="d-flex justify-content-between small">
                                  <span>From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})</span>
                                  <span>{new Date(selectedMessage.createdAt).toLocaleDateString()}</span>
                              </div>
                          </div>
                          <div className="p-3 rounded bg-light" style={{ minHeight: '150px', whiteSpace: 'pre-wrap', color: '#333' }}>
                              {selectedMessage.message}
                          </div>
                      </div>
                      
                      <div className="modal-footer border-0 pt-0 d-flex gap-2">
                          <a 
                              href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`} 
                              className="btn btn-outline-custom flex-grow-1 text-center shadow-sm" 
                              style={{ padding: '12px' }}
                          >
                              <i className="fa-solid fa-desktop me-2"></i> Desktop App
                          </a>
                          <a 
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}&su=Re:%20${encodeURIComponent(selectedMessage.subject)}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-proceed flex-grow-1 text-center shadow-sm" 
                              style={{ padding: '12px' }}
                          >
                              <i className="fa-brands fa-google me-2"></i> Web Gmail
                          </a>
                      </div>

                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default AdminDashboard;