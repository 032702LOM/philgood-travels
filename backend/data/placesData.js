// backend/data/placesData.js

// ==========================================
// REGIONS
// ==========================================
const regions = [
  { id: 'Palawan', name: 'Palawan', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/7d/39/5f/caption.jpg?w=800&h=800&s=1', desc: 'The last frontier.', typeBadge: 'Parks, Beaches', locationLabel: 'MIMAROPA' },
  { id: 'Bohol', name: 'Bohol', image: 'https://www.tripsavvy.com/thmb/ENcqAjtXtH3XNV3eIg4MKfSyQ6A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-135558476-8533a33260d9436c9bc432ce630ec732.jpg', desc: 'Nature and heritage.', typeBadge: 'Mountains, Beaches', locationLabel: 'Central Visayas' },
  { id: 'Aklan', name: 'Aklan (Boracay)', image: 'https://www.philippinebeaches.org/wp-content/uploads/2024/05/Boracay-White-Beach.jpg', desc: 'World-famous powdery sands.', typeBadge: 'Beaches, Resorts', locationLabel: 'Western Visayas' },
  { id: 'Cebu', name: 'Cebu', image: 'https://www.agoda.com/wp-content/uploads/2023/12/Featured-image-Cebu-1244x700.jpg', desc: 'Queen City of the South.', typeBadge: 'Beaches, Mountains', locationLabel: 'Central Visayas' },
  { id: 'Manila', name: 'Manila', image: 'https://www.travel-palawan.com/wp-content/uploads/2023/04/Manila-Intramuros-Kalesa-city-tour-Philippines.jpeg', desc: 'Historic core of the capital.', typeBadge: 'Cities, Resort Hotels', locationLabel: 'NCR' },
  { id: 'Banaue', name: 'Ifugao (Banaue)', image: 'https://cdn-v2.theculturetrip.com/1220x680/wp-content/uploads/2018/02/shutterstock_634025597-e1730712247519.webp', desc: 'The eighth wonder of the world.', typeBadge: 'Mountains, Culture', locationLabel: 'North Central Luzon' }
];

// ==========================================
// ACCOMMODATIONS
// ==========================================
const allPlaces = [
    { id: 'Palawan-A', region: 'Palawan', name: 'El Nido Resorts - Miniloc', price: 25000 },
    { id: 'Palawan-B', region: 'Palawan', name: 'Princesa Garden Island', price: 7800 },
    { id: 'Palawan-C', region: 'Palawan', name: 'Seda Lio', price: 11500 },
    { id: 'Bohol-A', region: 'Bohol', name: 'Henann Resort Alona Beach', price: 8500 },
    { id: 'Bohol-B', region: 'Bohol', name: 'The Bellevue Resort', price: 9200 },
    { id: 'Bohol-C', region: 'Bohol', name: 'Loboc River Resort', price: 4500 },
    { id: 'Aklan-A', region: 'Aklan', name: 'Shangri-La Boracay', price: 22000 },
    { id: 'Aklan-B', region: 'Aklan', name: 'Movenpick Resort & Spa', price: 14500 },
    { id: 'Aklan-C', region: 'Aklan', name: 'Discovery Shores', price: 18000 },
    { id: 'Cebu-A', region: 'Cebu', name: 'Crimson Resort Mactan', price: 12500 },
    { id: 'Cebu-B', region: 'Cebu', name: 'Marco Polo Plaza', price: 6500 },
    { id: 'Cebu-C', region: 'Cebu', name: 'Magic Island Dive Resort', price: 8900 },
    { id: 'Manila-A', region: 'Manila', name: 'The Manila Hotel', price: 7200 },
    { id: 'Manila-B', region: 'Manila', name: 'Conrad Manila', price: 13500 },
    { id: 'Manila-C', region: 'Manila', name: 'Okada Manila', price: 16000 },
    { id: 'Ifugao-A', region: 'Ifugao', name: 'Banaue Hotel & Hostel', price: 2500 },
    { id: 'Ifugao-B', region: 'Ifugao', name: 'Banaue Homestay', price: 1200 },
    { id: 'Ifugao-C', region: 'Ifugao', name: '7th Heavens Cafe', price: 1800 }
];

// ==========================================
// TOUR PACKAGES
// ==========================================
const tourPackages = [
    { id: 'Tour-ElNido', name: 'El Nido Island Paradise', price: 34999 },
    { id: 'Tour-Bohol', name: 'Bohol Adventure Package', price: 25999 },
    { id: 'Tour-Boracay', name: 'Boracay Beach Escape', price: 39999 },
    { id: 'Tour-Cebu', name: 'Cebu Canyoneering', price: 22999 },
    { id: 'Tour-Manila', name: 'Manila City Escape', price: 16999 },
    { id: 'Tour-Banaue', name: 'Banaue Heritage Tour', price: 28999 }
];

// ⚡ EXPORT FOR NODE.JS BACKEND ⚡
module.exports = { regions, allPlaces, tourPackages };