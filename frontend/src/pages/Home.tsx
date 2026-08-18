import { Link } from 'react-router-dom';
import ArchFrame from '@/components/ArchFrame';
import ServiceCard from '@/components/ServiceCard';
import { services, discounts } from '@/data/services';
import { salonInfo } from '@/data/salonInfo';

export default function Home() {
  const featured = services.slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-rise">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-5">Hair · Skin · Nails — Lahore</p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-espresso mb-6">
            Look after
            <br />
            <span className="italic text-rose-dark">yourself</span>, beautifully.
          </h1>
          <p className="text-base text-espresso/70 max-w-md leading-relaxed mb-8">
            {salonInfo.name} is a chair-side studio for haircuts, styling, facials and nail care — with a chat
            assistant that answers in English, Urdu or Roman Urdu, day or night.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/services"
              className="rounded-full bg-espresso text-blush px-7 py-3 text-sm tracking-wide hover:bg-rose-dark transition-colors"
            >
              View services &amp; prices
            </Link>
            <a
              href={`https://wa.me/${salonInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-espresso/20 text-espresso px-7 py-3 text-sm tracking-wide hover:border-rose hover:text-rose-dark transition-colors"
            >
              Book on WhatsApp
            </a>
          </div>
        </div>

        <div className="relative h-[420px] hidden md:block animate-rise" style={{ animationDelay: '0.15s' }}>
          <ArchFrame className="h-full" />
        </div>
      </section>

      <div className="scallop-divider" aria-hidden="true" />

      {discounts.length > 0 && (
        <section className="bg-espresso text-blush">
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-center gap-3 text-center">
            {discounts.map((d) => (
              <p key={d.name} className="text-sm">
                <span className="font-display italic text-gold-light mr-2">{d.name}</span>
                {d.description}
              </p>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl text-espresso">Signature services</h2>
          <Link to="/services" className="text-sm underline decoration-rose underline-offset-4 text-espresso/70 hover:text-rose-dark">
            See full menu
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((s, i) => (
            <ServiceCard key={s.name} service={s} index={i} />
          ))}
        </div>
      </section>

      <div className="scallop-divider" aria-hidden="true" />

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl text-espresso mb-4">Not sure what you need?</h2>
        <p className="text-espresso/70 max-w-lg mx-auto mb-2">
          Tap the chat bubble in the corner — ask about a service, a price, or today's hours, in whichever
          language is easiest for you.
        </p>
        <p className="text-espresso/50 text-sm">Aap Urdu ya Roman Urdu mein bhi likh sakte hain.</p>
      </section>
    </>
  );
}
