// assets/data.js
// Shared data used by every Kotofit page. No DOM access — pure data.

const LOCATIONS = [
  { id: 'jc-3rd',     city: 'Jersey City · NJ',       name: '3rd Street',    courts: 8,  hours: 'Open until 11PM',   img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80&auto=format&fit=crop', status: 'open',
    address: '123 3rd Street, Jersey City, NJ 07302',
    sports: ['badminton', 'pickleball', 'pingpong'],
    services: ['coaching', 'stringing'] },
  { id: 'jc-bruns',   city: 'Jersey City · NJ',       name: 'Brunswick',     courts: 10, hours: 'Open until 11PM',   img: 'https://images.unsplash.com/photo-1554290712-e640351074bd?w=800&q=80&auto=format&fit=crop', status: 'open',
    address: '88 Brunswick Street, Jersey City, NJ 07302',
    sports: ['badminton', 'pickleball'],
    services: ['coaching', 'stringing', 'events'] },
  { id: 'jc-summit',  city: 'Jersey City · NJ',       name: 'Summit Ave',    courts: 6,  hours: 'Open until 10PM',   img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80&auto=format&fit=crop', status: 'open',
    address: '440 Summit Avenue, Jersey City, NJ 07306',
    sports: ['badminton', 'pingpong'],
    services: ['stringing'] },
  { id: 'lic-10th',   city: 'Long Island City · NY',  name: '10th Street',   courts: 12, hours: 'Open until 11PM',   img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80&auto=format&fit=crop', status: 'open',
    address: '47-10 10th Street, Long Island City, NY 11101',
    sports: ['badminton', 'pickleball', 'pingpong'],
    services: ['coaching', 'stringing', 'events'] },
  { id: 'bk-soon',    city: 'Brooklyn · NY',          name: 'Coming Soon',   courts: 0,  hours: 'Opens this season', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80&auto=format&fit=crop', status: 'soon',
    address: 'Brooklyn — exact address coming soon',
    sports: [],
    services: [] },
  { id: 'qns-soon',   city: 'Queens · NY',            name: 'Coming Soon',   courts: 0,  hours: 'Opens this season', img: 'https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=800&q=80&auto=format&fit=crop', status: 'soon',
    address: 'Queens — exact address coming soon',
    sports: [],
    services: [] },
];

