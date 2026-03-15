import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SESSION_KEY = "pd_session";

function readStoredSession(): unknown {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return d?.user ?? d?.data ?? d ?? null;
  } catch {
    return null;
  }
}

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowSignup, setAllowSignup] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (readStoredSession()) {
      navigate("/", { replace: true });
      return;
    }
    fetch("/api/auth/get-session", { credentials: "include" })
      .then((r) => r.text())
      .then((text) => {
        const d = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;
        const session = d?.data ?? d?.session ?? d ?? null;
        if (session) navigate("/", { replace: true });
      })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, [navigate]);

  useEffect(() => {
    if (checkingSession) return;
    fetch("/api/allow-signup", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setAllowSignup(d?.allowSignup === true))
      .catch(() => setAllowSignup(false));
  }, [checkingSession]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const res = await fetch("/api/auth/sign-in/username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: (form.elements.namedItem("username") as HTMLInputElement).value,
        password: (form.elements.namedItem("password") as HTMLInputElement).value,
        callbackURL: "/",
      }),
      credentials: "include",
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const session = data?.user ?? data?.data ?? data;
      if (session) {
        try {
          sessionStorage.setItem("pd_session", JSON.stringify({ user: session }));
        } catch (_) {}
      }
      window.location.href = "/";
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data?.error?.message || "Sign in failed");
  }

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: "100vh", padding: "var(--space-6)" }}>
        <div className="card p-4" style={{ maxWidth: "24rem", width: "100%" }}>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: "100vh", padding: "var(--space-6)" }}>
      <div style={{ maxWidth: "24rem", width: "100%" }}>
        <article className="card p-4">
          <header className="mb-4">
            <h1>Sign in</h1>
            <p className="text-light">Enter your credentials to access Proxydeck.</p>
          </header>
          <form onSubmit={handleSubmit} className="vstack gap-4">
            <div data-field>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Your username"
              />
            </div>
            <div data-field>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Your password"
              />
            </div>
            {error && (
              <div role="alert" data-variant="danger">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          {allowSignup && (
            <p className="text-light mt-4 pt-4" style={{ borderTop: "1px solid var(--border)", marginBlockEnd: 0 }}>
              First time? <a href="/signup">Create an account</a>
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
