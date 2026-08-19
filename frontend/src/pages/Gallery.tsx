const tiles = [
  { label: 'Hair styling', tone: 'from-rose-light to-rose' },
  { label: 'Bridal look', tone: 'from-gold-light to-gold' },
  { label: 'Facial treatment', tone: 'from-rose to-espresso' },
  { label: 'Nail art', tone: 'from-gold to-rose-dark' },
  { label: 'Hair coloring', tone: 'from-rose-dark to-espresso' },
  { label: 'Party makeup', tone: 'from-gold-light to-rose' },
  { label: 'Before & after', tone: 'from-espresso to-rose-dark' },
  { label: 'Salon interior', tone: 'from-rose-light to-gold' },
];

export default function Gallery() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-4">Our work</p>
      <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-4">Gallery</h1>
      <p className="text-espresso/70 max-w-xl mb-12">
        A look at recent work across the salon. Photos below are placeholders — swap in real shots from your
        stylists whenever you're ready.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t, i) => (
          <div
            key={t.label}
            className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${t.tone} flex items-end p-4 ${
              i % 5 === 0 ? 'sm:row-span-2 sm:aspect-auto' : ''
            }`}
          >
            <span className="text-blush text-sm font-display italic bg-espresso/30 backdrop-blur-sm rounded-full px-3 py-1">
              {t.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
