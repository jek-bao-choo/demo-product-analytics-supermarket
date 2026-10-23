// Mock data for the Furniture Mart demo store. All product names are generic.

export const FM_HOME_URL = '/furniture-mart/';
export const FM_CATEGORY_URL = '/furniture-mart/category/sofas-armchairs/';

const idr = new Intl.NumberFormat('id-ID');
export const formatRp = (n) => `Rp ${idr.format(n)}`;

export const fmHomeSlides = [
  {
    id: 'make-room-to-celebrate',
    title: 'Make room',
    subtitle: 'to celebrate together',
    text: 'Discover more inspiration here',
    emoji: '🛋️📚🪴',
    panel: '#8b3a2b',
    bg: '#a9bfb4',
  },
  {
    id: 'sofa-week',
    title: 'Sofa week',
    subtitle: 'up to 30% off selected sofas',
    text: 'Till 31 Oct. While stocks last.',
    emoji: '🛋️',
    panel: '#0058a3',
    bg: '#e9dcc8',
  },
  {
    id: 'cosy-corners',
    title: 'Cosy corners',
    subtitle: 'armchairs for every space',
    text: 'Find your favourite reading spot',
    emoji: '🪑💡',
    panel: '#2f5d3a',
    bg: '#d9d4c7',
  },
];

// Tiles with `link: true` go to the Sofas & armchairs page; the rest are inert.
export const fmCategories = [
  { id: 'new', name: 'New', emoji: '🆕', link: true },
  { id: 'top-picks', name: 'Our top picks', emoji: '❤️', link: true },
  { id: 'sofas', name: 'Sofas & armchairs', emoji: '🛋️', link: true },
  { id: 'wardrobes', name: 'Wardrobes', emoji: '🚪' },
  { id: 'desks', name: 'Tables & desks', emoji: '🪵' },
  { id: 'kids', name: 'Kids', emoji: '🧸' },
  { id: 'lighting', name: 'Lighting', emoji: '💡' },
  { id: 'beds', name: 'Beds', emoji: '🛏️' },
];

export const fmRooms = [
  { id: 'living-room', name: 'Living room', emoji: '🛋️', link: true },
  { id: 'bedroom', name: 'Bedroom', emoji: '🛏️' },
  { id: 'kitchen', name: 'Kitchen', emoji: '🍳' },
  { id: 'dining', name: 'Dining', emoji: '🍽️' },
  { id: 'workspace', name: 'Home office', emoji: '🖥️' },
  { id: 'bathroom', name: 'Bathroom', emoji: '🛁' },
  { id: 'outdoor', name: 'Outdoor', emoji: '🌿' },
];

export const fmTopPicks = [
  { id: 'linnea-3-seat', name: 'LINNEA', desc: '3-seat sofa, beige', emoji: '🛋️', price: 4999000 },
  { id: 'otto-armchair', name: 'OTTO', desc: 'Armchair, dark green', emoji: '🪑', price: 1799000 },
  { id: 'bryn-bookcase', name: 'BRYN', desc: 'Bookcase, white, 80x202 cm', emoji: '📚', price: 999000 },
  { id: 'luma-lamp', name: 'LUMA', desc: 'Floor lamp, brass', emoji: '💡', price: 649000 },
  { id: 'nord-bed', name: 'NORD', desc: 'Bed frame, oak veneer, 160x200 cm', emoji: '🛏️', price: 3299000 },
  { id: 'vera-plant', name: 'VERA', desc: 'Plant pot, terracotta, 24 cm', emoji: '🪴', price: 149000 },
];

export const fmLowerPrice = [
  { id: 'kasa-side-table', name: 'KASA', desc: 'Side table, black', emoji: '🪵', price: 199000, was: 299000, tag: 'Lower price' },
  { id: 'mira-cushion', name: 'MIRA', desc: 'Cushion cover, 50x50 cm', emoji: '🟫', price: 49000, was: 79000, tag: 'Lower price' },
  { id: 'tove-rug', name: 'TOVE', desc: 'Rug, low pile, 133x195 cm', emoji: '🧶', price: 599000, was: 799000, tag: 'Lower price' },
  { id: 'arne-mirror', name: 'ARNE', desc: 'Mirror, 60 cm', emoji: '🪞', price: 349000, was: 449000, tag: 'Lower price' },
  { id: 'saga-throw', name: 'SAGA', desc: 'Throw, grey, 120x160 cm', emoji: '🧣', price: 129000, was: 179000, tag: 'Lower price' },
];

export const sofaTypes = [
  { id: 'all', name: 'All' },
  { id: 'sofa', name: 'Sofas', emoji: '🛋️' },
  { id: 'armchair', name: 'Armchairs', emoji: '🪑' },
  { id: 'sofa-bed', name: 'Sofa-beds', emoji: '🛏️' },
  { id: 'footstool', name: 'Footstools & pouffes', emoji: '🟤' },
];

export const sofaProducts = [
  { id: 'linnea-2-seat', type: 'sofa', name: 'LINNEA', desc: '2-seat sofa, beige', emoji: '🛋️', price: 3499000, was: 4999000, tag: 'Lower price', rating: 4.6, reviews: 312 },
  { id: 'linnea-3-seat', type: 'sofa', name: 'LINNEA', desc: '3-seat sofa, beige', emoji: '🛋️', price: 4999000, tag: 'Best seller', rating: 4.7, reviews: 845 },
  { id: 'holm-corner', type: 'sofa', name: 'HOLM', desc: 'Corner sofa, 4-seat, grey', emoji: '🛋️', price: 7999000, was: 10999000, tag: 'Lower price', rating: 4.4, reviews: 127 },
  { id: 'mats-modular', type: 'sofa', name: 'MATS', desc: 'Modular sofa, 3-seat, dark grey', emoji: '🛋️', price: 6499000, tag: 'New', rating: 4.5, reviews: 38 },
  { id: 'storm-chaise', type: 'sofa', name: 'STORM', desc: 'Chaise longue, light grey', emoji: '🛋️', price: 3999000, rating: 4.3, reviews: 96 },
  { id: 'otto-armchair', type: 'armchair', name: 'OTTO', desc: 'Armchair, dark green', emoji: '🪑', price: 1399000, was: 1799000, tag: 'Lower price', rating: 4.8, reviews: 530 },
  { id: 'elsa-armchair', type: 'armchair', name: 'ELSA', desc: 'Rocking armchair, birch', emoji: '🪑', price: 1299000, tag: 'Best seller', rating: 4.7, reviews: 1204 },
  { id: 'nils-wing', type: 'armchair', name: 'NILS', desc: 'Wing chair, blue', emoji: '💺', price: 2199000, rating: 4.5, reviews: 211 },
  { id: 'fjell-sofa-bed', type: 'sofa-bed', name: 'FJELL', desc: '3-seat sofa-bed, blue', emoji: '🛏️', price: 5499000, was: 6999000, tag: 'Lower price', rating: 4.2, reviews: 174 },
  { id: 'dag-sofa-bed', type: 'sofa-bed', name: 'DAG', desc: '2-seat sofa-bed, grey', emoji: '🛏️', price: 3299000, rating: 4.1, reviews: 88 },
  { id: 'rune-footstool', type: 'footstool', name: 'RUNE', desc: 'Footstool, rattan', emoji: '🪵', price: 399000, was: 549000, tag: 'Lower price', rating: 4.6, reviews: 143 },
  { id: 'pia-pouffe', type: 'footstool', name: 'PIA', desc: 'Pouffe, natural', emoji: '🟤', price: 299000, rating: 4.4, reviews: 302 },
];
