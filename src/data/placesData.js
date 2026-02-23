// src/data/placesData.js

// ==========================================
// REGIONS (Mother Cards - Homepage & Destinations)
// ==========================================
export const regions = [
  { id: 'Palawan', name: 'Palawan', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/7d/39/5f/caption.jpg?w=800&h=800&s=1', desc: 'The last frontier.', typeBadge: 'Parks, Beaches', locationLabel: 'MIMAROPA' },
  { id: 'Bohol', name: 'Bohol', image: 'https://www.tripsavvy.com/thmb/ENcqAjtXtH3XNV3eIg4MKfSyQ6A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-135558476-8533a33260d9436c9bc432ce630ec732.jpg', desc: 'Nature and heritage.', typeBadge: 'Mountains, Beaches', locationLabel: 'Central Visayas' },
  { id: 'Boracay', name: 'Aklan (Boracay)', image: 'https://www.philippinebeaches.org/wp-content/uploads/2024/05/Boracay-White-Beach.jpg', desc: 'World-famous powdery sands.', typeBadge: 'Beaches, Resorts', locationLabel: 'Western Visayas' },
  { id: 'Cebu', name: 'Cebu', image: 'https://www.agoda.com/wp-content/uploads/2023/12/Featured-image-Cebu-1244x700.jpg', desc: 'Queen City of the South.', typeBadge: 'Beaches, Mountains', locationLabel: 'Central Visayas' },
  { id: 'Manila', name: 'Manila', image: 'https://www.travel-palawan.com/wp-content/uploads/2023/04/Manila-Intramuros-Kalesa-city-tour-Philippines.jpeg', desc: 'Historic core of the capital.', typeBadge: 'Cities, Resort Hotels', locationLabel: 'NCR' },
  { id: 'Banaue', name: 'Ifugao (Banaue)', image: 'https://cdn-v2.theculturetrip.com/1220x680/wp-content/uploads/2018/02/shutterstock_634025597-e1730712247519.webp', desc: 'The eighth wonder of the world.', typeBadge: 'Mountains, Culture', locationLabel: 'North Central Luzon' }
];

// ==========================================
// ACCOMMODATIONS (Destinations Page Cards)
// ==========================================
export const allPlaces = [
    {
        id: 'Palawan-A', region: 'Palawan', name: 'El Nido Resorts - Miniloc', type: 'National Park / Eco-Resort / Camping', price: 25000,
        img: 'https://gttp.images.tshiftcdn.com/471852/x/0/el-nido-miniloc-island-resort-water-cottages.jpg?dpr=2&height=360&quality=65', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.1477, lon: 119.3828, 
        payment: ['Pay now', 'Free cancellation'], travelStyle: ['National Park', 'Resort Hotel', 'Camping', 'Hiking/Mountaineering'], roomOffers: ['Lunch included', 'Dinner included', 'Airport transfer', 'Gluten-free', 'Vegan'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Non-smoking', 'Family/child friendly', 'Airport transfer'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['Double', 'Single/twin'], bedrooms: ['1 bedroom/studio'], beachAccess: 'Private beach'
    },
    {
        id: 'Palawan-B', region: 'Palawan', name: 'Princesa Garden Island', type: 'Resort Hotel / City', price: 7800,
        img: 'https://triphappy.ph/wp-content/uploads/2025/04/1-7.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 9.7548, lon: 118.7610, 
        payment: ['Book now, pay later', 'Pay at the hotel', 'Free cancellation'], travelStyle: ['Resort Hotel', 'City'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Treadmill', 'Car rental'], facilities: ['Swimming pool', 'Internet', 'Car park', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Facilities for disabled guests', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Palawan-C', region: 'Palawan', name: 'Seda Lio', type: 'Resort Hotel / Beach', price: 11500,
        img: 'https://dom.raksotravel.com/Upload/Itinerary/Detail_14388_Serial_126_media.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.2001, lon: 119.4184, 
        payment: ['Pay now', 'Pay at the hotel', 'Book without credit card'], travelStyle: ['Resort Hotel', 'Hiking/Mountaineering'], roomOffers: ['Breakfast included', 'Airport transfer', 'Early check-in', 'Gluten-free'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Family/child friendly', 'Restaurants', 'Business facilities'], family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio'], beachAccess: 'Public beach'
    },
    {
        id: 'Bohol-A', region: 'Bohol', name: 'Henann Resort Alona Beach', type: 'Resort Hotel / Beach', price: 8500,
        img: 'https://www.henann.com/henannpremiercoast/wp-content/uploads/2025/08/henann_premier_coast_homepage3_new-4.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 9.5513, lon: 123.7712, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Pay now'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Treadmill', 'Dinner included'], facilities: ['Swimming pool', 'Internet', 'Car park', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Business facilities', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Public beach'
    },
    {
        id: 'Bohol-B', region: 'Bohol', name: 'The Bellevue Resort', type: 'Resort Hotel / Beach', price: 9200,
        img: 'https://thebellevuebohol.com/wp-content/uploads/2022/11/4-2.jpg', panorama: 'https://pannellum.org/images/cerro-toco-0.jpg', lat: 9.6133, lon: 123.7718, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Book now, pay later'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Treadmill', 'Early check-in', 'Vegetarian'], facilities: ['Swimming pool', 'Internet', 'Car park', 'Gym/fitness', 'Spa/sauna', 'Family/child friendly', 'Restaurants', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Bohol-C', region: 'Bohol', name: 'Loboc River Resort', type: 'Mountains / Resort Hotel / Camping', price: 4500,
        img: 'https://b2264055.smushcdn.com/2264055/wp-content/uploads/2020/05/LobocRiverResort-ExclusivePool.jpg?lossy=1&strip=1&webp=1', panorama: 'https://pannellum.org/images/bma-0.jpg', lat: 9.6366, lon: 124.0322, 
        payment: ['Pay at the hotel', 'Pay now'], travelStyle: ['Mountains', 'Hiking/Mountaineering', 'Camping', 'Resort Hotel'], roomOffers: ['Breakfast included', 'Outside food delivery allowed', 'Bottle of wine', 'Recreation area access with conditions'], facilities: ['Swimming pool', 'Internet', 'Car park', 'Restaurants', 'Family/child friendly', 'Front desk [24-hour]', 'Smoking area'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['Queen', 'Double', 'Single/twin'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Aklan-A', region: 'Boracay', name: 'Shangri-La Boracay', type: 'Resort Hotel / Beach', price: 22000,
        img: 'https://sitecore-cd.shangri-la.com/-/media/Shangri-La/boracay_boracayresort/about/2023_SLBO_Explore-Boracay.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.9804, lon: 121.9126, 
        payment: ['Pay at the hotel', 'Pay now'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Dinner included', 'Bottle of wine'], facilities: ['Swimming pool', 'Gym/fitness', 'Spa/sauna', 'Family/child friendly', 'Restaurants', 'Business facilities', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '5-10 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms', '3+ bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Aklan-B', region: 'Boracay', name: 'Movenpick Resort & Spa', type: 'Resort Hotel / Beach', price: 14500,
        img: 'https://static51.com-hotel.com/uploads/hotel/79977/photo/movenpick-resort-spa-jimbaran-bali_15833146371.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.9781, lon: 121.9137, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Pay now'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Bottle of wine', 'Vegetarian'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Aklan-C', region: 'Boracay', name: 'Discovery Shores', type: 'Resort Hotel / Beach', price: 18000,
        img: 'https://www.hotelscombined.com/himg/2a/8d/29/ice-188879268-65954305_3XL-177763.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 11.9664, lon: 121.9234, 
        payment: ['Pay at the hotel', 'Book now, pay later'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Vegan', 'Early check-in'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Family/child friendly'], family: 'Kids stay for free', distance: '<2 km to center', bed: ['Queen', 'Double', 'King'], bedrooms: ['1 bedroom/studio', '2 bedrooms'], beachAccess: 'Public beach'
    },
    {
        id: 'Cebu-A', region: 'Cebu', name: 'Crimson Resort Mactan', type: 'Resort Hotel / Beach', price: 12500,
        img: 'https://www.johansens.com/wp-content/uploads/2016/05/Philippines-Crimson-Resort-and-Spa-Mactan-14.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 10.3060, lon: 124.0189, 
        payment: ['Free cancellation', 'Pay at the hotel'], travelStyle: ['Resort Hotel'], roomOffers: ['Breakfast included', 'Airport transfer', 'Espresso machine with pods', 'Exercise bike', 'Recreation area access with conditions'], facilities: ['Swimming pool', 'Gym/fitness', 'Spa/sauna', 'Family/child friendly', 'Restaurants', 'Nightclub'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '3+ bedrooms'], beachAccess: 'Private beach'
    },
    {
        id: 'Cebu-B', region: 'Cebu', name: 'Marco Polo Plaza', type: 'City / Hotel', price: 6500,
        img: 'https://d17k8relgo9zj1.cloudfront.net/rcimg/2/TLarV2XnBZnp0cj_N9Rc5kflMHxvHkzglVuGO_RLZYM/fit/0/1000/ce/1/aHR0cHM6Ly9pLnRyYXZlbGFwaS5jb20vaG90ZWxzLzIwMDAwMDAvMTQ2MDAwMC8xNDU1MTAwLzE0NTUwMTcvOThiZjRmOTkuanBn.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 10.3340, lon: 123.8932, 
        payment: ['Pay at the hotel', 'Pay now', 'Book now, pay later'], travelStyle: ['City'], roomOffers: ['Breakfast included', 'Treadmill', 'Early check-in', 'Delivery from nearby convenience store'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Front desk [24-hour]', 'Restaurants', 'Business facilities'], family: 'Kids stay for free', distance: '2-5 km to center', bed: ['King', 'Queen', 'Single/twin'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Cebu-C', region: 'Cebu', name: 'Magic Island Dive Resort', type: 'Resort Hotel / Beach', price: 8900,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoDLSPjK7K8bDVN3DR-LBkMmeHquKKExirZQ&s', panorama: 'https://pannellum.org/images/alma.jpg', lat: 9.9485, lon: 123.3644, 
        payment: ['Pay now', 'Pay at the hotel'], travelStyle: ['Resort Hotel', 'Hiking/Mountaineering'], roomOffers: ['Breakfast included', 'Vegetarian', 'Outside food delivery allowed'], facilities: ['Swimming pool', 'Internet', 'Restaurants', 'Smoking area', 'Golf course [on-site]', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['Double', 'Single/twin'], bedrooms: ['1 bedroom/studio'], beachAccess: 'Public beach'
    },
    {
        id: 'Manila-A', region: 'Manila', name: 'The Manila Hotel', type: 'City / Hotel', price: 7200,
        img: 'https://images.trvl-media.com/lodging/1000000/30000/24300/24224/30951071.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', panorama: 'https://pannellum.org/images/alma.jpg', lat: 14.5866, lon: 120.9762, 
        payment: ['Pay at the hotel', 'Pay now', 'Free cancellation'], travelStyle: ['City'], roomOffers: ['Breakfast included', 'Outside food delivery allowed', 'Dumbbells', 'Car rental', 'Dinner included'], facilities: ['Swimming pool', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Facilities for disabled guests', 'Golf course [on-site]', 'Business facilities'], family: 'Kids stay for free', distance: 'Inside city center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '3+ bedrooms']
    },
    {
        id: 'Manila-B', region: 'Manila', name: 'Conrad Manila', type: 'City / Hotel', price: 13500,
        img: 'https://www.momondo.com.au/himg/c8/17/ed/ice-2588129-122167908-474128.jpg', panorama: 'https://pannellum.org/images/alma.jpg', lat: 14.5350, lon: 120.9829, 
        payment: ['Free cancellation', 'Pay at the hotel', 'Pay now'], travelStyle: ['City'], roomOffers: ['Breakfast included', 'Espresso machine with pods', 'Gluten-free', 'Vegan', 'Dumbbells'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Restaurants', 'Business facilities', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '5-10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '2 bedrooms']
    },
    {
        id: 'Manila-C', region: 'Manila', name: 'Okada Manila', type: 'Resort Hotel / City', price: 16000,
        img: 'https://www.tigerresort.com/images/okadabanner02.png', panorama: 'https://pannellum.org/images/alma.jpg', lat: 14.5161, lon: 120.9824, 
        payment: ['Pay at the hotel', 'Pay now', 'Book now, pay later'], travelStyle: ['Resort Hotel', 'City'], roomOffers: ['Breakfast included', 'Espresso machine with pods', 'Delivery from nearby convenience store'], facilities: ['Swimming pool', 'Internet', 'Gym/fitness', 'Spa/sauna', 'Nightclub', 'Restaurants', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '>10 km to center', bed: ['King', 'Single/twin'], bedrooms: ['1 bedroom/studio', '3+ bedrooms']
    },
    {
        id: 'Ifugao-A', region: 'Ifugao', name: 'Banaue Hotel & Hostel', type: 'Mountain / Hotel', price: 2500,
        img: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/558096968.jpg?k=80a9bbf74083c2e465b954173c7a4d503733345736a86c472fb21c36eab5caff&o=', panorama: 'https://pannellum.org/images/alma.jpg', lat: 16.9032, lon: 121.0556, 
        payment: ['Pay at the hotel'], travelStyle: ['Mountains', 'Hiking/Mountaineering'], roomOffers: ['Breakfast included', 'Vegetarian', 'Outside food delivery allowed'], facilities: ['Swimming pool', 'Internet', 'Restaurants', 'Car park', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '<2 km to center', bed: ['Double', 'Single/twin', 'Bunk bed'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Ifugao-B', region: 'Ifugao', name: 'Banaue Homestay', type: 'Mountain / Homestay / Camping', price: 1200,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLp4dXIPp5BGsCFclVYOTr7OqftgOBgJJ9ug&s', panorama: 'https://pannellum.org/images/alma.jpg', lat: 16.9116, lon: 121.0601, 
        payment: ['Pay at the hotel', 'Book without credit card'], travelStyle: ['Mountains', 'Hiking/Mountaineering', 'Camping'], roomOffers: ['Breakfast included', 'Outside food delivery allowed', 'Early check-in'], facilities: ['Internet', 'Family/child friendly', 'Restaurants', 'Non-smoking'], family: 'Kids stay for free', distance: '<2 km to center', bed: ['Double', 'Single/twin'], bedrooms: ['1 bedroom/studio']
    },
    {
        id: 'Ifugao-C', region: 'Ifugao', name: '7th Heavens Cafe', type: 'Mountain / Lodge', price: 1800,
        img: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/485942567.jpg?k=20c564bd5d87c8270ca46c2e2af7027faf5e45c8c378423a2d33810551a0168c&o=', panorama: 'https://pannellum.org/images/alma.jpg', lat: 16.9200, lon: 121.0650, 
        payment: ['Pay at the hotel', 'Pay now'], travelStyle: ['Mountains', 'Hiking/Mountaineering'], roomOffers: ['Breakfast included', 'Vegetarian', 'Vegan', 'Early check-in', 'Lunch included'], facilities: ['Restaurants', 'Internet', 'Pets allowed', 'Smoking area', 'Front desk [24-hour]'], family: 'Kids stay for free', distance: '<2 km to center', bed: ['Double', 'Bunk bed'], bedrooms: ['1 bedroom/studio']
    }
];

// ==========================================
// TOUR PACKAGES (Featured Tours & Homepage)
// ==========================================
export const tourPackages = [
    { id: 'Tour-ElNido', name: 'El Nido Island Paradise', price: 34999, duration: '4 Days / 3 Nights', img: 'https://www.elnidoparadise.com/wp-content/uploads/pasandigan-beach.jpeg', type: 'Diving / Beach' },
    { id: 'Tour-Bohol', name: 'Bohol Adventure Package', price: 25999, duration: '3 Days / 2 Nights', img: 'https://thesweetwanderlust.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-20-at-3.22.09-PM.jpg.webp', type: 'Nature / Sightseeing' },
    { id: 'Tour-Boracay', name: 'Boracay Beach Escape', price: 39999, duration: '5 Days / 4 Nights', img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHMierP49f26a64uN3vekaYGii5NxYXU4w0xZDQ4Kyk01pQjaqf2wCLvjFIljnW7A7HikYICKVBMxVtL2k5beN98Ab5WmFcg2ciOTzdfDlchqXvJMhpdhGmsS5v0SKpUFWzpAK93SgJANjMBLjRhcEXjYaYJxFQzAYoZYTy16UQ8JECl51CJ73htSLPiU/s2048/puka-beach-with-jan.jpg', type: 'Beach / Relaxation' },
    { id: 'Tour-Cebu', name: 'Cebu Canyoneering', price: 22999, duration: '3 Days / 2 Nights', img: 'https://travelraro.com/wp-content/uploads/2023/09/Untitled-design.png', type: 'Adventure / Diving' },
    { id: 'Tour-Manila', name: 'Manila City Escape', price: 16999, duration: '2 Days / 1 Night', img: 'https://www.aworldtotravel.com/wp-content/uploads/2023/08/manila-skyline-from-harbour-square.jpg', type: 'City / History' },
    { id: 'Tour-Banaue', name: 'Banaue Heritage Tour', price: 28999, duration: '4 Days / 3 Nights', img: 'https://www.vacationhive.com/images/hives/11/11-banaue-terraces-main-img-new.jpg', type: 'Culture / Mountains' }
];