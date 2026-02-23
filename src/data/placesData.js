// src/data/placesData.js

// ==========================================
// REGIONS (Mother Cards - Used in Destinations Page & Homepage)
// ==========================================
export const regions = [
  { id: 'Manila', name: 'Manila', image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Aerial_view_of_Manila_%27s_city_center_area_%28Padre_Burgos_area%29_in_Ermita%2C_Manila.jpg', desc: 'Historic core of the capital.', typeBadge: 'Cities, Resort Hotels', locationLabel: 'NCR' },
  { id: 'Cebu', name: 'Cebu', image: 'https://images.unsplash.com/photo-1505261476952-3225cbfc7557?q=80&w=1811&auto=format&fit=crop', desc: 'Queen City of the South.', typeBadge: 'Beaches, Mountains', locationLabel: 'Central Visayas' },
  { id: 'Palawan', name: 'Palawan', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop', desc: 'The last frontier.', typeBadge: 'Parks, Beaches', locationLabel: 'MIMAROPA' },
  { id: 'Bohol', name: 'Bohol', image: 'https://images.unsplash.com/photo-1581215061628-2187b387eb5c?q=80&w=1754&auto=format&fit=crop', desc: 'Nature and heritage.', typeBadge: 'Mountains, Beaches', locationLabel: 'Central Visayas' },
  { id: 'Boracay', name: 'Aklan (Boracay)', image: 'https://images.unsplash.com/photo-1741717609743-a830659a58ba?q=80&w=1740&auto=format&fit=crop', desc: 'World-famous powdery sands.', typeBadge: 'Beaches, Resorts', locationLabel: 'Western Visayas' },
  { id: 'Banaue', name: 'Ifugao (Banaue)', image: 'https://images.unsplash.com/photo-1711060169357-ed923c9f2156?q=80&w=1744&auto=format&fit=crop', desc: 'The eighth wonder of the world.', typeBadge: 'Mountains, Culture', locationLabel: 'North Central Luzon' }
];

// ==========================================
// ACCOMMODATIONS (Subcards - Used in Destinations Page)
// ==========================================
export const allPlaces = [
    {
        id: 'Bohol-A', region: 'Bohol', name: 'Henann Resort Alona Beach', type: 'Resort Hotel / Beach', price: 8500,
        img: 'https://images.unsplash.com/photo-1591506557489-e8ca407063e7?q=80&w=1742&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 9.5513, lon: 123.7712, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Pay now'], 
        travelStyle: ['Resort Hotel'],
        roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Treadmill', 'Dinner included'],
        facilities: ['Swimming pool', 'Internet', 'Car park', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Business facilities', 'Front desk [24-hour]'],
        family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Public beach'
    },
    {
        id: 'Bohol-B', region: 'Bohol', name: 'The Bellevue Resort', type: 'Resort Hotel / Beach', price: 9200,
        img: 'https://images.unsplash.com/photo-1728042743743-e2a2abf35c47?q=80&w=1550&auto=format&fit=crop', panorama: 'https://pannellum.org/images/cerro-toco-0.jpg', lat: 9.6133, lon: 123.7718, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Book now, pay later'], 
        travelStyle: ['Resort Hotel'],
        roomOffers: ['Breakfast included', 'Airport transfer', 'Treadmill', 'Early check-in', 'Vegetarian'],
        facilities: ['Swimming pool', 'Internet', 'Car park', 'Gym/fitness', 'Spa/sauna', 'Family/child friendly', 'Restaurants', 'Front desk [24-hour]'],
        family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Bohol-C', region: 'Bohol', name: 'Loboc River Resort', type: 'Mountains / Resort Hotel / Camping', price: 4500,
        img: 'https://images.unsplash.com/photo-1579625197446-3b8c000acfac?q=80&w=2062&auto=format&fit=crop', panorama: 'https://pannellum.org/images/bma-0.jpg', lat: 9.6366, lon: 124.0322, 
        payment: ['Pay at the hotel', 'Pay now'], 
        travelStyle: ['Mountains', 'Hiking/Mountaineering', 'Camping', 'Resort Hotel'],
        roomOffers: ['Breakfast included', 'Outside food delivery allowed', 'Bottle of wine', 'Recreation area access with conditions'],
        facilities: ['Swimming pool', 'Internet', 'Car park', 'Restaurants', 'Family/child friendly', 'Front desk [24-hour]', 'Smoking area'],
        family: 'Kids stay for free', distance: '>10 km to center', bed: ['Queen', 'Double', 'Single/twin'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Palawan-A', region: 'Palawan', name: 'El Nido Resorts - Miniloc', type: 'National Park / Eco-Resort / Camping', price: 25000,
        img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.1477, lon: 119.3828, 
        payment: ['Pay now', 'Free cancellation'], 
        travelStyle: ['National Park', 'Resort Hotel', 'Camping', 'Hiking/Mountaineering'],
        roomOffers: ['Lunch included', 'Dinner included', 'Airport transfer', 'Gluten-free', 'Vegan'],
        facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Non-smoking', 'Family/child friendly', 'Airport transfer'],
        family: 'Kids stay for free', distance: '>10 km to center', bed: ['Double', 'Single/twin'], bedrooms: ['1 bedroom/studio'], beachAccess: 'Private beach'
    },
    {
        id: 'Palawan-B', region: 'Palawan', name: 'Princesa Garden Island', type: 'Resort Hotel / City', price: 7800,
        img: 'https://images.unsplash.com/photo-1581216061628-2187b387eb5c?q=80&w=1754&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 9.7548, lon: 118.7610, 
        payment: ['Book now, pay later', 'Pay at the hotel', 'Free cancellation'], 
        travelStyle: ['Resort Hotel', 'City'],
        roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Treadmill', 'Car rental'],
        facilities: ['Swimming pool', 'Internet', 'Car park', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Facilities for disabled guests', 'Front desk [24-hour]'],
        family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Palawan-C', region: 'Palawan', name: 'Seda Lio', type: 'Resort Hotel / Beach', price: 11500,
        img: 'https://images.unsplash.com/photo-1542533382-b42a59d8bd39?q=80&w=1548&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.2001, lon: 119.4184, 
        payment: ['Pay now', 'Pay at the hotel', 'Book without credit card'], 
        travelStyle: ['Resort Hotel', 'Hiking/Mountaineering'],
        roomOffers: ['Breakfast included', 'Airport transfer', 'Early check-in', 'Gluten-free'],
        facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Family/child friendly', 'Restaurants', 'Business facilities'],
        family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio'], beachAccess: 'Public beach'
    },
    {
        id: 'Aklan-A', region: 'Boracay', name: 'Shangri-La Boracay', type: 'Resort Hotel / Beach', price: 22000,
        img: 'https://images.unsplash.com/photo-1656521161419-ac6889a753f1?q=80&w=1750&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.9804, lon: 121.9126, 
        payment: ['Pay at the hotel', 'Pay now'], 
        travelStyle: ['Resort Hotel'],
        roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Dinner included', 'Bottle of wine'],
        facilities: ['Swimming pool', 'Gym/fitness', 'Spa/sauna', 'Family/child friendly', 'Restaurants', 'Business facilities', 'Front desk [24-hour]'],
        family: 'Kids stay for free', distance: '5-10 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms', '3+ bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Aklan-B', region: 'Boracay', name: 'Movenpick Resort & Spa', type: 'Resort Hotel / Beach', price: 14500,
        img: 'https://images.unsplash.com/photo-1542213493895-edf5b94f5a96?q=80&w=1546&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.9781, lon: 121.9137, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Pay now'], 
        travelStyle: ['Resort Hotel'],
        roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Bottle of wine', 'Vegetarian'],
        facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Front desk [24-hour]'],
        family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Aklan-C', region: 'Boracay', name: 'Discovery Shores', type: 'Resort Hotel / Beach', price: 18000,
        img: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=800&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.9664, lon: 121.9234, 
        payment: ['Pay at the hotel', 'Book now, pay later'], 
        travelStyle: ['Resort Hotel'],
        roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Vegan', 'Early check-in'],
        facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Family/child friendly'],
        family: 'Kids stay for free', distance: '<2 km to center', bed: ['Queen', 'Double', 'King'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Public beach'
    },
    {
        id: 'Cebu-A', region: 'Cebu', name: 'Crimson Resort Mactan', type: 'Resort Hotel / Beach', price: 12500,
        img: 'https://images.unsplash.com/photo-1573551089778-46a7abc39d9f?q=80&w=1548&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 10.3060, lon: 124.0189, 
        payment: ['Free cancellation', 'Pay at the hotel'], 
        travelStyle: ['Resort Hotel'],
        roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Exercise bike', 'Recreation area access with conditions'],
        facilities: ['Swimming pool', 'Gym/fitness', 'Spa/sauna', 'Family/child friendly', 'Restaurants', 'Nightclub'],
        family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '3+ bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Cebu-B', region: 'Cebu', name: 'Marco Polo Plaza', type: 'City / Hotel', price: 6500,
        img: 'https://images.unsplash.com/photo-1742965635343-d8949a669935?q=80&w=1548&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 10.3340, lon: 123.8932, 
        payment: ['Pay at the hotel', 'Pay now', 'Book now, pay later'], 
        travelStyle: ['City'],
        roomOffers: ['Breakfast included', 'Treadmill', 'Early check-in', 'Delivery from nearby convenience store'],
        facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Front desk [24-hour]', 'Restaurants', 'Business facilities'],
        family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Cebu-C', region: 'Cebu', name: 'Magic Island Dive Resort', type: 'Resort Hotel / Beach', price: 8900,
        img: 'https://images.unsplash.com/photo-1501890664351-4ef399c1524f?q=80&w=2064&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 9.9485, lon: 123.3644, 
        payment: ['Pay now', 'Pay at the hotel'], 
        travelStyle: ['Resort Hotel', 'Hiking/Mountaineering'],
        roomOffers: ['Breakfast included', 'Vegetarian', 'Outside food delivery allowed'],
        facilities: ['Swimming pool', 'Internet', 'Restaurants', 'Smoking area', 'Golf course [on-site]', 'Front desk [24-hour]'], 
        family: 'Kids stay for free', distance: '>10 km to center', bed: ['Double', 'Single/twin'], bedrooms: ['1 bedroom/studio'], beachAccess: 'Public beach'
    },
    {
        id: 'Manila-A', region: 'Manila', name: 'The Manila Hotel', type: 'City / Hotel', price: 7200,
        img: 'https://zimminaroundtheworld.com/wp-content/uploads/2025/08/DSC_5200.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 14.5866, lon: 120.9762, 
        payment: ['Pay at the hotel', 'Pay now', 'Free cancellation'], 
        travelStyle: ['City'],
        roomOffers: ['Breakfast included', 'Outside food delivery allowed', 'Dumbbells', 'Car rental', 'Dinner included'],
        facilities: ['Swimming pool', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Facilities for disabled guests', 'Golf course [on-site]', 'Business facilities'],
        family: 'Kids stay for free', distance: 'Inside city center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '3+ bedrooms']
    },
    {
        id: 'Manila-B', region: 'Manila', name: 'Conrad Manila', type: 'City / Hotel', price: 13500,
        img: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Rizal_Park_from_above.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 14.5350, lon: 120.9829, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Pay now'], 
        travelStyle: ['City'],
        roomOffers: ['Breakfast included', 'Espresso machine with pods', 'Gluten-free', 'Vegan', 'Dumbbells'],
        facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Business facilities', 'Front desk [24-hour]'],
        family: 'Kids stay for free', distance: '5-10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms']
    },
    {
        id: 'Manila-C', region: 'Manila', name: 'Okada Manila', type: 'Resort Hotel / City', price: 16000,
        img: 'https://as2.ftcdn.net/jpg/05/70/59/03/1000_F_570590315_I4c15koiQ3os2GiviPa2QKYCTNQEx0N0.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 14.5161, lon: 120.9824, 
        payment: ['Pay at the hotel', 'Pay now', 'Book now, pay later'], 
        travelStyle: ['Resort Hotel', 'City'],
        roomOffers: ['Breakfast included', 'Espresso machine with pods', 'Delivery from nearby convenience store'],
        facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Nightclub', 'Restaurants', 'Front desk [24-hour]'],
        family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '3+ bedrooms']
    },
    {
        id: 'Ifugao-A', region: 'Ifugao', name: 'Banaue Hotel & Hostel', type: 'Mountain / Hotel', price: 2500,
        img: 'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=800&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 16.9032, lon: 121.0556, 
        payment: ['Pay at the hotel'], 
        travelStyle: ['Mountains', 'Hiking/Mountaineering'],
        roomOffers: ['Breakfast included', 'Vegetarian', 'Outside food delivery allowed'],
        facilities: ['Swimming pool', 'Internet', 'Restaurants', 'Car park', 'Front desk [24-hour]'],
        family: 'Kids stay for free', distance: '<2 km to center', bed: ['Double', 'Single/twin', 'Bunk bed'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Ifugao-B', region: 'Ifugao', name: 'Banaue Homestay', type: 'Mountain / Homestay / Camping', price: 1200,
        img: 'https://images.unsplash.com/photo-1575406811594-da848ffb8a50?q=80&w=1742&auto=format&fit=crop', panorama: 'https://pannellum.org/images/alma.jpg', lat: 16.9116, lon: 121.0601, 
        payment: ['Pay at the hotel', 'Book without credit card'], 
        travelStyle: ['Mountains', 'Hiking/Mountaineering', 'Camping'],
        roomOffers: ['Breakfast included', 'Outside food delivery allowed', 'Early check-in'],
        facilities: ['Internet', 'Family/child friendly', 'Restaurants', 'Non-smoking'],
        family: 'Kids stay for free', distance: '<2 km to center', bed: ['Double', 'Single/twin'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Ifugao-C', region: 'Ifugao', name: '7th Heavens Cafe', type: 'Mountain / Lodge', price: 1800,
        img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/7a/4e/4f/tappiyah-falls.jpg?w=1200&h=1200&s=1', panorama: 'https://pannellum.org/images/alma.jpg', lat: 16.9200, lon: 121.0650, 
        payment: ['Pay at the hotel', 'Pay now'], 
        travelStyle: ['Mountains', 'Hiking/Mountaineering'],
        roomOffers: ['Breakfast included', 'Vegetarian', 'Vegan', 'Early check-in', 'Lunch included'],
        facilities: ['Restaurants', 'Internet', 'Pets allowed', 'Smoking area', 'Front desk [24-hour]'],
        family: 'Kids stay for free', distance: '<2 km to center', bed: ['Double', 'Bunk bed'], bedrooms: ['1 bedroom/studio']
    }
];

// ==========================================
// ⚡ NEW: JAW-DROPPING TOUR PACKAGES IMAGES
// ==========================================
export const tourPackages = [
    { id: 'Tour-ElNido', name: 'El Nido Island Paradise', price: 34999, duration: '4 Days / 3 Nights', img: 'https://images.unsplash.com/photo-1520626337972-8ee434ee744c?q=80&w=1200&auto=format&fit=crop', type: 'Diving / Beach' },
    { id: 'Tour-Bohol', name: 'Bohol Adventure Package', price: 25999, duration: '3 Days / 2 Nights', img: 'https://images.unsplash.com/photo-1590077423771-474b8862cb24?q=80&w=1200&auto=format&fit=crop', type: 'Nature / Sightseeing' },
    { id: 'Tour-Boracay', name: 'Boracay Beach Escape', price: 39999, duration: '5 Days / 4 Nights', img: 'https://images.unsplash.com/photo-1542213493895-edf5b94f5a96?q=80&w=1200&auto=format&fit=crop', type: 'Beach / Relaxation' },
    { id: 'Tour-Cebu', name: 'Cebu Canyoneering', price: 22999, duration: '3 Days / 2 Nights', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop', type: 'Adventure / Diving' },
    { id: 'Tour-Banaue', name: 'Banaue Heritage Tour', price: 28999, duration: '4 Days / 3 Nights', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop', type: 'Culture / Mountains' },
    { id: 'Tour-Manila', name: 'Manila City Escape', price: 16999, duration: '2 Days / 1 Night', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop', type: 'City / History' }
];