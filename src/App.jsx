import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './PhilGood.css';
import { Toaster } from 'react-hot-toast';


// Context Providers
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext'; 
import { ChatProvider } from './context/ChatContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile'; 
import VerifyEmail from './components/VerifyEmail'; 

// Pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Tours from './pages/Tours';
import Gallery from './pages/Gallery';
import Connect from './pages/Connect';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard'; 
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import Checkout from './pages/Checkout';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider> 
        <ChatProvider>
        <div className="App">
          <ScrollToTop />
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/admin" element={<AdminDashboard />} /> 
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} /> 
            </Routes>
          </main>
          <Footer />
        </div>
        </ChatProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;