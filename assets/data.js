// assets/data.js
// Shared data used by every Kotofit page. No DOM access — pure data.

const LOCATIONS = [
  { id: 'jc-3rd',     city: 'Jersey City · NJ',       name: '3rd Street',    courts: 3,  hours: 'Weekdays 7PM–11:30PM', img: 'assets/kotofit-nj.png', status: 'open',
    address: '123 3rd Street, Jersey City, NJ 07302',
    sports: ['badminton'],
    courtMix: ['3 Badminton'],
    schedule: { weekdays: ['19:00', '23:30'], weekends: null },
    services: ['coaching', 'stringing'] },
  { id: 'jc-bruns',   city: 'Jersey City · NJ',       name: 'Brunswick',     courts: 6,  hours: 'Daily 6AM–2AM',        img: 'assets/kotofit-nj2.png', status: 'open',
    address: '88 Brunswick Street, Jersey City, NJ 07302',
    sports: ['badminton', 'pickleball', 'pingpong'],
    courtMix: ['3 Badminton', '2 Pickleball', '1 Ping pong table'],
    schedule: { weekdays: ['06:00', '02:00'], weekends: ['06:00', '02:00'] },
    services: ['coaching', 'stringing', 'events'] },
  { id: 'jc-summit',  city: 'Jersey City · NJ',       name: 'Summit Ave',    courts: 4,  hours: 'Daily 6AM–2AM',        img: 'assets/kotofit-nj3.png', status: 'open',
    address: '440 Summit Avenue, Jersey City, NJ 07306',
    sports: ['badminton', 'pickleball'],
    courtMix: ['2 Badminton', '1 Pickleball', '1 Box cricket field'],
    schedule: { weekdays: ['06:00', '02:00'], weekends: ['06:00', '02:00'] },
    services: ['stringing'] },
  { id: 'lic-10th',   city: 'Long Island City · NY',  name: '10th Street',   courts: 8,  hours: 'Daily 6AM–11PM',       img: 'assets/kotofit-lic.png', status: 'open',
    address: '47-10 10th Street, Long Island City, NY 11101',
    sports: ['badminton', 'pickleball', 'pingpong'],
    courtMix: ['4 Badminton', '2 Pickleball', '1 Ping pong table', 'Digital wall + lounge'],
    schedule: { weekdays: ['06:00', '23:00'], weekends: ['06:00', '23:00'] },
    services: ['coaching', 'stringing', 'events'] },
  { id: 'jc-soon',    city: 'Jersey City · NJ',       name: 'Coming Soon',   courts: 0,  hours: 'Opens this season', img: '', status: 'soon',
    address: 'Jersey City — exact address coming soon',
    sports: [],
    services: [] },
  { id: 'bk-soon',    city: 'Brooklyn · NY',          name: 'Coming Soon',   courts: 0,  hours: 'Opens this season', img: '', status: 'soon',
    address: 'Brooklyn — exact address coming soon',
    sports: [],
    services: [] },
  { id: 'qns-soon',   city: 'Queens · NY',            name: 'Coming Soon',   courts: 0,  hours: 'Opens this season', img: '', status: 'soon',
    address: 'Queens — exact address coming soon',
    sports: [],
    services: [] },
];

const SPORTS = [
  { id: 'badminton',  num: '01', name: 'Badminton',  read: 'Open play, leagues, clinics →',  img: 'assets/badminton-racket.jpg', desc: 'The fastest racquet sport in the world. Open play sessions, member leagues, and clinics for every level — from first racquet to tournament prep.' },
  { id: 'pickleball', num: '02', name: 'Pickleball', read: 'All levels, mixers, tournaments →', img: 'assets/pickleball-paddle.jpg', desc: "America's fastest-growing sport. Drop-in mixers every week, ladder leagues, and weekend tournaments. Easy to learn, hard to put down." },
  { id: 'pingpong',   num: '03', name: 'Ping Pong',  read: 'Drop in, tables ready →',          img: 'assets/tabletennis-paddle.jpg', desc: 'Tables ready at every location. No reservation needed — drop in, grab a paddle, and play.' },
];

