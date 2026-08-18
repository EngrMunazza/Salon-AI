import { salonInfo } from '@/data/salonInfo';

export default function Footer() {
  return (
    <footer className="bg-espresso text-blush/90">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl mb-3">{salonInfo.name}</p>
          <p className="text-sm text-blush/70 leading-relaxed">{salonInfo.tagline}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gold-light mb-3">Visit</p>
          <p className="text-sm text-blush/80 leading-relaxed">{salonInfo.address}</p>
          <a
            href={salonInfo.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline decoration-gold underline-offset-4 hover:text-gold-light"
          >
            Get directions
          </a>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gold-light mb-3">Reach us</p>
          <p className="text-sm text-blush/80">{salonInfo.phone}</p>
          <a
            href={`https://wa.me/${salonInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline decoration-gold underline-offset-4 hover:text-gold-light"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-blush/10 py-5 text-center text-xs text-blush/50">
        © {new Date().getFullYear()} {salonInfo.name}. All rights reserved.
      </div>
    </footer>
  );
}
