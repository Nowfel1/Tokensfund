import Link from "next/link";
import Logo from "@/components/Logo";

// The site header, shared by every page. Change the menu here — once — and
// it updates everywhere. (Before this existed, each page carried its own copy
// of the header, so a single menu change meant editing 54 files.)
export default function Header({ showRoutes = false }: { showRoutes?: boolean }) {
  return (
    <header className="masthead">
      <div className="header-inner">
        <Link href="/" className="brand">
          <Logo size={34} />
          <span>tokensfund<span className="tld">.xyz</span></span>
        </Link>
        <nav className="main-nav">
          <Link href="/" className="nav-link">Swap</Link>
          <Link href="/order" className="nav-link">Order status</Link>
          <Link href="/blog" className="nav-link">Blog</Link>
          <Link href="/faq" className="nav-link">FAQ</Link>
          {showRoutes && (
            <span className="routes-pill">
              <span className="routes-pill-dot" />4 routes live
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
