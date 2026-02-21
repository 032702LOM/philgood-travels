import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePreferences } from '../context/PreferencesContext';

const Profile = () => {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences(); // 👈 Bring in your currency tool!
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]); // 👈 State to hold their trips

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);

      // 👉 FETCH THEIR BOOKINGS FROM MONGODB
      axios.get(`http://localhost:5000/api/bookings/user/${parsedUser.id}`)
        .then(response => {
            setBookings(response.data);
        })
        .catch(err => console.error("Failed to fetch bookings", err));
    }
  }, [navigate]);

  if (!user) return null; 

  return (
    <div className="fade-in" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div className="container">
        <div className="row g-4">
          
          {/* --- LEFT SIDE: Profile Card --- */}
          <div className="col-lg-4">
            <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-secondary border-opacity-25 text-center teal-hover-box h-100">
              <div 
                className="text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow" 
                style={{ width: '80px', height: '80px', fontSize: '2.5rem', backgroundColor: '#2A9D8F' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-white font-montserrat fw-bold mb-1">{user.name}</h4>
              <p className="text-white-50 mb-4">{user.email}</p>
              <hr className="border-secondary border-opacity-25" />
              <p className="text-white-50 small mb-0"><i className="fa-solid fa-shield-halved text-success me-2"></i> Secure Verified Account</p>
            </div>
          </div>

          {/* --- RIGHT SIDE: My Bookings --- */}
          <div className="col-lg-8">
            <div className="bg-card-dark p-4 rounded-4 shadow-lg border border-secondary border-opacity-25 h-100">
              <h4 className="text-white font-montserrat fw-bold border-bottom border-secondary border-opacity-25 pb-3 mb-4">
                <i className="fa-solid fa-suitcase-rolling text-accent me-2"></i> My Bookings
              </h4>
              
              {/* 👉 DYNAMICALLY SHOW BOOKINGS */}
              {bookings.length === 0 ? (
                <div className="text-center py-5 border border-secondary border-opacity-25 border-dashed rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)'}}>
                  <i className="fa-solid fa-ticket fs-1 text-white-50 mb-3 opacity-50"></i>
                  <h5 className="text-white font-montserrat">No bookings yet</h5>
                  <p className="text-white-50 small mb-0">When you book a tour, your itinerary will appear here!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="p-3 border border-secondary border-opacity-25 rounded-3" style={{ backgroundColor: '#021625' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="text-white fw-bold m-0" style={{ color: '#FF8C73' }}>{booking.packageName}</h5>
                        <span className="badge bg-success"><i className="fa-solid fa-check me-1"></i> Confirmed</span>
                      </div>
                      <p className="text-white-50 small mb-1"><i className="fa-regular fa-calendar text-accent me-2"></i> {booking.travelDate}</p>
                      <p className="text-white-50 small mb-2"><i className="fa-solid fa-user-group text-accent me-2"></i> {booking.guests.adults} Adults {booking.guests.children > 0 && `, ${booking.guests.children} Children`} {booking.guests.infants > 0 && `, ${booking.guests.infants} Infants`}</p>
                      <hr className="border-secondary border-opacity-25 my-2"/>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="text-white-50 small"><i className="fa-solid fa-credit-card me-1"></i> {booking.paymentMethod}</span>
                        <span className="text-white fw-bold fs-5">{formatPrice(booking.totalPrice)}</span>
                      </div>
                    </div>
                  ))}
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