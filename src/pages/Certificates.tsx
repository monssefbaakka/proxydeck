import { useEffect, useState } from "react";

interface CertInfo {
  domain: string;
  issuer?: string;
  expiry?: string;
}

export function Certificates() {
  const [certs, setCerts] = useState<CertInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then((data) => setCerts(Array.isArray(data) ? data : []))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <article className="card">
      <header>
        <h2>Certificates</h2>
        <p>TLS certificates (read-only). ACME certs are managed when you add sites with TLS.</p>
      </header>
      {certs.length === 0 ? (
        <p>No certificate data available. Enable TLS on a site to request ACME certs.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Issuer</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c, i) => (
              <tr key={i}>
                <td>{c.domain}</td>
                <td>{c.issuer ?? "—"}</td>
                <td>{c.expiry ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
}
