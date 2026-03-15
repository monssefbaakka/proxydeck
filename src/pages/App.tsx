import { type ReactNode } from "react";
import { Layout } from "../components/Layout";

interface AppProps {
  path?: string;
  children?: ReactNode;
}

function getPath(): string {
  if (typeof window !== "undefined") return window.location.pathname;
  return "/";
}

export function App({ path: pathProp, children }: AppProps) {
  const path = pathProp ?? getPath();
  return (
    <Layout>
      {children ?? <h1>Proxydeck</h1>}
    </Layout>
  );
}
