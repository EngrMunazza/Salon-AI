// Mirrors app/data/salon_info.json in the backend.
// Edit here for now; once the backend exposes GET /salon-info, replace
// this static object with a fetch call (see lib/api.ts).

export const salonInfo = {
  name: 'Beauty Salon',
  tagline: 'Look after yourself, beautifully.',
  address: '123 Main Street, Lahore, Pakistan',
  mapUrl: 'https://maps.google.com',
  phone: '+92 300 1234567',
  whatsapp: '+923001234567', // digits only, no + or spaces, for wa.me links
  timings: {
    Monday: '10:00 AM – 8:00 PM',
    Tuesday: '10:00 AM – 8:00 PM',
    Wednesday: '10:00 AM – 8:00 PM',
    Thursday: '10:00 AM – 8:00 PM',
    Friday: '10:00 AM – 8:00 PM',
    Saturday: '10:00 AM – 9:00 PM',
    Sunday: '12:00 PM – 8:00 PM',
  },
};