// Memberships are location-specific. NJ and LIC each have their own tiers
// and their own comparison-table feature rows since the offerings differ.
const MEMBERSHIPS = {
  nj: {
    label: 'New Jersey',
    locationIds: ['jc-3rd', 'jc-bruns', 'jc-summit'],
    rows: [
      { key: 'fullCourt', label: 'Full court (per hr)',    sub: 'peak / off-peak' },
      { key: 'openPlay',  label: 'Open play (per 90 min)', sub: 'peak / off-peak' },
      { key: 'advance',   label: 'Advance booking' },
      { key: 'coaching',  label: 'Coaching / clinic discount' },
    ],
    tiers: [
      { id: 'nj-free', name: 'Free', tagline: 'No commitment until you book and play',
        priceMo: 0, priceQ: null, featured: false, limitedOffer: false, cta: 'Try free',
        cells: { fullCourt: '$60 / $44', openPlay: '$20 / $15', advance: '14 days', coaching: '—' },
        perks: ['Pay per court — $60 peak / $44 off-peak', '$20 / $15 open play (90 min)', '14-day advance booking', 'No coaching discount', 'Free cancellation any time'] },
      { id: 'nj-open', name: 'Open Play Elite', tagline: "Best for regular open-play bookings",
        priceMo: 35, priceQ: 95, featured: true, limitedOffer: false, cta: 'Join Open Play Elite',
        cells: { fullCourt: '$54 / $39.60 (10% off)', openPlay: '$14 / $10.50 (30% off)', advance: '21 days', coaching: '$20 off' },
        perks: ['30% off all open-play bookings', '10% off full-court bookings', '21-day advance booking', '$20 off coaching / clinics', 'Free cancellation any time'] },
      { id: 'nj-court', name: 'Full Court Elite', tagline: 'Best for regular full-court bookings',
        priceMo: 59, priceQ: 159, featured: false, limitedOffer: false, cta: 'Join Full Court Elite',
        cells: { fullCourt: '$45 / $33 (25% off)', openPlay: '$18 / $13.50 (10% off)', advance: '21 days', coaching: '$25 off' },
        perks: ['25% off all full-court bookings', '10% off open-play bookings', '21-day advance booking', '$25 off coaching / clinics', 'Free cancellation any time'] },
    ],
  },
  lic: {
    label: 'Long Island City',
    locationIds: ['lic-10th'],
    rows: [
      { key: 'fullCourt', label: 'Full court (per hr)',         sub: 'peak / off-peak' },
      { key: 'openPlay',  label: 'Open play (per 90 min)',      sub: 'peak / off-peak' },
      { key: 'ubr',       label: 'UBR / DUPR open play (120 min)' },
      { key: 'coaching',  label: 'Coaching package perks' },
      { key: 'pingpong',  label: 'Ping pong / multi-ball wall' },
      { key: 'advance',   label: 'Advance booking' },
    ],
    tiers: [
      { id: 'lic-free', name: 'Free', tagline: 'Pay per play',
        priceMo: 0, priceQ: null, featured: false, limitedOffer: false, cta: 'Try free',
        cells: { fullCourt: '$80 / $50', openPlay: '$24 / $15', ubr: '—', coaching: '—', pingpong: '—', advance: '14 days' },
        perks: ['Pay per court — $80 peak / $50 off-peak', '$24 / $15 open play (90 min)', '14-day advance booking', 'No discounts on UBR, coaching, or ping pong', 'Free cancellation any time'] },
      { id: 'lic-silver', name: 'Silver', tagline: 'Best for regular open-play bookings',
        priceMo: 49, priceQ: 129, featured: true, limitedOffer: true, cta: 'Join Silver',
        cells: { fullCourt: '$76 / $47 (5% off)', openPlay: '$19.60 / $13 (20% off)', ubr: '1 free session (worth ~$30)', coaching: '—', pingpong: '20% off', advance: '21 days' },
        perks: ['20% off all open-play bookings', '5% off full-court bookings', '1 free UBR/DUPR session per month (~$30 value)', '20% off ping pong / multi-ball wall', '21-day advance booking', 'Cancel auto-renewal anytime'] },
      { id: 'lic-gold', name: 'Gold', tagline: 'Best for regular private-court bookings',
        priceMo: 139, priceQ: 389, featured: false, limitedOffer: true, cta: 'Join Gold',
        cells: { fullCourt: '$64 / $40 (20% off)', openPlay: '$19.60 / $13 (20% off)', ubr: '—', coaching: '$50 off coaching package', pingpong: '30% off', advance: '21 days' },
        perks: ['20% off all private-court bookings', '20% off open-play bookings', '$50 off any coaching package', '30% off ping pong / multi-ball wall', '21-day advance booking', 'Cancel auto-renewal anytime'] },
      { id: 'lic-plat', name: 'Platinum', tagline: 'Dedicated weekly pre-reserved courts at 30% off',
        priceMo: null, priceQ: 699, featured: false, limitedOffer: true, cta: 'Join Platinum',
        cells: { fullCourt: '$56 / $35 (30% off)', openPlay: '$16.80 / $10.50 (30% off)', ubr: '3 free sessions (worth ~$90)', coaching: '$150 off coaching package', pingpong: '40% off', advance: 'Dedicated pre-reserved weekly courts (max 3 hrs/week)' },
        perks: ['Dedicated pre-reserved weekly courts (max 3 hrs/week)', '30% off all private-court & open-play bookings', '3 free UBR/DUPR sessions per month (~$90 value)', '$150 off any coaching package', '40% off ping pong / multi-ball wall', 'Cancel auto-renewal anytime'] },
    ],
  },
};

