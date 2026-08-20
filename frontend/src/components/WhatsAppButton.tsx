import { salonInfo } from '@/data/salonInfo';

// Official-style WhatsApp green (#25D366), separate from the site's chat
// widget — this opens a real WhatsApp conversation, the chat widget talks
// to our own booking assistant.
export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${salonInfo.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-soft flex items-center justify-center hover:bg-[#1EBE5A] transition-colors"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.362.687 4.564 1.874 6.418L4 29l7.77-1.84A11.93 11.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3Zm0 21.75c-1.94 0-3.75-.54-5.29-1.47l-.38-.23-4.61 1.09 1.12-4.5-.25-.4A9.71 9.71 0 0 1 5.25 15c0-5.93 4.82-10.75 10.75-10.75S26.75 9.07 26.75 15 21.93 24.75 16 24.75Zm5.94-8.06c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.51-.16-.72.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.34-.5-2.55-1.6-.94-.85-1.58-1.9-1.76-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.56.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.72-1.75-.99-2.4-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67 0 1.58 1.15 3.1 1.31 3.32.16.21 2.26 3.46 5.48 4.85.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}
