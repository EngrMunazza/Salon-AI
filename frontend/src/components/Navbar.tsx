import { Link } from 'react-router-dom';
import { useState } from 'react';
import { salonInfo } from '@/data/salonInfo';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'Hours & Location' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-blush/90 backdrop-blur border-b border-line">
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-tight text-espresso">
          {salonInfo.name}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm uppercase tracking-[0.14em] text-espresso/80 hover:text-rose-dark transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${salonInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-espresso text-blush px-5 py-2 text-sm tracking-wide hover:bg-rose-dark transition-colors"
          >
            Book on WhatsApp
          </a>
        </div>

        <button
          className="md:hidden text-espresso"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6 L20 20 M20 6 L6 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 8 H22 M4 13 H22 M4 18 H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-line px-6 py-4 flex flex-col gap-4 bg-blush">
          {links.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="text-espresso text-base">
              {l.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${salonInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-espresso text-blush px-5 py-2 text-sm text-center"
          >
            Book on WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