const COACHES = [
  { id: 'c1', role: 'Head Coach', name: 'Tariq Sharif',
    desc: "Former professional coach at Rutgers University. Has coached ex-national players from multiple countries and led 100+ adults through structured programs at Kotofit in 2024.",
    awards: [
      'Former world #62 in doubles',
      'Multiple-time Pakistan national champion',
      'BWF Certified',
    ],
    img: 'https://images.squarespace-cdn.com/content/v1/633bb9752a5d2a489346bdb7/e4c02360-e816-4fad-8072-fd6c80e7de0d/WhatsApp+Image+2023-12-30+at+10.07.22+PM.jpeg',
    feature: true,
    specialty: 'Badminton — singles & doubles' },
  { id: 'c2', role: 'Coach', name: 'Rana',
    desc: "Two decades coaching badminton with an Egyptian national team background. Brings high-level competitive experience to every session — coached 50+ kids and adults at Kotofit in 2024.",
    awards: [
      'Egyptian national team alumna',
      'National, continental & world championship participant',
      'BWF Certified',
    ],
    img: 'https://images.squarespace-cdn.com/content/v1/633bb9752a5d2a489346bdb7/1d181eaf-e8c9-4878-b37a-f04bf02eecc2/coach+rana.png',
    specialty: 'Badminton — junior & adult' },
  { id: 'c3', role: 'Coach', name: 'Kevin Sun',
    desc: "Began formal training young — entered provincial team training at age nine. Builds a structured, systematic approach grounded in fundamentals and match-based application.",
    awards: [
      "2015 National Games — Men's Singles Champion",
      "2016 National Games — Men's Singles Runner-up",
      "2023 Shanghai Mixed Doubles — Semifinalist",
    ],
    img: 'https://images.squarespace-cdn.com/content/v1/633bb9752a5d2a489346bdb7/150d85f0-ced5-4d4f-88cc-2ef5d001e2b5/Kevin+Sun.png',
    specialty: 'Badminton — singles' },
];

const EVENTS = [
  { id: 'e1',  day: '02', mo: 'May', name: 'Beginner Pickleball Mixer',  meta: 'Brunswick · 6:00 PM · Free for members',           sport: 'pickleball', location: 'jc-bruns',  month: 'May', price: 'free' },
  { id: 'e2',  day: '09', mo: 'May', name: 'Spring Doubles Tournament',  meta: '3rd Street · 10:00 AM · $25 entry',               sport: 'badminton',  location: 'jc-3rd',     month: 'May', price: 'paid' },
  { id: 'e3',  day: '15', mo: 'May', name: 'Junior Badminton Camp',      meta: 'LIC · All week · Ages 8–14',                       sport: 'badminton',  location: 'lic-10th',   month: 'May', price: 'paid' },
  { id: 'e4',  day: '23', mo: 'May', name: 'Late-Night Open Play',       meta: 'Summit Ave · 10:00 PM · Members only',             sport: 'badminton',  location: 'jc-summit',  month: 'May', price: 'free' },
  { id: 'e5',  day: '30', mo: 'May', name: 'Pickleball Skills Clinic',   meta: 'Brunswick · 7:00 PM · $30',                        sport: 'pickleball', location: 'jc-bruns',   month: 'May', price: 'paid' },
  { id: 'e6',  day: '06', mo: 'Jun', name: 'Summer Kickoff Mixer',       meta: 'LIC · 5:00 PM · Free',                             sport: 'badminton',  location: 'lic-10th',   month: 'Jun', price: 'free' },
  { id: 'e7',  day: '13', mo: 'Jun', name: 'Ping Pong Ladder Night',     meta: '3rd Street · 8:00 PM · $10 entry',                 sport: 'pingpong',   location: 'jc-3rd',     month: 'Jun', price: 'paid' },
  { id: 'e8',  day: '20', mo: 'Jun', name: 'Pickleball Open Tournament', meta: 'Brunswick · 9:00 AM · $40',                        sport: 'pickleball', location: 'jc-bruns',   month: 'Jun', price: 'paid' },
  { id: 'e9',  day: '27', mo: 'Jun', name: 'Member Appreciation Night',  meta: 'All locations · 7:00 PM · Members only',           sport: 'badminton',  location: 'all',        month: 'Jun', price: 'free' },
  { id: 'e10', day: '04', mo: 'Jul', name: 'Independence Day Open Play', meta: 'LIC · All day · Free for members',                 sport: 'badminton',  location: 'lic-10th',   month: 'Jul', price: 'free' },
  { id: 'e11', day: '11', mo: 'Jul', name: 'Junior Pickleball Camp',     meta: 'Brunswick · All week · Ages 10–16 · $250',         sport: 'pickleball', location: 'jc-bruns',   month: 'Jul', price: 'paid' },
  { id: 'e12', day: '18', mo: 'Jul', name: 'Summer Doubles League Final',meta: '3rd Street · 6:00 PM · Spectators welcome',        sport: 'badminton',  location: 'jc-3rd',     month: 'Jul', price: 'free' },
];

