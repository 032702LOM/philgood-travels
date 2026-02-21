import React, { useState, useEffect } from 'react';
import { usePreferences } from '../context/PreferencesContext';

// ==========================================
// HARD-CODED GALLERY DATA
// Every image here is manually set and fully controllable.
// ==========================================
const galleryData = [
  { 
    id: 'Palawan', 
    name: 'Palawan', 
    cover: 'https://images.unsplash.com/photo-1531168556467-8053153c361c?q=80&w=800&auto=format&fit=crop', 
    subcards: [
      { 
        id: 'palawan-elnido', 
        name: 'El Nido', 
        cover: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'el-img-1', title: 'Big Lagoon', url: 'https://images.unsplash.com/photo-1520626337972-8ee434ee744c?q=80&w=800&auto=format&fit=crop' },
          { id: 'el-img-2', title: 'Secret Beach', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=800&auto=format&fit=crop' },
          { id: 'el-img-3', title: 'Nacpan Beach', url: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop' },
          { id: 'el-img-4', title: 'Limestone Cliffs', url: 'https://images.unsplash.com/photo-1606676366299-fdec90590467?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Bohol', 
    name: 'Bohol', 
    cover: 'https://images.unsplash.com/photo-1518182170546-0766bd6f6a56?q=80&w=800&auto=format&fit=crop', 
    subcards: [
      { 
        id: 'bohol-choc', 
        name: 'Chocolate Hills', 
        cover: 'https://images.unsplash.com/photo-1518182170546-0766bd6f6a56?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'bh-img-1', title: 'Sunrise Hills', url: 'https://images.unsplash.com/photo-1518182170546-0766bd6f6a56?q=80&w=800&auto=format&fit=crop' },
          { id: 'bh-img-2', title: 'Tarsier Sanctuary', url: 'https://images.unsplash.com/photo-1590077423771-474b8862cb24?q=80&w=800&auto=format&fit=crop' },
          { id: 'bh-img-3', title: 'Loboc River', url: 'https://images.unsplash.com/photo-1544253303-346c19694f6e?q=80&w=800&auto=format&fit=crop' },
          { id: 'bh-img-4', title: 'Panglao Shore', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Boracay', 
    name: 'Boracay (Aklan)', 
    cover: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop', 
    subcards: [
      { 
        id: 'boracay-whitebeach', 
        name: 'White Beach', 
        cover: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'br-img-1', title: 'Sunset Views', url: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop' },
          { id: 'br-img-2', title: 'Puka Shell Beach', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
          { id: 'br-img-3', title: 'Island Hopping', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'br-img-4', title: 'Crystal Clear Waters', url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Cebu', 
    name: 'Cebu', 
    cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop', 
    subcards: [
      { 
        id: 'cebu-south', 
        name: 'South Cebu', 
        cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'cb-img-1', title: 'Kawasan Falls', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop' },
          { id: 'cb-img-2', title: 'Moalboal Sardines', url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop' },
          { id: 'cb-img-3', title: 'Oslob Whalesharks', url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800&auto=format&fit=crop' },
          { id: 'cb-img-4', title: 'Sumilon Island', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Manila', 
    name: 'Manila', 
    cover: 'https://images.unsplash.com/photo-1518439179707-1b0b7531776b?q=80&w=800&auto=format&fit=crop', 
    subcards: [
      { 
        id: 'manila-intra', 
        name: 'Intramuros', 
        cover: 'https://images.unsplash.com/photo-1518439179707-1b0b7531776b?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'mn-img-1', title: 'Walled City', url: 'https://images.unsplash.com/photo-1518439179707-1b0b7531776b?q=80&w=800&auto=format&fit=crop' },
          { id: 'mn-img-2', title: 'Manila Bay Sunset', url: 'https://images.unsplash.com/photo-1561501900-3701fa6a36a6?q=80&w=800&auto=format&fit=crop' },
          { id: 'mn-img-3', title: 'City Skyline', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop' },
          { id: 'mn-img-4', title: 'Historic Streets', url: 'https://images.unsplash.com/photo-1542314831-c6a420325142?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Banaue', 
    name: 'Ifugao (Banaue)', 
    cover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop', 
    subcards: [
      { 
        id: 'banaue-terraces', 
        name: 'Rice Terraces', 
        cover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'bn-img-1', title: 'Eighth Wonder', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop' },
          { id: 'bn-img-2', title: 'Mountain Village', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'bn-img-3', title: 'Morning Mist', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
          { id: 'bn-img-4', title: 'Cultural Heritage', url: 'https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    ] 
  }
];

const Gallery = () => {
  const { t } = usePreferences();
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedSubcard, setSelectedSubcard] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  const availableSubcards = selectedRegion === 'All' ? [] : galleryData.find(r => r.id === selectedRegion)?.subcards || [];

  useEffect(() => { if (selectedRegion === 'All') { setSelectedSubcard('All'); } }, [selectedRegion]);

  const handleRegionClick = (regionId) => { setSelectedRegion(regionId); setSelectedSubcard('All'); setSearchKeyword(''); window.scrollTo({ top: 400, behavior: 'smooth' }); };
  const handleSubcardClick = (subcardName) => { setSelectedSubcard(subcardName); setSearchKeyword(''); window.scrollTo({ top: 400, behavior: 'smooth' }); };
  const handleBackToRegions = () => { setSelectedRegion('All'); setSelectedSubcard('All'); };
  const handleBackToSubcards = () => { setSelectedSubcard('All'); };

  const renderRegions = () => {
    const filteredRegions = galleryData.filter(r => r.name.toLowerCase().includes(searchKeyword.toLowerCase()));
    return (
      <div className="fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4"><h4 className="text-white font-montserrat fw-bold mb-0">Explore by Region</h4><span className="text-white-50 small">{galleryData.length} Regions</span></div>
        <div className="row g-4">{filteredRegions.map((region) => (<div key={region.id} className="col-md-4 scroll-reveal visible"><div className="card h-100 border-0 overflow-hidden shadow" style={{ cursor: 'pointer' }} onClick={() => handleRegionClick(region.id)}><div className="card-img-wrapper" style={{ height: '250px' }}><img src={region.cover} className="card-img-top w-100 h-100 object-fit-cover" alt={region.name} /><div className="position-absolute w-100 h-100 top-0 start-0 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.3)', transition: 'background 0.3s' }}><h3 className="text-white fw-bold text-uppercase shadow-sm" style={{ letterSpacing: '2px', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>{region.name}</h3></div></div></div></div>))}</div>
      </div>
    );
  };

  const renderSubcards = () => {
    const region = galleryData.find(r => r.id === selectedRegion);
    if (!region) return null;
    const filteredSubcards = region.subcards.filter(s => s.name.toLowerCase().includes(searchKeyword.toLowerCase()));
    return (
      <div className="fade-in">
        <button className="btn btn-link text-white text-decoration-none p-0 mb-4 opacity-75" onClick={handleBackToRegions}><i className="fa-solid fa-arrow-left me-2"></i> Back to All Regions</button>
        <div className="d-flex justify-content-between align-items-center mb-4"><h4 className="text-white font-montserrat fw-bold mb-0">{region.name} Destinations</h4><span className="text-white-50 small">{region.subcards.length} Locations</span></div>
        <div className="row g-4 justify-content-center">{filteredSubcards.map((sub) => (<div key={sub.id} className="col-md-4 scroll-reveal visible"><div className="card h-100 border-0 shadow" style={{ cursor: 'pointer', backgroundColor: 'var(--card-bg)' }} onClick={() => handleSubcardClick(sub.name)}><div className="card-img-wrapper" style={{ height: '220px' }}><span className="card-badge" style={{ top: '10px', right: '10px', fontSize: '0.65rem' }}>{sub.images.length} Images</span><img src={sub.cover} className="card-img-top w-100 h-100 object-fit-cover" alt={sub.name} /></div><div className="card-body p-3 text-center"><h6 className="card-title mb-0 fs-5 text-white">{sub.name}</h6></div></div></div>))}</div>
      </div>
    );
  };

  const renderImages = () => {
    const region = galleryData.find(r => r.id === selectedRegion);
    const subcard = region?.subcards.find(s => s.name === selectedSubcard);
    if (!subcard) return null;
    const filteredImages = subcard.images.filter(img => img.title.toLowerCase().includes(searchKeyword.toLowerCase()));
    return (
      <div className="fade-in">
        <button className="btn btn-link text-white text-decoration-none p-0 mb-4 opacity-75" onClick={handleBackToSubcards}><i className="fa-solid fa-arrow-left me-2"></i> Back to {region.name} Destinations</button>
        <div className="d-flex justify-content-between align-items-center mb-4"><h4 className="text-white font-montserrat fw-bold mb-0">{subcard.name} Gallery</h4><span className="text-white-50 small">{subcard.images.length} Photos</span></div>
        <div className="row g-3">{filteredImages.map((img) => (<div key={img.id} className="col-6 col-md-4 col-lg-3 scroll-reveal visible gallery-item"><div className="position-relative overflow-hidden rounded-3 shadow-sm h-100"><img src={img.url} alt={img.title} className="w-100 h-100 object-fit-cover gallery-img" style={{ aspectRatio: '1/1', transition: 'transform 0.4s ease' }} /><div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}><small className="text-white font-montserrat fw-semibold">{img.title}</small></div></div></div>))}</div>
      </div>
    );
  };

  return (
    <div className="fade-in" style={{ paddingTop: '76px' }}>
      
      <section className="gallery-hero" style={{ 
          backgroundImage: "linear-gradient(to bottom, rgba(2, 26, 46, 0.4), #021A2E), url('https://images.unsplash.com/photo-1590077423771-474b8862cb24?q=80&w=2000&auto=format&fit=crop')",
          padding: '130px 0 50px 0', backgroundSize: 'cover', backgroundPosition: 'center 30%'
      }}>
          <div className="container text-center mb-4 scroll-reveal visible">
              <h1 className="hero-title" style={{ fontSize: '4rem' }}>{t('gal_title', 'VISUAL JOURNEY')}</h1>
              <p className="section-desc mb-0">{t('gal_desc', 'Discover the beauty of the Philippines through our lens')}</p>
          </div>

          <div className="container pb-4 scroll-reveal visible delay-1">
              <div className="search-filter-bar p-4 rounded-4 mx-auto" style={{ maxWidth: '900px', backgroundColor: '#03233B', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="row g-3 align-items-center">
                      <div className="col-md-4"><label className="text-white-50 small mb-1 fw-bold">Region</label><div className="input-with-icon position-relative"><i className="fa-solid fa-map-location-dot position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#a0a0a0', zIndex: 1 }}></i><select className="form-select w-100 border-0" style={{ backgroundColor: '#021625', color: 'white', paddingLeft: '45px', height: '50px' }} value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedSubcard('All'); }}><option value="All">All Regions</option>{galleryData.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}</select></div></div>
                      <div className="col-md-4"><label className="text-white-50 small mb-1 fw-bold">Location</label><div className="input-with-icon position-relative"><i className="fa-solid fa-camera position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#a0a0a0', zIndex: 1 }}></i><select className="form-select w-100 border-0" style={{ backgroundColor: '#021625', color: 'white', paddingLeft: '45px', height: '50px' }} value={selectedSubcard} onChange={(e) => setSelectedSubcard(e.target.value)} disabled={selectedRegion === 'All'}><option value="All">{selectedRegion === 'All' ? 'Select a Region first' : 'All Locations'}</option>{availableSubcards.map(sub => (<option key={sub.id} value={sub.name}>{sub.name}</option>))}</select></div></div>
                      <div className="col-md-4"><label className="text-white-50 small mb-1 fw-bold">Keyword Search</label><div className="input-with-icon position-relative"><i className="fa-solid fa-magnifying-glass position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#a0a0a0', zIndex: 1 }}></i><input type="text" className="form-control border-0 w-100" style={{ backgroundColor: '#021625', color: 'white', paddingLeft: '45px', height: '50px' }} placeholder="Type to search..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/></div></div>
                  </div>
              </div>
          </div>
      </section>

      <section className="py-5" style={{ minHeight: '500px', backgroundColor: 'var(--bg-dark)' }}>
        <div className="container">
          {selectedRegion === 'All' && renderRegions()}
          {selectedRegion !== 'All' && selectedSubcard === 'All' && renderSubcards()}
          {selectedRegion !== 'All' && selectedSubcard !== 'All' && renderImages()}
        </div>
      </section>

    </div>
  );
};

export default Gallery;
