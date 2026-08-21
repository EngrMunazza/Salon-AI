import { Link } from 'react-router-dom';
import ArchFrame from '@/components/ArchFrame';
import ServiceCard from '@/components/ServiceCard';
import { services, promotions } from '@/data/services';
import { salonInfo } from '@/data/salonInfo';
import { heroImage } from '@/data/images';
import { useChat } from '@/context/ChatContext';

export default function Home() {
  const featured = services.slice(0, 3);
  const { setIsOpen } = useChat();

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
            {salonInfo.name} is a chair-side studio for hair, skin, nails, brows and bridal looks — with a chat
            assistant that checks availability and books your slot instantly, in English, Urdu or Roman Urdu.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-full bg-espresso text-blush px-7 py-3 text-sm tracking-wide hover:bg-rose-dark transition-colors"
            >
              Book via chat
            </button>
            <Link
              to="/services"
              className="rounded-full border border-espresso/20 text-espresso px-7 py-3 text-sm tracking-wide hover:border-rose hover:text-rose-dark transition-colors"
            >
              View services &amp; prices
            </Link>
          </div>
        </div>

        <div className="relative h-[420px] hidden md:block animate-rise" style={{ animationDelay: '0.15s' }}>
          <ArchFrame className="h-full" imageUrl={heroImage} />
        </div>

        <div className="md:hidden -mx-6 animate-rise" style={{ animationDelay: '0.15s' }}>
          <img
            src={heroImage}
            alt={`Inside ${salonInfo.name}`}
            width={900}
            height={500}
            loading="eager"
            decoding="async"
            className="w-full h-56 object-cover"
          />
        </div>
      </section>

      <div className="scallop-divider" aria-hidden="true" />

      {promotions.length > 0 && (
        <section className="bg-espresso text-blush">
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
            {promotions.map((p) => (
              <p key={p} className="text-sm">
                <span className="text-gold-light mr-2">✦</span>
                {p}
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
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>

      <div className="scallop-divider" aria-hidden="true" />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            to="/gallery"
            className="group rounded-2xl bg-gradient-to-br from-rose-light to-rose p-8 flex flex-col justify-end h-56 hover:opacity-95 transition-opacity"
          >
            <span className="font-display text-2xl text-blush mb-1">Gallery</span>
            <span className="text-sm text-blush/80">See our recent work</span>
          </Link>
          <Link
            to="/team"
            className="group rounded-2xl bg-gradient-to-br from-gold-light to-gold p-8 flex flex-col justify-end h-56 hover:opacity-95 transition-opacity"
          >
            <span className="font-display text-2xl text-blush mb-1">Team</span>
            <span className="text-sm text-blush/80">Meet the specialists</span>
          </Link>
          <Link
            to="/reviews"
            className="group rounded-2xl bg-gradient-to-br from-rose-dark to-gold p-8 flex flex-col justify-end h-56 hover:opacity-95 transition-opacity"
          >
            <span className="font-display text-2xl text-blush mb-1">Reviews</span>
            <span className="text-sm text-blush/80">Hear from our clients</span>
          </Link>
          <Link
            to="/faq"
            className="group rounded-2xl bg-gradient-to-br from-espresso to-rose-dark p-8 flex flex-col justify-end h-56 hover:opacity-95 transition-opacity"
          >
            <span className="font-display text-2xl text-blush mb-1">FAQ</span>
            <span className="text-sm text-blush/80">Booking, pricing &amp; more</span>
          </Link>
        </div>
      </section>

      <div className="scallop-divider" aria-hidden="true" />

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl text-espresso mb-4">Booking is just a message away</h2>
        <p className="text-espresso/70 max-w-lg mx-auto mb-2">
          Tap the chat bubble in the corner and say what you'd like, e.g. "book a haircut tomorrow at 3pm" — the
          assistant checks the slot and confirms it on the spot.
        </p>
        <p className="text-espresso/50 text-sm">Aap Urdu ya Roman Urdu mein bhi likh sakte hain.</p>
      </section>
    </>
  );
}