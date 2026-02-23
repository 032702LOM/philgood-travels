// src/data/placesData.js

// ==========================================
// REGIONS (Mother Cards - Homepage & Destinations)
// ==========================================
export const regions = [
  { id: 'Manila', name: 'Manila', image: 'https://loremflickr.com/1200/800/Manila,City/all?lock=1', desc: 'Historic core of the capital.', typeBadge: 'Cities, Resort Hotels', locationLabel: 'NCR' },
  { id: 'Cebu', name: 'Cebu', image: 'https://loremflickr.com/1200/800/Cebu,Beach/all?lock=2', desc: 'Queen City of the South.', typeBadge: 'Beaches, Mountains', locationLabel: 'Central Visayas' },
  { id: 'Palawan', name: 'Palawan', image: 'https://loremflickr.com/1200/800/Palawan,Lagoon/all?lock=3', desc: 'The last frontier.', typeBadge: 'Parks, Beaches', locationLabel: 'MIMAROPA' },
  { id: 'Bohol', name: 'Bohol', image: 'https://loremflickr.com/1200/800/Bohol,Landscape/all?lock=4', desc: 'Nature and heritage.', typeBadge: 'Mountains, Beaches', locationLabel: 'Central Visayas' },
  { id: 'Boracay', name: 'Aklan (Boracay)', image: 'https://loremflickr.com/1200/800/Boracay,Sand/all?lock=5', desc: 'World-famous powdery sands.', typeBadge: 'Beaches, Resorts', locationLabel: 'Western Visayas' },
  { id: 'Banaue', name: 'Ifugao (Banaue)', image: 'https://loremflickr.com/1200/800/Banaue,Terraces/all?lock=6', desc: 'The eighth wonder of the world.', typeBadge: 'Mountains, Culture', locationLabel: 'North Central Luzon' }
];