const STRING_CATEGORIES = [
  { id: 'durability', label: 'Built for durability', tabLabel: 'Durability',
    desc: 'Longer-lasting strings for high-frequency players, beginners, and anyone who breaks strings often.' },
  { id: 'power',      label: 'Built for power',      tabLabel: 'Power',
    desc: 'Explosive repulsion strings for attackers who want every smash to feel heavy.' },
  { id: 'control',    label: 'Built for control & feel', tabLabel: 'Control & feel',
    desc: 'Refined, sensitive strings for tactical players who shape every shot.' },
];

// To use a real product photo for any item below, add an `img` field with
// either a local path (e.g. `img: 'assets/strings/yonex-bg65.png'`) or any
// hosted URL. The renderer falls back to a shared default if `img` is unset.
const STRINGS = [
  // === DURABILITY ===
  { id: 'yonex-bg65',       name: 'Yonex BG65',           category: 'durability',
    img: 'https://us.yonex.com/cdn/shop/files/BG65-2_WHITE_1.jpg?v=1752002883&width=1946',
    desc: 'Durable all-round string. The most-strung badminton string in the world — best for beginners and high-frequency players who break strings often.',
    price: 22, gauge: '0.70mm', durability: 5, control: 3, power: 3,
    pickIf: 'You break strings often or play 4+ times a week.',
    playstyle: 'All-round · Durable' },
  { id: 'yonex-bg65ti',     name: 'Yonex BG65 Titanium',  category: 'durability',
    img: 'https://us.yonex.com/cdn/shop/files/ABG65TIW_White_1.jpg?v=1770434589',
    desc: 'BG65 with a titanium hydride coating. Same proven durability with a slightly crisper feel and a touch more snap.',
    price: 25, gauge: '0.70mm', durability: 5, control: 3, power: 4,
    pickIf: 'You loved BG65 but want a bit more pop on smashes.',
    playstyle: 'All-round · Crisper' },
  { id: 'yonex-nano95',     name: 'Yonex Nanogy 95',      category: 'durability',
    img: 'https://us.yonex.com/cdn/shop/files/NBG95_Red_1.png?v=1770434568&width=1946',
    desc: 'Refined nylon multifilament. Soft on the arm with surprising control — a comfortable middle ground for intermediate players.',
    price: 26, gauge: '0.69mm', durability: 4, control: 4, power: 3,
    pickIf: 'You want control without the harshness of a thinner string.',
    playstyle: 'Comfort · Control' },
  { id: 'victor-vbs66n',    name: 'Victor VBS-66N',       category: 'durability',
    img: 'https://cdn.shopify.com/s/files/1/0595/4342/1085/products/VBS-66NRL.jpg?v=1653736225',
    desc: 'Affordable performance. Balanced feel for intermediate players who want more than a beginner string without paying pro prices.',
    price: 24, gauge: '0.66mm', durability: 3, control: 4, power: 4,
    pickIf: 'You want a step up from BG65 without spending $30.',
    playstyle: 'Balanced · Value' },

  // === POWER ===
  { id: 'yonex-bg80',       name: 'Yonex BG80',           category: 'power',
    img: 'https://us.yonex.com/cdn/shop/files/BG80-2_WHITE_1.jpg?v=1764804978&width=1946',
    desc: 'Power and repulsion. The choice of attacking players who want every smash to feel explosive.',
    price: 28, gauge: '0.68mm', durability: 4, control: 3, power: 5,
    pickIf: 'You play attacking — smashes are your money shot.',
    playstyle: 'Power · Repulsion' },
  { id: 'yonex-aerobite-boost', name: 'Yonex Aerobite Boost', category: 'power',
    img: 'https://www.badmintonavenue.com/cdn/shop/files/yonex-aerobite-boost-0-72-0-61mm-badminton-hybrid-200m-reel-red-front__98676__17694.1698772299.jpg?v=1726216750&width=2400',
    desc: 'Hybrid string — thicker mains for power, thinner crosses for repulsion. A doubles-tour favorite for back-court hammers.',
    price: 32, gauge: '0.72/0.61mm', durability: 3, control: 4, power: 5,
    pickIf: 'You play doubles back-court and want extra power on every smash.',
    playstyle: 'Hybrid · Doubles power' },
  { id: 'ashaway-zm70fire', name: 'Ashaway Zymax 70',     category: 'power',
    img: 'https://www.badmintonalley.com/v/vspfiles/photos/STRING-ASHAWAY-ZYMAX-70-WHT-2.jpg?v-cache=1765504033',
    desc: 'Built around explosive feel. Snappy, loud, and tuned for big hitters who want maximum repulsion at standard gauge.',
    price: 30, gauge: '0.70mm', durability: 4, control: 3, power: 5,
    pickIf: 'You want max power without dropping to a thinner gauge.',
    playstyle: 'Power · Loud' },

  // === CONTROL & FEEL ===
  { id: 'yonex-bg66u',      name: 'Yonex BG66 Ultimax',   category: 'control',
    img: 'https://us.yonex.com/cdn/shop/files/BG66UM-2_METALLIC-WHITE_1.jpg?v=1752003035',
    desc: 'A pro-tour staple. Ultra-fine 0.65mm gauge for sharp repulsion and unmatched feel — at the cost of longevity.',
    price: 32, gauge: '0.65mm', durability: 2, control: 5, power: 5,
    pickIf: 'You prioritize feel and shot precision over string longevity.',
    playstyle: 'Pro-grade · Sharp' },
  { id: 'ashaway-zm',       name: 'Ashaway Zymax 69 Fire',category: 'control',
    img: 'https://www.badmintonwarehouse.com/cdn/shop/products/ashaway-zymax-69-fire-0-69mm-badminton-string-orange-or-white-1_700x700.jpg?v=1528316787',
    desc: 'Pro-tour favorite. Crisp, defined control with surprising durability — equally at home in singles and doubles.',
    price: 32, gauge: '0.69mm', durability: 4, control: 5, power: 4,
    pickIf: 'You want pro-level control without giving up durability.',
    playstyle: 'Control · All-court' },
  { id: 'yonex-aerosonic',  name: 'Yonex Aerosonic',      category: 'control',
    img: 'https://us.yonex.com/cdn/shop/files/ABGASW_White_1.jpg?v=1740344297&width=1946',
    desc: "Yonex's thinnest string at 0.61mm. The most sensation per shot — built for advanced players who don't mind restringing every two weeks.",
    price: 34, gauge: '0.61mm', durability: 1, control: 5, power: 4,
    pickIf: "You're advanced and want the sharpest possible feel.",
    playstyle: 'Pro · Ultra-thin' },
];

