import { useState } from 'react';
import { galleryImages } from '@/data/images';

function GalleryTile({ label, url, priority }: { label: string; url: string; priority: boolean }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-rose/10 flex items-center justify-center">
        <span className="text-xs text-rose-dark/60">Photo coming soon</span>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-line/40 aspect-[3/4]">
      <img
        src={url}
        alt={label}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setBroken(true)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default function Gallery() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-4">Our work</p>
      <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-4">Gallery</h1>
      <p className="text-espresso/70 max-w-xl mb-12">
        A look at recent work across the salon.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {galleryImages.map((img, i) => (
          <GalleryTile key={img.label} label={img.label} url={img.url} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
