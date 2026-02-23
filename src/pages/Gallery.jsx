import React, { useState, useEffect } from 'react';
import { usePreferences } from '../context/PreferencesContext';

// ==========================================
// GALLERY DATA WITH CUSTOM COVERS
// ==========================================
const galleryData = [
  { 
    id: 'Palawan', name: 'Palawan', cover: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/7d/39/5f/caption.jpg?w=800&h=800&s=1', 
    subcards: [
      { 
        id: 'palawan-elnido', name: 'El Nido', cover: 'https://cdn.getyourguide.com/img/location/5a085ec50c581.jpeg/99.jpg',
        images: [
          { id: 'el-1', title: 'Limestone Cliffs', url: 'https://images.unsplash.com/photo-1520626337972-8ee434ee744c?q=80&w=1000&auto=format&fit=crop' },
          { id: 'el-2', title: 'Clear Waters', url: 'https://images.unsplash.com/photo-1531168556467-8053153c361c?q=80&w=1000&auto=format&fit=crop' },
          { id: 'el-3', title: 'Hidden Lagoon', url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1000&auto=format&fit=crop' },
          { id: 'el-4', title: 'Secret Beach', url: 'https://images.unsplash.com/photo-1544253303-346c19694f6e?q=80&w=1000&auto=format&fit=crop' },
          { id: 'el-5', title: 'Island Boat', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'palawan-coron', name: 'Coron', cover: 'https://chrisandwrensworld.com/wp-content/uploads/2025/05/kayangan-lake.jpeg',
        images: [
          { id: 'co-1', title: 'Kayangan Lake', url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000&auto=format&fit=crop' },
          { id: 'co-2', title: 'Shipwreck Dive', url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1000&auto=format&fit=crop' },
          { id: 'co-3', title: 'Twin Lagoon', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop' },
          { id: 'co-4', title: 'Tropical Palms', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop' },
          { id: 'co-5', title: 'Coron Sunset', url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'palawan-puerto', name: 'Puerto Princesa', cover: 'https://res.cloudinary.com/tourhq/image/upload/c_fill,f_auto,fl_progressive,g_auto,h_900,q_auto:best,w_1800/zk4xamikzjqztvl1oche',
        images: [
          { id: 'pp-1', title: 'Underground River', url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pp-2', title: 'Honda Bay', url: 'https://images.unsplash.com/photo-1542213493895-edf5b94f5a96?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pp-3', title: 'Eco Resort', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pp-4', title: 'City Walk', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pp-5', title: 'Sabang Beach', url: 'https://images.unsplash.com/photo-1588698944583-0498b25350c3?q=80&w=1000&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Bohol', name: 'Bohol', cover: 'https://www.tripsavvy.com/thmb/ENcqAjtXtH3XNV3eIg4MKfSyQ6A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-135558476-8533a33260d9436c9bc432ce630ec732.jpg', 
    subcards: [
      { 
        id: 'bohol-choc', name: 'Chocolate Hills', cover: 'https://azertag.az/files/2022/2/1200x630/1656946012465159130_1200x630.jpg',
        images: [
          { id: 'ch-1', title: 'Sunrise Hills', url: 'https://images.unsplash.com/photo-1518182170546-0766bd6f6a56?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ch-2', title: 'Viewing Deck', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ch-3', title: 'Lush Greenery', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ch-4', title: 'Trekking Path', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ch-5', title: 'Nature Escape', url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'bohol-panglao', name: 'Panglao Island', cover: 'https://www.vacationhive.com/images/hives/4/4-panglao-island-img2-vacationhive.jpg',
        images: [
          { id: 'pa-1', title: 'Alona Beach', url: 'https://images.unsplash.com/photo-1571407921666-da644f80c656?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pa-2', title: 'Dumaluan Sand', url: 'https://images.unsplash.com/photo-1501890664351-4ef399c1524f?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pa-3', title: 'Balicasag Reef', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pa-4', title: 'Resort Pool', url: 'https://images.unsplash.com/photo-1564507592227-6102a474dd7e?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pa-5', title: 'Ocean Sunset', url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'bohol-loboc', name: 'Loboc River', cover: 'https://gttp.images.tshiftcdn.com/356733/x/0/loboc-river-cruise-in-bohol-island.jpg',
        images: [
          { id: 'lo-1', title: 'River Cruise', url: 'https://images.unsplash.com/photo-1579625197446-3b8c000acfac?q=80&w=1000&auto=format&fit=crop' },
          { id: 'lo-2', title: 'Jungle Canopy', url: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1000&auto=format&fit=crop' },
          { id: 'lo-3', title: 'Paddle Boarding', url: 'https://images.unsplash.com/photo-1596208620712-42171c66c3c5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'lo-4', title: 'Tarsier Sanctuary', url: 'https://images.unsplash.com/photo-1581216061628-2187b387eb5c?q=80&w=1000&auto=format&fit=crop' },
          { id: 'lo-5', title: 'Rainforest Views', url: 'https://images.unsplash.com/photo-1568283084589-91cb61858693?q=80&w=1000&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Boracay', name: 'Boracay (Aklan)', cover: 'https://www.philippinebeaches.org/wp-content/uploads/2024/05/Boracay-White-Beach.jpg', 
    subcards: [
      { 
        id: 'boracay-white', name: 'White Beach', cover: 'https://gttp.images.tshiftcdn.com/254251/x/0/guide-to-white-beach-in-boracay-island-activities-station-1-hotels-best-time-to-go-21.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'wb-1', title: 'Station 1 Sand', url: 'https://images.unsplash.com/photo-1656521161419-ac6889a753f1?q=80&w=1000&auto=format&fit=crop' },
          { id: 'wb-2', title: 'Paraw Sailing', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop' },
          { id: 'wb-3', title: 'Famous Sunset', url: 'https://images.unsplash.com/photo-1605302685934-8c7fc63321db?q=80&w=1000&auto=format&fit=crop' },
          { id: 'wb-4', title: 'Station 2 Vibe', url: 'https://images.unsplash.com/photo-1542213493895-edf5b94f5a96?q=80&w=1000&auto=format&fit=crop' },
          { id: 'wb-5', title: 'Nightlife', url: 'https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'boracay-puka', name: 'Puka Shell Beach', cover: 'https://vip-philippines.com/wp-content/uploads/2022/05/puka-beach-03.jpg',
        images: [
          { id: 'ps-1', title: 'Quiet Shores', url: 'https://images.unsplash.com/photo-1591506557489-e8ca407063e7?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ps-2', title: 'Puka Shells', url: 'https://images.unsplash.com/photo-1580210214361-b472ea98c430?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ps-3', title: 'Crystal Waters', url: 'https://images.unsplash.com/photo-1572970588667-1725b871ed19?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ps-4', title: 'Island Boat', url: 'https://images.unsplash.com/photo-1557345681-19717646ba43?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ps-5', title: 'Ocean Views', url: 'https://images.unsplash.com/photo-1604502016259-dfc469b6dc67?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'boracay-diniwid', name: 'Diniwid', cover: 'https://gttp.images.tshiftcdn.com/222327/x/0/15-best-tourist-spots-in-the-philippines-3.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'dw-1', title: 'Cliff Cove', url: 'https://images.unsplash.com/photo-1610411894902-602dc85208f8?q=80&w=1000&auto=format&fit=crop' },
          { id: 'dw-2', title: 'Hidden Beach', url: 'https://images.unsplash.com/photo-1515444743217-1a4cd2a25df5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'dw-3', title: 'Rocky Shore', url: 'https://images.unsplash.com/photo-1566497282835-f1262d05fdd5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'dw-4', title: 'Coastal Walk', url: 'https://images.unsplash.com/photo-1604502127263-6e3e5ed5ebbb?q=80&w=1000&auto=format&fit=crop' },
          { id: 'dw-5', title: 'Sunset Cocktails', url: 'https://images.unsplash.com/photo-1530968997232-47525fc95092?q=80&w=1000&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Cebu', name: 'Cebu', cover: 'https://www.agoda.com/wp-content/uploads/2023/12/Featured-image-Cebu-1244x700.jpg', 
    subcards: [
      { 
        id: 'cebu-moalboal', name: 'Moalboal', cover: 'https://gttp.images.tshiftcdn.com/224585/x/0/best-travel-guide-to-moalboal-town-on-cebu-island-everything-you-need-to-know-19.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'mb-1', title: 'Sardine Run', url: 'https://images.unsplash.com/photo-1573551089778-46a7abc39d9f?q=80&w=1000&auto=format&fit=crop' },
          { id: 'mb-2', title: 'Coral Reefs', url: 'https://images.unsplash.com/photo-1541940989-63309a6fb5e1?q=80&w=1000&auto=format&fit=crop' },
          { id: 'mb-3', title: 'Sea Turtles', url: 'https://images.unsplash.com/photo-1587585507345-a773229b47e2?q=80&w=1000&auto=format&fit=crop' },
          { id: 'mb-4', title: 'Dive Spot', url: 'https://images.unsplash.com/photo-1603565815301-1915ea014e7a?q=80&w=1000&auto=format&fit=crop' },
          { id: 'mb-5', title: 'Beach Life', url: 'https://images.unsplash.com/photo-1612438210352-875f1064299b?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'cebu-oslob', name: 'Oslob', cover: 'https://gttp.images.tshiftcdn.com/456760/x/0/oslob-cebu.jpg',
        images: [
          { id: 'os-1', title: 'Whale Sharks', url: 'https://images.unsplash.com/photo-1742965635343-d8949a669935?q=80&w=1000&auto=format&fit=crop' },
          { id: 'os-2', title: 'Kawasan Falls', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'os-3', title: 'Sumilon Island', url: 'https://images.unsplash.com/photo-1600109961621-1c5c4cb517de?q=80&w=1000&auto=format&fit=crop' },
          { id: 'os-4', title: 'Canyoneering', url: 'https://images.unsplash.com/photo-1538332560-6bfa43c683b7?q=80&w=1000&auto=format&fit=crop' },
          { id: 'os-5', title: 'South Cebu', url: 'https://images.unsplash.com/photo-1568283084589-91cb61858693?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'cebu-bantayan', name: 'Bantayan Island', cover: 'https://gttp.images.tshiftcdn.com/479755/x/0/travel-guide-to-bantayan-island-in-cebu-province-everything-you-need-to-know-3.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'bi-1', title: 'Kota Beach', url: 'https://images.unsplash.com/photo-1622396113941-de93c8d17208?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bi-2', title: 'Virgin Island', url: 'https://images.unsplash.com/photo-1591030467554-47e2bfdf2eb5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bi-3', title: 'Ogtong Cave', url: 'https://images.unsplash.com/photo-1600185966373-c155d8df6f83?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bi-4', title: 'Sandbar Views', url: 'https://images.unsplash.com/photo-1602492161421-2eec30dcab9f?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bi-5', title: 'Relaxing Vibes', url: 'https://images.unsplash.com/photo-1501890664351-4ef399c1524f?q=80&w=1000&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Manila', name: 'Manila', cover: 'https://www.travel-palawan.com/wp-content/uploads/2023/04/Manila-Intramuros-Kalesa-city-tour-Philippines.jpeg', 
    subcards: [
      { 
        id: 'manila-intra', name: 'Intramuros', cover: 'https://gttp.images.tshiftcdn.com/253831/x/0/ultimate-travel-guide-to-intramuros-old-town-in-manila-city-everything-you-need-to-know-20.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'in-1', title: 'Walled City', url: 'https://images.unsplash.com/photo-1518439179707-1b0b7531776b?q=80&w=1000&auto=format&fit=crop' },
          { id: 'in-2', title: 'Fort Santiago', url: 'https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=1000&auto=format&fit=crop' },
          { id: 'in-3', title: 'Manila Cathedral', url: 'https://images.unsplash.com/photo-1604502127263-6e3e5ed5ebbb?q=80&w=1000&auto=format&fit=crop' },
          { id: 'in-4', title: 'Cobblestones', url: 'https://images.unsplash.com/photo-1599557422967-df59a68a54d4?q=80&w=1000&auto=format&fit=crop' },
          { id: 'in-5', title: 'Historic Vibe', url: 'https://images.unsplash.com/photo-1596208620712-42171c66c3c5?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'manila-rizal', name: 'Rizal Park', cover: 'https://gttp.images.tshiftcdn.com/456852/x/0/rizal-park.jpg',
        images: [
          { id: 'rp-1', title: 'Park Monument', url: 'https://images.unsplash.com/photo-1561501900-3701fa6a36a6?q=80&w=1000&auto=format&fit=crop' },
          { id: 'rp-2', title: 'Green Spaces', url: 'https://images.unsplash.com/photo-1542314831-c6a420325142?q=80&w=1000&auto=format&fit=crop' },
          { id: 'rp-3', title: 'City Gardens', url: 'https://images.unsplash.com/photo-1568283084589-91cb61858693?q=80&w=1000&auto=format&fit=crop' },
          { id: 'rp-4', title: 'National Museum', url: 'https://images.unsplash.com/photo-1605302685934-8c7fc63321db?q=80&w=1000&auto=format&fit=crop' },
          { id: 'rp-5', title: 'Sunset Walks', url: 'https://images.unsplash.com/photo-1612438210352-875f1064299b?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'manila-bgc', name: 'BGC', cover: 'https://gttp.images.tshiftcdn.com/377440/x/0/bonifacio-global-city.jpg?crop=1.91%3A1&fit=crop&width=1200',
        images: [
          { id: 'bgc-1', title: 'Modern Skyline', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bgc-2', title: 'High Street', url: 'https://images.unsplash.com/photo-1513407030348-51e4ec7950fa?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bgc-3', title: 'Night Lights', url: 'https://images.unsplash.com/photo-1566497282835-f1262d05fdd5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bgc-4', title: 'Luxury Malls', url: 'https://images.unsplash.com/photo-1603565815301-1915ea014e7a?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bgc-5', title: 'City Living', url: 'https://images.unsplash.com/photo-1559812239-65a4eeb755de?q=80&w=1000&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Banaue', name: 'Ifugao (Banaue)', cover: 'https://cdn-v2.theculturetrip.com/1220x680/wp-content/uploads/2018/02/shutterstock_634025597-e1730712247519.webp', 
    subcards: [
      { 
        id: 'banaue-batad', name: 'Batad Terraces', cover: 'https://gttp.images.tshiftcdn.com/225663/x/0/banaue-travel-guide-home-of-rice-terraces-in-the-philippines-3.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'bt-1', title: 'Amphitheater', url: 'https://images.unsplash.com/photo-1711060169357-ed923c9f2156?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bt-2', title: 'Rice Paddies', url: 'https://images.unsplash.com/photo-1575406811594-da848ffb8a50?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bt-3', title: 'Village Life', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bt-4', title: 'Trekking Path', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bt-5', title: 'Mountain Peaks', url: 'https://images.unsplash.com/photo-1581216061628-2187b387eb5c?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'banaue-view', name: 'Banaue Viewpoint', cover: 'https://gttp.images.tshiftcdn.com/225663/x/0/banaue-travel-guide-home-of-rice-terraces-in-the-philippines-3.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'vp-1', title: 'Main Viewpoint', url: 'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'vp-2', title: 'Morning Mist', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop' },
          { id: 'vp-3', title: 'Terraces Horizon', url: 'https://images.unsplash.com/photo-1600109961621-1c5c4cb517de?q=80&w=1000&auto=format&fit=crop' },
          { id: 'vp-4', title: 'Heritage', url: 'https://images.unsplash.com/photo-1587585507345-a773229b47e2?q=80&w=1000&auto=format&fit=crop' },
          { id: 'vp-5', title: 'Golden Hour', url: 'https://images.unsplash.com/photo-1538332560-6bfa43c683b7?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'banaue-tappiya', name: 'Tappiya Falls', cover: 'https://www.projectlupad.com/wp-content/uploads/2017/12/Tappiya-Falls-x-Batad-Rice-Terraces-Aerial-Tour-Project-LUPAD.jpeg',
        images: [
          { id: 'tf-1', title: 'Hidden Waterfall', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'tf-2', title: 'Jungle Hike', url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1000&auto=format&fit=crop' },
          { id: 'tf-3', title: 'Plunge Pool', url: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1000&auto=format&fit=crop' },
          { id: 'tf-4', title: 'River Boulders', url: 'https://images.unsplash.com/photo-1602492161421-2eec30dcab9f?q=80&w=1000&auto=format&fit=crop' },
          { id: 'tf-5', title: 'Nature Escape', url: 'https://images.unsplash.com/photo-1591030467554-47e2bfdf2eb5?q=80&w=1000&auto=format&fit=crop' }
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