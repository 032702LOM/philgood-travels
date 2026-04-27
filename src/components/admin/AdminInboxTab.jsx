import React from 'react';

const AdminInboxTab = ({ stats, handleReadMessage, handleDeleteMessage }) => {
  return (
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
};

export default AdminInboxTab;