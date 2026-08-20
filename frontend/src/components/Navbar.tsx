import { Link } from 'react-router-dom';
import { useState } from 'react';
import { salonInfo } from '@/data/salonInfo';
import { useChat } from '@/context/ChatContext';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/team', label: 'Team' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Visit & Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { setIsOpen } = useChat();

  return (
    <header className="sticky top-0 z-40 bg-blush/90 backdrop-blur border-b border-line">
      <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-2xl tracking-tight text-espresso shrink-0">
          {salonInfo.name}
        </Link>

        <div className="hidden xl:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm uppercase tracking-[0.1em] text-espresso/80 hover:text-rose-dark transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="hidden xl:inline-block rounded-full bg-espresso text-blush px-5 py-2 text-sm tracking-wide hover:bg-rose-dark transition-colors shrink-0"
        >
          Book via chat
        </button>

        <button
          className="xl:hidden text-espresso"
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
        <div className="xl:hidden border-t border-line px-6 py-4 flex flex-col gap-4 bg-blush">
          {links.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="text-espresso text-base">
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              setIsOpen(true);
            }}
            className="rounded-full bg-espresso text-blush px-5 py-2 text-sm text-center"
          >
            Book via chat
          </button>
        </div>
      )}
    </header>
  );
}
