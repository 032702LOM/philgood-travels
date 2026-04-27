import React from 'react';
import { usePreferences } from '../../context/PreferencesContext';

const AdminStatsCards = ({ stats }) => {
  const { formatPrice } = usePreferences();

  return (
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
};

export default AdminStatsCards;