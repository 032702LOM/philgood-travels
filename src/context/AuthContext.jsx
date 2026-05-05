import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Ensure cookies are sent with every request
axios.defaults.withCredentials = true;

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // ⚡ 1. Initialize state synchronously from localStorage so it survives the F5 refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('user'));
  
  // Since we have local data, we don't need to block the app from rendering
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
        if (response.data.user) {
          setUser(response.data.user);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        // ⚡ 2. Don't aggressively wipe local storage if the server is just slow!
        // Only log out if the backend explicitly tells us the token is dead (401 Unauthorized)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('user');
          setUser(null);
          setIsLoggedIn(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
    } catch (err) {
      console.error("Logout error", err);
    }
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {/* ⚡ 3. Removed the !loading block so the app renders immediately */}
      {children} 
    </AuthContext.Provider>
  );
};