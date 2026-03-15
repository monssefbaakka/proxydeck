import { useEffect, useState } from "react";

interface ProxyStatus {
  provider: "caddy" | "traefik" | null;
}

export function Dashboard() {
  const [status, setStatus] = useState<ProxyStatus | null>(null);

  useEffect(() => {
    fetch("/api/proxy/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ provider: null }));
  }, []);

  const providerLabel = status?.provider ?? "—";
  const hasProxy = status?.provider != null;

  return (
    <article className="card">
      <header>
        <h2>Proxy status</h2>
        <p>
          Provider: <strong>{providerLabel}</strong>
        </p>
      </header>
      {hasProxy ? (
        <p>
          <a href="/sites" className="button">
            Manage sites
          </a>
        </p>
      ) : (
        <p>No Caddy or Traefik detected. Configure CADDY_ADMIN or TRAEFIK_API_URL.</p>
      )}
    </article>
  );
}
