import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './PhilGood.css';

// Context Provider
import { PreferencesProvider } from './context/PreferencesContext'; 

// Layout & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Tours from './pages/Tours';
import Gallery from './pages/Gallery';
import Connect from './pages/Connect';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  return (
    <PreferencesProvider> 
      <div className="App">
        <ScrollToTop />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </PreferencesProvider>
  );
}

export default App;