const SPORTS = [
  { id: 'badminton',  num: '01', name: 'Badminton',  read: 'Open play, leagues, clinics →',  img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80&auto=format&fit=crop', desc: 'The fastest racquet sport in the world. Open play sessions, member leagues, and clinics for every level — from first racquet to tournament prep.' },
  { id: 'pickleball', num: '02', name: 'Pickleball', read: 'All levels, mixers, tournaments →', img: 'https://images.unsplash.com/photo-1659318006095-4d44845f3a1b?w=1200&q=80&auto=format&fit=crop', desc: "America's fastest-growing sport. Drop-in mixers every week, ladder leagues, and weekend tournaments. Easy to learn, hard to put down." },
  { id: 'pingpong',   num: '03', name: 'Ping Pong',  read: 'Drop in, tables ready →',          img: 'https://images.unsplash.com/photo-1611251135345-18c56206b863?w=1200&q=80&auto=format&fit=crop', desc: 'Tables ready at every location. No reservation needed — drop in, grab a paddle, and play.' },
];

const TIERS = [
  { id: 'dropin',     name: 'Drop-in',                price: 0,   featured: false, perks: ['Pay per court', 'Standard booking window', 'Public events'], cta: 'Book one-off',
    fullPerks: ['Pay $20–$30 per court hour', 'Book 48 hours in advance', 'Public events open to all', 'No commitment, no monthly fee', 'Walk-in pricing for ping pong'] },
  { id: 'go-koto',    name: 'Go Koto · Most popular', price: 49,  featured: true,  perks: ['72-hour early booking', 'Free monthly events', '10% off clinics + stringing', 'Guest passes'], cta: 'Become a member',
    fullPerks: ['72-hour early booking window', '$15/hr member court rate', 'Free monthly member events', '10% off clinics and stringing', '2 guest passes per month', 'Freeze for up to 3 months/year', 'Member-only mixers'] },
  { id: 'all-access', name: 'All-Access',             price: 129, featured: false, perks: ['14-day early booking', 'All clinics included', 'Free stringing (2/mo)', 'Unlimited guest passes'], cta: 'Go All-Access',
    fullPerks: ['14-day early booking window', '$10/hr member court rate', 'All group clinics included', '2 free stringings per month', 'Unlimited guest passes', 'Family add-on at 50% off', 'Priority on tournament entries', 'Personal locker at home court'] },
];

const COACHES = [
  { id: 'c1', role: 'Head coach',  name: 'Wei Chen',     desc: 'Former national singles champion. Head of badminton clinics across all locations.',                       img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=80&auto=format&fit=crop', feature: true,
    specialty: 'Badminton singles & doubles', rate: 95 },
  { id: 'c2', role: 'Pickleball',  name: 'Maria Lopez',  desc: 'PPA-certified pro coach with 8 years competitive play and a passion for getting beginners on the court.', img: 'https://images.unsplash.com/photo-1554290712-e640351074bd?w=600&q=80&auto=format&fit=crop',
    specialty: 'Pickleball — beginner & intermediate', rate: 75 },
  { id: 'c3', role: 'Youth',       name: 'Jordan Park',  desc: 'Junior development specialist. Built youth programs at three clubs before joining Kotofit.',              img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80&auto=format&fit=crop',
    specialty: 'Junior badminton (ages 8–17)', rate: 70 },
  { id: 'c4', role: 'Doubles',     name: 'Aisha Khan',   desc: 'Doubles strategist. Former regional doubles champion, now coaching pairs through advanced rotations.',     img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80&auto=format&fit=crop',
    specialty: 'Badminton doubles', rate: 85 },
  { id: 'c5', role: 'Private',     name: 'David Kim',    desc: 'Private-lessons specialist. 1-on-1 coaching focused on technical refinement and match prep.',              img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80&auto=format&fit=crop',
    specialty: 'Privates — all levels', rate: 110 },
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

const STRINGS = [
  { id: 'yonex-bg65',  name: 'Yonex BG65',     desc: 'Durable all-round string. Best for beginners and high-frequency players who break strings often.', price: 22, gauge: '0.70mm', durability: 5, control: 3, power: 3 },
  { id: 'yonex-bg80',  name: 'Yonex BG80',     desc: 'Power and repulsion. The choice of attacking players who want every smash to feel explosive.',     price: 28, gauge: '0.68mm', durability: 4, control: 3, power: 5 },
  { id: 'ashaway-zm',  name: 'Ashaway Zymax',  desc: 'Pro tour favorite. Crisp control with surprising durability — equally at home in singles and doubles.', price: 32, gauge: '0.66mm', durability: 4, control: 5, power: 4 },
];

const TENSIONS = ['22 lbs · Soft feel', '24 lbs · Balanced (recommended)', '26 lbs · Crisp control', '28 lbs · Pro level'];

const PROGRAMS = [
  { id: 'group',    name: 'Group Clinics',   img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&q=80&auto=format&fit=crop',
    desc: 'Small-group sessions (4–8 players) led by Kotofit coaches. Drills, match play, and feedback. All levels.',
    priceRange: '$30–$45 per session', cta: 'Book a clinic' },
  { id: 'private',  name: 'Private Lessons', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900&q=80&auto=format&fit=crop',
    desc: '1-on-1 coaching focused on your goals. Technical refinement, match prep, footwork, strategy.',
    priceRange: '$70–$110 per hour', cta: 'Book a lesson' },
  { id: 'junior',   name: 'Junior Academy',  img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80&auto=format&fit=crop',
    desc: 'Year-round development for ages 8–17. Skill streams from beginner introduction to tournament-ready.',
    priceRange: '$250 per week (camps) / $40 per drop-in', cta: 'Enroll' },
];

const FAQS = {
  memberships: [
    { q: 'Can I freeze my membership?', a: 'Go Koto and All-Access members can freeze for up to 3 months per calendar year. Drop-in does not require freezing — pay only when you play.' },
    { q: 'Can I share my membership with family?', a: 'All-Access includes a 50%-off family add-on for one additional adult at the same address. Children play at junior rates regardless of plan.' },
    { q: 'What if I cancel?', a: 'Memberships are month-to-month with no commitment. Cancel anytime from your account; access continues through the end of the current billing cycle.' },
    { q: 'When does my booking window open?', a: 'Drop-in: 48 hours before tee time. Go Koto: 72 hours. All-Access: 14 days. Booking opens at midnight Eastern.' },
    { q: 'Are guest passes capped?', a: 'Go Koto: 2 guest passes per month, unused passes do not roll over. All-Access: unlimited guest passes (subject to court availability).' },
    { q: 'Do members get discounts on clinics and stringing?', a: 'Go Koto: 10% off both. All-Access: clinics included in membership; 2 free stringings per month, additional at member rate.' },
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
