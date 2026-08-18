// Mirrors app/data/services.json in the backend.
// Keep these two files in sync until the backend exposes GET /services.

export type Service = {
  name: string;
  price: number;
  duration: string;
  category: 'Hair' | 'Skin' | 'Nails';
};

export const services: Service[] = [
  { name: 'Haircut', price: 1500, duration: '45 minutes', category: 'Hair' },
  { name: 'Hair Styling', price: 2000, duration: '60 minutes', category: 'Hair' },
  { name: 'Facial', price: 2500, duration: '60 minutes', category: 'Skin' },
  { name: 'Manicure', price: 1500, duration: '45 minutes', category: 'Nails' },
  { name: 'Pedicure', price: 1800, duration: '60 minutes', category: 'Nails' },
];

export const discounts = [
  { name: 'Weekend Offer', description: '10% off selected services on weekends' },
];

export function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}
