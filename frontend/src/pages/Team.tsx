const roles = [
  { title: 'Senior Hair Stylist', specialties: ['Haircuts', 'Styling', 'Keratin treatments'] },
  { title: 'Colour Specialist', specialties: ['Hair coloring', 'Highlights', 'Balayage'] },
  { title: 'Skin & Facial Specialist', specialties: ['Facials', 'Clean-ups', 'Skin consultations'] },
  { title: 'Nail Technician', specialties: ['Manicure', 'Pedicure', 'Nail extensions'] },
  { title: 'Brow & Lash Artist', specialties: ['Threading', 'Lash extensions', 'Brow shaping'] },
  { title: 'Bridal & Makeup Artist', specialties: ['Bridal packages', 'Party makeup', 'Trials'] },
];

function Avatar({ letter }: { letter: string }) {
  return (
    <div className="h-20 w-20 rounded-full bg-rose/15 border border-rose/30 flex items-center justify-center mb-5">
      <span className="font-display text-2xl italic text-rose-dark">{letter}</span>
    </div>
  );
}

export default function Team() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-4">The team</p>
      <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-4">Who you'll meet in the chair</h1>
      <p className="text-espresso/70 max-w-xl mb-12">
        Every specialist trains across their area continually — ask the chat assistant to match you with the
        right person for a service.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((r) => (
          <div key={r.title} className="rounded-2xl border border-line bg-white p-6">
            <Avatar letter={r.title[0]} />
            <h3 className="font-display text-xl text-espresso mb-3">{r.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {r.specialties.map((s) => (
                <li key={s} className="text-xs text-espresso/70 bg-blush border border-line rounded-full px-3 py-1">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-xs text-espresso/40 mt-10">
        Team photos and names coming soon — placeholders shown until real profiles are added.
      </p>
    </div>
  );
}
