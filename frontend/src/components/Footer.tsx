import { Link } from 'react-router-dom';
import { salonInfo } from '@/data/salonInfo';
import SocialIcons from '@/components/SocialIcons';

const quickLinks = [
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/team', label: 'Team' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Visit & Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-espresso text-blush/90">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-2xl mb-3">{salonInfo.name}</p>
          <p className="text-sm text-blush/70 leading-relaxed max-w-xs mb-5">{salonInfo.tagline}</p>
          <SocialIcons className="text-blush/70" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gold-light mb-3">Explore</p>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="text-sm text-blush/80 hover:text-gold-light transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gold-light mb-3">Reach us</p>
          <p className="text-sm text-blush/80 mb-1">{salonInfo.address}</p>
          <p className="text-sm text-blush/80 mb-2">{salonInfo.phone}</p>
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