const TENSIONS = ['22 lbs · Soft feel', '24 lbs · Balanced (recommended)', '26 lbs · Crisp control', '28 lbs · Pro level'];

const RACKET_CATEGORIES = [
  { id: 'attack',   label: 'Attack',    tabLabel: 'Attack',
    desc: 'Head-heavy, stiff frames. Built around the smash — for singles players and doubles back-court hitters.' },
  { id: 'allround', label: 'All-round', tabLabel: 'All-round',
    desc: 'Balanced frames that handle every shot well. The right pick for most intermediate-to-advanced players.' },
  { id: 'speed',    label: 'Speed',     tabLabel: 'Speed',
    desc: 'Head-light, aerodynamic frames built for fast hands — defensive doubles play, drives, and counter-attacks.' },
];

const RACKETS = [
  // === ATTACK ===
  { id: 'astrox-99pro',     name: 'Yonex Astrox 99 Pro',     category: 'attack',
    img: 'https://yumo.ca/cdn/shop/files/Yonex_Astrox99Pro_Black_Green_Badminton_Racket_YumoProShop.png?v=1756334590',
    desc: "Kento Momota's signature singles racquet. Built around the rotational generator concept for explosive smashes.",
    price: 260, weight: '4U (83g)', balance: 'Head-heavy', flex: 'Stiff', level: 'Advanced',
    pickIf: 'You play singles and your smash is your best weapon.' },
  { id: 'astrox-88dpro',    name: 'Yonex Astrox 88D Pro',    category: 'attack',
    img: 'https://yumo.ca/cdn/shop/files/Yonex_Astrox88DPro_Black_Silver_Badminton_Racket_YumoProShop.png?v=1708629919',
    desc: 'The doubles back-court hammer. Thicker shaft and head-heavy build — engineered for the rear-court attacker.',
    price: 250, weight: '3U (88g)', balance: 'Head-heavy', flex: 'Stiff', level: 'Advanced',
    pickIf: 'You play doubles back-court and want every smash to land heavy.' },
  { id: 'thruster-falcon',  name: 'Victor Thruster Falcon',  category: 'attack',
    img: 'https://yumo.ca/cdn/shop/products/Victor_TK-F_ThrusterF_ehanced_badminton_racket_black_1_yumoproshop.jpg?v=1611944420',
    desc: 'Aggressive head-heavy frame at a more accessible price. Fast through the air despite the weight bias.',
    price: 200, weight: '4U (83g)', balance: 'Head-heavy', flex: 'Medium', level: 'Intermediate',
    pickIf: "You're moving up to your first attack-oriented frame." },

  // === ALL-ROUND ===
  { id: 'astrox-88spro',    name: 'Yonex Astrox 88S Pro',    category: 'allround',
    img: 'https://yumo.ca/cdn/shop/files/Yonex_Astrox88SPro_Black_Silver_Badminton_Racket_YumoProShop.png?v=1765309385',
    desc: 'The doubles front-court counterpart to the 88D. Even balance for fast hands and net play, with enough head weight to finish.',
    price: 250, weight: '3U (88g)', balance: 'Even', flex: 'Stiff', level: 'Advanced',
    pickIf: 'You play doubles front-court and need quick hands without giving up power.' },
  { id: 'arcsaber-11pro',   name: 'Yonex Arcsaber 11 Pro',   category: 'allround',
    img: 'https://yumo.ca/cdn/shop/products/Yonex_2022_ARC11PRO_Red_Badminton_racket_YumoProShop.png?v=1642022794',
    desc: 'A control-first all-rounder built for the precise player. Holds the shuttle longer for refined shot placement.',
    price: 260, weight: '3U (88g)', balance: 'Even', flex: 'Stiff', level: 'Advanced',
    pickIf: 'You shape every shot — drops, drives, clears with placement intent.' },
  { id: 'arcsaber-7pro',    name: 'Yonex Arcsaber 7 Pro',    category: 'allround',
    img: 'https://yumo.ca/cdn/shop/products/arc7-p.png?v=1656528668',
    desc: 'A more forgiving Arcsaber. Even balance with a medium-flex shaft — comfortable for full-rally singles play.',
    price: 200, weight: '4U (83g)', balance: 'Even', flex: 'Medium', level: 'Intermediate',
    pickIf: "You're intermediate and want one racquet that does everything well." },

  // === SPEED ===
  { id: 'nanoflare-700',    name: 'Yonex Nanoflare 700',     category: 'speed',
    img: 'https://www.badmintonwarehouse.com/cdn/shop/products/Nanoflare_700_Badminton_Racket_Cyan_Frame_1024x.jpg?v=1646751153',
    desc: 'Head-light frame engineered for speed. Built for the doubles player who lives at the net and counter-attacks fast.',
    price: 200, weight: '4U (83g)', balance: 'Head-light', flex: 'Medium', level: 'Intermediate',
    pickIf: "You're a fast-hands doubles player who counter-drives everything." },
  { id: 'nanoflare-800pro', name: 'Yonex Nanoflare 800 Pro', category: 'speed',
    img: 'https://yumo.ca/cdn/shop/files/Yonex_NF800Pro_Green_Badminton_Racket_YumoProShop.png?v=1698259077',
    desc: 'The flagship speed frame. Aerodynamic head, head-light balance, stiff shaft — built for elite-level fast play.',
    price: 260, weight: '4U (83g)', balance: 'Head-light', flex: 'Stiff', level: 'Advanced',
    pickIf: 'You play fast doubles at a high level and want the quickest racquet you can hold.' },
];

