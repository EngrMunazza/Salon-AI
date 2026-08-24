import { useState } from 'react';
import { type Service, formatPKR, formatDuration } from '@/data/services';
import { serviceImages } from '@/data/images';
import { useChat } from '@/context/ChatContext';

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { openWithMessage } = useChat();
  const image = serviceImages[service.id];
  const [broken, setBroken] = useState(false);

  return (
    <div className="group relative rounded-2xl border border-line bg-white overflow-hidden hover:border-rose transition-colors flex flex-col">
      {image && !broken && (
        <div className="h-36 bg-line/40 overflow-hidden">
          <img
            src={image}
            alt={service.name}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs uppercase tracking-[0.16em] text-rose-dark mb-3">{service.category}</p>
        <h3 className="font-display text-2xl text-espresso mb-2">{service.name}</h3>
        <p className="text-sm text-espresso/60 mb-1">{formatDuration(service.duration_minutes)}</p>
        {service.discount && (
          <p className="text-xs text-gold-dark bg-gold-light/30 inline-block rounded-full px-3 py-1 w-fit mb-3 mt-2">
            {service.discount}
          </p>
        )}

        <div className="flex items-end justify-between mt-auto pt-4">
          <span className="font-display text-xl text-espresso">{formatPKR(service.price)}</span>
          <span className="text-2xl text-line group-hover:text-rose transition-colors font-display">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <button
          onClick={() => openWithMessage(`I'd like to book "${service.name}"`)}
          className="mt-4 w-full rounded-full border border-espresso/15 text-espresso text-sm py-2 hover:bg-espresso hover:text-blush transition-colors"
        >
          Book via chat
        </button>
      </div>
    </div>
  );
}
