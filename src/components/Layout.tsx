import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/sites", label: "Sites" },
  { href: "/config", label: "Config" },
  { href: "/certificates", label: "Certificates" },
  { href: "/logs", label: "Logs" },
];

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <nav aria-label="Main">
        <ul className="unstyled hstack" style={{ gap: "1rem", listStyle: "none" }}>
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className="unstyled">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main>{children}</main>
    </>
  );
}