const PROGRAMS = [
  { id: 'adults-group', name: 'Adults Group Coaching',
    audience: 'Age 15+ · All skill levels',
    ratio: '1 coach : 4 students',
    sessions: '12 hours total',
    sessionLength: '90 min per session',
    price: 425, priceLabel: '$425', priceUnit: 'per person',
    perks: ['$30 off any racket in the pro shop', '1 makeup session per package'],
    cta: 'Register', featured: true },
  { id: 'adults-semi', name: 'Adults Semi-Private',
    audience: 'Age 15+ · All skill levels',
    ratio: '1 coach : 2 students',
    sessions: '6 hours total',
    sessionLength: '90 min per session',
    price: 399, priceLabel: '$399', priceUnit: 'per person',
    perks: ['$30 off any racket in the pro shop', '1 makeup session per package'],
    cta: 'Register' },
  { id: 'kids-group', name: 'Kids Group Coaching',
    audience: 'Ages 5–14 · All skill levels',
    ratio: '1 coach : 4–5 students',
    sessions: '12 hours total',
    sessionLength: '90 min per session',
    price: 449, priceLabel: '$449', priceUnit: 'per person',
    perks: ['Free 90 min practice time every week', '$30 off any racket in the pro shop', '1 makeup session per package'],
    cta: 'Register' },
  { id: 'private', name: 'Private Coaching',
    audience: 'All ages · All levels',
    ratio: '1:1 or 1:2 with any coach',
    sessions: 'Schedule built around you',
    sessionLength: 'Flexible',
    price: null, priceLabel: 'Custom', priceUnit: 'contact for pricing',
    perks: ['Tailored to your goals — technical refinement, match prep, footwork', 'Pick any coach on the roster'],
    cta: 'Contact via WhatsApp', contactOnly: true },
];

