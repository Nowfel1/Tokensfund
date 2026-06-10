interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

export default function Logo({ size = 36, showWordmark = false }: LogoProps) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="tokensfund"
      >
        {/* background */}
        <rect width="80" height="80" rx="20" fill="#121931"/>
        {/* violet top bar */}
        <rect x="14" y="16" width="52" height="11" rx="3.5" fill="#8b8cf0"/>
        {/* gold vertical stem — sits on top of bar */}
        <rect x="34" y="16" width="12" height="50" rx="3.5" fill="#f4c64e"/>
        {/* green mid streams */}
        <rect x="14" y="33" width="20" height="7" rx="2.5" fill="#5fd6a6"/>
        <rect x="46" y="33" width="20" height="7" rx="2.5" fill="#5fd6a6"/>
        {/* faint violet lower echoes */}
        <rect x="14" y="47" width="14" height="5" rx="2" fill="#8b8cf0" opacity="0.35"/>
        <rect x="52" y="47" width="14" height="5" rx="2" fill="#8b8cf0" opacity="0.35"/>
      </svg>
      {showWordmark && (
        <span style={{
          fontWeight: 800,
          fontSize: size * 0.56,
          letterSpacing: "-0.03em",
          color: "#e9edfa",
          lineHeight: 1,
        }}>
          tokensfund
          <span style={{ color: "#5d678c", fontWeight: 400 }}>.xyz</span>
        </span>
      )}
    </span>
  );
}
