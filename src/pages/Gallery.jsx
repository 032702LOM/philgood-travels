import React, { useState, useEffect } from 'react';
import { usePreferences } from '../context/PreferencesContext';

// ==========================================
// HARD-CODED GALLERY DATA
// 6 Regions -> 3 Subcards per Region -> 5 Images per Subcard
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
          { id: 'el-img-4', title: 'Limestone Cliffs', url: 'https://images.unsplash.com/photo-1606676366299-fdec90590467?q=80&w=800&auto=format&fit=crop' },
          { id: 'el-img-5', title: 'Hidden Lagoon', url: 'https://images.unsplash.com/photo-1544253303-346c19694f6e?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'palawan-coron', 
        name: 'Coron', 
        cover: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'co-img-1', title: 'Kayangan Lake', url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop' },
          { id: 'co-img-2', title: 'Twin Lagoon', url: 'https://images.unsplash.com/photo-1531168556467-8053153c361c?q=80&w=800&auto=format&fit=crop' },
          { id: 'co-img-3', title: 'Shipwreck Dive', url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop' },
          { id: 'co-img-4', title: 'Mt. Tapyas View', url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800&auto=format&fit=crop' },
          { id: 'co-img-5', title: 'Coron Bay', url: 'https://images.unsplash.com/photo-1520626337972-8ee434ee744c?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'palawan-puerto', 
        name: 'Puerto Princesa', 
        cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'pp-img-1', title: 'Underground River', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop' },
          { id: 'pp-img-2', title: 'Honda Bay', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop' },
          { id: 'pp-img-3', title: 'City Tour', url: 'https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=800&auto=format&fit=crop' },
          { id: 'pp-img-4', title: 'Firefly Watching', url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&auto=format&fit=crop' },
          { id: 'pp-img-5', title: 'Sabang Beach', url: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop' }
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
          { id: 'ch-img-1', title: 'Sunrise Hills', url: 'https://images.unsplash.com/photo-1518182170546-0766bd6f6a56?q=80&w=800&auto=format&fit=crop' },
          { id: 'ch-img-2', title: 'Viewing Deck', url: 'https://images.unsplash.com/photo-1590077423771-474b8862cb24?q=80&w=800&auto=format&fit=crop' },
          { id: 'ch-img-3', title: 'ATV Adventure', url: 'https://images.unsplash.com/photo-1544253303-346c19694f6e?q=80&w=800&auto=format&fit=crop' },
          { id: 'ch-img-4', title: 'Green Season', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop' },
          { id: 'ch-img-5', title: 'Brown Season', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'bohol-panglao', 
        name: 'Panglao Island', 
        cover: 'https://images.unsplash.com/photo-1571407921666-da644f80c656?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'pa-img-1', title: 'Alona Beach', url: 'https://images.unsplash.com/photo-1571407921666-da644f80c656?q=80&w=800&auto=format&fit=crop' },
          { id: 'pa-img-2', title: 'Dumaluan Beach', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop' },
          { id: 'pa-img-3', title: 'Balicasag Island', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
          { id: 'pa-img-4', title: 'Hinagdanan Reef', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'pa-img-5', title: 'Resort Sunset', url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'bohol-loboc', 
        name: 'Loboc River', 
        cover: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'lo-img-1', title: 'River Cruise', url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&auto=format&fit=crop' },
          { id: 'lo-img-2', title: 'Tarsier Sanctuary', url: 'https://images.unsplash.com/photo-1590077423771-474b8862cb24?q=80&w=800&auto=format&fit=crop' },
          { id: 'lo-img-3', title: 'Floating Restaurant', url: 'https://images.unsplash.com/photo-1518182170546-0766bd6f6a56?q=80&w=800&auto=format&fit=crop' },
          { id: 'lo-img-4', title: 'Paddle Boarding', url: 'https://images.unsplash.com/photo-1544253303-346c19694f6e?q=80&w=800&auto=format&fit=crop' },
          { id: 'lo-img-5', title: 'Jungle Views', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop' }
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
        id: 'boracay-white', 
        name: 'White Beach', 
        cover: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'wb-img-1', title: 'Station 1 Views', url: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop' },
          { id: 'wb-img-2', title: 'Paraw Sailing', url: 'https://images.unsplash.com/photo-1544253303-346c19694f6e?q=80&w=800&auto=format&fit=crop' },
          { id: 'wb-img-3', title: 'Famous Sunset', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
          { id: 'wb-img-4', title: 'Station 2 Sands', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'wb-img-5', title: 'Nightlife Fire Dance', url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'boracay-puka', 
        name: 'Puka Shell Beach', 
        cover: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'ps-img-1', title: 'Quiet Shores', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
          { id: 'ps-img-2', title: 'Puka Shells', url: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop' },
          { id: 'ps-img-3', title: 'Crystal Waters', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'ps-img-4', title: 'Local Vendors', url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800&auto=format&fit=crop' },
          { id: 'ps-img-5', title: 'Island Hopping Boat', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'boracay-ariel', 
        name: 'Ariels Point', 
        cover: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'ap-img-1', title: 'Cliff Diving', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'ap-img-2', title: 'Snorkeling', url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop' },
          { id: 'ap-img-3', title: 'Kayaking', url: 'https://images.unsplash.com/photo-1544253303-346c19694f6e?q=80&w=800&auto=format&fit=crop' },
          { id: 'ap-img-4', title: 'Boat Party', url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800&auto=format&fit=crop' },
          { id: 'ap-img-5', title: 'Ocean Views', url: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop' }
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
          { id: 'sc-img-1', title: 'Kawasan Falls', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop' },
          { id: 'sc-img-2', title: 'Moalboal Sardines', url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop' },
          { id: 'sc-img-3', title: 'Oslob Whalesharks', url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800&auto=format&fit=crop' },
          { id: 'sc-img-4', title: 'Sumilon Island', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
          { id: 'sc-img-5', title: 'Canyoneering', url: 'https://images.unsplash.com/photo-1531168556467-8053153c361c?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'cebu-city', 
        name: 'Cebu City', 
        cover: 'https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'cc-img-1', title: 'Magellans Cross', url: 'https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=800&auto=format&fit=crop' },
          { id: 'cc-img-2', title: 'Basilica Minore', url: 'https://images.unsplash.com/photo-1518439179707-1b0b7531776b?q=80&w=800&auto=format&fit=crop' },
          { id: 'cc-img-3', title: 'Sirao Garden', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
          { id: 'cc-img-4', title: 'Temple of Leah', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'cc-img-5', title: 'City Skyline', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'cebu-bantayan', 
        name: 'Bantayan Island', 
        cover: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'ba-img-1', title: 'Kota Beach', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop' },
          { id: 'ba-img-2', title: 'Virgin Island', url: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=800&auto=format&fit=crop' },
          { id: 'ba-img-3', title: 'Ogtong Cave', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop' },
          { id: 'ba-img-4', title: 'Sandbar', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'ba-img-5', title: 'Sunset Views', url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800&auto=format&fit=crop' }
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
          { id: 'in-img-1', title: 'Walled City', url: 'https://images.unsplash.com/photo-1518439179707-1b0b7531776b?q=80&w=800&auto=format&fit=crop' },
          { id: 'in-img-2', title: 'Fort Santiago', url: 'https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=800&auto=format&fit=crop' },
          { id: 'in-img-3', title: 'Manila Cathedral', url: 'https://images.unsplash.com/photo-1561501900-3701fa6a36a6?q=80&w=800&auto=format&fit=crop' },
          { id: 'in-img-4', title: 'Cobblestone Streets', url: 'https://images.unsplash.com/photo-1542314831-c6a420325142?q=80&w=800&auto=format&fit=crop' },
          { id: 'in-img-5', title: 'Kalesa Ride', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'manila-makati', 
        name: 'Makati CBD', 
        cover: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'mk-img-1', title: 'City Skyline', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop' },
          { id: 'mk-img-2', title: 'Ayala Triangle', url: 'https://images.unsplash.com/photo-1561501900-3701fa6a36a6?q=80&w=800&auto=format&fit=crop' },
          { id: 'mk-img-3', title: 'Night City Lights', url: 'https://images.unsplash.com/photo-1518439179707-1b0b7531776b?q=80&w=800&auto=format&fit=crop' },
          { id: 'mk-img-4', title: 'Greenbelt Park', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
          { id: 'mk-img-5', title: 'Modern Architecture', url: 'https://images.unsplash.com/photo-1542314831-c6a420325142?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'manila-bay', 
        name: 'Manila Bay', 
        cover: 'https://images.unsplash.com/photo-1561501900-3701fa6a36a6?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'mb-img-1', title: 'Bay Sunset', url: 'https://images.unsplash.com/photo-1561501900-3701fa6a36a6?q=80&w=800&auto=format&fit=crop' },
          { id: 'mb-img-2', title: 'Rizal Park', url: 'https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=800&auto=format&fit=crop' },
          { id: 'mb-img-3', title: 'Ocean Park', url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop' },
          { id: 'mb-img-4', title: 'Baywalk Promenade', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop' },
          { id: 'mb-img-5', title: 'Cultural Center', url: 'https://images.unsplash.com/photo-1518439179707-1b0b7531776b?q=80&w=800&auto=format&fit=crop' }
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
        id: 'banaue-batad', 
        name: 'Batad Terraces', 
        cover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'bt-img-1', title: 'Amphitheater View', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop' },
          { id: 'bt-img-2', title: 'Rice Paddies', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
          { id: 'bt-img-3', title: 'Mountain Village', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'bt-img-4', title: 'Trekking Trails', url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&auto=format&fit=crop' },
          { id: 'bt-img-5', title: 'Ifugao Culture', url: 'https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'banaue-view', 
        name: 'Banaue Viewpoint', 
        cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'vp-img-1', title: 'Main Viewpoint', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
          { id: 'vp-img-2', title: 'Morning Mist', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'vp-img-3', title: 'Terraces Horizon', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop' },
          { id: 'vp-img-4', title: 'Local Handicrafts', url: 'https://images.unsplash.com/photo-1518182170546-0766bd6f6a56?q=80&w=800&auto=format&fit=crop' },
          { id: 'vp-img-5', title: 'Sunset Glow', url: 'https://images.unsplash.com/photo-1590077423771-474b8862cb24?q=80&w=800&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'banaue-tappiya', 
        name: 'Tappiya Falls', 
        cover: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop',
        images: [
          { id: 'tf-img-1', title: 'Hidden Waterfall', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' },
          { id: 'tf-img-2', title: 'Jungle Hike', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
          { id: 'tf-img-3', title: 'Plunge Pool', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop' },
          { id: 'tf-img-4', title: 'River Boulders', url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&auto=format&fit=crop' },
          { id: 'tf-img-5', title: 'Nature Escape', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop' }
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
                  <img src={region.cover} className="card-img-top w-100 h-100 object-fit-cover" alt={region.name} />
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
                  <img src={sub.cover} className="card-img-top w-100 h-100 object-fit-cover" alt={sub.name} />
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
        
        {/* --- UPDATED GRID LAYOUT FOR 5 IMAGES --- */}
        <div className="row g-3 justify-content-center">
          {filteredImages.map((img) => (
            // Changed from col-lg-3 (25% width) to col-lg (auto width) so 5 items share the row equally
            <div key={img.id} className="col-6 col-md-4 col-lg scroll-reveal visible gallery-item" style={{ minWidth: '20%' }}>
              <div className="position-relative overflow-hidden rounded-3 shadow-sm h-100">
                <img src={img.url} alt={img.title} className="w-100 h-100 object-fit-cover gallery-img" style={{ aspectRatio: '1/1', transition: 'transform 0.4s ease' }} />
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