const FAQS = {
  memberships: [
    { q: 'Why do New Jersey and Long Island City have different plans?', a: 'The two locations operate independently with their own pricing and demand. NJ has three tiers (Free, Open Play Elite, Full Court Elite). LIC has four (Free, Silver, Gold, Platinum) plus extras like UBR/DUPR sessions and a multi-ball wall. Use the toggle above the cards to switch.' },
    { q: 'What is "peak" vs "off-peak"?', a: 'NJ peak hours run weekdays 5:30PM–11PM and weekends 7AM–11PM. LIC peak runs weekdays 5PM–10PM and weekends 7AM–11PM. Off-peak covers everything else. Member discounts apply to both, but court rates differ.' },
    { q: 'What is the difference between "open play" and "full court"?', a: 'Open play is a 90-minute drop-in session — you join other players at your level; per-person pricing. Full court is a 60-minute court reservation you book end-to-end for your group; per-court pricing. Most members lean toward one or the other, which is why NJ has separate Open Play Elite and Full Court Elite tiers.' },
    { q: 'Should I pay monthly or quarterly?', a: 'All paid tiers offer monthly or quarterly billing — quarterly is roughly one month free per quarter. (LIC Platinum is quarterly only.) Pick monthly for flexibility to cancel sooner; pick quarterly if you know you will be playing consistently.' },
    { q: 'What is the cancellation policy?', a: 'All paid tiers can cancel auto-renewal at any time at no charge — your access continues through the end of the period you already paid for. The free tier has nothing to cancel; you just stop booking.' },
    { q: 'How does the LIC Platinum tier work?', a: 'Platinum is quarterly only ($699/qtr) and includes dedicated, pre-reserved weekly courts up to 3 hours per week. It is built for groups or regular players who want a guaranteed time slot every week instead of hunting for availability.' },
    { q: 'What are UBR / DUPR open plays?', a: 'Skill-rated 120-minute open play sessions at LIC, grouped by player rating so the level stays competitive. Silver members get 1 free session per month; Platinum members get 3.' },
  ],
  coaching: [
    { q: 'What level are clinics for?', a: 'Most clinics are split into Beginner, Intermediate, and Advanced cohorts. The schedule lists the level for each session.' },
    { q: 'Are private lessons 1-on-1 only?', a: 'Yes by default, but two-player privates can be booked at a reduced per-person rate. Ask the coach when booking.' },
    { q: 'Can I cancel a booked session?', a: 'Cancel up to 24 hours before the session for a full refund. Within 24 hours: 50% credit toward a future booking.' },
    { q: "What's included in a clinic?", a: 'Coach instruction, court time, on-site shuttlecocks/balls. Bring your own racquet and grip.' },
    { q: 'Do I need my own racquet?', a: 'Yes, bring your own. The front desk has a small loaner pool ($5/session) but availability is not guaranteed.' },
  ],
  stringing: [
    { q: 'Can I bring my own string?', a: 'Yes — labor only is $15 if you supply the string. Drop the racquet and string together at the front desk.' },
    { q: 'How often should I restring?', a: 'Rule of thumb: as many times per year as you play per week. Weekly players: once a year. Daily players: 6+ times.' },
    { q: 'Do you offer same-day stringing?', a: 'Same-day on weekdays if dropped off before noon, $10 rush fee. Weekend drops are turned around by Monday end-of-day.' },
    { q: 'When can I pick up?', a: 'Pickup hours are tied to each location\'s open hours. We text when ready; bring your confirmation number to the front desk.' },
  ],
};

