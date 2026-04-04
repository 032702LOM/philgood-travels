import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './PhilGood.css';

// Context Provider
import { PreferencesProvider } from './context/PreferencesContext'; 

// Layout & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile'; 
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Tours from './pages/Tours';
import Gallery from './pages/Gallery';
import Connect from './pages/Connect';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound';

// ⚡ UPDATED: Global Scroll and Reveal Animation Tracker
const ScrollAndReveal = () => {
  const { pathname } = useLocation();
  
  useEffect(() => { 
    // 1. Scroll to top instantly on page change
    window.scrollTo(0, 0); 
    
    let observer;

    // 2. Increased from 100ms to 300ms so React has enough time to build the new page!
    const timer = setTimeout(() => {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach(el => observer.observe(el));
    }, 300); 
    
    // 3. CLEANUP: This stops the observer from glitching when you click links quickly
    return () => {
        clearTimeout(timer);
        if (observer) observer.disconnect();
    };

  }, [pathname]);
  
  return null;
};

function App() {
  return (
    <PreferencesProvider> 
      <div className="App">
        <ScrollAndReveal /> {/* <-- Applied global fix here */}
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="*" element={<NotFound />} /> 
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PreferencesProvider>
  );
}

export default App;