// Site-wide settings. Owners can edit these values directly.
export const site = {
  name: 'Gummikins',
  url: 'https://gummikins.com',
  tagline: 'Little creatures. A brighter, softer world.',
  message: 'When you can’t be there, a Gummikins can.',
  supporting: 'Made by hand. Given with love. Here when you can’t be.',
  description:
    'Handmade crochet Gummikins™ plush and cozy sensory blankets. Soft, squishy companions made one at a time, for the people you love and the ones you can’t be with right now.',
  email: 'hello@gummikins.com',
  instagram: 'gummikins_plush',
  instagramUrl: 'https://www.instagram.com/gummikins_plush/',
  location: 'Wisconsin, USA',
  currency: 'USD',
  turnaround: '2–4 business days',
};

export const nav = [
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'Our story' },
  { href: '/custom', label: 'Special orders' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
];

export const footerNav = {
  shop: [
    { href: '/shop', label: 'All Gummikins' },
    { href: '/shop?filter=keychains', label: 'Keychains' },
    { href: '/shop?filter=blankets', label: 'Blankets & sensory' },
    { href: '/custom', label: 'Giant & special orders' },
  ],
  world: [
    { href: '/about', label: 'Our story' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/journal', label: 'Journal' },
    { href: '/contact', label: 'Contact' },
  ],
  help: [
    { href: '/faq', label: 'FAQ' },
    { href: '/policies/shipping', label: 'Shipping' },
    { href: '/policies/returns', label: 'Returns' },
    { href: '/policies/privacy', label: 'Privacy' },
    { href: '/policies/terms', label: 'Terms' },
  ],
};

// Flat shipping charge by size. Multi-item orders are calculated at checkout.
export const shippingRates = [
  { label: 'Keychain', price: 6.95 },
  { label: 'Small', price: 7.95 },
  { label: 'Medium', price: 8.95 },
  { label: 'Large', price: 10.95 },
  { label: 'Giant', price: 15.95 },
  { label: 'Nest Blanket', price: '10.95–15.95' },
];

export const sizes = [
  { key: 'keychain', name: 'Keychain', inches: '3"', scale: 0.42, price: 20, note: 'Clips to keys and bags' },
  { key: 'small', name: 'Small', inches: '5–6"', scale: 0.6, price: 35, note: 'Fits in one palm' },
  { key: 'medium', name: 'Medium', inches: '7–8"', scale: 0.74, price: 50, note: 'A two-handed hug' },
  { key: 'large', name: 'Large', inches: '10–12"', scale: 0.88, price: 70, note: 'A full armful' },
  { key: 'giant', name: 'Giant', inches: '16–18"', scale: 1.08, price: 120, note: 'Special order only', special: true },
];

export const testimonials = [
  { quote: 'I can’t stop touching it.', who: 'Verified Buyer', tint: 'rose' },
  {
    quote: 'My 16-year-old granddaughter latched onto her Gummikins™ and didn’t let it go for hours at a time.',
    who: 'Verified Buyer',
    tint: 'sky',
  },
  {
    quote: 'Our Gummikins™ keychains bring us so much happiness on our long commutes.',
    who: 'Verified Buyer',
    tint: 'ochre',
  },
  { quote: 'Gummikins™ goes to college in the fall with our freshman!', who: 'Verified Buyer', tint: 'moss' },
  {
    quote: 'Our large Gummikins™ fills the empty spaces in the hospital bed for our little niece.',
    who: 'Verified Buyer',
    tint: 'cream',
  },
  { quote: 'Gummikins™ has become Grandpa’s TV companion.', who: 'Verified Buyer', tint: 'rose' },
];

export const reasons = [
  { title: 'For someone far away', body: 'A soft stand-in for a hug you can’t give in person.', tint: 'sky' },
  { title: 'For a child or grandchild', body: 'A first friend, a bedtime buddy, a pocket of comfort.', tint: 'ochre' },
  { title: 'For leaving home', body: 'Off to college, a new city, a first apartment. A little piece of home goes too.', tint: 'moss' },
  { title: 'For a hard season', body: 'Hospital stays, big changes, long nights. Something soft to hold on to.', tint: 'rose' },
  { title: 'For hands that like to fidget', body: 'Squeezable, rubbable, textured and quiet. Made to be touched, over and over.', tint: 'cream' },
  { title: 'Just because', body: 'You saw one and wanted it. That is a perfectly good reason.', tint: 'sky' },
];
