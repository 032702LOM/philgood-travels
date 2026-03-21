import React, { createContext, useState, useContext, useEffect } from 'react';

const PreferencesContext = createContext();

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('PHP');
  
  // --- THEME STATE ---
  // ⚡ UPDATED: Changed the default fallback from 'dark' to 'light' to match the new Tropical Archipelago theme
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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
      pop_dest: "Most Popular Destinations", top_pkg: "Top Packages That Fit You", calc_price: "CALCULATE TOTAL PRICE", hero_island: "Island Paradise", 
      hero_adv: "Adventure Awaits", hero_trail: "Find Your Trail", dest_title: "Find Your Place", tours_title: "Tour Packages", gal_title: "Visual Journey", conn_title: "Let us Connect", price_summary: "Price Summary",
      // --- CONTACT PAGE ---
      contact_info: "Contact Information", contact_desc: "Our travel experts are ready to assist you. Reach out to us via email, phone, or visit our office.", head_office: "Head Office", phone: "Phone Number", email_addr: "Email Address", send_msg: "Send Us a Message", your_name: "Your Name", your_email: "Your Email", subject: "Subject", message: "Message", placeholder_help: "How can we help?", placeholder_msg: "Write your message here...", btn_send: "SEND MESSAGE",
      // --- BOOKING PAGE ---
      booking_title: "Secure Your Spot", booking_desc: "Complete your booking and pack your bags", trip_details: "Trip Details", dest_pkg: "Destination / Package", select_pkg: "-- Select a Package --", travel_date: "Travel Date", num_guests: "Number of Guests",
      adults: "Adults", adults_desc: "12+ years", children: "Children", children_desc: "50% Off (2-11 yrs)", infants: "Infants", infants_desc: "Free (Under 2)",
      acc_class: "Accommodation Class", std_class: "Standard", std_desc: "Included", deluxe_class: "Deluxe", lux_class: "Luxury", pax: "/pax",
      lead_guest: "Lead Guest Details", full_name: "Full Name",
      carbon_footprint: "Carbon Footprint", carbon_desc: "Air travel and ground transport generate emissions. The estimated footprint for", carbon_desc2: "traveler(s) is", carbon_desc3: "Help us offset this by contributing to local Philippine reforestation projects.", offset_carbon: "Offset My Carbon Footprint",
      optional_addons: "Optional Add-ons", transfer: "Roundtrip Airport Transfer", transfer_desc: "Hassle-free pick up and drop off.", insurance: "Travel Insurance", insurance_desc: "Full coverage per guest.", dinner: "Romantic Dinner Setup", dinner_desc: "Candlelit dinner by the beach.",
      payment_details: "Payment Details", how_paying: "How are we paying?", split_1: "Just me (Pay in full)", split_ways: "Split", split_ways2: "ways", invoice_emails: "Email Addresses for Invoices:", lead_email: "Lead Booker's Email", friend_email: "Friend", friend_email2: "'s Email",
      each_pays: "Each person will pay", invoices_tied: "Invoices will be tied to the emails above.", payment_method: "Payment Method",
      select_summary: "Select a package to see summary", split: "Split", ways: "ways", per_person2: "/person", secure_payment: "Secure Encrypted Payment", processing: "Processing..."
    },
    es: {
      nav_home: "Inicio", nav_dest: "Destinos", nav_tours: "Tours Destacados", nav_gallery: "Galería", nav_connect: "Conectar", nav_book: "RESERVAR",
      book_now: "Reservar Ahora", view_details: "Ver Detalles", select: "Seleccionar", per_person: "por persona", total: "Total", confirm: "Confirmar Reserva",
      pop_dest: "Destinos Más Populares", top_pkg: "Los Mejores Paquetes", calc_price: "CALCULAR PRECIO TOTAL", hero_island: "PARAÍSO ISLEÑO", 
      hero_adv: "LA AVENTURA ESPERA", hero_trail: "ENCUENTRA TU RUTA", dest_title: "ENCUENTRA TU LUGAR", tours_title: "PAQUETES TURÍSTICOS", gal_title: "VIAJE VISUAL", conn_title: "CONTÁCTANOS", price_summary: "Resumen de Precios",
      // --- CONTACT PAGE ---
      contact_info: "Información de Contacto", contact_desc: "Nuestros expertos en viajes están listos para ayudarle. Contáctenos por correo, teléfono o visite nuestra oficina.", head_office: "Sede Principal", phone: "Número de Teléfono", email_addr: "Correo Electrónico", send_msg: "Envíenos un Mensaje", your_name: "Su Nombre", your_email: "Su Correo", subject: "Asunto", message: "Mensaje", placeholder_help: "¿Cómo podemos ayudar?", placeholder_msg: "Escriba su mensaje aquí...", btn_send: "ENVIAR MENSAJE",
      // --- BOOKING PAGE ---
      booking_title: "Asegura tu lugar", booking_desc: "Completa tu reserva y haz las maletas", trip_details: "Detalles del viaje", dest_pkg: "Destino / Paquete", select_pkg: "-- Selecciona un paquete --", travel_date: "Fecha de viaje", num_guests: "Número de huéspedes",
      adults: "Adultos", adults_desc: "12+ años", children: "Niños", children_desc: "50% Dto (2-11 años)", infants: "Bebés", infants_desc: "Gratis (Menos de 2)",
      acc_class: "Clase de Alojamiento", std_class: "Estándar", std_desc: "Incluido", deluxe_class: "Deluxe", lux_class: "Lujo", pax: "/pax",
      lead_guest: "Detalles del huésped principal", full_name: "Nombre completo",
      carbon_footprint: "Huella de Carbono", carbon_desc: "Los viajes generan emisiones. La huella estimada para", carbon_desc2: "viajero(s) es", carbon_desc3: "Ayúdanos a compensar esto contribuyendo a proyectos locales de reforestación.", offset_carbon: "Compensar mi huella",
      optional_addons: "Complementos Opcionales", transfer: "Traslado al aeropuerto", transfer_desc: "Recogida sin complicaciones.", insurance: "Seguro de viaje", insurance_desc: "Cobertura total.", dinner: "Cena Romántica", dinner_desc: "Cena a la luz de las velas.",
      payment_details: "Detalles de pago", how_paying: "¿Cómo pagaremos?", split_1: "Solo yo (Pago total)", split_ways: "Dividir en", split_ways2: "partes", invoice_emails: "Correos para facturas:", lead_email: "Correo del titular", friend_email: "Correo del amigo", friend_email2: "",
      each_pays: "Cada persona pagará", invoices_tied: "Las facturas se vincularán a estos correos.", payment_method: "Método de pago",
      select_summary: "Selecciona un paquete para ver el resumen", split: "Dividido en", ways: "partes", per_person2: "/persona", secure_payment: "Pago Seguro Encriptado", processing: "Procesando..."
    },
    tl: {
      nav_home: "Bahay", nav_dest: "Destinasyon", nav_tours: "Sikat na Tours", nav_gallery: "Gallerio", nav_connect: "Kumonekta", nav_book: "MAG-BOOK NA",
      book_now: "Mag-book Na", view_details: "Tingnan ang Detalye", select: "Piliin", per_person: "bawat tao", total: "Kabuuan", confirm: "Kumpirmahin",
      pop_dest: "Mga Sikat na Destinasyon", top_pkg: "Mga Nangungunang Packages", calc_price: "KALKULAHIN ANG KABUUAN", hero_island: "PARAISO NG ISLA", 
      hero_adv: "NAGHIHINTAY ANG ADVENTURE", hero_trail: "HANAPIN ANG IYONG LANDAS", dest_title: "HANAPIN ANG IYONG LUGAR", tours_title: "MGA TOUR PACKAGES", gal_title: "BISWAL NA PAGLALAKBAY", conn_title: "MAKIPAG-UGNAYAN", price_summary: "Buod ng Presyo",
      // --- CONTACT PAGE ---
      contact_info: "Impormasyon sa Pakikipag-ugnayan", contact_desc: "Handang tumulong ang aming mga eksperto sa paglalakbay. Makipag-ugnayan sa amin via email, telepono, o bisitahin ang aming opisina.", head_office: "Pangunahing Tanggapan", phone: "Numero ng Telepono", email_addr: "Email Address", send_msg: "Magpadala ng Mensahe", your_name: "Iyong Pangalan", your_email: "Iyong Email", subject: "Paksa", message: "Mensahe", placeholder_help: "Paano kami makakatulong?", placeholder_msg: "Isulat ang iyong mensahe rito...", btn_send: "IPADALA ANG MENSAHE",
      // --- BOOKING PAGE ---
      booking_title: "I-secure ang Iyong Pwesto", booking_desc: "Kumpletuhin ang iyong booking at mag-impake na", trip_details: "Detalye ng Biyahe", dest_pkg: "Destinasyon / Package", select_pkg: "-- Pumili ng Package --", travel_date: "Petsa ng Biyahe", num_guests: "Bilang ng Bisita",
      adults: "Matatanda", adults_desc: "12+ taon", children: "Bata", children_desc: "50% Off (2-11 taon)", infants: "Sanggol", infants_desc: "Libre (Pababa ng 2)",
      acc_class: "Uri ng Akomodasyon", std_class: "Standard", std_desc: "Kasama na", deluxe_class: "Deluxe", lux_class: "Luxury", pax: "/tao",
      lead_guest: "Detalye ng Pangunahing Bisita", full_name: "Buong Pangalan",
      carbon_footprint: "Carbon Footprint", carbon_desc: "Ang paglalakbay ay lumilikha ng emissions. Ang tinatayang footprint para sa", carbon_desc2: "na manlalakbay ay", carbon_desc3: "Tulungan kaming bawiin ito sa pamamagitan ng pagsuporta sa mga lokal na proyekto.", offset_carbon: "Bawiin ang Aking Carbon Footprint",
      optional_addons: "Mga Opsyonal na Add-on", transfer: "Hatid-Sundo sa Airport", transfer_desc: "Walang hassle na byahe.", insurance: "Travel Insurance", insurance_desc: "Buong saklaw bawat bisita.", dinner: "Romantic na Hapunan", dinner_desc: "Hapunan sa tabing-dagat.",
      payment_details: "Detalye ng Pagbabayad", how_paying: "Paano tayo magbabayad?", split_1: "Ako lang (Buong bayad)", split_ways: "Hatiin sa", split_ways2: "tao", invoice_emails: "Mga Email para sa Invoice:", lead_email: "Email ng Pangunahing Booker", friend_email: "Email ng Kaibigan", friend_email2: "",
      each_pays: "Ang bawat isa ay magbabayad ng", invoices_tied: "Ang mga invoice ay ipadadala sa mga email sa itaas.", payment_method: "Paraan ng Pagbabayad",
      select_summary: "Pumili ng package para makita ang buod", split: "Hati sa", ways: "tao", per_person2: "/tao", secure_payment: "Ligtas na Pagbabayad", processing: "Pinoproseso..."
    },
    fr: {
      nav_home: "Accueil", nav_dest: "Destinations", nav_tours: "Circuits", nav_gallery: "Galerie", nav_connect: "Contact", nav_book: "RÉSERVER",
      book_now: "Réserver", view_details: "Détails", select: "Sélectionner", per_person: "par personne", total: "Total", confirm: "Confirmer",
      pop_dest: "Destinations Populaires", top_pkg: "Meilleurs Forfaits", calc_price: "CALCULER LE PRIX", hero_island: "PARADIS INSULAIRE", 
      hero_adv: "L'AVENTURE ATTEND", hero_trail: "TROUVEZ VOTRE VOIE", dest_title: "VOTRE PLACE", tours_title: "FORFAITS", gal_title: "VOYAGE VISUEL", conn_title: "CONTACTEZ-NOUS", price_summary: "Résumé des prix",
      // --- CONTACT PAGE ---
      contact_info: "Coordonnées", contact_desc: "Nos experts en voyages sont prêts à vous aider. Contactez-nous par e-mail, téléphone ou visitez notre bureau.", head_office: "Siège Social", phone: "Numéro de Téléphone", email_addr: "Adresse E-mail", send_msg: "Envoyez-nous un message", your_name: "Votre Nom", your_email: "Votre E-mail", subject: "Sujet", message: "Message", placeholder_help: "Comment pouvons-nous vous aider?", placeholder_msg: "Écrivez votre message ici...", btn_send: "ENVOYER LE MESSAGE",
      // --- BOOKING PAGE ---
      booking_title: "Sécurisez votre place", booking_desc: "Complétez votre réservation", trip_details: "Détails du voyage", dest_pkg: "Destination / Forfait", select_pkg: "-- Sélectionnez un forfait --", travel_date: "Date de voyage", num_guests: "Nombre d'invités",
      adults: "Adultes", adults_desc: "12+ ans", children: "Enfants", children_desc: "50% de réduc. (2-11 ans)", infants: "Bébés", infants_desc: "Gratuit (-2 ans)",
      acc_class: "Classe d'Hébergement", std_class: "Standard", std_desc: "Inclus", deluxe_class: "Deluxe", lux_class: "Luxe", pax: "/pers",
      lead_guest: "Détails de l'invité principal", full_name: "Nom complet",
      carbon_footprint: "Empreinte Carbone", carbon_desc: "Les voyages génèrent des émissions. L'empreinte estimée pour", carbon_desc2: "voyageur(s) est de", carbon_desc3: "Aidez-nous à compenser cela.", offset_carbon: "Compenser mon empreinte",
      optional_addons: "Options supplémentaires", transfer: "Transfert aéroport", transfer_desc: "Prise en charge sans tracas.", insurance: "Assurance voyage", insurance_desc: "Couverture totale.", dinner: "Dîner Romantique", dinner_desc: "Dîner aux chandelles.",
      payment_details: "Détails de paiement", how_paying: "Comment payons-nous?", split_1: "Seulement moi (Paiement total)", split_ways: "Diviser en", split_ways2: "", invoice_emails: "E-mails pour les factures:", lead_email: "E-mail principal", friend_email: "E-mail de l'ami", friend_email2: "",
      each_pays: "Chaque personne paiera", invoices_tied: "Les factures seront liées à ces e-mails.", payment_method: "Mode de paiement",
      select_summary: "Sélectionnez un forfait pour voir le résumé", split: "Divisé par", ways: "", per_person2: "/pers", secure_payment: "Paiement Sécurisé", processing: "Traitement en cours..."
    },
    pt: {
      nav_home: "Início", nav_dest: "Destinos", nav_tours: "Tours Populares", nav_gallery: "Galeria", nav_connect: "Conectar", nav_book: "RESERVAR",
      book_now: "Reservar Agora", view_details: "Ver Detalhes", select: "Selecionar", per_person: "por pessoa", total: "Total", confirm: "Confirmar",
      pop_dest: "Destinos Populares", top_pkg: "Melhores Pacotes", calc_price: "CALCULAR PREÇO", hero_island: "PARAÍSO ILHÉU", 
      hero_adv: "AVENTURA AGUARDA", hero_trail: "ENCONTRE SUA TRILHA", dest_title: "SEU LUGAR", tours_title: "PACOTES", gal_title: "JORNADA VISUAL", conn_title: "CONTATO", price_summary: "Resumo do Preço",
      // --- CONTACT PAGE ---
      contact_info: "Informações de Contato", contact_desc: "Nossos especialistas em viagens estão prontos para ajudar. Entre em contato por e-mail, telefone ou visite nosso escritório.", head_office: "Sede", phone: "Número de Telefone", email_addr: "Endereço de E-mail", send_msg: "Envie-nos uma Mensagem", your_name: "Seu Nome", your_email: "Seu E-mail", subject: "Assunto", message: "Mensagem", placeholder_help: "Como podemos ajudar?", placeholder_msg: "Escreva sua mensagem aqui...", btn_send: "ENVIAR MENSAGEM",
      // --- BOOKING PAGE ---
      booking_title: "Garanta seu lugar", booking_desc: "Conclua sua reserva", trip_details: "Detalhes da viagem", dest_pkg: "Destino / Pacote", select_pkg: "-- Selecione um pacote --", travel_date: "Data da viagem", num_guests: "Número de hóspedes",
      adults: "Adultos", adults_desc: "12+ anos", children: "Crianças", children_desc: "50% de desc. (2-11 anos)", infants: "Bebês", infants_desc: "Grátis (-2 anos)",
      acc_class: "Classe de Acomodação", std_class: "Padrão", std_desc: "Incluído", deluxe_class: "Deluxe", lux_class: "Luxo", pax: "/pax",
      lead_guest: "Detalhes do hóspede principal", full_name: "Nome completo",
      carbon_footprint: "Pegada de Carbono", carbon_desc: "As viagens geram emissões. A pegada estimada para", carbon_desc2: "viajante(s) é de", carbon_desc3: "Ajude-nos a compensar isso.", offset_carbon: "Compensar minha pegada",
      optional_addons: "Complementos Opcionais", transfer: "Traslado ao aeroporto", transfer_desc: "Recolha sem problemas.", insurance: "Seguro de viagem", insurance_desc: "Cobertura total.", dinner: "Jantar Romântico", dinner_desc: "Jantar à luz de velas.",
      payment_details: "Detalhes de pagamento", how_paying: "Como vamos pagar?", split_1: "Só eu (Pagamento total)", split_ways: "Dividir em", split_ways2: "partes", invoice_emails: "E-mails para faturas:", lead_email: "E-mail principal", friend_email: "E-mail do amigo", friend_email2: "",
      each_pays: "Cada pessoa pagará", invoices_tied: "As faturas serão vinculadas a estes e-mails.", payment_method: "Método de pagamento",
      select_summary: "Selecione um pacote para ver o resumo", split: "Dividido por", ways: "", per_person2: "/pessoa", secure_payment: "Pagamento Seguro", processing: "Processando..."
    },
    ja: {
      nav_home: "ホーム", nav_dest: "目的地", nav_tours: "ツアー", nav_gallery: "ギャラリー", nav_connect: "連絡先", nav_book: "予約する",
      book_now: "今すぐ予約", view_details: "詳細を見る", select: "選択", per_person: "1人あたり", total: "合計", confirm: "予約を確定する",
      pop_dest: "人気の目的地", top_pkg: "おすすめパッケージ", calc_price: "合計料金", hero_island: "島の楽園", 
      hero_adv: "冒険が待っている", hero_trail: "道を見つける", dest_title: "場所を見つける", tours_title: "パッケージ", gal_title: "ビジュアル", conn_title: "お問い合わせ", price_summary: "料金概要",
      // --- CONTACT PAGE ---
      contact_info: "連絡先情報", contact_desc: "旅行の専門家がお手伝いします。メール、電話、またはオフィスまでご連絡ください。", head_office: "本社", phone: "電話番号", email_addr: "メールアドレス", send_msg: "メッセージを送る", your_name: "お名前", your_email: "メール", subject: "件名", message: "メッセージ", placeholder_help: "どのようにお手伝いできますか？", placeholder_msg: "ここにメッセージを書いてください...", btn_send: "送信する",
      // --- BOOKING PAGE ---
      booking_title: "スポットを確保", booking_desc: "予約を完了してください", trip_details: "旅行の詳細", dest_pkg: "目的地/パッケージ", select_pkg: "-- パッケージを選択 --", travel_date: "旅行日", num_guests: "ゲスト数",
      adults: "大人", adults_desc: "12歳以上", children: "子供", children_desc: "50%オフ (2-11歳)", infants: "幼児", infants_desc: "無料 (2歳未満)",
      acc_class: "宿泊クラス", std_class: "標準", std_desc: "含まれています", deluxe_class: "デラックス", lux_class: "ラグジュアリー", pax: "/人",
      lead_guest: "代表者の詳細", full_name: "フルネーム",
      carbon_footprint: "カーボンフットプリント", carbon_desc: "旅行は排出量を生み出します。推定フットプリント:", carbon_desc2: "旅行者あたり", carbon_desc3: "これを相殺するのに協力してください。", offset_carbon: "相殺する",
      optional_addons: "オプション", transfer: "空港送迎", transfer_desc: "手間のかからない送迎。", insurance: "旅行保険", insurance_desc: "完全な補償。", dinner: "ロマンチックなディナー", dinner_desc: "キャンドルライトディナー。",
      payment_details: "支払い詳細", how_paying: "支払い方法は？", split_1: "全額支払い", split_ways: "分割:", split_ways2: "人", invoice_emails: "請求書用メール:", lead_email: "代表者のメール", friend_email: "友人のメール", friend_email2: "",
      each_pays: "各人の支払い:", invoices_tied: "請求書はこれらのメールにリンクされます。", payment_method: "支払い方法",
      select_summary: "パッケージを選択して概要を表示", split: "分割", ways: "人", per_person2: "/人", secure_payment: "安全な支払い", processing: "処理中..."
    },
    zh: {
      nav_home: "首页", nav_dest: "目的地", nav_tours: "特色行程", nav_gallery: "画廊", nav_connect: "联系我们", nav_book: "立即预订",
      book_now: "立即预订", view_details: "查看详情", select: "选择", per_person: "每人", total: "总计", confirm: "确认预订",
      pop_dest: "热门目的地", top_pkg: "热门套餐", calc_price: "计算总价", hero_island: "海岛天堂", 
      hero_adv: "冒险在召唤", hero_trail: "寻找路线", dest_title: "寻找地点", tours_title: "旅游套餐", gal_title: "视觉之旅", conn_title: "联系我们", price_summary: "价格汇总",
      // --- CONTACT PAGE ---
      contact_info: "联系信息", contact_desc: "我们的旅行专家随时准备为您提供帮助。请通过电子邮件、电话或访问我们的办公室与我们联系。", head_office: "总部", phone: "电话号码", email_addr: "电子邮件地址", send_msg: "给我们发信息", your_name: "您的姓名", your_email: "您的邮箱", subject: "主题", message: "留言", placeholder_help: "我们能帮您什么？", placeholder_msg: "在此写下您的留言...", btn_send: "发送信息",
      // --- BOOKING PAGE ---
      booking_title: "确保您的位置", booking_desc: "完成您的预订", trip_details: "旅行详情", dest_pkg: "目的地/套餐", select_pkg: "-- 选择一个套餐 --", travel_date: "旅行日期", num_guests: "客人数",
      adults: "成人", adults_desc: "12岁+", children: "儿童", children_desc: "50%优惠 (2-11岁)", infants: "婴儿", infants_desc: "免费 (2岁以下)",
      acc_class: "住宿等级", std_class: "标准", std_desc: "包含", deluxe_class: "豪华", lux_class: "奢华", pax: "/人",
      lead_guest: "主要联系人详情", full_name: "全名",
      carbon_footprint: "碳足迹", carbon_desc: "旅行会产生排放。预计碳足迹:", carbon_desc2: "旅客是", carbon_desc3: "请帮助我们抵消它。", offset_carbon: "抵消我的碳足迹",
      optional_addons: "可选附加项", transfer: "机场接送", transfer_desc: "无忧接送。", insurance: "旅行保险", insurance_desc: "全面保障。", dinner: "浪漫晚餐", dinner_desc: "海滩烛光晚餐。",
      payment_details: "付款详情", how_paying: "我们如何付款？", split_1: "只有我（全额付款）", split_ways: "平分给", split_ways2: "人", invoice_emails: "发票邮箱：", lead_email: "主要预订人邮箱", friend_email: "朋友的邮箱", friend_email2: "",
      each_pays: "每人将支付", invoices_tied: "发票将与上述邮箱绑定。", payment_method: "付款方式",
      select_summary: "选择套餐以查看摘要", split: "平分给", ways: "人", per_person2: "/人", secure_payment: "安全加密付款", processing: "处理中..."
    },
    ar: {
      nav_home: "الرئيسية", nav_dest: "الوجهات", nav_tours: "جولات", nav_gallery: "المعرض", nav_connect: "تواصل", nav_book: "احجز الآن",
      book_now: "احجز الآن", view_details: "عرض التفاصيل", select: "اختر", per_person: "للشخص الواحد", total: "المجموع", confirm: "تأكيد الحجز",
      pop_dest: "الوجهات الشعبية", top_pkg: "أفضل الباقات", calc_price: "السعر الإجمالي", hero_island: "جنة الجزيرة", 
      hero_adv: "المغامرة تنتظر", hero_trail: "اكتشف مسارك", dest_title: "وجهتك", tours_title: "باقات الجولات", gal_title: "رحلة بصرية", conn_title: "تواصل معنا", price_summary: "ملخص السعر",
      // --- CONTACT PAGE ---
      contact_info: "معلومات الاتصال", contact_desc: "خبراء السفر لدينا مستعدون لمساعدتك. تواصل معنا عبر البريد الإلكتروني أو الهاتف أو قم بزيارة مكتبنا.", head_office: "المكتب الرئيسي", phone: "رقم الهاتف", email_addr: "البريد الإلكتروني", send_msg: "أرسل لنا رسالة", your_name: "اسمك", your_email: "بريدك الإلكتروني", subject: "الموضوع", message: "الرسالة", placeholder_help: "كيف يمكننا المساعدة؟", placeholder_msg: "اكتب رسالتك هنا...", btn_send: "إرسال الرسالة",
      // --- BOOKING PAGE ---
      booking_title: "احجز مكانك", booking_desc: "أكمل حجزك", trip_details: "تفاصيل الرحلة", dest_pkg: "الوجهة / الباقة", select_pkg: "-- اختر باقة --", travel_date: "تاريخ السفر", num_guests: "عدد الضيوف",
      adults: "بالغين", adults_desc: "12+ سنة", children: "أطفال", children_desc: "خصم 50% (2-11 سنة)", infants: "رُضّع", infants_desc: "مجاناً (أقل من 2)",
      acc_class: "فئة الإقامة", std_class: "قياسي", std_desc: "مشمول", deluxe_class: "ديلوكس", lux_class: "فاخر", pax: "/شخص",
      lead_guest: "تفاصيل الضيف الرئيسي", full_name: "الاسم الكامل",
      carbon_footprint: "البصمة الكربونية", carbon_desc: "السفر يولد انبعاثات. البصمة المقدرة هي:", carbon_desc2: "مسافر", carbon_desc3: "ساعدنا في تعويض ذلك.", offset_carbon: "تعويض بصمتي الكربونية",
      optional_addons: "إضافات اختيارية", transfer: "نقل المطار", transfer_desc: "استقبال وتوديع مريح.", insurance: "تأمين السفر", insurance_desc: "تغطية كاملة.", dinner: "عشاء رومانسي", dinner_desc: "عشاء على ضوء الشموع.",
      payment_details: "تفاصيل الدفع", how_paying: "كيف سندفع؟", split_1: "أنا فقط (دفع كامل)", split_ways: "تقسيم على", split_ways2: "أشخاص", invoice_emails: "رسائل البريد للفواتير:", lead_email: "البريد الرئيسي", friend_email: "بريد الصديق", friend_email2: "",
      each_pays: "سيدفع كل شخص", invoices_tied: "سيتم ربط الفواتير بهذه العناوين.", payment_method: "طريقة الدفع",
      select_summary: "اختر باقة لرؤية الملخص", split: "تقسيم", ways: "أشخاص", per_person2: "/شخص", secure_payment: "دفع آمن", processing: "جاري المعالجة..."
    },
    th: {
      nav_home: "หน้าแรก", nav_dest: "จุดหมายปลายทาง", nav_tours: "ทัวร์แนะนำ", nav_gallery: "แกลเลอรี", nav_connect: "ติดต่อเรา", nav_book: "จองเลย",
      book_now: "จองเลย", view_details: "ดูรายละเอียด", select: "เลือก", per_person: "ต่อท่าน", total: "รวม", confirm: "ยืนยันการจอง",
      pop_dest: "จุดหมายปลายทางยอดนิยม", top_pkg: "แพ็คเกจยอดนิยม", calc_price: "คำนวณราคารวม", hero_island: "เกาะสวรรค์", 
      hero_adv: "การผจญภัยรออยู่", hero_trail: "ค้นหาเส้นทางของคุณ", dest_title: "ค้นหาสถานที่ของคุณ", tours_title: "แพ็คเกจทัวร์", gal_title: "การเดินทางด้วยภาพ", conn_title: "ติดต่อเรา", price_summary: "สรุปราคา",
      // --- CONTACT PAGE ---
      contact_info: "ข้อมูลการติดต่อ", contact_desc: "ผู้เชี่ยวชาญด้านการเดินทางของเราพร้อมที่จะช่วยเหลือคุณ ติดต่อเราผ่านทางอีเมล โทรศัพท์ หรือเยี่ยมชมสำนักงานของเรา", head_office: "สำนักงานใหญ่", phone: "หมายเลขโทรศัพท์", email_addr: "ที่อยู่อีเมล", send_msg: "ส่งข้อความถึงเรา", your_name: "ชื่อของคุณ", your_email: "อีเมลของคุณ", subject: "หัวข้อ", message: "ข้อความ", placeholder_help: "เราจะช่วยคุณได้อย่างไร?", placeholder_msg: "เขียนข้อความของคุณที่นี่...", btn_send: "ส่งข้อความ",
      // --- BOOKING PAGE ---
      booking_title: "ยืนยันสถานที่ของคุณ", booking_desc: "ดำเนินการจองให้เสร็จสิ้น", trip_details: "รายละเอียดการเดินทาง", dest_pkg: "จุดหมายปลายทาง / แพ็คเกจ", select_pkg: "-- เลือกแพ็คเกจ --", travel_date: "วันที่เดินทาง", num_guests: "จำนวนผู้เข้าพัก",
      adults: "ผู้ใหญ่", adults_desc: "อายุ 12+ ปี", children: "เด็ก", children_desc: "ลด 50% (2-11 ปี)", infants: "ทารก", infants_desc: "ฟรี (อายุต่ำกว่า 2 ปี)",
      acc_class: "ระดับที่พัก", std_class: "มาตรฐาน", std_desc: "รวมอยู่ด้วย", deluxe_class: "ดีลักซ์", lux_class: "หรูหรา", pax: "/ท่าน",
      lead_guest: "รายละเอียดผู้เข้าพักหลัก", full_name: "ชื่อเต็ม",
      carbon_footprint: "คาร์บอนฟุตพริ้นท์", carbon_desc: "การเดินทางทำให้เกิดการปล่อยก๊าซ ปริมาณที่คาดว่าจะเกิดขึ้นสำหรับ", carbon_desc2: "นักเดินทางคือ", carbon_desc3: "ช่วยเราชดเชยสิ่งนี้", offset_carbon: "ชดเชยคาร์บอนฟุตพริ้นท์ของฉัน",
      optional_addons: "ส่วนเสริมทางเลือก", transfer: "รถรับส่งสนามบิน", transfer_desc: "รับส่งสะดวกสบาย", insurance: "ประกันการเดินทาง", insurance_desc: "คุ้มครองเต็มรูปแบบ", dinner: "ดินเนอร์สุดโรแมนติก", dinner_desc: "ดินเนอร์ใต้แสงเทียน",
      payment_details: "รายละเอียดการชำระเงิน", how_paying: "เราจะจ่ายเงินอย่างไร?", split_1: "ฉันเท่านั้น (จ่ายเต็มจำนวน)", split_ways: "แบ่งปันให้", split_ways2: "คน", invoice_emails: "อีเมลสำหรับใบแจ้งหนี้:", lead_email: "อีเมลผู้จองหลัก", friend_email: "อีเมลของเพื่อน", friend_email2: "",
      each_pays: "แต่ละคนจะจ่าย", invoices_tied: "ใบแจ้งหนี้จะเชื่อมโยงกับอีเมลเหล่านี้", payment_method: "วิธีการชำระเงิน",
      select_summary: "เลือกแพ็คเกจเพื่อดูสรุป", split: "แบ่ง", ways: "คน", per_person2: "/คน", secure_payment: "การชำระเงินที่ปลอดภัย", processing: "กำลังประมวลผล..."
    },
    ms: {
      nav_home: "Utama", nav_dest: "Destinasi", nav_tours: "Lawatan Pilihan", nav_gallery: "Galeri", nav_connect: "Hubungi", nav_book: "TEMPAH SEKARANG",
      book_now: "Tempah Sekarang", view_details: "Lihat Butiran", select: "Pilih", per_person: "seorang", total: "Jumlah", confirm: "Sahkan Tempahan",
      pop_dest: "Destinasi Paling Popular", top_pkg: "Pakej Terbaik Untuk Anda", calc_price: "KIRA JUMLAH HARGA", hero_island: "PULAU PARADISE", 
      hero_adv: "PENGEMBARAAN MENANTI", hero_trail: "CARI LALUAN ANDA", dest_title: "CARI TEMPAT ANDA", tours_title: "PAKEJ LAWATAN", gal_title: "PERJALANAN VISUAL", conn_title: "HUBUNGI KAMI", price_summary: "Ringkasan Harga",
      // --- CONTACT PAGE ---
      contact_info: "Maklumat Hubungan", contact_desc: "Pakar pelancongan kami sedia membantu anda. Hubungi kami melalui e-mel, telefon, atau lawati pejabat kami.", head_office: "Ibu Pejabat", phone: "Nombor Telefon", email_addr: "Alamat E-mel", send_msg: "Hantar Mesej", your_name: "Nama Anda", your_email: "E-mel Anda", subject: "Subjek", message: "Mesej", placeholder_help: "Bagaimana kami boleh membantu?", placeholder_msg: "Tulis mesej anda di sini...", btn_send: "HANTAR MESEJ",
      // --- BOOKING PAGE ---
      booking_title: "Sahkan Tempat Anda", booking_desc: "Lengkapkan tempahan anda", trip_details: "Butiran Perjalanan", dest_pkg: "Destinasi / Pakej", select_pkg: "-- Pilih Pakej --", travel_date: "Tarikh Perjalanan", num_guests: "Bilangan Tetamu",
      adults: "Dewasa", adults_desc: "12+ tahun", children: "Kanak-kanak", children_desc: "Diskaun 50% (2-11 thn)", infants: "Bayi", infants_desc: "Percuma (Bawah 2)",
      acc_class: "Kelas Penginapan", std_class: "Standard", std_desc: "Termasuk", deluxe_class: "Deluxe", lux_class: "Mewah", pax: "/pax",
      lead_guest: "Butiran Tetamu Utama", full_name: "Nama Penuh",
      carbon_footprint: "Jejak Karbon", carbon_desc: "Perjalanan menghasilkan pelepasan. Anggaran jejak untuk", carbon_desc2: "pengembara ialah", carbon_desc3: "Bantu kami mengimbangi ini.", offset_carbon: "Imbangi Jejak Karbon Saya",
      optional_addons: "Tambahan Pilihan", transfer: "Pemindahan Lapangan Terbang", transfer_desc: "Pengambilan tanpa masalah.", insurance: "Insurans Perjalanan", insurance_desc: "Perlindungan penuh.", dinner: "Makan Malam Romantik", dinner_desc: "Makan malam cahaya lilin.",
      payment_details: "Butiran Pembayaran", how_paying: "Bagaimana kita membayar?", split_1: "Hanya saya (Bayar penuh)", split_ways: "Bahagikan kepada", split_ways2: "orang", invoice_emails: "E-mel untuk Invois:", lead_email: "E-mel Pengepah Utama", friend_email: "E-mel Rakan", friend_email2: "",
      each_pays: "Setiap orang akan membayar", invoices_tied: "Invois akan diikat pada e-mel ini.", payment_method: "Kaedah Pembayaran",
      select_summary: "Pilih pakej untuk melihat ringkasan", split: "Bahagi", ways: "orang", per_person2: "/orang", secure_payment: "Pembayaran Selamat", processing: "Memproses..."
    },
    id: {
      nav_home: "Beranda", nav_dest: "Destinasi", nav_tours: "Tur Pilihan", nav_gallery: "Galeri", nav_connect: "Kontak", nav_book: "PESAN SEKARANG",
      book_now: "Pesan Sekarang", view_details: "Lihat Detail", select: "Pilih", per_person: "per orang", total: "Total", confirm: "Konfirmasi Pemesanan",
      pop_dest: "Destinasi Paling Populer", top_pkg: "Paket Terbaik Untuk Anda", calc_price: "HITUNG TOTAL HARGA", hero_island: "PULAU SURGA", 
      hero_adv: "PETUALANGAN MENANTI", hero_trail: "TEMUKAN JALUR ANDA", dest_title: "TEMUKAN TEMPAT ANDA", tours_title: "PAKET TUR", gal_title: "PERJALANAN VISUAL", conn_title: "HUBUNGI KAMI", price_summary: "Ringkasan Harga",
      // --- CONTACT PAGE ---
      contact_info: "Informasi Kontak", contact_desc: "Pakar perjalanan kami siap membantu Anda. Hubungi kami melalui email, telepon, atau kunjungi kantor kami.", head_office: "Kantor Pusat", phone: "Nombor Telepon", email_addr: "Alamat Email", send_msg: "Kirim Pesan", your_name: "Nama Anda", your_email: "Email Anda", subject: "Subjek", message: "Pesan", placeholder_help: "Bagaimana kami bisa membantu?", placeholder_msg: "Tulis pesan Anda di sini...", btn_send: "KIRIM PESAN",
      // --- BOOKING PAGE ---
      booking_title: "Amankan Tempat Anda", booking_desc: "Selesaikan pemesanan Anda", trip_details: "Detail Perjalanan", dest_pkg: "Destinasi / Paket", select_pkg: "-- Pilih Paket --", travel_date: "Tanggal Perjalanan", num_guests: "Jumlah Tamu",
      adults: "Dewasa", adults_desc: "12+ tahun", children: "Anak-anak", children_desc: "Diskon 50% (2-11 thn)", infants: "Bayi", infants_desc: "Gratis (Di bawah 2)",
      acc_class: "Kelas Akomodasi", std_class: "Standar", std_desc: "Termasuk", deluxe_class: "Deluxe", lux_class: "Mewah", pax: "/pax",
      lead_guest: "Detail Tamu Utama", full_name: "Nama Lengkap",
      carbon_footprint: "Jejak Karbon", carbon_desc: "Perjalanan menghasilkan emisi. Perkiraan jejak untuk", carbon_desc2: "wisatawan adalah", carbon_desc3: "Bantu kami mengimbanginya.", offset_carbon: "Imbangi Jejak Karbon Saya",
      optional_addons: "Tambahan Opsional", transfer: "Transfer Bandara", transfer_desc: "Penjemputan tanpa repot.", insurance: "Asuransi Perjalanan", insurance_desc: "Cakupan penuh.", dinner: "Makan Malam Romantis", dinner_desc: "Makan malam dengan cahaya lilin.",
      payment_details: "Detail Pembayaran", how_paying: "Bagaimana kita membayar?", split_1: "Hanya saya (Bayar penuh)", split_ways: "Bagi", split_ways2: "orang", invoice_emails: "Email untuk Faktur:", lead_email: "Email Pemesan Utama", friend_email: "Email Teman", friend_email2: "",
      each_pays: "Setiap orang akan membayar", invoices_tied: "Faktur akan dikaitkan dengan email ini.", payment_method: "Metode Pembayaran",
      select_summary: "Pilih paket untuk melihat ringkasan", split: "Bagi", ways: "orang", per_person2: "/orang", secure_payment: "Pembayaran Aman", processing: "Memproses..."
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