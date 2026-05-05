import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // ⚡ NEW: Ask the backend "Who is this cookie for?"
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
        if (response.data.user) {
          setUser(response.data.user);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        // If the cookie is expired or missing, clean up
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
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
      {!loading && children} 
    </AuthContext.Provider>
  );
};