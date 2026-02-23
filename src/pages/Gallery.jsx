import React, { useState, useEffect } from 'react';
import { usePreferences } from '../context/PreferencesContext';

// ==========================================
// HARD-CODED GALLERY DATA (UPDATED WITH NEW LINKS)
// ==========================================
const galleryData = [
  { 
    id: 'Palawan', 
    name: 'Palawan', 
    cover: 'https://loremflickr.com/800/800/El,Nido,philippines/all?lock=00', 
    subcards: [
      { 
        id: 'palawan-elnido', 
        name: 'El Nido', 
        cover: 'https://loremflickr.com/800/800/El,Nido,philippines/all?lock=00',
        images: [
          { id: 'el-img-1', title: 'El Nido - 1', url: 'https://loremflickr.com/800/800/El,Nido,philippines/all?lock=00' },
          { id: 'el-img-2', title: 'El Nido - 2', url: 'https://loremflickr.com/800/800/El,Nido,philippines/all?lock=01' },
          { id: 'el-img-3', title: 'El Nido - 3', url: 'https://loremflickr.com/800/800/El,Nido,philippines/all?lock=02' },
          { id: 'el-img-4', title: 'El Nido - 4', url: 'https://loremflickr.com/800/800/El,Nido,philippines/all?lock=03' },
          { id: 'el-img-5', title: 'El Nido - 5', url: 'https://loremflickr.com/800/800/El,Nido,philippines/all?lock=04' }
        ]
      },
      { 
        id: 'palawan-coron', 
        name: 'Coron', 
        cover: 'https://loremflickr.com/800/800/Coron,philippines/all?lock=10',
        images: [
          { id: 'co-img-1', title: 'Coron - 1', url: 'https://loremflickr.com/800/800/Coron,philippines/all?lock=10' },
          { id: 'co-img-2', title: 'Coron - 2', url: 'https://loremflickr.com/800/800/Coron,philippines/all?lock=11' },
          { id: 'co-img-3', title: 'Coron - 3', url: 'https://loremflickr.com/800/800/Coron,philippines/all?lock=12' },
          { id: 'co-img-4', title: 'Coron - 4', url: 'https://loremflickr.com/800/800/Coron,philippines/all?lock=13' },
          { id: 'co-img-5', title: 'Coron - 5', url: 'https://loremflickr.com/800/800/Coron,philippines/all?lock=14' }
        ]
      },
      { 
        id: 'palawan-puerto', 
        name: 'Puerto Princesa', 
        cover: 'https://loremflickr.com/800/800/Puerto,Princesa,philippines/all?lock=20',
        images: [
          { id: 'pp-img-1', title: 'Puerto Princesa - 1', url: 'https://loremflickr.com/800/800/Puerto,Princesa,philippines/all?lock=20' },
          { id: 'pp-img-2', title: 'Puerto Princesa - 2', url: 'https://loremflickr.com/800/800/Puerto,Princesa,philippines/all?lock=21' },
          { id: 'pp-img-3', title: 'Puerto Princesa - 3', url: 'https://loremflickr.com/800/800/Puerto,Princesa,philippines/all?lock=22' },
          { id: 'pp-img-4', title: 'Puerto Princesa - 4', url: 'https://loremflickr.com/800/800/Puerto,Princesa,philippines/all?lock=23' },
          { id: 'pp-img-5', title: 'Puerto Princesa - 5', url: 'https://loremflickr.com/800/800/Puerto,Princesa,philippines/all?lock=24' }
        ]
      }
    ] 
  },
  { 
    id: 'Bohol', 
    name: 'Bohol', 
    cover: 'https://loremflickr.com/800/800/Chocolate,Hills,philippines/all?lock=00', 
    subcards: [
      { 
        id: 'bohol-choc', 
        name: 'Chocolate Hills', 
        cover: 'https://loremflickr.com/800/800/Chocolate,Hills,philippines/all?lock=00',
        images: [
          { id: 'ch-img-1', title: 'Chocolate Hills - 1', url: 'https://loremflickr.com/800/800/Chocolate,Hills,philippines/all?lock=00' },
          { id: 'ch-img-2', title: 'Chocolate Hills - 2', url: 'https://loremflickr.com/800/800/Chocolate,Hills,philippines/all?lock=01' },
          { id: 'ch-img-3', title: 'Chocolate Hills - 3', url: 'https://loremflickr.com/800/800/Chocolate,Hills,philippines/all?lock=02' },
          { id: 'ch-img-4', title: 'Chocolate Hills - 4', url: 'https://loremflickr.com/800/800/Chocolate,Hills,philippines/all?lock=03' },
          { id: 'ch-img-5', title: 'Chocolate Hills - 5', url: 'https://loremflickr.com/800/800/Chocolate,Hills,philippines/all?lock=04' }
        ]
      },
      { 
        id: 'bohol-panglao', 
        name: 'Panglao Island', 
        cover: 'https://loremflickr.com/800/800/Panglao,Island,philippines/all?lock=10',
        images: [
          { id: 'pa-img-1', title: 'Panglao Island - 1', url: 'https://loremflickr.com/800/800/Panglao,Island,philippines/all?lock=10' },
          { id: 'pa-img-2', title: 'Panglao Island - 2', url: 'https://loremflickr.com/800/800/Panglao,Island,philippines/all?lock=11' },
          { id: 'pa-img-3', title: 'Panglao Island - 3', url: 'https://loremflickr.com/800/800/Panglao,Island,philippines/all?lock=12' },
          { id: 'pa-img-4', title: 'Panglao Island - 4', url: 'https://loremflickr.com/800/800/Panglao,Island,philippines/all?lock=13' },
          { id: 'pa-img-5', title: 'Panglao Island - 5', url: 'https://loremflickr.com/800/800/Panglao,Island,philippines/all?lock=14' }
        ]
      },
      { 
        id: 'bohol-loboc', 
        name: 'Loboc River', 
        cover: 'https://loremflickr.com/800/800/Loboc,River,philippines/all?lock=20',
        images: [
          { id: 'lo-img-1', title: 'Loboc River - 1', url: 'https://loremflickr.com/800/800/Loboc,River,philippines/all?lock=20' },
          { id: 'lo-img-2', title: 'Loboc River - 2', url: 'https://loremflickr.com/800/800/Loboc,River,philippines/all?lock=21' },
          { id: 'lo-img-3', title: 'Loboc River - 3', url: 'https://loremflickr.com/800/800/Loboc,River,philippines/all?lock=22' },
          { id: 'lo-img-4', title: 'Loboc River - 4', url: 'https://loremflickr.com/800/800/Loboc,River,philippines/all?lock=23' },
          { id: 'lo-img-5', title: 'Loboc River - 5', url: 'https://loremflickr.com/800/800/Loboc,River,philippines/all?lock=24' }
        ]
      }
    ] 
  },
  { 
    id: 'Boracay', 
    name: 'Boracay (Aklan)', 
    cover: 'https://loremflickr.com/800/800/White,Beach,philippines/all?lock=00', 
    subcards: [
      { 
        id: 'boracay-white', 
        name: 'White Beach', 
        cover: 'https://loremflickr.com/800/800/White,Beach,philippines/all?lock=00',
        images: [
          { id: 'wb-img-1', title: 'White Beach - 1', url: 'https://loremflickr.com/800/800/White,Beach,philippines/all?lock=00' },
          { id: 'wb-img-2', title: 'White Beach - 2', url: 'https://loremflickr.com/800/800/White,Beach,philippines/all?lock=01' },
          { id: 'wb-img-3', title: 'White Beach - 3', url: 'https://loremflickr.com/800/800/White,Beach,philippines/all?lock=02' },
          { id: 'wb-img-4', title: 'White Beach - 4', url: 'https://loremflickr.com/800/800/White,Beach,philippines/all?lock=03' },
          { id: 'wb-img-5', title: 'White Beach - 5', url: 'https://loremflickr.com/800/800/White,Beach,philippines/all?lock=04' }
        ]
      },
      { 
        id: 'boracay-puka', 
        name: 'Puka Shell Beach', 
        cover: 'https://www.travel-palawan.com/wp-content/uploads/2024/12/Puka-Shell-Beach-Boracay.jpg',
        images: [
          { id: 'ps-img-1', title: 'Puka Shell Beach - 1', url: 'https://www.pelago.com/img/products/PH-Philippines/boracay-island-hopping-day-tour-puka-beach-tambisaan-beach-coral-garden-crocodile-island-ilig-iligan-beach-philippines/b2c1f9aa-6285-4cd4-9442-2425b1b770b3_boracay-island-hopping-day-tour-puka-beach-tambisaan-beach-coral-garden-crocodile-island-ilig-iligan-beach-philippines.jpg' },
          { id: 'ps-img-2', title: 'Puka Shell Beach - 2', url: 'https://www.travel-palawan.com/wp-content/uploads/2024/12/Puka-Shell-Beach-Boracay.jpg' },
          { id: 'ps-img-3', title: 'Puka Shell Beach - 3', url: 'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/ot9yodnkzmflglxeooce.jpg' },
          { id: 'ps-img-4', title: 'Puka Shell Beach - 4', url: 'https://www.boracaybeach.guide/wp-content/uploads/2020/04/puka-beach-borocay-sign.jpg' },
          { id: 'ps-img-5', title: 'Puka Shell Beach - 5', url: 'https://www.thedistrictboracay.com/wp-content/uploads/2015/02/IMG_5286.jpg' }
        ]
      },
      { 
        id: 'boracay-diniwid', 
        name: 'Diniwid', 
        cover: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/19/6b/2b/view-of-diniwid-beach.jpg?w=900&h=500&s=1',
        images: [
          { id: 'dw-img-1', title: 'Diniwid - 1', url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/19/6b/2b/view-of-diniwid-beach.jpg?w=900&h=500&s=1' },
          { id: 'dw-img-2', title: 'Diniwid - 2', url: 'https://www.myboracayguide.com/Air-Photo/Air-Photo-5.jpg' },
          { id: 'dw-img-3', title: 'Diniwid - 3', url: 'https://images.trvl-media.com/place/6184371/9682f548-3b4a-4f12-bbb3-3b7b72e1537e.jpg' },
          { id: 'dw-img-4', title: 'Diniwid - 4', url: 'https://www.vigattintourism.com/assets/article_main_photos/optimize/1346405392d7ojUY31.jpg' },
          { id: 'dw-img-5', title: 'Diniwid - 5', url: 'https://viaje.com.ph/wp-content/uploads/2024/03/vrt-posts-img-2-cropped.png' }
        ]
      }
    ] 
  },
  { 
    id: 'Cebu', 
    name: 'Cebu', 
    cover: 'https://media.meer.com/attachments/f8f6ceb2e265665e65eb48fbd307be350c970dd2/store/fill/1090/613/c65a7589724cc0a95638e63bce224d19cc7b1d70b96da5cbfd33ee5b18e0/A-kayaker-paddles-above-whale-sharks-in-the-waters-of-Oslob-a-town-in-the-Philippines-that-has.jpg', 
    subcards: [
      { 
        id: 'cebu-moalboal', 
        name: 'Moalboal', 
        cover: 'https://loremflickr.com/800/800/Moalboal,philippines/all?lock=00',
        images: [
          { id: 'mb-img-1', title: 'Moalboal - 1', url: 'https://loremflickr.com/800/800/Moalboal,philippines/all?lock=00' },
          { id: 'mb-img-2', title: 'Moalboal - 2', url: 'https://loremflickr.com/800/800/Moalboal,philippines/all?lock=01' },
          { id: 'mb-img-3', title: 'Moalboal - 3', url: 'https://loremflickr.com/800/800/Moalboal,philippines/all?lock=02' },
          { id: 'mb-img-4', title: 'Moalboal - 4', url: 'https://loremflickr.com/800/800/Moalboal,philippines/all?lock=03' },
          { id: 'mb-img-5', title: 'Moalboal - 5', url: 'https://loremflickr.com/800/800/Moalboal,philippines/all?lock=04' }
        ]
      },
      { 
        id: 'cebu-oslob', 
        name: 'Oslob', 
        cover: 'https://media.meer.com/attachments/f8f6ceb2e265665e65eb48fbd307be350c970dd2/store/fill/1090/613/c65a7589724cc0a95638e63bce224d19cc7b1d70b96da5cbfd33ee5b18e0/A-kayaker-paddles-above-whale-sharks-in-the-waters-of-Oslob-a-town-in-the-Philippines-that-has.jpg',
        images: [
          { id: 'os-img-1', title: 'Oslob - 1', url: 'https://media.meer.com/attachments/f8f6ceb2e265665e65eb48fbd307be350c970dd2/store/fill/1090/613/c65a7589724cc0a95638e63bce224d19cc7b1d70b96da5cbfd33ee5b18e0/A-kayaker-paddles-above-whale-sharks-in-the-waters-of-Oslob-a-town-in-the-Philippines-that-has.jpg' },
          { id: 'os-img-2', title: 'Oslob - 2', url: 'https://outoftownblog.com/wp-content/uploads/2020/01/Tourists-are-watching-whale-sharks-in-the-town-of-Oslob-Philippines-aerial-view..jpg' },
          { id: 'os-img-3', title: 'Oslob - 3', url: 'https://gttp.images.tshiftcdn.com/225443/x/0/best-travel-guide-to-oslob-town-in-cebu-island-everything-you-need-to-know-17.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883' },
          { id: 'os-img-4', title: 'Oslob - 4', url: 'https://img.freepik.com/free-photo/aerial-view-sandy-beach-with-tourists-swimming-beautiful-clear-sea-water-sumilon-island-beach-landing-near-oslob-cebu-philippines-boost-up-color-processing_1253-893.jpg?semt=ais_user_personalization&w=740&q=80' },
          { id: 'os-img-5', title: 'Oslob - 5', url: 'https://www.vacationhive.com/wp-content/uploads/2022/10/sumilon-content-img-banner.jpg' }
        ]
      },
      { 
        id: 'cebu-bantayan', 
        name: 'Bantayan Island', 
        cover: 'https://shoestringdiary.wordpress.com/wp-content/uploads/2025/09/kota_beach108-ssd-cover.jpg?w=1140',
        images: [
          { id: 'bi-img-1', title: 'Bantayan Island - 1', url: 'https://shoestringdiary.wordpress.com/wp-content/uploads/2025/09/kota_beach108-ssd-cover.jpg?w=1140' },
          { id: 'bi-img-2', title: 'Bantayan Island - 2', url: 'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/qrdrvazewadua9rcxw00.jpg' },
          { id: 'bi-img-3', title: 'Bantayan Island - 3', url: 'https://imgs.mongabay.com/wp-content/uploads/sites/20/2020/10/05072221/bantayan-features.png' },
          { id: 'bi-img-4', title: 'Bantayan Island - 4', url: 'https://www.baconismagic.ca/wp-content/uploads/2024/11/santa-Fe-Beach.jpg' },
          { id: 'bi-img-5', title: 'Bantayan Island - 5', url: 'https://cdn.forevervacation.com/uploads/attraction/bantayan-island-important-2439.webp' }
        ]
      }
    ] 
  },
  { 
    id: 'Manila', 
    name: 'Manila', 
    cover: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Rizal_Monument_%28Manila%2C_2024%29.jpg', 
    subcards: [
      { 
        id: 'manila-intra', 
        name: 'Intramuros', 
        cover: 'https://loremflickr.com/800/800/Intramuros,philippines/all?lock=00',
        images: [
          { id: 'in-img-1', title: 'Intramuros - 1', url: 'https://loremflickr.com/800/800/Intramuros,philippines/all?lock=00' },
          { id: 'in-img-2', title: 'Intramuros - 2', url: 'https://loremflickr.com/800/800/Intramuros,philippines/all?lock=01' },
          { id: 'in-img-3', title: 'Intramuros - 3', url: 'https://loremflickr.com/800/800/Intramuros,philippines/all?lock=02' },
          { id: 'in-img-4', title: 'Intramuros - 4', url: 'https://loremflickr.com/800/800/Intramuros,philippines/all?lock=03' },
          { id: 'in-img-5', title: 'Intramuros - 5', url: 'https://loremflickr.com/800/800/Intramuros,philippines/all?lock=04' }
        ]
      },
      { 
        id: 'manila-rizal', 
        name: 'Rizal Park', 
        cover: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Rizal_Monument_%28Manila%2C_2024%29.jpg',
        images: [
          { id: 'rp-img-1', title: 'Rizal Park - 1', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Rizal_Monument_%28Manila%2C_2024%29.jpg' },
          { id: 'rp-img-2', title: 'Rizal Park - 2', url: 'https://pgaacreativedesign.com/wp-content/uploads/2024/11/rizal_park_looking_west_medres.jpg' },
          { id: 'rp-img-3', title: 'Rizal Park - 3', url: 'https://images.summitmedia-digital.com/spotph/images/2024/06/29/flag-and-rizal-1-1719675185.jpg' },
          { id: 'rp-img-4', title: 'Rizal Park - 4', url: 'https://res.klook.com/image/upload/w_500,h_313,c_fill,q_85/activities/hdxxrasmgoinb0ofyrxz.jpg' },
          { id: 'rp-img-5', title: 'Rizal Park - 5', url: 'https://thursd.com/storage/media/97017/Rizal-Park-Luneta-by-Apolinario.jpg?1760646138831' }
        ]
      },
      { 
        id: 'manila-bgc', 
        name: 'BGC', 
        cover: 'https://bgc.com.ph/wp-content/uploads/2021/11/activities.jpg',
        images: [
          { id: 'bgc-img-1', title: 'BGC - 1', url: 'https://bgc.com.ph/wp-content/uploads/2021/11/activities.jpg' },
          { id: 'bgc-img-2', title: 'BGC - 2', url: 'https://bunny-wp-pullzone-jq11rxv9xs.b-cdn.net/wp-content/uploads/2023/04/bgc.webp' },
          { id: 'bgc-img-3', title: 'BGC - 3', url: 'https://sms-bridges.com/wp-content/uploads/2023/02/BGC-photo-4.jpg' },
          { id: 'bgc-img-4', title: 'BGC - 4', url: 'https://thefortcity.com/wp-content/uploads/20201435200129sYzw50ac309fa08668468b87f662656ab1604.jpg' },
          { id: 'bgc-img-5', title: 'BGC - 5', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/View_from_Grand_Hyatt_Manila_overlooking_Bonifacio_Global_City_and_Makati_skylines_at_sunset.jpg' }
        ]
      }
    ] 
  },
  { 
    id: 'Banaue', 
    name: 'Ifugao (Banaue)', 
    cover: 'https://islandhoppinginthephilippines.com/luzon/wp-content/uploads/2023/10/Banaue-Rice-Terraces.webp', 
    subcards: [
      { 
        id: 'banaue-batad', 
        name: 'Batad Terraces', 
        cover: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/51/34/df/photo0jpg.jpg?w=900&h=500&s=1',
        images: [
          { id: 'bt-img-1', title: 'Batad Terraces - 1', url: 'https://loremflickr.com/800/800/Batad,Terraces,philippines/all?lock=00' },
          { id: 'bt-img-2', title: 'Batad Terraces - 2', url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/51/34/df/photo0jpg.jpg?w=900&h=500&s=1' },
          { id: 'bt-img-3', title: 'Batad Terraces - 3', url: 'https://cdn.audleytravel.com/2272/1623/79/15978475-batad-village.jpg' },
          { id: 'bt-img-4', title: 'Batad Terraces - 4', url: 'https://www.goparoo.com/asia/philippines/luzon/banaue/attractions/batad-rice-terraces/images/pics/Batad%20Rice%20Terraces.jpg' },
          { id: 'bt-img-5', title: 'Batad Terraces - 5', url: 'https://afar.brightspotcdn.com/dims4/default/d0b27db/2147483647/strip/false/crop/800x450+0+25/resize/1200x675!/quality/90/?url=https%3A%2F%2Fk3-prod-afar-media.s3.us-west-2.amazonaws.com%2Fbrightspot%2F71%2F28%2Fc189a543b31f45e031b2171cc55f%2Foriginal-ifugao-rha-29-5018-20tony-20waltham-age.jpg' }
        ]
      },
      { 
        id: 'banaue-view', 
        name: 'Banaue Viewpoint', 
        cover: 'https://islandhoppinginthephilippines.com/luzon/wp-content/uploads/2023/10/Banaue-Rice-Terraces.webp',
        images: [
          { id: 'vp-img-1', title: 'Banaue Viewpoint - 1', url: 'https://islandhoppinginthephilippines.com/luzon/wp-content/uploads/2023/10/Banaue-Rice-Terraces.webp' },
          { id: 'vp-img-2', title: 'Banaue Viewpoint - 2', url: 'https://images.euronews.com/articles/stories/07/37/80/50/1536x864_cmsv2_8d5d3d96-cc69-508d-a6b3-2f78ed51eaf8-7378050.jpg' },
          { id: 'vp-img-3', title: 'Banaue Viewpoint - 3', url: 'https://img1.advisor.travel/1314x680px-Banaue_Rice_Terraces_8.jpg' },
          { id: 'vp-img-4', title: 'Banaue Viewpoint - 4', url: 'https://static.easyrock.com.ph/posts/2024/7/GxDq2Y8IoFaEoXnRavfmw.jpeg' },
          { id: 'vp-img-5', title: 'Banaue Viewpoint - 5', url: 'https://cdn.britannica.com/98/150498-050-C7E45C90/Banaue-rice-terraces-Luzon-Philippines.jpg' }
        ]
      },
      { 
        id: 'banaue-tappiya', 
        name: 'Tappiya Falls', 
        cover: 'https://nojuanisanisland.com/wp-content/uploads/2015/06/dsc_0879.jpg',
        images: [
          { id: 'tf-img-1', title: 'Tappiya Falls - 1', url: 'https://nojuanisanisland.com/wp-content/uploads/2015/06/dsc_0879.jpg' },
          { id: 'tf-img-2', title: 'Tappiya Falls - 2', url: 'https://mediaim.expedia.com/destination/2/6fdb280cc6400d6bb875b58c40003fe0.jpg' },
          { id: 'tf-img-3', title: 'Tappiya Falls - 3', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Tappiyah_Waterfalls.jpg' },
          { id: 'tf-img-4', title: 'Tappiya Falls - 4', url: 'https://jontotheworld.com/wp-content/uploads/2015/08/tappiya-tappiya-falls.jpg' },
          { id: 'tf-img-5', title: 'Tappiya Falls - 5', url: 'https://www.willflyforfood.net/uploads/food-travel3/batad-sagada/batad/tappiya/tappiya8.jpg' }
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