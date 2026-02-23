import React, { useState, useEffect } from 'react';
import { usePreferences } from '../context/PreferencesContext';

// ==========================================
// FOOLPROOF GALLERY DATA
// ==========================================
const galleryData = [
  { 
    id: 'Palawan', name: 'Palawan', cover: 'https://loremflickr.com/1000/1000/Palawan,Beach/all?lock=50', 
    subcards: [
      { 
        id: 'palawan-elnido', name: 'El Nido', cover: 'https://loremflickr.com/1000/1000/El,Nido,Lagoon/all?lock=51',
        images: [
          { id: 'el-1', title: 'Limestone Cliffs', url: 'https://loremflickr.com/1000/1000/El,Nido,Lagoon/all?lock=51' },
          { id: 'el-2', title: 'Clear Waters', url: 'https://loremflickr.com/1000/1000/El,Nido,Lagoon/all?lock=52' },
          { id: 'el-3', title: 'Hidden Lagoon', url: 'https://loremflickr.com/1000/1000/El,Nido,Lagoon/all?lock=53' },
          { id: 'el-4', title: 'Secret Beach', url: 'https://loremflickr.com/1000/1000/El,Nido,Lagoon/all?lock=54' },
          { id: 'el-5', title: 'Island Boat', url: 'https://loremflickr.com/1000/1000/El,Nido,Lagoon/all?lock=55' }
        ]
      },
      { 
        id: 'palawan-coron', name: 'Coron', cover: 'https://loremflickr.com/1000/1000/Coron,Palawan/all?lock=61',
        images: [
          { id: 'co-1', title: 'Kayangan Lake', url: 'https://loremflickr.com/1000/1000/Coron,Palawan/all?lock=61' },
          { id: 'co-2', title: 'Shipwreck Dive', url: 'https://loremflickr.com/1000/1000/Coron,Palawan/all?lock=62' },
          { id: 'co-3', title: 'Twin Lagoon', url: 'https://loremflickr.com/1000/1000/Coron,Palawan/all?lock=63' },
          { id: 'co-4', title: 'Tropical Palms', url: 'https://loremflickr.com/1000/1000/Coron,Palawan/all?lock=64' },
          { id: 'co-5', title: 'Coron Sunset', url: 'https://loremflickr.com/1000/1000/Coron,Palawan/all?lock=65' }
        ]
      },
      { 
        id: 'palawan-puerto', name: 'Puerto Princesa', cover: 'https://loremflickr.com/1000/1000/Puerto,Princesa,River/all?lock=71',
        images: [
          { id: 'pp-1', title: 'Mangrove River', url: 'https://loremflickr.com/1000/1000/Puerto,Princesa,River/all?lock=71' },
          { id: 'pp-2', title: 'Honda Bay', url: 'https://loremflickr.com/1000/1000/Puerto,Princesa,River/all?lock=72' },
          { id: 'pp-3', title: 'Eco Resort', url: 'https://loremflickr.com/1000/1000/Puerto,Princesa,River/all?lock=73' },
          { id: 'pp-4', title: 'City Walk', url: 'https://loremflickr.com/1000/1000/Puerto,Princesa,River/all?lock=74' },
          { id: 'pp-5', title: 'Sabang Beach', url: 'https://loremflickr.com/1000/1000/Puerto,Princesa,River/all?lock=75' }
        ]
      }
    ] 
  },
  { 
    id: 'Bohol', name: 'Bohol', cover: 'https://loremflickr.com/1000/1000/Bohol,Landscape/all?lock=80', 
    subcards: [
      { 
        id: 'bohol-choc', name: 'Chocolate Hills', cover: 'https://loremflickr.com/1000/1000/Chocolate,Hills,Bohol/all?lock=81',
        images: [
          { id: 'ch-1', title: 'Sunrise Hills', url: 'https://loremflickr.com/1000/1000/Chocolate,Hills,Bohol/all?lock=81' },
          { id: 'ch-2', title: 'Viewing Deck', url: 'https://loremflickr.com/1000/1000/Chocolate,Hills,Bohol/all?lock=82' },
          { id: 'ch-3', title: 'Lush Greenery', url: 'https://loremflickr.com/1000/1000/Chocolate,Hills,Bohol/all?lock=83' },
          { id: 'ch-4', title: 'Trekking Path', url: 'https://loremflickr.com/1000/1000/Chocolate,Hills,Bohol/all?lock=84' },
          { id: 'ch-5', title: 'ATV Trails', url: 'https://loremflickr.com/1000/1000/Chocolate,Hills,Bohol/all?lock=85' }
        ]
      },
      { 
        id: 'bohol-panglao', name: 'Panglao Island', cover: 'https://loremflickr.com/1000/1000/Panglao,Island/all?lock=91',
        images: [
          { id: 'pa-1', title: 'Alona Beach', url: 'https://loremflickr.com/1000/1000/Panglao,Island/all?lock=91' },
          { id: 'pa-2', title: 'Dumaluan Sand', url: 'https://loremflickr.com/1000/1000/Panglao,Island/all?lock=92' },
          { id: 'pa-3', title: 'Balicasag Reef', url: 'https://loremflickr.com/1000/1000/Panglao,Island/all?lock=93' },
          { id: 'pa-4', title: 'Resort Pool', url: 'https://loremflickr.com/1000/1000/Panglao,Island/all?lock=94' },
          { id: 'pa-5', title: 'Ocean Sunset', url: 'https://loremflickr.com/1000/1000/Panglao,Island/all?lock=95' }
        ]
      },
      { 
        id: 'bohol-loboc', name: 'Loboc River', cover: 'https://loremflickr.com/1000/1000/Loboc,River,Bohol/all?lock=101',
        images: [
          { id: 'lo-1', title: 'River Cruise', url: 'https://loremflickr.com/1000/1000/Loboc,River,Bohol/all?lock=101' },
          { id: 'lo-2', title: 'Jungle Canopy', url: 'https://loremflickr.com/1000/1000/Loboc,River,Bohol/all?lock=102' },
          { id: 'lo-3', title: 'Paddle Boarding', url: 'https://loremflickr.com/1000/1000/Loboc,River,Bohol/all?lock=103' },
          { id: 'lo-4', title: 'Tarsier Sanctuary', url: 'https://loremflickr.com/1000/1000/Loboc,River,Bohol/all?lock=104' },
          { id: 'lo-5', title: 'Rainforest Views', url: 'https://loremflickr.com/1000/1000/Loboc,River,Bohol/all?lock=105' }
        ]
      }
    ] 
  },
  { 
    id: 'Boracay', name: 'Boracay (Aklan)', cover: 'https://loremflickr.com/1000/1000/Boracay,Beach/all?lock=110', 
    subcards: [
      { 
        id: 'boracay-white', name: 'White Beach', cover: 'https://loremflickr.com/1000/1000/White,Beach,Boracay/all?lock=111',
        images: [
          { id: 'wb-1', title: 'Station 1 Sand', url: 'https://loremflickr.com/1000/1000/White,Beach,Boracay/all?lock=111' },
          { id: 'wb-2', title: 'Paraw Sailing', url: 'https://loremflickr.com/1000/1000/White,Beach,Boracay/all?lock=112' },
          { id: 'wb-3', title: 'Famous Sunset', url: 'https://loremflickr.com/1000/1000/White,Beach,Boracay/all?lock=113' },
          { id: 'wb-4', title: 'Station 2 Vibe', url: 'https://loremflickr.com/1000/1000/White,Beach,Boracay/all?lock=114' },
          { id: 'wb-5', title: 'Nightlife', url: 'https://loremflickr.com/1000/1000/White,Beach,Boracay/all?lock=115' }
        ]
      },
      { 
        id: 'boracay-puka', name: 'Puka Shell Beach', cover: 'https://loremflickr.com/1000/1000/Puka,Shell,Beach/all?lock=121',
        images: [
          { id: 'ps-1', title: 'Quiet Shores', url: 'https://loremflickr.com/1000/1000/Puka,Shell,Beach/all?lock=121' },
          { id: 'ps-2', title: 'Puka Shells', url: 'https://loremflickr.com/1000/1000/Puka,Shell,Beach/all?lock=122' },
          { id: 'ps-3', title: 'Crystal Waters', url: 'https://loremflickr.com/1000/1000/Puka,Shell,Beach/all?lock=123' },
          { id: 'ps-4', title: 'Island Boat', url: 'https://loremflickr.com/1000/1000/Puka,Shell,Beach/all?lock=124' },
          { id: 'ps-5', title: 'Ocean Views', url: 'https://loremflickr.com/1000/1000/Puka,Shell,Beach/all?lock=125' }
        ]
      },
      { 
        id: 'boracay-diniwid', name: 'Diniwid', cover: 'https://loremflickr.com/1000/1000/Diniwid,Beach/all?lock=131',
        images: [
          { id: 'dw-1', title: 'Cliff Cove', url: 'https://loremflickr.com/1000/1000/Diniwid,Beach/all?lock=131' },
          { id: 'dw-2', title: 'Hidden Beach', url: 'https://loremflickr.com/1000/1000/Diniwid,Beach/all?lock=132' },
          { id: 'dw-3', title: 'Rocky Shore', url: 'https://loremflickr.com/1000/1000/Diniwid,Beach/all?lock=133' },
          { id: 'dw-4', title: 'Coastal Walk', url: 'https://loremflickr.com/1000/1000/Diniwid,Beach/all?lock=134' },
          { id: 'dw-5', title: 'Sunset Cocktails', url: 'https://loremflickr.com/1000/1000/Diniwid,Beach/all?lock=135' }
        ]
      }
    ] 
  },
  { 
    id: 'Cebu', name: 'Cebu', cover: 'https://loremflickr.com/1000/1000/Cebu,Beach/all?lock=140', 
    subcards: [
      { 
        id: 'cebu-moalboal', name: 'Moalboal', cover: 'https://loremflickr.com/1000/1000/Moalboal,Sardines/all?lock=141',
        images: [
          { id: 'mb-1', title: 'Sardine Run', url: 'https://loremflickr.com/1000/1000/Moalboal,Sardines/all?lock=141' },
          { id: 'mb-2', title: 'Coral Reefs', url: 'https://loremflickr.com/1000/1000/Moalboal,Sardines/all?lock=142' },
          { id: 'mb-3', title: 'Sea Turtles', url: 'https://loremflickr.com/1000/1000/Moalboal,Sardines/all?lock=143' },
          { id: 'mb-4', title: 'Dive Spot', url: 'https://loremflickr.com/1000/1000/Moalboal,Sardines/all?lock=144' },
          { id: 'mb-5', title: 'Beach Life', url: 'https://loremflickr.com/1000/1000/Moalboal,Sardines/all?lock=145' }
        ]
      },
      { 
        id: 'cebu-oslob', name: 'Oslob', cover: 'https://loremflickr.com/1000/1000/Oslob,Whale/all?lock=151',
        images: [
          { id: 'os-1', title: 'Whale Sharks', url: 'https://loremflickr.com/1000/1000/Oslob,Whale/all?lock=151' },
          { id: 'os-2', title: 'Kawasan Falls', url: 'https://loremflickr.com/1000/1000/Oslob,Whale/all?lock=152' },
          { id: 'os-3', title: 'Sumilon Island', url: 'https://loremflickr.com/1000/1000/Oslob,Whale/all?lock=153' },
          { id: 'os-4', title: 'Canyoneering', url: 'https://loremflickr.com/1000/1000/Oslob,Whale/all?lock=154' },
          { id: 'os-5', title: 'South Cebu', url: 'https://loremflickr.com/1000/1000/Oslob,Whale/all?lock=155' }
        ]
      },
      { 
        id: 'cebu-bantayan', name: 'Bantayan Island', cover: 'https://loremflickr.com/1000/1000/Bantayan,Island/all?lock=161',
        images: [
          { id: 'bi-1', title: 'Kota Beach', url: 'https://loremflickr.com/1000/1000/Bantayan,Island/all?lock=161' },
          { id: 'bi-2', title: 'Virgin Island', url: 'https://loremflickr.com/1000/1000/Bantayan,Island/all?lock=162' },
          { id: 'bi-3', title: 'Ogtong Cave', url: 'https://loremflickr.com/1000/1000/Bantayan,Island/all?lock=163' },
          { id: 'bi-4', title: 'Sandbar Views', url: 'https://loremflickr.com/1000/1000/Bantayan,Island/all?lock=164' },
          { id: 'bi-5', title: 'Relaxing Vibes', url: 'https://loremflickr.com/1000/1000/Bantayan,Island/all?lock=165' }
        ]
      }
    ] 
  },
  { 
    id: 'Manila', name: 'Manila', cover: 'https://loremflickr.com/1000/1000/Manila,City/all?lock=170', 
    subcards: [
      { 
        id: 'manila-intra', name: 'Intramuros', cover: 'https://loremflickr.com/1000/1000/Intramuros,Manila/all?lock=171',
        images: [
          { id: 'in-1', title: 'Walled City', url: 'https://loremflickr.com/1000/1000/Intramuros,Manila/all?lock=171' },
          { id: 'in-2', title: 'Fort Santiago', url: 'https://loremflickr.com/1000/1000/Intramuros,Manila/all?lock=172' },
          { id: 'in-3', title: 'Manila Cathedral', url: 'https://loremflickr.com/1000/1000/Intramuros,Manila/all?lock=173' },
          { id: 'in-4', title: 'Cobblestones', url: 'https://loremflickr.com/1000/1000/Intramuros,Manila/all?lock=174' },
          { id: 'in-5', title: 'Historic Vibe', url: 'https://loremflickr.com/1000/1000/Intramuros,Manila/all?lock=175' }
        ]
      },
      { 
        id: 'manila-rizal', name: 'Rizal Park', cover: 'https://loremflickr.com/1000/1000/Rizal,Park,Manila/all?lock=181',
        images: [
          { id: 'rp-1', title: 'Park Monument', url: 'https://loremflickr.com/1000/1000/Rizal,Park,Manila/all?lock=181' },
          { id: 'rp-2', title: 'Green Spaces', url: 'https://loremflickr.com/1000/1000/Rizal,Park,Manila/all?lock=182' },
          { id: 'rp-3', title: 'City Gardens', url: 'https://loremflickr.com/1000/1000/Rizal,Park,Manila/all?lock=183' },
          { id: 'rp-4', title: 'National Museum', url: 'https://loremflickr.com/1000/1000/Rizal,Park,Manila/all?lock=184' },
          { id: 'rp-5', title: 'Sunset Walks', url: 'https://loremflickr.com/1000/1000/Rizal,Park,Manila/all?lock=185' }
        ]
      },
      { 
        id: 'manila-bgc', name: 'BGC', cover: 'https://loremflickr.com/1000/1000/BGC,Manila/all?lock=191',
        images: [
          { id: 'bgc-1', title: 'Modern Skyline', url: 'https://loremflickr.com/1000/1000/BGC,Manila/all?lock=191' },
          { id: 'bgc-2', title: 'High Street', url: 'https://loremflickr.com/1000/1000/BGC,Manila/all?lock=192' },
          { id: 'bgc-3', title: 'Night Lights', url: 'https://loremflickr.com/1000/1000/BGC,Manila/all?lock=193' },
          { id: 'bgc-4', title: 'Luxury Malls', url: 'https://loremflickr.com/1000/1000/BGC,Manila/all?lock=194' },
          { id: 'bgc-5', title: 'City Living', url: 'https://loremflickr.com/1000/1000/BGC,Manila/all?lock=195' }
        ]
      }
    ] 
  },
  { 
    id: 'Banaue', name: 'Ifugao (Banaue)', cover: 'https://loremflickr.com/1000/1000/Banaue,Terraces/all?lock=200', 
    subcards: [
      { 
        id: 'banaue-batad', name: 'Batad Terraces', cover: 'https://loremflickr.com/1000/1000/Batad,Terraces/all?lock=201',
        images: [
          { id: 'bt-1', title: 'Amphitheater', url: 'https://loremflickr.com/1000/1000/Batad,Terraces/all?lock=201' },
          { id: 'bt-2', title: 'Rice Paddies', url: 'https://loremflickr.com/1000/1000/Batad,Terraces/all?lock=202' },
          { id: 'bt-3', title: 'Village Life', url: 'https://loremflickr.com/1000/1000/Batad,Terraces/all?lock=203' },
          { id: 'bt-4', title: 'Trekking Path', url: 'https://loremflickr.com/1000/1000/Batad,Terraces/all?lock=204' },
          { id: 'bt-5', title: 'Mountain Peaks', url: 'https://loremflickr.com/1000/1000/Batad,Terraces/all?lock=205' }
        ]
      },
      { 
        id: 'banaue-view', name: 'Banaue Viewpoint', cover: 'https://loremflickr.com/1000/1000/Banaue,Viewpoint/all?lock=211',
        images: [
          { id: 'vp-1', title: 'Main Viewpoint', url: 'https://loremflickr.com/1000/1000/Banaue,Viewpoint/all?lock=211' },
          { id: 'vp-2', title: 'Morning Mist', url: 'https://loremflickr.com/1000/1000/Banaue,Viewpoint/all?lock=212' },
          { id: 'vp-3', title: 'Terraces Horizon', url: 'https://loremflickr.com/1000/1000/Banaue,Viewpoint/all?lock=213' },
          { id: 'vp-4', title: 'Heritage', url: 'https://loremflickr.com/1000/1000/Banaue,Viewpoint/all?lock=214' },
          { id: 'vp-5', title: 'Golden Hour', url: 'https://loremflickr.com/1000/1000/Banaue,Viewpoint/all?lock=215' }
        ]
      },
      { 
        id: 'banaue-tappiya', name: 'Tappiya Falls', cover: 'https://loremflickr.com/1000/1000/Tappiya,Falls/all?lock=221',
        images: [
          { id: 'tf-1', title: 'Hidden Waterfall', url: 'https://loremflickr.com/1000/1000/Tappiya,Falls/all?lock=221' },
          { id: 'tf-2', title: 'Jungle Hike', url: 'https://loremflickr.com/1000/1000/Tappiya,Falls/all?lock=222' },
          { id: 'tf-3', title: 'Plunge Pool', url: 'https://loremflickr.com/1000/1000/Tappiya,Falls/all?lock=223' },
          { id: 'tf-4', title: 'River Boulders', url: 'https://loremflickr.com/1000/1000/Tappiya,Falls/all?lock=224' },
          { id: 'tf-5', title: 'Nature Escape', url: 'https://loremflickr.com/1000/1000/Tappiya,Falls/all?lock=225' }
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

  useEffect(() => { 
    if (selectedRegion === 'All') { setSelectedSubcard('All'); } 
  }, [selectedRegion]);

  const handleRegionClick = (regionId) => { setSelectedRegion(regionId); setSelectedSubcard('All'); setSearchKeyword(''); window.scrollTo({ top: 400, behavior: 'smooth' }); };
  const handleSubcardClick = (subcardName) => { setSelectedSubcard(subcardName); setSearchKeyword(''); window.scrollTo({ top: 400, behavior: 'smooth' }); };
  const handleBackToRegions = () => { setSelectedRegion('All'); setSelectedSubcard('All'); };
  const handleBackToSubcards = () => { setSelectedSubcard('All'); };

  const renderRegions = () => {
    const filteredRegions = galleryData.filter(r => r.name.toLowerCase().includes(searchKeyword.toLowerCase()));
    return (
      <div className="fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4"><h4 className="text-white font-montserrat fw-bold mb-0">Explore by Region</h4><span className="text-white-50 small">{galleryData.length} Regions</span></div>
        <div className="row g-4">
          {filteredRegions.map((region) => (
            <div key={region.id} className="col-md-4 scroll-reveal visible">
              <div className="card h-100 border-0 overflow-hidden shadow" style={{ cursor: 'pointer' }} onClick={() => handleRegionClick(region.id)}>
                <div className="card-img-wrapper" style={{ height: '250px' }}>
                  <img src={region.cover} className="card-img-top w-100 h-100 object-fit-cover" alt={region.name} loading="lazy" />
                  <div className="position-absolute w-100 h-100 top-0 start-0 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.3)', transition: 'background 0.3s' }}>
                    <h3 className="text-white fw-bold text-uppercase shadow-sm" style={{ letterSpacing: '2px', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>{region.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
        <div className="row g-4 justify-content-center">
          {filteredSubcards.map((sub) => (
            <div key={sub.id} className="col-md-4 scroll-reveal visible">
              <div className="card h-100 border-0 shadow" style={{ cursor: 'pointer', backgroundColor: 'var(--card-bg)' }} onClick={() => handleSubcardClick(sub.name)}>
                <div className="card-img-wrapper" style={{ height: '220px' }}>
                  <span className="card-badge" style={{ top: '10px', right: '10px', fontSize: '0.65rem' }}>{sub.images.length} Images</span>
                  <img src={sub.cover} className="card-img-top w-100 h-100 object-fit-cover" alt={sub.name} loading="lazy" />
                </div>
                <div className="card-body p-3 text-center">
                  <h6 className="card-title mb-0 fs-5 text-white">{sub.name}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
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
        <button className="btn btn-link text-white text-decoration-none p-0 mb-4 opacity-75" onClick={handleBackToSubcards}>
            <i className="fa-solid fa-arrow-left me-2"></i> Back to {region.name} Destinations
        </button>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-white font-montserrat fw-bold mb-0">{subcard.name} Gallery</h4>
            <span className="text-white-50 small">{subcard.images.length} Photos</span>
        </div>
        
        <div className="row g-3 justify-content-center">
          {filteredImages.map((img) => (
            <div key={img.id} className="col-6 col-md-4 col-lg scroll-reveal visible gallery-item" style={{ minWidth: '20%' }}>
              <div className="position-relative overflow-hidden rounded-3 shadow-sm h-100">
                <img src={img.url} alt={img.title} loading="lazy" className="w-100 h-100 object-fit-cover gallery-img" style={{ aspectRatio: '1/1', transition: 'transform 0.4s ease' }} />
                <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                  <small className="text-white font-montserrat fw-semibold">{img.title}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
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