import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Styling
import './PhilGood.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 

// Pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Tours from './pages/Tours';
import Gallery from './pages/Gallery';
import Connect from './pages/Connect';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound'; // <-- Imported the 404 Page

// Helper: This makes the page start at the top when you switch pages
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        
        {/* Navbar stays at the top */}
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/booking" element={<Booking />} />
            
            {/* Catch-all route for the 404 Not Found page */}
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;