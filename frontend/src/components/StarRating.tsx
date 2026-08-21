function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M12 3.5 L14.6 9 L20.7 9.8 L16.3 13.9 L17.5 20 L12 17 L6.5 20 L7.7 13.9 L3.3 9.8 L9.4 9 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type StarRatingProps = {
  value: number;
  size?: number;
  className?: string;
  /** Pass to make it an interactive picker; omit for read-only display. */
  onChange?: (rating: number) => void;
};

export default function StarRating({ value, size = 18, className = '', onChange }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = !!onChange;

  return (
    <div className={`flex items-center gap-0.5 text-gold ${className}`} role={interactive ? 'radiogroup' : undefined}>
      {stars.map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => onChange(n)}
            className="hover:scale-110 transition-transform"
          >
            <Star filled={n <= value} size={size} />
          </button>
        ) : (
          <Star key={n} filled={n <= Math.round(value)} size={size} />
        ),
      )}
    </div>
  );
}