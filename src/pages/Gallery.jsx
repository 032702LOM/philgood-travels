import React, { useState, useEffect } from 'react';
import { usePreferences } from '../context/PreferencesContext';

// 1. IMPORT YOUR LOCAL VIDEO HERE
// Make sure the file is actually in src/assets/video/
import galleryVideo from '../assets/video/PhilGood_vid.mp4'; 

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
          { id: 'el-1', title: 'Limestone Cliffs', url: 'https://miro.medium.com/v2/resize:fit:828/format:webp/1*kBitGxrJbQATyzBXW-v70Q.jpeg' },
          { id: 'el-2', title: 'Clear Waters', url: 'https://magicoftravels.com/static/1b8666dce9bb7ed69fd333af7a321950/cd33f/tour-a-main.jpg' },
          { id: 'el-3', title: 'Hidden Lagoon', url: 'https://www.dronestagr.am/wp-content/uploads/2018/05/DJI_0547.jpg' },
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
          { id: 'pp-5', title: 'Sabang Beach', url: 'https://images.trvl-media.com/place/6130851/6ddb64f1-6568-4275-9ece-2d69279de039.jpg' }
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
          { id: 'ch-1', title: 'Sunrise Hills', url: 'https://static.tripzilla.ph/media/106294/conversions/160495_800x-w768.webp' },
          { id: 'ch-2', title: 'Viewing Deck', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ch-3', title: 'Lush Greenery', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ch-4', title: 'Trekking Path', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ch-5', title: 'Nature Escape', url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'bohol-panglao', name: 'Panglao Island', cover: 'https://www.vacationhive.com/images/hives/4/4-panglao-island-img2-vacationhive.jpg',
        images: [
          { id: 'pa-1', title: 'Alona Beach', url: 'https://www.divescotty.com/images/pictures/island-tours-hopping/480/alona-beach_480.jpg' },
          { id: 'pa-2', title: 'Dumaluan Sand', url: 'https://images.unsplash.com/photo-1501890664351-4ef399c1524f?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pa-3', title: 'Balicasag Reef', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1000&auto=format&fit=crop' },
          { id: 'pa-4', title: 'Resort Pool', url: 'https://www.henann.com/bohol/henannalonabeach/uploads/slider/720/pool1.jpg' },
          { id: 'pa-5', title: 'Ocean Sunset', url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'bohol-loboc', name: 'Loboc River', cover: 'https://tshirtcdn.com/356733/x/0/loboc-river-cruise-in-bohol-island.jpg',
        images: [
          { id: 'lo-1', title: 'River Cruise', url: 'https://images.unsplash.com/photo-1579625197446-3b8c000acfac?q=80&w=1000&auto=format&fit=crop' },
          { id: 'lo-2', title: 'Jungle Canopy', url: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1000&auto=format&fit=crop' },
          { id: 'lo-3', title: 'Paddle Boarding', url: 'https://ik.imagekit.io/tvlk/xpe-asset/AyJ40ZAo1DOyPyKLZ9c3RGQHTP2oT4ZXW+QmPVVkFQiXFSv42UaHGzSmaSzQ8DO5QIbWPZuF+VkYVRk6gh-Vg4ECbfuQRQ4pHjWJ5Rmbtkk=/2002063701956/Loboc-Stand-Up-Paddle-Board-1-Hour-Tour--89b5209f-8f32-4458-b9fe-9f33a4bfd51c.jpeg?tr=q-60,c-at_max,w-1280,h-720&_src=imagekit' },
          { id: 'lo-4', title: 'Tarsier Sanctuary', url: 'https://images.unsplash.com/photo-1581216061628-2187b387eb5c?q=80&w=1000&auto=format&fit=crop' },
          { id: 'lo-5', title: 'Rainforest Views', url: 'https://i.natgeofe.com/n/85fa5197-f0cd-47a8-b429-eb9f1bb7cd9c/loboc-river-bohol-island-philippines.jpg' }
        ]
      }
    ] 
  },
  { 
    id: 'Boracay', name: 'Boracay (Aklan)', cover: 'https://www.philippinebeaches.org/wp-content/uploads/2024/05/Boracay-White-Beach.jpg', 
    subcards: [
      { 
        id: 'boracay-white', name: 'White Beach', cover: 'https://tshiftcdn.com/254251/x/0/guide-to-white-beach-in-boracay-island-activities-station-1-hotels-best-time-to-go-21.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'wb-1', title: 'Station 1 Sand', url: 'https://images.unsplash.com/photo-1656521161419-ac6889a753f1?q=80&w=1000&auto=format&fit=crop' },
          { id: 'wb-2', title: 'Paraw Sailing', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop' },
          { id: 'wb-3', title: 'Famous Sunset', url: 'https://www.thedistrictboracay.com/wp-content/uploads/2018/06/BoracaySunsets1.jpg' },
          { id: 'wb-4', title: 'Station 2 Vibe', url: 'https://images.unsplash.com/photo-1542213493895-edf5b94f5a96?q=80&w=1000&auto=format&fit=crop' },
          { id: 'wb-5', title: 'Nightlife', url: 'https://www.explore.com/img/gallery/visit-this-southeast-asian-island-for-incredible-nightlife/l-intro-1698165565.jpg' }
        ]
      },
      { 
        id: 'boracay-puka', name: 'Puka Shell Beach', cover: 'https://vip-philippines.com/wp-content/uploads/2022/05/puka-beach-03.jpg',
        images: [
          { id: 'ps-1', title: 'Quiet Shores', url: 'https://images.unsplash.com/photo-1591506557489-e8ca407063e7?q=80&w=1000&auto=format&fit=crop' },
          { id: 'ps-2', title: 'Puka Shells', url: 'https://www.divescotty.com/images/social-media/puka-shell-beach-boracay_1440.jpg' },
          { id: 'ps-3', title: 'Crystal Waters', url: 'https://media-cdn.tripadvisor.com/media/photo-s/02/72/c1/88/crystal-clear-h2o.jpg' },
          { id: 'ps-4', title: 'Island Boat', url: 'https://www.discoverimages.com/p/251/otrigger-bangka-boat-diniwid-beach-19388770.jpg.webp' },
          { id: 'ps-5', title: 'Ocean Views', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Boracay_White_Beach.png' }
        ]
      },
      { 
        id: 'boracay-diniwid', name: 'Diniwid', cover: 'https://tshiftcdn.com/222327/x/0/15-best-tourist-spots-in-the-philippines-3.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'dw-1', title: 'Cliff Cove', url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/8f/40/6e/photo1jpg.jpg?w=800&h=500&s=1' },
          { id: 'dw-2', title: 'Hidden Beach', url: 'https://felizhotelboracay.com/wp-content/uploads/2025/07/Get-Away-from-the-Crowd-5-Hidden-Spots-and-Experiences-Around-Boracay-1080x675.jpg' },
          { id: 'dw-3', title: 'Rocky Shore', url: 'https://img.freepik.com/premium-photo/rocky-beach-boracay-island-philippines_78361-17621.jpg' },
          { id: 'dw-4', title: 'Coastal Walk', url: 'https://reachinghot.com/wp-content/uploads/2020/05/Filippiinit_0420_145-1536x1152.jpg.webp' },
          { id: 'dw-5', title: 'Sunset Cocktails', url: 'https://info.myboracayguide.com/wp-content/uploads/2024/02/cocktails-at-sunset-1240x697.webp' }
        ]
      }
    ] 
  },
  { 
    id: 'Cebu', name: 'Cebu', cover: 'https://www.agoda.com/wp-content/uploads/2023/12/Featured-image-Cebu-1244x700.jpg', 
    subcards: [
      { 
        id: 'cebu-moalboal', name: 'Moalboal', cover: 'https://tshiftcdn.com/224585/x/0/best-travel-guide-to-moalboal-town-on-cebu-island-everything-you-need-to-know-19.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'mb-1', title: 'Sardine Run', url: 'https://images.unsplash.com/photo-1573551089778-46a7abc39d9f?q=80&w=1000&auto=format&fit=crop' },
          { id: 'mb-2', title: 'Coral Reefs', url: 'https://image.kkday.com/v2/image/get/c_fit%2Cq_55%2Ct_webp%2Cw_960/s1.kkday.com/product_136506/20221130082525_cVb6c/jpg' },
          { id: 'mb-3', title: 'Sea Turtles', url: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/6f/3e/fb.jpg' },
          { id: 'mb-4', title: 'Dive Spot', url: 'https://cebufundivers.com/wp-content/uploads/2023/06/diving_moalboal_cebufundivers_0010.jpg' },
          { id: 'mb-5', title: 'Beach Life', url: 'https://whatmegdidnext.com/wp-content/uploads/2022/09/White-Beach-square-1170x658.jpg' }
        ]
      },
      { 
        id: 'cebu-oslob', name: 'Oslob', cover: 'https://tshiftcdn.com/456760/x/0/oslob-cebu.jpg',
        images: [
          { id: 'os-1', title: 'Whale Sharks', url: 'https://images.unsplash.com/photo-1742965635343-d8949a669935?q=80&w=1000&auto=format&fit=crop' },
          { id: 'os-2', title: 'Kawasan Falls', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'os-3', title: 'Sumilon Island', url: 'https://www.islandtrektours.com/wp-content/uploads/2020/06/sumilon-island-sandbar-cebu-tours.jpg' },
          { id: 'os-4', title: 'Canyoneering', url: 'https://www.pelago.com/img/products/PH-Philippines/exclusive-canyoneering-cebu-badian-with-meals-and-private-transfers-option/674f2142-494a-4119-b21b-52c42c09d95f_exclusive-canyoneering-cebu-badian-with-meals-and-private-transfers-option-xlarge.jpg' },
          { id: 'os-5', title: 'South Cebu', url: 'https://twomonkeystravelgroup.com/wp-content/uploads/2015/11/7-Awesome-Things-To-Do-In-Southern-Cebu-Philippines8.jpg' }
        ]
      },
      { 
        id: 'cebu-bantayan', name: 'Bantayan Island', cover: 'https://tshiftcdn.com/479755/x/0/travel-guide-to-bantayan-island-in-cebu-province-everything-you-need-to-know-3.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'bi-1', title: 'Kota Beach', url: 'https://images.squarespace-cdn.com/content/v1/6594f8425879a6053191fbf8/1e571570-ddea-4a75-b0ca-0f0cd0fa3113/IMG_9838.gif?form' },
          { id: 'bi-2', title: 'Virgin Island', url: 'https://www.nopostcode.com/wp-content/uploads/2022/04/Virgin-Island-Bantayan-17.jpg' },
          { id: 'bi-3', title: 'Ogtong Cave', url: 'https://www.nopostcode.com/wp-content/uploads/2021/11/Ogtong-Cave-Bantayan-Island-9.jpg' },
          { id: 'bi-4', title: 'Sandbar Views', url: 'https://www.freedomwall.net/wp-content/uploads/2025/09/kota-beach-bantayan-island.jpg' },
          { id: 'bi-5', title: 'Relaxing Vibes', url: 'https://images.unsplash.com/photo-1501890664351-4ef399c1524f?q=80&w=1000&auto=format&fit=crop' }
        ]
      }
    ] 
  },
  { 
    id: 'Manila', name: 'Manila', cover: 'https://www.travel-palawan.com/wp-content/uploads/2023/04/Manila-Intramuros-Kalesa-city-tour-Philippines.jpeg', 
    subcards: [
      { 
        id: 'manila-intra', name: 'Intramuros', cover: 'https://tshiftcdn.com/253831/x/0/ultimate-travel-guide-to-intramuros-old-town-in-manila-city-everything-you-need-to-know-20.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'in-1', title: 'Walled City', url: 'https://www.nipino.com/uploads/images/202404/image_870x_662135fe6e3fd.jpg' },
          { id: 'in-2', title: 'Fort Santiago', url: 'https://www.tripsavvy.com/thmb/jXuIpX-iAa_Yn1qweXpO97e1LB0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-515030857-599ff63e03f402001100ee1d-6218e3c18a3a4503a2a1fb183ce8ccfb.jpg' },
          { id: 'in-3', title: 'Manila Cathedral', url: 'https://catholicshrinebasilica.com/wp-content/uploads/The-Manila-Cathedral.webp' },
          { id: 'in-4', title: 'Cobblestones', url: 'https://cdn.coconuts.co/coconuts/wp-content/uploads/2020/04/Intramuros-936x540.jpg' },
          { id: 'in-5', title: 'Historic Vibe', url: 'https://www.crownasia.com.ph/wp-content/uploads/2023/08/Enjoying-the-Beauty-and-Wonder-of-Intramuros-1536x1024.jpg' }
        ]
      },
      { 
        id: 'manila-rizal', name: 'Rizal Park', cover: 'https://tshiftcdn.com/456852/x/0/rizal-park.jpg',
        images: [
          { id: 'rp-1', title: 'Park Monument', url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Rizal_Monument_at_Rizal_Park.jpg
' },
          { id: 'rp-2', title: 'Green Spaces', url: 'https://worldforestvoices.wordpress.com/wp-content/uploads/2022/03/wfc-johanna-caresse-eusebio-2-featured.png?w=1568' },
          { id: 'rp-3', title: 'City Gardens', url: 'https://thursd.com/storage/media/97017/Rizal-Park-Luneta-by-Apolinario.jpg?1760646138831' },
          { id: 'rp-4', title: 'National Museum', url: 'https://weblinks.nationalmuseum.gov.ph/wp-content/uploads/2021/08/01123638/National-Museum-of-Fine-Arts-Facade-Photo-Banner-1-scaled.jpg' },
          { id: 'rp-5', title: 'Sunset Walks', url: 'https://images.pond5.com/sunset-fountains-rizal-parkmanilaluzonphilippines-084463963_prevstill.jpeg' }
        ]
      },
      { 
        id: 'manila-bgc', name: 'BGC', cover: 'https://tshiftcdn.com/377440/x/0/bonifacio-global-city.jpg?crop=1.91%3A1&fit=crop&width=1200',
        images: [
          { id: 'bgc-1', title: 'Modern Skyline', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bgc-2', title: 'High Street', url: 'https://cdn.sanity.io/images/4f3ey4m9/production/b0e2dc98ba622433c9a95f00cee56dac013e0b72-3600x2400.jpg?auto=format&fit=max&q=75&w=1280' },
          { id: 'bgc-3', title: 'Night Lights', url: 'https://www.shutterstock.com/image-photo/bonifacio-global-city-taguig-metro-600nw-2472707607.jpg' },
          { id: 'bgc-4', title: 'Luxury Malls', url: 'https://images.preview.ph/preview/images/2025/02/03/uptown-mall-1738519223.jpg' },
          { id: 'bgc-5', title: 'City Living', url: 'https://grandhyattmanilaresidences.ph/wp-content/uploads/2021/10/shutterstock_484771681.jpg' }
        ]
      }
    ] 
  },
  { 
    id: 'Banaue', name: 'Ifugao (Banaue)', cover: 'https://cdn-v2.theculturetrip.com/1220x680/wp-content/uploads/2018/02/shutterstock_634025597-e1730712247519.webp', 
    subcards: [
      { 
        id: 'banaue-batad', name: 'Batad Terraces', cover: 'https://tshiftcdn.com/225663/x/0/banaue-travel-guide-home-of-rice-terraces-in-the-philippines-3.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'bt-1', title: 'Amphitheater', url: 'https://images.unsplash.com/photo-1711060169357-ed923c9f2156?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bt-2', title: 'Rice Paddies', url: 'https://images.unsplash.com/photo-1575406811594-da848ffb8a50?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bt-3', title: 'Village Life', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bt-4', title: 'Trekking Path', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop' },
          { id: 'bt-5', title: 'Mountain Peaks', url: 'https://images.unsplash.com/photo-1581216061628-2187b387eb5c?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
      { 
        id: 'banaue-view', name: 'Banaue Viewpoint', cover: 'https://tshiftcdn.com/225663/x/0/banaue-travel-guide-home-of-rice-terraces-in-the-philippines-3.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883',
        images: [
          { id: 'vp-1', title: 'Main Viewpoint', url: 'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'vp-2', title: 'Morning Mist', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop' },
          { id: 'vp-3', title: 'Terraces Horizon', url: 'https://www.smprime.com/wp-content/webpc-passthru.php?src=https://www.smprime.com/wp-content/uploads/2025/09/The-Horizon-Terraces.png&nocache=1' },
          { id: 'vp-4', title: 'Heritage', url: 'https://www.kkday.com/en-ph/blog/wp-content/uploads/philippines_ilocos_norte_paoay_church.jpg' },
          { id: 'vp-5', title: 'Golden Hour', url: 'https://thumbs.dreamstime.com/b/picture-sunset-vanilla-beach-el-nido-philippines-golden-hour-337040596.jpg?w=1400' }
        ]
      },
      { 
        id: 'banaue-tappiya', name: 'Tappiya Falls', cover: 'https://www.projectlupad.com/wp-content/uploads/2017/12/Tappiya-Falls-x-Batad-Rice-Terraces-Aerial-Tour-Project-LUPAD.jpeg',
        images: [
          { id: 'tf-1', title: 'Hidden Waterfall', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop' },
          { id: 'tf-2', title: 'Jungle Hike', url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1000&auto=format&fit=crop' },
          { id: 'tf-3', title: 'Plunge Pool', url: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1000&auto=format&fit=crop' },
          { id: 'tf-4', title: 'River Boulders', url: 'https://wamu.org/wp-content/uploads/2023/10/awp-1_wide-54a9e8553c801130b2aef7532f2beefbf7e9e13d-1500x844.jpg' },
          { id: 'tf-5', title: 'Nature Escape', url: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/15/73/ad/8d.jpg' }
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
        <div className="d-flex justify-content-between align-items-center mb-4"><h4 className="text-navy font-montserrat fw-bold mb-0">Explore by Region</h4><span className="text-grey fw-bold small">{galleryData.length} Regions</span></div>
        <div className="row g-4">
          {filteredRegions.map((region) => (
            <div key={region.id} className="col-md-6 col-lg-4 scroll-reveal visible">
              <div className="card h-100 border-0 overflow-hidden shadow" style={{ cursor: 'pointer' }} onClick={() => handleRegionClick(region.id)}>
                <div className="card-img-wrapper" style={{ height: '250px' }}>
                  <img src={region.cover} className="card-img-top w-100 h-100 object-fit-cover" alt={region.name} loading="lazy" />
                  <div className="position-absolute w-100 h-100 top-0 start-0 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0, 119, 182, 0.4)', transition: 'background 0.3s' }}>
                    <h3 className="text-pure-white fw-bold text-uppercase shadow-sm" style={{ letterSpacing: '2px', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>{region.name}</h3>
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
        <button className="btn btn-link text-navy fw-bold text-decoration-none p-0 mb-4 opacity-75" onClick={handleBackToRegions}><i className="fa-solid fa-arrow-left me-2"></i> Back to All Regions</button>
        <div className="d-flex justify-content-between align-items-center mb-4"><h4 className="text-navy font-montserrat fw-bold mb-0">{region.name} Destinations</h4><span className="text-grey fw-bold small">{region.subcards.length} Locations</span></div>
        <div className="row g-4 justify-content-center">
          {filteredSubcards.map((sub) => (
            <div key={sub.id} className="col-md-6 col-lg-4 scroll-reveal visible">
              <div className="card h-100 border-0 shadow" style={{ cursor: 'pointer', backgroundColor: 'var(--card-bg)' }} onClick={() => handleSubcardClick(sub.name)}>
                <div className="card-img-wrapper" style={{ height: '220px' }}>
                  <span className="card-badge" style={{ top: '10px', right: '10px', fontSize: '0.65rem' }}>{sub.images.length} Images</span>
                  <img src={sub.cover} className="card-img-top w-100 h-100 object-fit-cover" alt={sub.name} loading="lazy" />
                </div>
                <div className="card-body p-3 text-center border-top border-primary border-opacity-10">
                  <h6 className="card-title mb-0 fs-5 text-navy">{sub.name}</h6>
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
        <button className="btn btn-link text-navy fw-bold text-decoration-none p-0 mb-4 opacity-75" onClick={handleBackToSubcards}>
            <i className="fa-solid fa-arrow-left me-2"></i> Back to {region.name} Destinations
        </button>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-navy font-montserrat fw-bold mb-0">{subcard.name} Gallery</h4>
            <span className="text-grey fw-bold small">{subcard.images.length} Photos</span>
        </div>
        
        <div className="row g-3 justify-content-center">
          {filteredImages.map((img) => (
            <div key={img.id} className="col-6 col-md-4 col-lg scroll-reveal visible gallery-item" style={{ minWidth: '20%' }}>
              <div className="position-relative overflow-hidden rounded-3 shadow-sm h-100 border border-primary border-opacity-10">
                <img src={img.url} alt={img.title} loading="lazy" className="w-100 h-100 object-fit-cover gallery-img" style={{ aspectRatio: '1/1', transition: 'transform 0.4s ease' }} />
                <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'linear-gradient(transparent, rgba(0, 119, 182, 0.9))' }}>
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
      <section className="gallery-hero position-relative overflow-hidden">
          {/* 2. THE BACKGROUND VIDEO FROM YOUR DEVICE */}
          <video autoPlay loop muted playsInline className="hero-video-bg">
              <source src={galleryVideo} type="video/mp4" />
          </video>
          
          <div className="video-overlay"></div>

          <div className="container text-center mb-4 scroll-reveal visible position-relative" style={{ zIndex: 2 }}>
              <h1 className="hero-title transparent-text" style={{ fontSize: '4rem' }}>{t('gal_title', 'Visual Journey')}</h1>
              <p className="section-desc text-white mb-0" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{t('gal_desc', 'Discover the beauty of the Philippines through our lens')}</p>
          </div>

          <div className="container pb-4 scroll-reveal visible delay-1 position-relative" style={{ zIndex: 2 }}>
              <div className="search-filter-bar p-4 rounded-4 mx-auto" style={{ maxWidth: '900px' }}>
                  <div className="row g-3 align-items-center">
                      <div className="col-md-4"><label className="text-primary-dark fw-bold small mb-1">Region</label><div className="input-with-icon"><i className="fa-solid fa-map-location-dot"></i><select className="form-control-dark form-select w-100" value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedSubcard('All'); }}><option value="All">All Regions</option>{galleryData.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}</select></div></div>
                      <div className="col-md-4"><label className="text-primary-dark fw-bold small mb-1">Location</label><div className="input-with-icon"><i className="fa-solid fa-camera"></i><select className="form-control-dark form-select w-100" value={selectedSubcard} onChange={(e) => setSelectedSubcard(e.target.value)} disabled={selectedRegion === 'All'}><option value="All">{selectedRegion === 'All' ? 'Select a Region first' : 'All Locations'}</option>{availableSubcards.map(sub => (<option key={sub.id} value={sub.name}>{sub.name}</option>))}</select></div></div>
                      <div className="col-md-4"><label className="text-primary-dark fw-bold small mb-1">Keyword Search</label><div className="input-with-icon"><i className="fa-solid fa-magnifying-glass"></i><input type="text" className="form-control-dark form-control w-100" placeholder="Type to search..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/></div></div>
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
