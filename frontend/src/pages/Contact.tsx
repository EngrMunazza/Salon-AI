import { salonInfo } from '@/data/salonInfo';
import { useChat } from '@/context/ChatContext';

export default function Contact() {
  const days = Object.entries(salonInfo.timings);
  const { setIsOpen } = useChat();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-4">Visit us</p>
      <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-12">Visit &amp; contact</h1>

      <div className="grid sm:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="font-display text-xl text-espresso mb-5">Opening hours</h2>
          <dl className="divide-y divide-line">
            {days.map(([day, hours]) => (
              <div key={day} className="flex justify-between py-2.5 text-sm">
                <dt className="text-espresso/70">{day}</dt>
                <dd className="text-espresso">{hours}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="font-display text-xl text-espresso mb-5">Find us</h2>
          <p className="text-sm text-espresso/70 mb-4 leading-relaxed">{salonInfo.address}</p>
          <a
            href={salonInfo.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-espresso/20 px-6 py-2.5 text-sm hover:border-rose hover:text-rose-dark transition-colors mb-8"
          >
            Open in Maps
          </a>

          <h2 className="font-display text-xl text-espresso mb-3">Contact</h2>
          <p className="text-sm text-espresso/70 mb-1">{salonInfo.phone}</p>
          <a
            href={`https://wa.me/${salonInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline decoration-rose underline-offset-4 text-rose-dark"
          >
            Message us on WhatsApp
          </a>
        </div>
      </div>

      <div className="rounded-2xl bg-espresso text-blush p-8 text-center">
        <h2 className="font-display text-2xl mb-2">Fastest way to book</h2>
        <p className="text-blush/70 text-sm mb-6 max-w-md mx-auto">
          Skip the back-and-forth — tell our chat assistant the service, date and time, and it checks
          availability and confirms your slot right away.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-rose text-blush px-7 py-3 text-sm tracking-wide hover:bg-rose-dark transition-colors"
        >
          Book via chat
        </button>
      </div>
    </div>
  );
}
