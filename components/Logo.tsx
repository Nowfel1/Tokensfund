interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

/**
 * TokensFund mark — "refined T".
 *
 * Design notes (kept deliberately, so the mark doesn't drift back):
 *  - TWO colours only: gold (brand accent) for the T, green for the side
 *    routes. The previous version used four, which turned to noise at the
 *    34px size the header actually renders.
 *  - FOUR shapes. Anything more is invisible below ~32px.
 *  - No sub-40% opacity elements: they vanish entirely when small.
 *  - The T is one continuous gold form (bar + stem share a colour), so it
 *    reads as a single letter rather than two stacked bars.
 */
export default function Logo({ size = 36, showWordmark = false }: LogoProps) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="tokensfund"
      >
        {/* background */}
        <rect width="80" height="80" rx="20" fill="#121931" />
        {/* the T — one solid gold form */}
        <rect x="16" y="18" width="48" height="12" rx="4" fill="#f4c64e" />
        <rect x="34" y="18" width="12" height="46" rx="4" fill="#f4c64e" />
        {/* side routes */}
        <rect x="16" y="38" width="14" height="8" rx="3" fill="#5fd6a6" />
        <rect x="50" y="38" width="14" height="8" rx="3" fill="#5fd6a6" />
      </svg>
      {showWordmark && (
        <span
          style={{
            fontWeight: 800,
            fontSize: size * 0.56,
            letterSpacing: "-0.03em",
            color: "#e9edfa",
            lineHeight: 1,
          }}
        >
          tokensfund
          <span style={{ color: "#5d678c", fontWeight: 400 }}>.xyz</span>
        </span>
      )}
    </span>
  );
}
