import { type Service, formatPKR } from '@/data/services';

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <div className="group relative rounded-2xl border border-line bg-white p-6 hover:border-rose transition-colors">
      <p className="text-xs uppercase tracking-[0.16em] text-rose-dark mb-3">{service.category}</p>
      <h3 className="font-display text-2xl text-espresso mb-2">{service.name}</h3>
      <p className="text-sm text-espresso/60 mb-5">{service.duration}</p>
      <div className="flex items-end justify-between">
        <span className="font-display text-xl text-espresso">{formatPKR(service.price)}</span>
        <span className="text-2xl text-line group-hover:text-rose transition-colors font-display">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
