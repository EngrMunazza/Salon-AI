import ServiceCard from '@/components/ServiceCard';
import { services, promotions } from '@/data/services';

const categories = ['Hair', 'Skin', 'Nails', 'Eyebrows & Lashes', 'Makeup', 'Bridal', 'Hand & Foot Spa'] as const;

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-4">Menu</p>
      <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-4">Services &amp; pricing</h1>
      <p className="text-espresso/70 max-w-xl mb-6">
        Every price includes consultation time with your stylist. Tap "Book via chat" on any service, or ask the
        assistant to price out a combination.
      </p>

      {promotions.length > 0 && (
        <div className="rounded-2xl bg-espresso text-blush p-6 mb-14 flex flex-wrap gap-x-8 gap-y-2">
          {promotions.map((p) => (
            <p key={p} className="text-sm">
              <span className="text-gold-light mr-2">✦</span>
              {p}
            </p>
          ))}
        </div>
      )}

      {categories.map((cat) => {
        const items = services.filter((s) => s.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-14">
            <h2 className="font-display text-2xl text-espresso mb-6">{cat}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
