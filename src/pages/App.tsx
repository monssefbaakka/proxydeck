import { type ReactNode } from "react";

interface AppProps {
  path?: string;
  children?: ReactNode;
}

export function App({ path = "/", children }: AppProps) {
  return (
    <div>
      {children ?? <h1>Proxydeck</h1>}
    </div>
  );
}
