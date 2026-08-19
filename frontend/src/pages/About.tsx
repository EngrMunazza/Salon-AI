import { Link } from 'react-router-dom';
import ArchFrame from '@/components/ArchFrame';
import { salonInfo } from '@/data/salonInfo';

const values = [
  {
    title: 'Consultation first',
    body: "Every service starts with a few honest minutes talking through what you actually want — not what's fastest for us.",
  },
  {
    title: 'Priced upfront',
    body: 'No surprise add-ons at the till. What you see on the services page is what you pay, discounts included.',
  },
  {
    title: 'Your language, your pace',
    body: 'Ask us anything in English, Urdu, or Roman Urdu — in person or through the chat assistant, day or night.',
  },
];

export default function About() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-5">About {salonInfo.name}</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-espresso mb-6">
            A neighbourhood studio,
            <br />
            <span className="italic text-rose-dark">run properly.</span>
          </h1>
          <p className="text-espresso/70 leading-relaxed max-w-md">
            {salonInfo.name} is a chair-side studio in Lahore covering hair, skin, nails, brows and bridal looks.
            We keep the menu honest, the pricing visible, and booking as simple as sending a message.
          </p>
        </div>
        <div className="relative h-[320px] hidden md:block">
          <ArchFrame className="h-full" />
        </div>
      </section>

      <div className="scallop-divider" aria-hidden="true" />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl text-espresso mb-10">What we care about</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line bg-white p-6">
              <h3 className="font-display text-xl text-espresso mb-3">{v.title}</h3>
              <p className="text-sm text-espresso/70 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-espresso text-blush">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-display text-3xl mb-4">Meet the team behind the chair</h2>
          <p className="text-blush/70 max-w-lg mx-auto mb-6">
            Our stylists specialise across hair, skin and bridal work — see who does what.
          </p>
          <Link
            to="/team"
            className="inline-block rounded-full border border-blush/30 px-7 py-3 text-sm tracking-wide hover:bg-blush hover:text-espresso transition-colors"
          >
            View the team
          </Link>
        </div>
      </section>
    </div>
  );
}
