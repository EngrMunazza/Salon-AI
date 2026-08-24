// Real photos, served from public/images/ (Vite serves everything in
// public/ from the site root, so public/images/hero.jpg becomes /images/hero.jpg).
//
// To swap any photo later: replace the file in public/images/ (keep the
// same filename), or change the path here to point at a new filename.

export const heroImage = '/images/hero.jpg';
export const aboutImage = '/images/about.jpg';

// One photo per service (matches data/services.ts service ids).
export const serviceImages: Record<string, string> = {
  svc_001: '/images/services/haircut-styling.jpg',
  svc_002: '/images/services/hair-wash-blowdry.jpg',
  svc_003: '/images/services/hair-coloring.jpg',
  svc_004: '/images/services/hair-straightening-keratin.jpg',
  svc_005: '/images/services/hair-spa-treatment.jpg',
  svc_006: '/images/services/facial-classic.jpg',
  svc_007: '/images/services/facial-whitening.jpg',
  svc_008: '/images/services/facial-gold.jpg',
  svc_009: '/images/services/clean-up.jpg',
  svc_010: '/images/services/manicure.jpg',
  svc_011: '/images/services/pedicure.jpg',
  svc_012: '/images/services/manicure-pedicure-combo.jpg',
  svc_013: '/images/services/nail-extensions.jpg',
  svc_014: '/images/services/eyebrow-threading.jpg',
  svc_015: '/images/services/eyelash-extensions.jpg',
  svc_016: '/images/services/party-makeup.jpg',
  svc_017: '/images/services/bridal-makeup-package.jpg',
  svc_018: '/images/services/paraffin-wax-treatment.jpg',
};

export const galleryImages = [
  { label: 'Our work — 1', url: '/images/gallery/1.jpg' },
  { label: 'Our work — 2', url: '/images/gallery/2.jpg' },
  { label: 'Our work — 3', url: '/images/gallery/3.jpg' },
  { label: 'Our work — 4', url: '/images/gallery/4.jpg' },
  { label: 'Our work — 5', url: '/images/gallery/5.jpg' },
  { label: 'Our work — 6', url: '/images/gallery/6.jpg' },
  { label: 'Our work — 7', url: '/images/gallery/7.jpg' },
  { label: 'Our work — 8', url: '/images/gallery/8.jpg' },
];

export const teamImages: Record<string, string> = {
  Zahra: '/images/team/senior-stylist.jpg',
  Rosey: '/images/team/skin-specialist.jpg',
  Hina: '/images/team/bridal-artist.jpg',
  Mariam: '/images/team/nail-technician.jpg',
  Sana: '/images/team/colour-specialist.jpg',
  Amna: '/images/team/makeup-specialist.jpg',
  Bushra: '/images/team/brow-lash-artist.jpg',
};
