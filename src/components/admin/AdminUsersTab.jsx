import React from 'react';

const AdminUsersTab = ({ stats, handleOpenUserCRM, handleDeleteUser }) => {
  return (
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
};

export default AdminUsersTab;