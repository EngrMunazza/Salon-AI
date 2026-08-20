import { salonInfo } from '@/data/salonInfo';

type IconLinkProps = { href: string; label: string; children: React.ReactNode };

function IconLink({ href, label, children }: IconLinkProps) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      aria-label={label}
      className="h-9 w-9 rounded-full border border-current/20 flex items-center justify-center hover:border-current transition-colors"
    >
      {children}
    </a>
  );
}

export default function SocialIcons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <IconLink href={salonInfo.social.instagram} label="Instagram">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </svg>
      </IconLink>

      <IconLink href={salonInfo.social.facebook} label="Facebook">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14 9h2.5V6h-2.5c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.5l.5-3H13v-2c0-.6.4-1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </IconLink>

      <IconLink href={salonInfo.social.twitter} label="Twitter / X">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4 L20 20 M20 4 L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </IconLink>

      <IconLink href={`mailto:${salonInfo.email}`} label="Email">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 6.5 L12 13 L20 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </IconLink>
    </div>
  );
}
