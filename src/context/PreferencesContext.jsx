import React, { createContext, useState, useContext, useEffect } from 'react';

const PreferencesContext = createContext();

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('PHP');
  
  // --- THEME STATE ---
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Automatically update the HTML body and save to local storage when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ==========================================
  // 1. CURRENCIES BY REGION
  // ==========================================
  const availableCurrencies = [
    // Base
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    
    // Southeast Asian
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },

    // East Asian
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    
    // Western
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },

    // Middle East
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal' },

    // South American
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
    { code: 'COP', symbol: '$', name: 'Colombian Peso' }
  ];

  // ==========================================
  // 2. LANGUAGES BY REGION
  // ==========================================
  const availableLanguages = [
    // Base & Local
    { code: 'en', name: 'English', native: 'English' },
    { code: 'tl', name: 'Tagalog', native: 'Tagalog' },
    
    // Southeast Asian
    { code: 'th', name: 'Thai', native: 'ไทย' },
    { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },

    // East Asian
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'zh', name: 'Chinese', native: '简体中文' },
    { code: 'ko', name: 'Korean', native: '한국어' },

    // Western
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    
    // South American
    { code: 'pt', name: 'Portuguese', native: 'Português' },

    // Middle East
    { code: 'ar', name: 'Arabic', native: 'العربية' }
  ];

  // ==========================================
  // 3. EXCHANGE RATES (Base: 1 PHP)
  // ==========================================
  const exchangeRates = { 
    PHP: 1, 
    THB: 0.60, MYR: 0.076, IDR: 275.0, SGD: 0.024,
    JPY: 2.65, CNY: 0.13, KRW: 23.5, 
    USD: 0.018, EUR: 0.016, GBP: 0.014, CAD: 0.024, AUD: 0.027, CHF: 0.016,
    AED: 0.065, SAR: 0.066, QAR: 0.064,
    BRL: 0.089, ARS: 15.0, COP: 70.0 
  };

  // ==========================================
  // 4. TRANSLATION DICTIONARY
  // ==========================================
  const translations = {
    en: {
      nav_home: "Home", nav_dest: "Destinations", nav_tours: "Featured Tours", nav_gallery: "Gallery", nav_connect: "Connect", nav_book: "BOOK NOW",
      book_now: "Book Now", view_details: "View Details", select: "Select", per_person: "per person", total: "Total", confirm: "Confirm Booking",
      pop_dest: "Most Popular Destinations", top_pkg: "Top Packages That Fit You", calc_price: "CALCULATE TOTAL PRICE", hero_island: "ISLAND PARADISE", 
      hero_adv: "ADVENTURE AWAITS", hero_trail: "FIND YOUR TRAIL", dest_title: "FIND YOUR PLACE", tours_title: "TOUR PACKAGES", gal_title: "VISUAL JOURNEY", conn_title: "GET IN TOUCH", price_summary: "Price Summary"
    },
    es: {
      nav_home: "Inicio", nav_dest: "Destinos", nav_tours: "Tours Destacados", nav_gallery: "Galería", nav_connect: "Conectar", nav_book: "RESERVAR",
      book_now: "Reservar Ahora", view_details: "Ver Detalles", select: "Seleccionar", per_person: "por persona", total: "Total", confirm: "Confirmar Reserva",
      pop_dest: "Destinos Más Populares", top_pkg: "Los Mejores Paquetes", calc_price: "CALCULAR PRECIO TOTAL", hero_island: "PARAÍSO ISLEÑO", 
      hero_adv: "LA AVENTURA ESPERA", hero_trail: "ENCUENTRA TU RUTA", dest_title: "ENCUENTRA TU LUGAR", tours_title: "PAQUETES TURÍSTICOS", gal_title: "VIAJE VISUAL", conn_title: "CONTÁCTANOS", price_summary: "Resumen de Precios"
    },
    tl: {
      nav_home: "Bahay", nav_dest: "Destinasyon", nav_tours: "Sikat na Tours", nav_gallery: "Gallerio", nav_connect: "Kumonekta", nav_book: "MAG-BOOK NA",
      book_now: "Mag-book Na", view_details: "Tingnan ang Detalye", select: "Piliin", per_person: "bawat tao", total: "Kabuuan", confirm: "Kumpirmahin",
      pop_dest: "Mga Sikat na Destinasyon", top_pkg: "Mga Nangungunang Packages", calc_price: "KALKULAHIN ANG KABUUAN", hero_island: "PARAISO NG ISLA", 
      hero_adv: "NAGHIHINTAY ANG ADVENTURE", hero_trail: "HANAPIN ANG IYONG LANDAS", dest_title: "HANAPIN ANG IYONG LUGAR", tours_title: "MGA TOUR PACKAGES", gal_title: "BISWAL NA PAGLALAKBAY", conn_title: "MAKIPAG-UGNAYAN", price_summary: "Buod ng Presyo"
    },
    fr: {
      nav_home: "Accueil", nav_dest: "Destinations", nav_tours: "Circuits", nav_gallery: "Galerie", nav_connect: "Contact", nav_book: "RÉSERVER",
      book_now: "Réserver", view_details: "Détails", select: "Sélectionner", per_person: "par personne", total: "Total", confirm: "Confirmer",
      pop_dest: "Destinations Populaires", top_pkg: "Meilleurs Forfaits", calc_price: "CALCULER LE PRIX", hero_island: "PARADIS INSULAIRE", 
      hero_adv: "L'AVENTURE ATTEND", hero_trail: "TROUVEZ VOTRE VOIE", dest_title: "VOTRE PLACE", tours_title: "FORFAITS", gal_title: "VOYAGE VISUEL", conn_title: "CONTACTEZ-NOUS", price_summary: "Résumé des prix"
    },
    pt: {
      nav_home: "Início", nav_dest: "Destinos", nav_tours: "Tours Populares", nav_gallery: "Galeria", nav_connect: "Conectar", nav_book: "RESERVAR",
      book_now: "Reservar Agora", view_details: "Ver Detalhes", select: "Selecionar", per_person: "por pessoa", total: "Total", confirm: "Confirmar",
      pop_dest: "Destinos Populares", top_pkg: "Melhores Pacotes", calc_price: "CALCULAR PREÇO", hero_island: "PARAÍSO ILHÉU", 
      hero_adv: "AVENTURA AGUARDA", hero_trail: "ENCONTRE SUA TRILHA", dest_title: "SEU LUGAR", tours_title: "PACOTES", gal_title: "JORNADA VISUAL", conn_title: "CONTATO", price_summary: "Resumo do Preço"
    },
    ja: {
      nav_home: "ホーム", nav_dest: "目的地", nav_tours: "ツアー", nav_gallery: "ギャラリー", nav_connect: "連絡先", nav_book: "予約する",
      book_now: "今すぐ予約", view_details: "詳細を見る", select: "選択", per_person: "1人あたり", total: "合計", confirm: "予約を確定する",
      pop_dest: "人気の目的地", top_pkg: "おすすめパッケージ", calc_price: "合計料金", hero_island: "島の楽園", 
      hero_adv: "冒険が待っている", hero_trail: "道を見つける", dest_title: "場所を見つける", tours_title: "パッケージ", gal_title: "ビジュアル", conn_title: "お問い合わせ", price_summary: "料金概要"
    },
    zh: {
      nav_home: "首页", nav_dest: "目的地", nav_tours: "特色行程", nav_gallery: "画廊", nav_connect: "联系我们", nav_book: "立即预订",
      book_now: "立即预订", view_details: "查看详情", select: "选择", per_person: "每人", total: "总计", confirm: "确认预订",
      pop_dest: "热门目的地", top_pkg: "热门套餐", calc_price: "计算总价", hero_island: "海岛天堂", 
      hero_adv: "冒险在召唤", hero_trail: "寻找路线", dest_title: "寻找地点", tours_title: "旅游套餐", gal_title: "视觉之旅", conn_title: "联系我们", price_summary: "价格汇总"
    },
    ar: {
      nav_home: "الرئيسية", nav_dest: "الوجهات", nav_tours: "جولات", nav_gallery: "المعرض", nav_connect: "تواصل", nav_book: "احجز الآن",
      book_now: "احجز الآن", view_details: "عرض التفاصيل", select: "اختر", per_person: "للشخص الواحد", total: "المجموع", confirm: "تأكيد الحجز",
      pop_dest: "الوجهات الشعبية", top_pkg: "أفضل الباقات", calc_price: "السعر الإجمالي", hero_island: "جنة الجزيرة", 
      hero_adv: "المغامرة تنتظر", hero_trail: "اكتشف مسارك", dest_title: "وجهتك", tours_title: "باقات الجولات", gal_title: "رحلة بصرية", conn_title: "تواصل معنا", price_summary: "ملخص السعر"
    },
    th: {
      nav_home: "หน้าแรก", nav_dest: "จุดหมายปลายทาง", nav_tours: "ทัวร์แนะนำ", nav_gallery: "แกลเลอรี", nav_connect: "ติดต่อเรา", nav_book: "จองเลย",
      book_now: "จองเลย", view_details: "ดูรายละเอียด", select: "เลือก", per_person: "ต่อท่าน", total: "รวม", confirm: "ยืนยันการจอง",
      pop_dest: "จุดหมายปลายทางยอดนิยม", top_pkg: "แพ็คเกจยอดนิยม", calc_price: "คำนวณราคารวม", hero_island: "เกาะสวรรค์", 
      hero_adv: "การผจญภัยรออยู่", hero_trail: "ค้นหาเส้นทางของคุณ", dest_title: "ค้นหาสถานที่ของคุณ", tours_title: "แพ็คเกจทัวร์", gal_title: "การเดินทางด้วยภาพ", conn_title: "ติดต่อเรา", price_summary: "สรุปราคา"
    },
    ms: {
      nav_home: "Utama", nav_dest: "Destinasi", nav_tours: "Lawatan Pilihan", nav_gallery: "Galeri", nav_connect: "Hubungi", nav_book: "TEMPAH SEKARANG",
      book_now: "Tempah Sekarang", view_details: "Lihat Butiran", select: "Pilih", per_person: "seorang", total: "Jumlah", confirm: "Sahkan Tempahan",
      pop_dest: "Destinasi Paling Popular", top_pkg: "Pakej Terbaik Untuk Anda", calc_price: "KIRA JUMLAH HARGA", hero_island: "PULAU PARADISE", 
      hero_adv: "PENGEMBARAAN MENANTI", hero_trail: "CARI LALUAN ANDA", dest_title: "CARI TEMPAT ANDA", tours_title: "PAKEJ LAWATAN", gal_title: "PERJALANAN VISUAL", conn_title: "HUBUNGI KAMI", price_summary: "Ringkasan Harga"
    },
    id: {
      nav_home: "Beranda", nav_dest: "Destinasi", nav_tours: "Tur Pilihan", nav_gallery: "Galeri", nav_connect: "Kontak", nav_book: "PESAN SEKARANG",
      book_now: "Pesan Sekarang", view_details: "Lihat Detail", select: "Pilih", per_person: "per orang", total: "Total", confirm: "Konfirmasi Pemesanan",
      pop_dest: "Destinasi Paling Populer", top_pkg: "Paket Terbaik Untuk Anda", calc_price: "HITUNG TOTAL HARGA", hero_island: "PULAU SURGA", 
      hero_adv: "PETUALANGAN MENANTI", hero_trail: "TEMUKAN JALUR ANDA", dest_title: "TEMUKAN TEMPAT ANDA", tours_title: "PAKET TUR", gal_title: "PERJALANAN VISUAL", conn_title: "HUBUNGI KAMI", price_summary: "Ringkasan Harga"
    }
  };

  const t = (key, defaultText) => translations[language]?.[key] || translations['en'][key] || defaultText;

  const formatPrice = (phpAmount) => {
    const converted = phpAmount * exchangeRates[currency];
    const currData = availableCurrencies.find(c => c.code === currency);
    return `${currData ? currData.symbol : ''}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <PreferencesContext.Provider value={{ 
        language, setLanguage, currency, setCurrency, 
        theme, setTheme, // Exposed Theme API
        t, formatPrice, availableCurrencies, availableLanguages 
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};
