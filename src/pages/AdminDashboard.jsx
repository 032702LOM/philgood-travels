import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePreferences } from '../context/PreferencesContext';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeChats, setActiveChats] = useState([]); 
  const [selectedChat, setSelectedChat] = useState(null); 
  const [adminSocket, setAdminSocket] = useState(null);
  const [adminChatInput, setAdminChatInput] = useState('');
  
  const [editMode, setEditMode] = useState(null);
  const [editUserData, setEditUserData] = useState({ 
    name: '', email: '', isAdmin: false, 
    address: { phone: '', street: '', city: '', postalCode: '', country: '' }, 
    marketing: { email: false, sms: false }, 
    tax: { vatNumber: '', collectTax: false }
  });
  
  const [newNote, setNewNote] = useState('');
  const [isPostingNote, setIsPostingNote] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [filterPackage, setFilterPackage] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { 
    setCurrentPage(1); 
  }, [searchKeyword, filterStatus, filterPayment, filterPackage, dateFrom, dateTo]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) { 
        navigate('/login'); 
        return; 
      }
      
      try {
        const parsedUser = JSON.parse(userStr);
        if (!parsedUser?.isAdmin) { 
          alert("🚨 Unauthorized Access."); 
          navigate('/'); 
          return; 
        }
      } catch (e) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get('https://philgood-travels.onrender.com/api/admin/stats');
        setStats(response.data);
      } catch (err) { 
        setError('Failed to load admin data. Please check your backend connection.'); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchAdminData();
  }, [navigate]);

 // ⚡ PHASE 3: LIVE CHAT SOCKET LOGIC
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('https://philgood-travels.onrender.com/api/admin/chats');
        setActiveChats(response.data);
      } catch (err) {
        console.error("Error fetching chat sessions:", err);
      }
    };

    fetchChats();

    const socket = io('https://philgood-travels.onrender.com', {
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });
    setAdminSocket(socket);

    socket.on('admin_notification', (data) => {
      fetchChats(); // Refresh sidebar

      // ⚡ FIX: We check 'prev.sessionId' INSIDE the state updater.
      // This guarantees React always has the freshest state without needing selectedChat in the dependency array!
      setSelectedChat(prev => {
        if (prev && prev.sessionId === data.sessionId) {
          return {
            ...prev,
            messages: [...prev.messages, { sender: 'user', text: data.text, timestamp: new Date() }]
          };
        }
        return prev; // If it's a different chat, just return the current state unchanged
      });
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []); // ⚡ FIX: Empty array! The socket will now stay permanently connected.

  // ⚡ SEND REPLY TO USER
  const handleAdminReply = () => {
      if (!adminChatInput.trim() || !selectedChat || !adminSocket) return;

      const replyData = {
          sessionId: selectedChat.sessionId,
          sender: 'admin',
          text: adminChatInput
      };

      // Emit the message to the server via the open socket
      adminSocket.emit('send_message', replyData);
      
      // Update your local state immediately so your message appears in the window
      setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, { 
              sender: 'admin', 
              text: adminChatInput, 
              timestamp: new Date() 
          }]
      }));
      setAdminChatInput('');
  };

  // ⚡ END AND DELETE CHAT FUNCTION
  const handleDeleteChat = async () => {
      if (!selectedChat) return;
      
      // Double-check before deleting
      if (!window.confirm('Are you sure you want to end and delete this chat session?')) return;

      try {
          // Tell the backend to delete it
          await axios.delete(`https://philgood-travels.onrender.com/api/admin/chats/${selectedChat.sessionId}`);
          
          // Clear it from the main chat window
          setSelectedChat(null);
          
          // Refresh the sidebar list to remove the deleted chat
          const response = await axios.get('https://philgood-travels.onrender.com/api/admin/chats');
          setActiveChats(response.data);
      } catch (err) {
          console.error("Error deleting chat:", err);
          alert("Failed to delete chat. Check console for details.");
      }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Mark this booking as ${newStatus}?`)) return;
    try {
      await axios.put(`https://philgood-travels.onrender.com/api/admin/booking-status/${bookingId}`, { status: newStatus });
      const response = await axios.get('https://philgood-travels.onrender.com/api/admin/stats');
      setStats(response.data);
    } catch (error) { 
      alert('❌ Failed to update status.'); 
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    if (currentUser && userId === currentUser.id) return alert("❌ Cannot delete your own account!");
    if (!window.confirm(`PERMANENTLY delete: ${userName}?`)) return;
    
    try {
      await axios.delete(`https://philgood-travels.onrender.com/api/admin/user/${userId}`);
      setStats(prev => ({ 
        ...prev, 
        allUsers: prev.allUsers?.filter(u => u._id !== userId) || [], 
        totalUsers: (prev.totalUsers || 1) - 1 
      }));
      if (selectedUser && selectedUser._id === userId) setSelectedUser(null);
    } catch (error) { 
      alert('❌ Failed to delete user.'); 
    }
  };

  const handleOpenUserCRM = (user) => {
      setSelectedUser(user);
      setEditUserData({ 
        name: user?.name || '', 
        email: user?.email || '', 
        isAdmin: user?.isAdmin || false, 
        address: user?.address || { phone: '', street: '', city: '', postalCode: '', country: '' }, 
        marketing: user?.marketing || { email: false, sms: false }, 
        tax: user?.tax || { vatNumber: '', collectTax: false }
      });
      setEditMode(null); 
      setNewNote(''); 
  };

  const handleSaveUserEdit = async () => {
      try {
          const response = await axios.put(`https://philgood-travels.onrender.com/api/admin/user/${selectedUser._id}`, editUserData);
          setStats(prev => ({ 
            ...prev, 
            allUsers: prev.allUsers?.map(u => u._id === response.data.user._id ? response.data.user : u) || []
          }));
          setSelectedUser(response.data.user); 
          setEditMode(null);
      } catch (error) { 
        alert('❌ Failed to update user.'); 
      }
  };

  const handleAddNote = async () => {
      if (!newNote.trim()) return;
      setIsPostingNote(true);
      try {
          const userStr = localStorage.getItem('user');
          const currentUser = userStr ? JSON.parse(userStr) : null;
          const initials = currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'AD';

          const response = await axios.post(`https://philgood-travels.onrender.com/api/admin/user/${selectedUser._id}/notes`, { 
            text: newNote, 
            authorInitials: initials 
          });
          setStats(prev => ({ 
            ...prev, 
            allUsers: prev.allUsers?.map(u => u._id === response.data.user._id ? response.data.user : u) || []
          }));
          setSelectedUser(response.data.user); 
          setNewNote('');
      } catch (error) { 
        alert("❌ Failed to post note."); 
      } finally { 
        setIsPostingNote(false); 
      }
  };

  const handleReadMessage = async (msg) => {
      setSelectedMessage(msg);
      if (msg.status === 'Unread') {
          try {
              await axios.put(`https://philgood-travels.onrender.com/api/admin/message/${msg._id}`);
              setStats(prev => ({ 
                ...prev, 
                allMessages: prev.allMessages?.map(m => m._id === msg._id ? { ...m, status: 'Read' } : m) || []
              }));
          } catch (e) { 
            console.error("Failed to mark as read", e); 
          }
      }
  };

  const handleDeleteMessage = async (msgId) => {
      if (!window.confirm("Delete this message permanently?")) return;
      try {
          await axios.delete(`https://philgood-travels.onrender.com/api/admin/message/${msgId}`);
          setStats(prev => ({ 
            ...prev, 
            allMessages: prev.allMessages?.filter(m => m._id !== msgId) || []
          }));
          setSelectedMessage(null);
      } catch (e) { 
        alert("Failed to delete message"); 
      }
  };

  const clearFilters = () => { 
    setSearchKeyword(''); setFilterStatus('All'); setFilterPayment('All'); setFilterPackage('All'); setDateFrom(''); setDateTo(''); 
  };

  // ⚡ NEW: CLICK-TO-COPY FEATURE ⚡
  const handleCopyEmail = (email) => {
      if (!email) return;
      navigator.clipboard.writeText(email).then(() => {
          alert(`✅ Copied to clipboard: ${email}`);
      }).catch(err => {
          console.error("Failed to copy text: ", err);
      });
  };

  const handleSendNewsletter = async () => {
      if (!window.confirm("Are you sure you want to email ALL subscribers?")) return;
      
      try {
          await axios.post('https://philgood-travels.onrender.com/api/admin/broadcast', {
              subject: "Our Monsoon Special is Here! 🌧️",
              htmlContent: `
                  <div style="font-family: sans-serif; padding: 20px;">
                      <h2 style="color: #00B4D8;">PhilGood Travels</h2>
                      <p>Pack your bags! Get 30% off all Palawan packages this weekend only.</p>
                      <a href="https://philgood-travels.vercel.app/tours" style="background-color: #FF9F1C; padding: 10px 20px; text-decoration: none; color: white; border-radius: 5px;">Book Now</a>
                  </div>
              `
          });
          alert("Newsletter sent successfully!");
      } catch (error) {
          alert("Failed to send newsletter.");
      }
  };
 

  // ==========================================
  // SAFE EARLY RETURNS
  // ==========================================
  if (isLoading) {
    return (
      <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
        <h3 className="text-navy fw-bold font-montserrat"><i className="fa-solid fa-spinner fa-spin text-accent me-2"></i> Loading Dashboard...</h3>
      </div>
    );
  }
  
  if (error || !stats) {
    return (
      <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-dark)' }}>
        <h3 className="text-danger fw-bold font-montserrat">{error || "Failed to load data. Please refresh."}</h3>
      </div>
    );
  }

  // ==========================================
  // SAFE DERIVED DATA
  // ==========================================
  let filteredBookings = [];
  let uniquePackages = [];
  let paginatedBookings = [];
  let totalPages = 1;

  if (stats?.allBookings) {
      uniquePackages = [...new Set(stats.allBookings.map(b => b?.packageName).filter(Boolean))];
      filteredBookings = stats.allBookings.filter(b => {
          if (!b) return false;
          const kw = searchKeyword.toLowerCase().replace('#', '');
          const matchSearch = !kw || b._id?.toLowerCase().includes(kw) || b.userId?.name?.toLowerCase().includes(kw) || b.userId?.email?.toLowerCase().includes(kw);
          const matchStatus = filterStatus === 'All' || b.bookingStatus === filterStatus;
          const totalPaid = b.payments?.reduce((sum, p) => p?.status === 'Paid' ? sum + (p?.amountDue || 0) : sum, 0) || 0;
          const isFullyPaid = totalPaid >= (b.totalPrice || 0);
          const matchPayment = filterPayment === 'All' || (filterPayment === 'Fully Paid' && isFullyPaid) || (filterPayment === 'Pending/Partial' && !isFullyPaid);
          const matchPackage = filterPackage === 'All' || b.packageName === filterPackage;
          let matchDate = true;
          if (dateFrom && b.travelDate && new Date(b.travelDate) < new Date(dateFrom)) matchDate = false;
          if (dateTo && b.travelDate && new Date(b.travelDate) > new Date(dateTo)) matchDate = false;
          return matchSearch && matchStatus && matchPayment && matchPackage && matchDate;
      });
      totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
      paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }

  let userBookings = []; 
  let userTotalSpent = 0; 
  let daysSince = 0;
  const activeUserToRender = selectedUser ? (stats?.allUsers?.find(u => u?._id === selectedUser._id) || selectedUser) : null;

  if (activeUserToRender && stats?.allBookings) {
      userBookings = stats.allBookings.filter(b => b?.userId?._id === activeUserToRender._id);
      userTotalSpent = userBookings.reduce((sum, b) => {
          if (b?.bookingStatus === 'Cancelled') return sum;
          const paid = b?.payments?.reduce((s, p) => p?.status === 'Paid' ? s + (p?.amountDue || 0) : s, 0) || 0;
          return sum + paid;
      }, 0);
      if (activeUserToRender.createdAt) {
          daysSince = Math.floor((new Date() - new Date(activeUserToRender.createdAt)) / (1000 * 60 * 60 * 24));
      }
  }

  const unreadCount = stats?.allMessages?.filter(m => m?.status === 'Unread').length || 0;
  
  let adminInitials = 'AD';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj?.name) adminInitials = userObj.name.substring(0, 2).toUpperCase();
    }
  } catch (e) { console.error("Initials error", e); }

  // ==========================================
  // RENDER HELPER FUNCTIONS
  // ==========================================
  const renderStatsCards = () => (
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-grey font-montserrat fw-bold text-uppercase m-0">Total Revenue</h6>
              <div className="bg-success bg-opacity-10 p-2 rounded-circle"><i className="fa-solid fa-wallet text-success fs-5"></i></div>
            </div>
            <h2 className="text-navy fw-bold font-montserrat m-0">{formatPrice(stats?.totalRevenue || 0)}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-grey font-montserrat fw-bold text-uppercase m-0">Total Bookings</h6>
              <div className="bg-primary bg-opacity-10 p-2 rounded-circle"><i className="fa-solid fa-suitcase-rolling text-primary fs-5"></i></div>
            </div>
            <h2 className="text-navy fw-bold font-montserrat m-0">{stats?.totalBookings || 0}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 rounded-4 shadow-lg border border-primary border-opacity-25 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-grey font-montserrat fw-bold text-uppercase m-0">Registered Users</h6>
              <div className="bg-warning bg-opacity-10 p-2 rounded-circle"><i className="fa-solid fa-users text-warning fs-5"></i></div>
            </div>
            <h2 className="text-navy fw-bold font-montserrat m-0">{stats?.totalUsers || 0}</h2>
          </div>
        </div>
      </div>
  );

  const renderBookingsTab = () => (
      <div className="row g-0 fade-in">
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
                        const totalPaid = booking?.payments?.reduce((sum, p) => p?.status === 'Paid' ? sum + (p?.amountDue || 0) : sum, 0) || 0;
                        const isFullyPaid = totalPaid >= (booking?.totalPrice || 0);
                        return (
                          <tr key={booking?._id}>
                            <td className="fw-bold" style={{ fontSize: '0.85rem' }}>#{booking?._id?.substring(0, 8)?.toUpperCase() || 'N/A'}</td>
                            <td>
                              <span className="d-block fw-bold text-navy">{booking?.userId?.name || 'Unknown User / Deleted'}</span>
                              <span className="small text-grey">{booking?.userId?.email || 'N/A'}</span>
                            </td>
                            <td>
                              <span className="d-block fw-bold text-primary-dark">{booking?.packageName || 'N/A'}</span>
                              <span className="small text-grey"><i className="fa-regular fa-calendar text-accent me-1"></i> {booking?.travelDate || 'N/A'}</span>
                            </td>
                            <td>
                              <span className="d-block fw-bold">{formatPrice(booking?.totalPrice || 0)}</span>
                              <span className={`small fw-bold ${isFullyPaid ? 'text-success' : 'text-warning'}`}>{isFullyPaid ? 'PAID' : 'PENDING'}</span>
                            </td>
                            <td>
                              {booking?.bookingStatus === 'Confirmed' && <span className="badge bg-success">Confirmed</span>}
                              {booking?.bookingStatus === 'Pending' && <span className="badge text-dark" style={{ backgroundColor: '#FFD166' }}>Pending</span>}
                              {booking?.bookingStatus === 'Cancelled' && <span className="badge bg-danger">Cancelled</span>}
                              {booking?.bookingStatus === 'Postponed' && <span className="badge bg-warning text-dark">Postponed</span>}
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
                  {uniquePackages.map(pkg => (<option key={pkg} value={pkg}>{pkg}</option>))}
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
  );

  const renderUsersTab = () => (
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
            {stats?.allUsers?.map(user => (
                <tr key={user?._id} style={{ cursor: 'pointer' }} onClick={() => handleOpenUserCRM(user)}>
                  <td className="fw-bold" style={{ fontSize: '0.85rem' }}>...{user?._id?.substring(18) || 'N/A'}</td>
                  <td className="fw-bold text-navy">{user?.name || 'N/A'}</td>
                  <td>{user?.email || 'N/A'}</td>
                  <td>
                    {user?.isAdmin ? <span className="badge bg-primary"><i className="fa-solid fa-shield-halved me-1"></i> Admin</span> : <span className="badge bg-secondary">Customer</span>}
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); handleDeleteUser(user._id, user.name); }} title="Delete User">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
  );

  const renderInboxTab = () => (
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
            {!stats?.allMessages || stats.allMessages.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-4 text-grey fw-bold">No messages in your inbox.</td></tr>
            ) : (
                stats.allMessages.map(msg => (
                <tr key={msg?._id} className={msg?.status === 'Unread' ? 'bg-primary bg-opacity-10' : ''} style={{ cursor: 'pointer' }} onClick={() => handleReadMessage(msg)}>
                  <td>
                    {msg?.status === 'Unread' ? <span className="badge bg-danger">New</span> : <span className="badge bg-secondary">Read</span>}
                  </td>
                  <td className="small">{msg?.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className={`text-navy ${msg?.status === 'Unread' ? 'fw-bold' : ''}`}>{msg?.name || 'N/A'}</td>
                  <td className={`${msg?.status === 'Unread' ? 'fw-bold text-dark' : 'text-grey'}`}>{msg?.subject || 'N/A'}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg._id); }} title="Delete Message">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  );

  const renderCrmModal = () => {
    if (!activeUserToRender) return null;
    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-xl" style={{ maxWidth: '1100px' }}> 
              <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: '#f4f6f8', borderRadius: '12px', overflow: 'hidden' }}>
                  
                  <div className="modal-header border-bottom py-3 px-4" style={{ backgroundColor: '#ffffff' }}>
                      <div className="d-flex align-items-center">
                          <button className="btn btn-sm btn-light border me-3" onClick={() => setSelectedUser(null)}><i className="fa-solid fa-arrow-left"></i></button>
                          <h4 className="modal-title fw-bold text-dark m-0 d-flex align-items-center" style={{ fontSize: '1.25rem' }}>
                              <i className="fa-regular fa-user me-2 text-muted"></i> {activeUserToRender?.name || 'Unknown'}
                          </h4>
                      </div>
                  </div>

                  <div className="modal-body p-4 text-dark" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                      
                      <div className="row g-0 mb-4 bg-white rounded-3 border shadow-sm">
                          <div className="col-md-3 p-3 border-end">
                              <small className="text-muted fw-bold d-block mb-1">Amount spent</small>
                              <h5 className="text-dark fw-bold m-0">{formatPrice(userTotalSpent)}</h5>
                          </div>
                          <div className="col-md-3 p-3 border-end">
                              <small className="text-muted fw-bold d-block mb-1">Orders</small>
                              <h5 className="text-dark fw-bold m-0">{userBookings.length}</h5>
                          </div>
                          <div className="col-md-3 p-3 border-end">
                              <small className="text-muted fw-bold d-block mb-1">Customer since</small>
                              <h5 className="text-dark fw-bold m-0">{daysSince} days</h5>
                          </div>
                          <div className="col-md-3 p-3">
                              <small className="text-muted fw-bold d-block mb-1">RFM group</small>
                              <h5 className="text-dark fw-bold m-0">Prospects</h5>
                          </div>
                      </div>

                      <div className="row g-4">
                          <div className="col-lg-8">
                              
                              <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
                                  <h6 className="fw-bold text-dark mb-3">Last order placed</h6>
                                  {userBookings.length === 0 ? (
                                      <p className="text-muted mb-0">No orders placed yet.</p>
                                  ) : (
                                      <div className="border rounded-2">
                                          <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                                              <div>
                                                  <span className="fw-bold me-2">#{userBookings[0]?._id?.substring(0,6)?.toUpperCase() || 'N/A'}</span>
                                                  {userBookings[0]?.bookingStatus === 'Confirmed' ? <span className="badge bg-secondary text-dark border"><i className="fa-solid fa-circle text-secondary me-1" style={{fontSize:'0.5rem'}}></i> Fulfilled</span> : <span className="badge bg-light text-dark border"><i className="fa-solid fa-circle-half-stroke text-secondary me-1" style={{fontSize:'0.5rem'}}></i> Pending</span>}
                                              </div>
                                              <span className="fw-bold">{formatPrice(userBookings[0]?.totalPrice || 0)}</span>
                                          </div>
                                          <div className="p-3 d-flex justify-content-between align-items-center">
                                              <div className="d-flex align-items-center">
                                                  <div className="bg-light border rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="fa-solid fa-suitcase-rolling text-muted"></i></div>
                                                  <div>
                                                      <h6 className="mb-0 fw-bold">{userBookings[0]?.packageName || 'N/A'}</h6>
                                                      <span className="badge bg-light text-dark border mt-1">{userBookings[0]?.travelDate || 'N/A'}</span>
                                                  </div>
                                              </div>
                                              <span className="text-dark">x 1</span>
                                              <span className="text-dark">{formatPrice(userBookings[0]?.totalPrice || 0)}</span>
                                          </div>
                                          <div className="p-3 border-top d-flex justify-content-between align-items-center">
                                              <span className="text-primary" style={{ cursor: 'pointer', fontWeight: '500' }}>Show products</span>
                                              <div>
                                                  <button className="btn btn-sm btn-light border me-2 fw-bold text-dark" onClick={() => {setSelectedUser(null); setSelectedBooking(userBookings[0]);}}>View details</button>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>

                              <div className="mt-4">
                                  <h6 className="fw-bold text-dark mb-3">Timeline</h6>
                                  
                                  <div className="bg-white p-3 rounded-3 shadow-sm border mb-4">
                                      <div className="d-flex align-items-center gap-3">
                                          <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                                            {adminInitials}
                                          </div>
                                          <input 
                                            type="text" 
                                            className="form-control border-0 bg-light" 
                                            placeholder="Leave a comment..." 
                                            value={newNote} 
                                            onChange={(e) => setNewNote(e.target.value)} 
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()} 
                                          />
                                          <button className="btn btn-sm btn-dark fw-bold px-3" onClick={handleAddNote} disabled={!newNote.trim() || isPostingNote}>
                                            {isPostingNote ? 'Posting...' : 'Post'}
                                          </button>
                                      </div>
                                  </div>

                                  {activeUserToRender?.adminNotes && activeUserToRender.adminNotes.length > 0 ? (
                                      <div className="ms-3 position-relative" style={{ borderLeft: '2px solid #e1e3e5', paddingBottom: '20px' }}>
                                          {activeUserToRender.adminNotes.slice().reverse().map(note => {
                                              const isSystem = note?.authorInitials === '⚙️';
                                              return (
                                              <div key={note?._id} className="mb-4 position-relative ps-4 pt-1">
                                                  
                                                  <div className={`position-absolute rounded-circle d-flex align-items-center justify-content-center shadow-sm ${isSystem ? 'bg-light text-muted border' : 'bg-secondary text-white'}`} style={{ width: '32px', height: '32px', left: '-17px', top: '0', fontSize: '0.75rem', fontWeight: 'bold', border: '2px solid #f4f6f8', zIndex: 1 }}>
                                                      {note?.authorInitials || 'AD'}
                                                  </div>
                                                  
                                                  {isSystem ? (
                                                      <div className="d-flex justify-content-between align-items-start">
                                                          <p className="m-0 text-muted" style={{ fontSize: '0.85rem' }}>{note?.text}</p>
                                                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>{note?.createdAt ? new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</small>
                                                      </div>
                                                  ) : (
                                                      <div className="bg-white p-3 rounded-3 shadow-sm border">
                                                          <div className="d-flex justify-content-between mb-2">
                                                              <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{note?.authorInitials || 'AD'} (Staff)</span>
                                                              <small className="text-muted" style={{ fontSize: '0.75rem' }}>{note?.createdAt ? new Date(note.createdAt).toLocaleString() : ''}</small>
                                                          </div>
                                                          <p className="m-0 text-dark" style={{ fontSize: '0.95rem' }}>{note?.text}</p>
                                                      </div>
                                                  )}
                                              </div>
                                          )})}
                                      </div>
                                  ) : (
                                      <p className="text-muted text-center py-3">Only you and other staff can see comments here.</p>
                                  )}
                              </div>
                          </div>

                          <div className="col-lg-4">
                              <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                      <h6 className="fw-bold text-dark m-0">Customer</h6>
                                      
                                      {!editMode && (
                                          <div className="dropdown">
                                              <i className="fa-solid fa-ellipsis text-muted" style={{ cursor: 'pointer', padding: '0 5px' }} data-bs-toggle="dropdown"></i>
                                              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2" style={{ fontSize: '0.9rem', minWidth: '220px' }}>
                                                  <li><button className="dropdown-item py-2" onClick={() => setEditMode('contact')}>Edit contact information</button></li>
                                                  <li><button className="dropdown-item py-2" onClick={() => setEditMode('address')}>Manage addresses</button></li>
                                                  <li><button className="dropdown-item py-2" onClick={() => setEditMode('marketing')}>Edit marketing settings</button></li>
                                                  <li><button className="dropdown-item py-2" onClick={() => setEditMode('tax')}>Edit tax details</button></li>
                                                  <li><hr className="dropdown-divider" /></li>
                                                  <li><button className="dropdown-item py-2 text-danger" onClick={(e) => { e.stopPropagation(); handleDeleteUser(activeUserToRender._id, activeUserToRender.name); }}>Delete customer</button></li>
                                              </ul>
                                          </div>
                                      )}
                                  </div>

                                  {!editMode && (
                                      <div className="fade-in">
                                          <h6 className="text-dark fw-bold mb-2">Contact information</h6>
                                          <div className="d-flex justify-content-between align-items-center mb-1">
                                              <a href={`mailto:${activeUserToRender?.email}`} className="text-decoration-none text-primary">{activeUserToRender?.email || 'N/A'}</a>
                                              {/* ⚡ CLICK-TO-COPY EMAIL ⚡ */}
                                              <i 
                                                className="fa-regular fa-copy text-muted ms-2" 
                                                style={{ cursor: 'pointer' }} 
                                                title="Copy Email"
                                                onClick={() => handleCopyEmail(activeUserToRender?.email)}
                                              ></i>
                                          </div>
                                          <p className="m-0 text-dark mb-4">{activeUserToRender?.address?.phone || 'No phone provided'}</p>

                                          <h6 className="text-dark fw-bold mb-2">Default address</h6>
                                          <p className="m-0 text-dark mb-4" style={{ lineHeight: '1.5' }}>
                                              {activeUserToRender?.name}<br/>
                                              {activeUserToRender?.address?.street ? (
                                                  <>
                                                      {activeUserToRender.address.street}<br/>
                                                      {activeUserToRender.address.city} {activeUserToRender.address.postalCode}<br/>
                                                      {activeUserToRender.address.country}
                                                  </>
                                              ) : (
                                                  <span className="text-muted">No address provided</span>
                                              )}
                                          </p>
                                          
                                          <h6 className="text-dark fw-bold mb-2">Marketing</h6>
                                          <div className="d-flex gap-2 mb-4">
                                              <span className="badge bg-light text-dark border px-2 py-1"><i className={`fa-regular ${activeUserToRender?.marketing?.email ? 'fa-circle-check text-success' : 'fa-circle text-muted'} me-1`} style={{fontSize:'0.6rem'}}></i> Email</span>
                                              <span className="badge bg-light text-dark border px-2 py-1"><i className={`fa-regular ${activeUserToRender?.marketing?.sms ? 'fa-circle-check text-success' : 'fa-circle text-muted'} me-1`} style={{fontSize:'0.6rem'}}></i> SMS</span>
                                          </div>

                                          <h6 className="text-dark fw-bold mb-2">Tax details</h6>
                                          <p className="m-0 text-dark" style={{ lineHeight: '1.5' }}>
                                              VAT number: {activeUserToRender?.tax?.vatNumber || 'Not provided'}<br/>
                                              {activeUserToRender?.tax?.collectTax ? 'Collect tax' : 'Do not collect tax'}
                                          </p>
                                      </div>
                                  )}

                                  {editMode === 'contact' && (
                                      <div className="fade-in">
                                          <h6 className="text-dark fw-bold mb-3 border-bottom pb-2">Edit Contact Info</h6>
                                          <div className="mb-3">
                                              <label className="text-muted fw-bold small mb-1">Full Name</label>
                                              <input type="text" className="form-control" value={editUserData.name} onChange={(e) => setEditUserData({...editUserData, name: e.target.value})} />
                                          </div>
                                          <div className="mb-3">
                                              <label className="text-muted fw-bold small mb-1">Email Address</label>
                                              <input type="email" className="form-control" value={editUserData.email} onChange={(e) => setEditUserData({...editUserData, email: e.target.value})} />
                                          </div>
                                          <div className="mb-4">
                                              <label className="text-muted fw-bold small mb-1">Phone Number</label>
                                              <input type="text" className="form-control" value={editUserData.address.phone} onChange={(e) => setEditUserData({...editUserData, address: {...editUserData.address, phone: e.target.value}})} />
                                          </div>
                                          <div className="mb-4 form-check form-switch pt-2">
                                              <input className="form-check-input" type="checkbox" role="switch" id="adminSwitch" checked={editUserData.isAdmin} onChange={(e) => setEditUserData({...editUserData, isAdmin: e.target.checked})} />
                                              <label className="form-check-label text-dark fw-bold ms-2" htmlFor="adminSwitch">Grant Admin Privileges</label>
                                          </div>
                                          <div className="d-flex gap-2">
                                              <button className="btn btn-light border flex-grow-1 fw-bold text-dark" onClick={() => setEditMode(null)}>Cancel</button>
                                              <button className="btn btn-dark flex-grow-1 fw-bold" onClick={handleSaveUserEdit}>Save</button>
                                          </div>
                                      </div>
                                  )}

                                  {editMode === 'address' && (
                                      <div className="fade-in">
                                          <h6 className="text-dark fw-bold mb-3 border-bottom pb-2">Manage Address</h6>
                                          <div className="mb-3">
                                              <label className="text-muted fw-bold small mb-1">Street Address</label>
                                              <input type="text" className="form-control" value={editUserData.address.street} onChange={(e) => setEditUserData({...editUserData, address: {...editUserData.address, street: e.target.value}})} />
                                          </div>
                                          <div className="row g-2 mb-3">
                                              <div className="col-6">
                                                  <label className="text-muted fw-bold small mb-1">City</label>
                                                  <input type="text" className="form-control" value={editUserData.address.city} onChange={(e) => setEditUserData({...editUserData, address: {...editUserData.address, city: e.target.value}})} />
                                              </div>
                                              <div className="col-6">
                                                  <label className="text-muted fw-bold small mb-1">Postal Code</label>
                                                  <input type="text" className="form-control" value={editUserData.address.postalCode} onChange={(e) => setEditUserData({...editUserData, address: {...editUserData.address, postalCode: e.target.value}})} />
                                              </div>
                                          </div>
                                          <div className="mb-4">
                                              <label className="text-muted fw-bold small mb-1">Country / Region</label>
                                              <input type="text" className="form-control" value={editUserData.address.country} onChange={(e) => setEditUserData({...editUserData, address: {...editUserData.address, country: e.target.value}})} />
                                          </div>
                                          <div className="d-flex gap-2">
                                              <button className="btn btn-light border flex-grow-1 fw-bold text-dark" onClick={() => setEditMode(null)}>Cancel</button>
                                              <button className="btn btn-dark flex-grow-1 fw-bold" onClick={handleSaveUserEdit}>Save</button>
                                          </div>
                                      </div>
                                  )}

                                  {editMode === 'marketing' && (
                                      <div className="fade-in">
                                          <h6 className="text-dark fw-bold mb-3 border-bottom pb-2">Marketing Settings</h6>
                                          <div className="form-check mb-3">
                                              <input className="form-check-input" type="checkbox" id="emailOptIn" checked={editUserData.marketing.email} onChange={(e) => setEditUserData({...editUserData, marketing: {...editUserData.marketing, email: e.target.checked}})} />
                                              <label className="form-check-label text-dark" htmlFor="emailOptIn">Subscribed to Email marketing</label>
                                          </div>
                                          <div className="form-check mb-4">
                                              <input className="form-check-input" type="checkbox" id="smsOptIn" checked={editUserData.marketing.sms} onChange={(e) => setEditUserData({...editUserData, marketing: {...editUserData.marketing, sms: e.target.checked}})} />
                                              <label className="form-check-label text-dark" htmlFor="smsOptIn">Subscribed to SMS marketing</label>
                                          </div>
                                          <div className="d-flex gap-2">
                                              <button className="btn btn-light border flex-grow-1 fw-bold text-dark" onClick={() => setEditMode(null)}>Cancel</button>
                                              <button className="btn btn-dark flex-grow-1 fw-bold" onClick={handleSaveUserEdit}>Save</button>
                                          </div>
                                      </div>
                                  )}

                                  {editMode === 'tax' && (
                                      <div className="fade-in">
                                          <h6 className="text-dark fw-bold mb-3 border-bottom pb-2">Tax Details</h6>
                                          <div className="mb-3">
                                              <label className="text-muted fw-bold small mb-1">VAT Number</label>
                                              <input type="text" className="form-control" placeholder="e.g. GB123456789" value={editUserData.tax.vatNumber} onChange={(e) => setEditUserData({...editUserData, tax: {...editUserData.tax, vatNumber: e.target.value}})} />
                                          </div>
                                          <div className="form-check mb-4">
                                              <input className="form-check-input" type="checkbox" id="collectTax" checked={editUserData.tax.collectTax} onChange={(e) => setEditUserData({...editUserData, tax: {...editUserData.tax, collectTax: e.target.checked}})} />
                                              <label className="form-check-label text-dark" htmlFor="collectTax">Collect tax on this customer</label>
                                          </div>
                                          <div className="d-flex gap-2">
                                              <button className="btn btn-light border flex-grow-1 fw-bold text-dark" onClick={() => setEditMode(null)}>Cancel</button>
                                              <button className="btn btn-dark flex-grow-1 fw-bold" onClick={handleSaveUserEdit}>Save</button>
                                          </div>
                                      </div>
                                  )}
                              </div>

                              <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
                                <h6 className="fw-bold text-dark mb-2">Store credit</h6>
                                <p className="m-0 text-muted">None</p>
                              </div>
                              
                              <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="fw-bold text-dark m-0">Tags</h6>
                                    <i className="fa-solid fa-pen text-muted" style={{ cursor: 'pointer' }}></i>
                                  </div>
                                  <input type="text" className="form-control mt-2" />
                              </div>
                              
                              <div className="bg-white p-4 rounded-3 shadow-sm border">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="fw-bold text-dark m-0">Notes</h6>
                                    <i className="fa-solid fa-pen text-muted" style={{ cursor: 'pointer' }}></i>
                                  </div>
                                  <p className="m-0 text-muted mt-2">None</p>
                              </div>
                              
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          </div>
      );
  };

  const renderBookingModal = () => {
    if (!selectedBooking) return null;
    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 31, 63, 0.7)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg"> 
              <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px' }}>
                  <div className="modal-header border-bottom border-primary border-opacity-10 pb-3" style={{ backgroundColor: 'var(--primary-dark)', color: 'white', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                      <div>
                        <h4 className="modal-title font-montserrat fw-bold mb-1">Booking Details</h4>
                        <small className="opacity-75">Order #{selectedBooking?._id?.toUpperCase() || 'N/A'}</small>
                      </div>
                      <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button>
                  </div>
                  <div className="modal-body p-4 text-grey">
                      <div className="row mb-4">
                          <div className="col-md-6">
                              <h6 className="text-primary-dark fw-bold mb-1">Package:</h6>
                              <p className="fs-5 text-navy fw-bold mb-3">{selectedBooking?.packageName || 'N/A'}</p>
                              <h6 className="text-primary-dark fw-bold mb-1">Travel Date:</h6>
                              <p className="mb-0"><i className="fa-regular fa-calendar text-accent me-2"></i>{selectedBooking?.travelDate || 'N/A'}</p>
                          </div>
                          <div className="col-md-6">
                              <h6 className="text-primary-dark fw-bold mb-1">Client:</h6>
                              <p className="mb-3">{selectedBooking?.userId?.name || 'Deleted User'} ({selectedBooking?.userId?.email || 'N/A'})</p>
                              <h6 className="text-primary-dark fw-bold mb-1">Guests:</h6>
                              <p className="mb-0"><i className="fa-solid fa-users text-accent me-2"></i>{selectedBooking?.guests?.adults || 0} Adults, {selectedBooking?.guests?.children || 0} Children, {selectedBooking?.guests?.infants || 0} Infants</p>
                          </div>
                      </div>
                      <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#F4FAFC', border: '1px solid rgba(0, 119, 182, 0.2)' }}>
                          <h6 className="text-navy font-montserrat fw-bold mb-3"><i className="fa-solid fa-file-invoice-dollar text-accent me-2"></i> Payment Tracking ({selectedBooking?.paymentMethod || 'N/A'})</h6>
                          {selectedBooking?.payments?.map((payment, idx) => (
                              <div key={idx} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-primary border-opacity-10">
                                  <span>{payment?.payerEmail || 'N/A'}</span>
                                  <div>
                                      <span className="fw-bold text-navy me-3">{formatPrice(payment?.amountDue || 0)}</span>
                                      {payment?.status === 'Paid' ? <span className="badge bg-success">Paid</span> : <span className="badge bg-warning text-dark">Pending</span>}
                                  </div>
                              </div>
                          ))}
                          <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                            <h5 className="text-navy fw-bold m-0">Grand Total</h5>
                            <h5 className="text-accent fw-bold m-0">{formatPrice(selectedBooking?.totalPrice || 0)}</h5>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    
    );
  };

  const renderMessageModal = () => {
    if (!selectedMessage) return null;
    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 31, 63, 0.7)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered"> 
              <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px' }}>
                  <div className="modal-header border-bottom border-primary border-opacity-10 pb-3">
                      <h4 className="modal-title font-montserrat fw-bold text-navy"><i className="fa-solid fa-envelope-open-text text-accent me-2"></i> Read Message</h4>
                      <button type="button" className="btn-close" onClick={() => setSelectedMessage(null)}></button>
                  </div>
                  <div className="modal-body p-4 text-grey">
                      <div className="mb-3 border-bottom border-primary border-opacity-10 pb-3">
                          <h6 className="text-navy fw-bold mb-1">{selectedMessage?.subject || 'No Subject'}</h6>
                          <div className="d-flex justify-content-between small">
                            <span>From: <strong>{selectedMessage?.name || 'Unknown'}</strong> ({selectedMessage?.email || 'N/A'})</span>
                            <span>{selectedMessage?.createdAt ? new Date(selectedMessage.createdAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                      </div>
                      <div className="p-3 rounded bg-light" style={{ minHeight: '150px', whiteSpace: 'pre-wrap', color: '#333' }}>
                        {selectedMessage?.message || 'No content.'}
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0 d-flex gap-2">
                      <a href={`mailto:${selectedMessage?.email}?subject=Re: ${encodeURIComponent(selectedMessage?.subject || '')}`} className="btn btn-outline-custom flex-grow-1 text-center shadow-sm" style={{ padding: '12px' }}>
                        <i className="fa-solid fa-desktop me-2"></i> Desktop App
                      </a>
                      <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage?.email}&su=Re:%20${encodeURIComponent(selectedMessage?.subject || '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-proceed flex-grow-1 text-center shadow-sm" style={{ padding: '12px' }}>
                        <i className="fa-brands fa-google me-2"></i> Web Gmail
                      </a>
                  </div>
              </div>
          </div>
      </div>
    );
  };

  // ⚡ PHASE 3: LIVE CHAT UI
  const renderLiveChatTab = () => (
    <div className="row g-0 fade-in" style={{ height: '600px', backgroundColor: '#fff' }}>
        {/* Left Sidebar: List of Active Users */}
        <div className="col-md-4 border-end overflow-auto p-3 h-100" style={{ backgroundColor: '#f8f9fa' }}>
            <h6 className="fw-bold text-navy mb-3">Customer Inquiries</h6>
            {activeChats.length === 0 ? (
                <div className="text-center mt-5 opacity-50">
                    <i className="fa-solid fa-cloud mb-2" style={{ fontSize: '2rem' }}></i>
                    <p className="small">No active chats found.</p>
                </div>
            ) : (
                activeChats.map(chat => (
                    <div key={chat._id} 
                         onClick={() => { 
                             setSelectedChat(chat); 
                             adminSocket.emit('join_chat', chat.sessionId); 
                         }}
                         className={`p-3 mb-2 rounded-3 border cursor-pointer shadow-sm ${selectedChat?.sessionId === chat.sessionId ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                         style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="fw-bold">Visitor {chat.sessionId.substring(8, 13)}</small>
                            <small className="opacity-75" style={{ fontSize: '0.7rem' }}>
                                {new Date(chat.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </small>
                        </div>
                        <div className="small text-truncate mt-1" style={{ opacity: 0.8 }}>
                            {chat.messages[chat.messages.length - 1]?.text}
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Right Side: The Chat Conversation */}
        <div className="col-md-8 d-flex flex-column p-0 h-100">
            {selectedChat ? (
                <>
                    <div className="p-3 border-bottom bg-white fw-bold text-navy d-flex align-items-center">
                        <div className="bg-success rounded-circle me-2" style={{ width: '10px', height: '10px' }}></div>
                        Session: {selectedChat.sessionId}
                    </div>
                    <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3" style={{ backgroundColor: '#f0f2f5' }}>
                        {selectedChat.messages.map((m, i) => (
                            <div key={i} className={`p-3 rounded-4 shadow-sm ${m.sender === 'admin' ? 'bg-primary text-white align-self-end' : 'bg-white text-dark align-self-start border'}`} style={{ maxWidth: '75%', fontSize: '0.9rem' }}>
                                {m.text}
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-white border-top d-flex gap-2">
                        <input 
                            type="text" 
                            className="form-control border-0 bg-light" 
                            placeholder="Type a message..." 
                            value={adminChatInput} 
                            onChange={e => setAdminChatInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleAdminReply()} 
                        />
                        <button className="btn btn-proceed px-4 fw-bold" onClick={handleAdminReply} disabled={!adminChatInput.trim()}>
                            Send
                        </button>
                        <button className="btn btn-outline-danger px-3 fw-bold" onClick={handleDeleteChat} title="End & Delete Chat"><i className="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </>
            ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-grey opacity-50">
                    <i className="fa-solid fa-comments mb-3" style={{ fontSize: '4rem' }}></i>
                    <p className="fw-bold">Select a conversation to start helping customers.</p>
                </div>
            )}
        </div>
    </div>
  );

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className="fade-in" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <div className="container pb-5">
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="section-title wave-text mb-1" style={{ fontSize: '3rem' }}>Admin Dashboard</h1>
            <p className="text-grey fw-bold m-0">Welcome to mission control. Here is your overview.</p>
          </div>
        </div>

        <button className="btn btn-proceed shadow-lg px-4 py-2" onClick={handleSendNewsletter}>
              <i className="fa-solid fa-paper-plane me-2"></i> Send Newsletter Blast
          </button>

        {renderStatsCards()}

        {/* TABS BUTTONS */}
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
            <button className={`btn ${activeTab === 'chat' ? 'btn-proceed shadow' : 'btn-outline-custom'}`} onClick={() => setActiveTab('chat')} style={{ borderRadius: '50px', padding: '10px 25px' }}>
  <i className="fa-solid fa-headset me-2"></i> Live Support
</button>
        </div>

        {/* MAIN TABS CONTAINER */}
        <div className="rounded-4 shadow-lg border border-primary border-opacity-25 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
          {activeTab === 'bookings' && renderBookingsTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'inbox' && renderInboxTab()}
          {activeTab === 'chat' && renderLiveChatTab()}
        </div>

      </div>

      {/* FLOATING MODALS */}
      {renderCrmModal()}
      {renderBookingModal()}
      {renderMessageModal()}

    </div>
  );
};

export default AdminDashboard;