const faqs = [
  {
    q: 'How do I book an appointment?',
    a: 'Tap the chat bubble and just say what you want — e.g. "book a haircut tomorrow at 3pm, my name is Ayesha, phone 03001234567." The assistant checks availability and confirms your slot with a booking ID right away.',
  },
  {
    q: "What if my preferred time isn't available?",
    a: "The assistant will say so and suggest the nearest open times on that day, so you're not stuck guessing.",
  },
  {
    q: 'What languages can I use with the chat assistant?',
    a: 'English, Urdu script, or Roman Urdu — it detects your language automatically and replies in kind.',
  },
  {
    q: 'Can I cancel or reschedule a booking?',
    a: 'Yes — just tell the chat assistant, e.g. "reschedule my appointment, phone 03001234567" or "cancel my booking." It looks up your active bookings by phone number and handles it on the spot.',
  },
  {
    q: 'Can I request a specific stylist?',
    a: 'Yes — mention their name when booking (see our Team page for who specialises in what), or just tell the assistant what you need and it can suggest the right person.',
  },
  {
    q: 'Are the prices on the services page final?',
    a: 'Yes — what you see is what you pay, including any listed discounts. No hidden charges at checkout.',
  },
  {
    q: 'Do you have a WhatsApp bot?',
    a: "Not yet — booking currently happens through the chat assistant on this website. WhatsApp booking is on our roadmap; for now you can message us on WhatsApp to talk to a person directly.",
  },
];

export default function FAQ() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-4">Good to know</p>
      <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-12">Frequently asked questions</h1>

      <div className="divide-y divide-line">
        {faqs.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-display text-lg text-espresso pr-4">{item.q}</span>
              <span className="text-rose-dark text-xl leading-none group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-sm text-espresso/70 leading-relaxed mt-3">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