FAQS.general = [
  { q: 'What is Kotofit?', a: 'Kotofit operates multiple sports facilities in Jersey City and Long Island City, with indoor courts for badminton, pickleball, and table tennis across four locations — each with its own hours and amenities.' },
  { q: 'Tell me about the new Long Island City facility.', a: 'Our newest facility is at 47-10 10th Street in Long Island City — twelve courts open until 11PM, with street parking around the building. See the Locations page for the full address and hours.' },
  { q: 'Is parking available at Kotofit facilities?', a: 'Parking varies by location. Jersey City facilities offer street parking and free lot parking with time restrictions. Long Island City has street parking available around the building.' },
];

FAQS.booking = [
  { q: 'How can I book reservations?', a: 'Create a free account on the reservation platform, choose "Book full court / find a partner," select your time slot, and you\'ll receive a pin code via email confirmation for facility entry.' },
  { q: 'Do I have to be a paid member to play?', a: 'No — we offer free memberships as well. Free members can book courts and open plays up to 14 days in advance at standard pay-per-play rates. Paid memberships unlock discounts, longer booking windows, and other perks.' },
  { q: 'Can I extend my time?', a: 'Yes, additional time can be reserved if slots are available. Exceeding your reservation without booking the extension triggers automatic charges.' },
  { q: 'How do cancellations work?', a: 'Jersey City: free cancellations 48+ hours before; $5 penalty 12-48 hours before (credited to your account). Long Island City: full refunds outside 24 hours. Coaching sessions are non-refundable across all locations.' },
];

FAQS.hours = [
  { q: 'What are peak and off-peak hours at Jersey City locations?', a: 'Peak hours run weekdays 5:30PM-11PM and weekends 7AM-11PM. Off-peak times are weekday mornings, weekday late nights, and weekend early mornings or late nights.' },
  { q: 'What are peak and off-peak hours at Long Island City?', a: 'Peak hours run weekdays 5PM-10PM and weekends 7AM-11PM. Off-peak includes weekday daytime, late nights, and weekend early or late times.' },
];

FAQS.courts = [
  { q: 'How long can I stay at the facility?', a: 'You can access the court from 10 minutes before your reservation to 5 minutes after. Past that window, the next booking takes the court.' },
  { q: 'Can I bring friends?', a: 'Yes — up to six people per court booking. Any additional players are charged at $12 per hour.' },
  { q: 'Do I need to bring my own equipment?', a: 'No — we provide badminton racquets, pickleball paddles, and table tennis paddles plus balls. All free with your booking.' },
  { q: 'What is my skill level?', a: 'Skill levels are split into Beginner, Intermediate, and Advanced for badminton. For pickleball, we have a reference video at the front desk and on our community channels — ask any coach if you\'re not sure where to start.' },
  { q: 'Can Kotofit help me find partners to play with?', a: 'Yes — the reservation platform has a "Find a Partner" feature that matches players by proficiency. Member events and mixers are great ways to meet regulars at your home court too.' },
];

const CONTACT_INFO = {
  whatsappNumber: '+1 551 328 7867',
  whatsappUrl: 'https://wa.me/15513287867',
  wechatId: 'kotofit1',
};