// ==========================================
// ACCOMMODATIONS (Destinations Page Cards)
// ==========================================
export const allPlaces = [
    {
        id: 'Bohol-A', region: 'Bohol', name: 'Henann Resort Alona Beach', type: 'Resort Hotel / Beach', price: 8500,
        img: 'https://loremflickr.com/1200/800/Resort,Pool/all?lock=7', panorama: 'https://pannellum.org/images/alma.jpg', lat: 9.5513, lon: 123.7712, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Pay now'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Treadmill', 'Dinner included'], facilities: ['Swimming pool', 'Internet', 'Car park', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Business facilities', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Public beach'
    },
    {
        id: 'Bohol-B', region: 'Bohol', name: 'The Bellevue Resort', type: 'Resort Hotel / Beach', price: 9200,
        img: 'https://loremflickr.com/1200/800/Luxury,Resort/all?lock=8', panorama: 'https://pannellum.org/images/cerro-toco-0.jpg', lat: 9.6133, lon: 123.7718, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Book now, pay later'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Treadmill', 'Early check-in', 'Vegetarian'], facilities: ['Swimming pool', 'Internet', 'Car park', 'Gym/fitness', 'Spa/sauna', 'Family/child friendly', 'Restaurants', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Bohol-C', region: 'Bohol', name: 'Loboc River Resort', type: 'Mountains / Resort Hotel / Camping', price: 4500,
        img: 'https://loremflickr.com/1200/800/River,Resort/all?lock=9', panorama: 'https://pannellum.org/images/bma-0.jpg', lat: 9.6366, lon: 124.0322, 
        payment: ['Pay at the hotel', 'Pay now'], travelStyle: ['Mountains', 'Hiking/Mountaineering', 'Camping', 'Resort Hotel'], roomOffers: ['Breakfast included', 'Outside food delivery allowed', 'Bottle of wine', 'Recreation area access with conditions'], facilities: ['Swimming pool', 'Internet', 'Car park', 'Restaurants', 'Family/child friendly', 'Front desk [24-hour]', 'Smoking area'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['Queen', 'Double', 'Single/twin'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Palawan-A', region: 'Palawan', name: 'El Nido Resorts - Miniloc', type: 'National Park / Eco-Resort / Camping', price: 25000,
        img: 'https://loremflickr.com/1200/800/Eco,Resort/all?lock=10', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.1477, lon: 119.3828, 
        payment: ['Pay now', 'Free cancellation'], travelStyle: ['National Park', 'Resort Hotel', 'Camping', 'Hiking/Mountaineering'], roomOffers: ['Lunch included', 'Dinner included', 'Airport transfer', 'Gluten-free', 'Vegan'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Non-smoking', 'Family/child friendly', 'Airport transfer'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['Double', 'Single/twin'], bedrooms: ['1 bedroom/studio'], beachAccess: 'Private beach'
    },
    {
        id: 'Palawan-B', region: 'Palawan', name: 'Princesa Garden Island', type: 'Resort Hotel / City', price: 7800,
        img: 'https://loremflickr.com/1200/800/Tropical,Resort/all?lock=11', panorama: 'https://pannellum.org/images/alma.jpg', lat: 9.7548, lon: 118.7610, 
        payment: ['Book now, pay later', 'Pay at the hotel', 'Free cancellation'], travelStyle: ['Resort Hotel', 'City'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Treadmill', 'Car rental'], facilities: ['Swimming pool', 'Internet', 'Car park', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Facilities for disabled guests', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Palawan-C', region: 'Palawan', name: 'Seda Lio', type: 'Resort Hotel / Beach', price: 11500,
        img: 'https://loremflickr.com/1200/800/Beach,Hotel/all?lock=12', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.2001, lon: 119.4184, 
        payment: ['Pay now', 'Pay at the hotel', 'Book without credit card'], travelStyle: ['Resort Hotel', 'Hiking/Mountaineering'], roomOffers: ['Breakfast included', 'Airport transfer', 'Early check-in', 'Gluten-free'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Family/child friendly', 'Restaurants', 'Business facilities'], family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio'], beachAccess: 'Public beach'
    },
    {
        id: 'Aklan-A', region: 'Boracay', name: 'Shangri-La Boracay', type: 'Resort Hotel / Beach', price: 22000,
        img: 'https://loremflickr.com/1200/800/Luxury,Hotel/all?lock=13', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.9804, lon: 121.9126, 
        payment: ['Pay at the hotel', 'Pay now'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Dinner included', 'Bottle of wine'], facilities: ['Swimming pool', 'Gym/fitness', 'Spa/sauna', 'Family/child friendly', 'Restaurants', 'Business facilities', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '5-10 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms', '3+ bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Aklan-B', region: 'Boracay', name: 'Movenpick Resort & Spa', type: 'Resort Hotel / Beach', price: 14500,
        img: 'https://loremflickr.com/1200/800/Spa,Resort/all?lock=14', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.9781, lon: 121.9137, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Pay now'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Bottle of wine', 'Vegetarian'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Aklan-C', region: 'Boracay', name: 'Discovery Shores', type: 'Resort Hotel / Beach', price: 18000,
        img: 'https://loremflickr.com/1200/800/Beachfront,Resort/all?lock=15', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.9664, lon: 121.9234, 
        payment: ['Pay at the hotel', 'Book now, pay later'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Vegan', 'Early check-in'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Family/child friendly'], family: 'Kids stay for free', distance: '<2 km to center', bed: ['Queen', 'Double', 'King'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Public beach'
    },
    {
        id: 'Cebu-A', region: 'Cebu', name: 'Crimson Resort Mactan', type: 'Resort Hotel / Beach', price: 12500,
        img: 'https://loremflickr.com/1200/800/Resort,Mactan/all?lock=16', panorama: 'https://pannellum.org/images/alma.jpg', lat: 10.3060, lon: 124.0189, 
        payment: ['Free cancellation', 'Pay at the hotel'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Exercise bike', 'Recreation area access with conditions'], facilities: ['Swimming pool', 'Gym/fitness', 'Spa/sauna', 'Family/child friendly', 'Restaurants', 'Nightclub'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '3+ bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Cebu-B', region: 'Cebu', name: 'Marco Polo Plaza', type: 'City / Hotel', price: 6500,
        img: 'https://loremflickr.com/1200/800/City,Hotel/all?lock=17', panorama: 'https://pannellum.org/images/alma.jpg', lat: 10.3340, lon: 123.8932, 
        payment: ['Pay at the hotel', 'Pay now', 'Book now, pay later'], travelStyle: ['City'], roomOffers: ['Breakfast included', 'Treadmill', 'Early check-in', 'Delivery from nearby convenience store'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Front desk [24-hour]', 'Restaurants', 'Business facilities'], family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Cebu-C', region: 'Cebu', name: 'Magic Island Dive Resort', type: 'Resort Hotel / Beach', price: 8900,
        img: 'https://loremflickr.com/1200/800/Dive,Resort/all?lock=18', panorama: 'https://pannellum.org/images/alma.jpg', lat: 9.9485, lon: 123.3644, 
        payment: ['Pay now', 'Pay at the hotel'], travelStyle: ['Resort Hotel', 'Hiking/Mountaineering'], roomOffers: ['Breakfast included', 'Vegetarian', 'Outside food delivery allowed'], facilities: ['Swimming pool', 'Internet', 'Restaurants', 'Smoking area', 'Golf course [on-site]', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['Double', 'Single/twin'], bedrooms: ['1 bedroom/studio'], beachAccess: 'Public beach'
    },
    {
        id: 'Manila-A', region: 'Manila', name: 'The Manila Hotel', type: 'City / Hotel', price: 7200,
        img: 'https://loremflickr.com/1200/800/Historic,Hotel/all?lock=19', panorama: 'https://pannellum.org/images/alma.jpg', lat: 14.5866, lon: 120.9762, 
        payment: ['Pay at the hotel', 'Pay now', 'Free cancellation'], travelStyle: ['City'], roomOffers: ['Breakfast included', 'Outside food delivery allowed', 'Dumbbells', 'Car rental', 'Dinner included'], facilities: ['Swimming pool', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Facilities for disabled guests', 'Golf course [on-site]', 'Business facilities'], family: 'Kids stay for free', distance: 'Inside city center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '3+ bedrooms']
    },
    {
        id: 'Manila-B', region: 'Manila', name: 'Conrad Manila', type: 'City / Hotel', price: 13500,
        img: 'https://loremflickr.com/1200/800/Modern,Hotel/all?lock=20', panorama: 'https://pannellum.org/images/alma.jpg', lat: 14.5350, lon: 120.9829, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Pay now'], travelStyle: ['City'], roomOffers: ['Breakfast included', 'Espresso machine with pods', 'Gluten-free', 'Vegan', 'Dumbbells'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Business facilities', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '5-10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms']
    },
    {
        id: 'Manila-C', region: 'Manila', name: 'Okada Manila', type: 'Resort Hotel / City', price: 16000,
        img: 'https://loremflickr.com/1200/800/Casino,Resort/all?lock=21', panorama: 'https://pannellum.org/images/alma.jpg', lat: 14.5161, lon: 120.9824, 
        payment: ['Pay at the hotel', 'Pay now', 'Book now, pay later'], travelStyle: ['Resort Hotel', 'City'], roomOffers: ['Breakfast included', 'Espresso machine with pods', 'Delivery from nearby convenience store'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Nightclub', 'Restaurants', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '3+ bedrooms']
    },
    {
        id: 'Ifugao-A', region: 'Ifugao', name: 'Banaue Hotel & Hostel', type: 'Mountain / Hotel', price: 2500,
        img: 'https://loremflickr.com/1200/800/Mountain,Hotel/all?lock=22', panorama: 'https://pannellum.org/images/alma.jpg', lat: 16.9032, lon: 121.0556, 
        payment: ['Pay at the hotel'], travelStyle: ['Mountains', 'Hiking/Mountaineering'], roomOffers: ['Breakfast included', 'Vegetarian', 'Outside food delivery allowed'], facilities: ['Swimming pool', 'Internet', 'Restaurants', 'Car park', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '<2 km to center', bed: ['Double', 'Single/twin', 'Bunk bed'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Ifugao-B', region: 'Ifugao', name: 'Banaue Homestay', type: 'Mountain / Homestay / Camping', price: 1200,
        img: 'https://loremflickr.com/1200/800/Homestay,Philippines/all?lock=23', panorama: 'https://pannellum.org/images/alma.jpg', lat: 16.9116, lon: 121.0601, 
        payment: ['Pay at the hotel', 'Book without credit card'], travelStyle: ['Mountains', 'Hiking/Mountaineering', 'Camping'], roomOffers: ['Breakfast included', 'Outside food delivery allowed', 'Early check-in'], facilities: ['Internet', 'Family/child friendly', 'Restaurants', 'Non-smoking'], family: 'Kids stay for free', distance: '<2 km to center', bed: ['Double', 'Single/twin'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Ifugao-C', region: 'Ifugao', name: '7th Heavens Cafe', type: 'Mountain / Lodge', price: 1800,
        img: 'https://loremflickr.com/1200/800/Cabin,Philippines/all?lock=24', panorama: 'https://pannellum.org/images/alma.jpg', lat: 16.9200, lon: 121.0650, 
        payment: ['Pay at the hotel', 'Pay now'], travelStyle: ['Mountains', 'Hiking/Mountaineering'], roomOffers: ['Breakfast included', 'Vegetarian', 'Vegan', 'Early check-in', 'Lunch included'], facilities: ['Restaurants', 'Internet', 'Pets allowed', 'Smoking area', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '<2 km to center', bed: ['Double', 'Bunk bed'], bedrooms: ['1 bedroom/studio']
    }
];

// ==========================================
// TOUR PACKAGES (Featured Tours & Homepage)
// ==========================================
export const tourPackages = [
    { id: 'Tour-ElNido', name: 'El Nido Island Paradise', price: 34999, duration: '4 Days / 3 Nights', img: 'https://loremflickr.com/1200/800/El,Nido,Palawan/all?lock=101', type: 'Diving / Beach' },
    { id: 'Tour-Bohol', name: 'Bohol Adventure Package', price: 25999, duration: '3 Days / 2 Nights', img: 'https://loremflickr.com/1200/800/Chocolate,Hills/all?lock=102', type: 'Nature / Sightseeing' },
    { id: 'Tour-Boracay', name: 'Boracay Beach Escape', price: 39999, duration: '5 Days / 4 Nights', img: 'https://loremflickr.com/1200/800/White,Beach,Boracay/all?lock=103', type: 'Beach / Relaxation' },
    { id: 'Tour-Cebu', name: 'Cebu Canyoneering', price: 22999, duration: '3 Days / 2 Nights', img: 'https://loremflickr.com/1200/800/Kawasan,Falls/all?lock=104', type: 'Adventure / Diving' },
    { id: 'Tour-Banaue', name: 'Banaue Heritage Tour', price: 28999, duration: '4 Days / 3 Nights', img: 'https://loremflickr.com/1200/800/Batad,Terraces/all?lock=105', type: 'Culture / Mountains' },
    { id: 'Tour-Manila', name: 'Manila City Escape', price: 16999, duration: '2 Days / 1 Night', img: 'https://loremflickr.com/1200/800/Intramuros,Manila/all?lock=106', type: 'City / History' }
];