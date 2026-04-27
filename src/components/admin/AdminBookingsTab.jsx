import React from 'react';
import { usePreferences } from '../../context/PreferencesContext';

const AdminBookingsTab = ({
    filteredBookings,
    paginatedBookings,
    uniquePackages,
    searchKeyword, setSearchKeyword,
    filterStatus, setFilterStatus,
    filterPayment, setFilterPayment,
    filterPackage, setFilterPackage,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    clearFilters,
    currentPage, setCurrentPage,
    totalPages,
    setSelectedBooking,
    handleStatusUpdate
}) => {
    const { formatPrice } = usePreferences();

    return (
        <div className="fade-in p-4">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-navy font-montserrat fw-bold m-0">
                    <i className="fa-solid fa-table-list text-accent me-2"></i> All Orders
                </h4>
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold border border-primary border-opacity-25">
                    {filteredBookings.length} results found
                </span>
            </div>

            {/* TOP FILTER BAR */}
            <div className="card shadow-sm border-0 mb-4 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <h6 className="text-navy fw-bold m-0"><i className="fa-solid fa-filter text-muted me-2"></i> Filter & Search</h6>
                        <button className="btn btn-sm btn-link text-accent fw-bold p-0 text-decoration-none" onClick={clearFilters}>
                            Reset All
                        </button>
                    </div>

                    <div className="row g-3">
                        {/* Search */}
                        <div className="col-lg-3 col-md-6">
                            <label className="text-muted small fw-bold mb-1">Search Keyword</label>
                            <div className="input-group input-group-sm shadow-sm">
                                <span className="input-group-text bg-white border-end-0"><i className="fa-solid fa-magnifying-glass text-muted"></i></span>
                                <input type="text" className="form-control border-start-0 ps-0" placeholder="ID, Name, Email..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-lg-2 col-md-6">
                            <label className="text-muted small fw-bold mb-1">Booking Status</label>
                            <select className="form-select form-select-sm shadow-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="All">All Statuses</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Postponed">Postponed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Payment */}
                        <div className="col-lg-2 col-md-6">
                            <label className="text-muted small fw-bold mb-1">Payment Status</label>
                            <select className="form-select form-select-sm shadow-sm" value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
                                <option value="All">All Payments</option>
                                <option value="Fully Paid">Fully Paid</option>
                                <option value="Pending/Partial">Pending / Partial</option>
                            </select>
                        </div>

                        {/* Package */}
                        <div className="col-lg-2 col-md-6">
                            <label className="text-muted small fw-bold mb-1">Destination</label>
                            <select className="form-select form-select-sm shadow-sm" value={filterPackage} onChange={(e) => setFilterPackage(e.target.value)}>
                                <option value="All">All Packages</option>
                                {uniquePackages.map(pkg => (<option key={pkg} value={pkg}>{pkg}</option>))}
                            </select>
                        </div>

                        {/* Dates */}
                        <div className="col-lg-3 col-md-12">
                            <label className="text-muted small fw-bold mb-1">Travel Date Range</label>
                            <div className="d-flex gap-2">
                                <input type="date" className="form-control form-control-sm shadow-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                <span className="text-muted align-self-center">-</span>
                                <input type="date" className="form-control form-control-sm shadow-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FULL WIDTH TABLE */}
            <div className="card shadow-sm border border-primary border-opacity-10 rounded-4 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
                <div className="table-responsive" style={{ minHeight: '400px' }}>
                    <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-grey)' }}>
                        <thead style={{ borderBottom: '2px solid var(--primary-color)', backgroundColor: 'rgba(0, 119, 182, 0.03)' }}>
                            <tr>
                                <th className="text-navy font-montserrat py-3 px-4">Order ID</th>
                                <th className="text-navy font-montserrat py-3">Client / Email</th>
                                <th className="text-navy font-montserrat py-3">Package & Date</th>
                                <th className="text-navy font-montserrat py-3">Total Price</th>
                                <th className="text-navy font-montserrat py-3">Status</th>
                                <th className="text-navy font-montserrat py-3 px-4 text-end">Actions</th>
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
                                            <td className="fw-bold px-4" style={{ fontSize: '0.85rem' }}>#{booking?._id?.substring(0, 8)?.toUpperCase() || 'N/A'}</td>
                                            <td>
                                                <span className="d-block fw-bold text-navy">{booking?.userId?.name || 'Unknown User'}</span>
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
                                            <td className="text-end px-4">
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

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
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
        </div>
    );
};

export default AdminBookingsTab;