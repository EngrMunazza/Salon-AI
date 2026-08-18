import ServiceCard from '@/components/ServiceCard';
import { services, discounts } from '@/data/services';

const categories = ['Hair', 'Skin', 'Nails'] as const;

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-4">Menu</p>
      <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-4">Services &amp; pricing</h1>
      <p className="text-espresso/70 max-w-xl mb-12">
        Every price includes consultation time with your stylist. Ask the chat assistant if you'd like a
        combination priced out.
      </p>

      {categories.map((cat) => {
        const items = services.filter((s) => s.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-14">
            <h2 className="font-display text-2xl text-espresso mb-6">{cat}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((s, i) => (
                <ServiceCard key={s.name} service={s} index={i} />
              ))}
            </div>
          </div>
        );
      })}

      {discounts.length > 0 && (
        <div className="rounded-2xl bg-espresso text-blush p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-light mb-3">Current offer</p>
          {discounts.map((d) => (
            <p key={d.name} className="text-lg">
              <span className="font-display italic mr-2">{d.name}</span>
              {d.description}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
