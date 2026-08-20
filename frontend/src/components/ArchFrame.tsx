// The salon's signature shape: a vanity-mirror arch ringed with bulb marks.
// Reused across the hero, service cards, and the chat widget header so the
// whole site reads as one idea rather than a stock template.
//
// Pass `imageUrl` to clip a real photo into the arch (used in the Home
// hero); omit it to fall back to the original gradient glow.

export default function ArchFrame({
  className = '',
  imageUrl,
}: {
  className?: string;
  imageUrl?: string;
}) {
  const bulbs = Array.from({ length: 11 });
  const archPath = 'M20 460 V180 C20 80 100 20 200 20 C300 20 380 80 380 180 V460';

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 400 460" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="archGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E3ABA8" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#C97B84" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#B98B4E" stopOpacity="0.35" />
          </linearGradient>
          {imageUrl && (
            <clipPath id="archClip">
              <path d={archPath} />
            </clipPath>
          )}
        </defs>

        {imageUrl ? (
          <image
            href={imageUrl}
            x="0"
            y="0"
            width="400"
            height="460"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#archClip)"
          />
        ) : (
          <path d={archPath} fill="url(#archGlow)" />
        )}

        {bulbs.map((_, i) => {
          const t = i / (bulbs.length - 1);
          const angle = Math.PI * (1 - t);
          const cx = 200 - 180 * Math.cos(angle);
          const cy = 200 - 180 * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={cx}
              cy={Math.min(cy, 200)}
              r="6"
              fill="#FBF3EF"
              className="animate-glow"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
