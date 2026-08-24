// Mirrors app/data/staff.json in the backend. Keep in sync until the
// backend exposes GET /staff.
//
// `role` is a display-friendly title derived from specialties — the
// backend only stores specialties, not a job title, so this mapping lives
// here on the frontend.

export type StaffMember = {
  id: string;
  name: string;
  specialties: string[];
  role: string;
};

export const staff: StaffMember[] = [
  { id: 'stf_001', name: 'Zahra', specialties: ['Hair'], role: 'Hair Stylist' },
  { id: 'stf_002', name: 'Rosey', specialties: ['Skin'], role: 'Skin & Facial Specialist' },
  { id: 'stf_003', name: 'Hina', specialties: ['Bridal'], role: 'Bridal Artist' },
  { id: 'stf_004', name: 'Mariam', specialties: ['Nails'], role: 'Nail Technician' },
  { id: 'stf_005', name: 'Sana', specialties: ['Hand & Foot Spa'], role: 'Hand & Foot Spa Specialist' },
  { id: 'stf_006', name: 'Amna', specialties: ['Makeup'], role: 'Makeup Artist' },
  { id: 'stf_007', name: 'Bushra', specialties: ['Eyebrows & Lashes'], role: 'Brow & Lash Artist' },
];