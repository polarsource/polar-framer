import { framer } from "framer-plugin";
import "./App.css";
import { Login, Tokens } from "./components/Login";
import { useState } from "react";
import { PolarProviders } from "./providers";
import { buildAPIClient } from "./api/polar";
import { ProductsView } from "./containers/ProductsView";

framer.showUI({
  position: "top right",
  width: 320,
  height: 460,
});

export function App() {
  const [tokens, setTokens] = useState<Tokens | null>(null);

  if (!tokens) {
    return <Login onSuccess={setTokens} />;
  }

  return (
    <PolarProviders polar={buildAPIClient(tokens.access_token)}>
      <main className="p-4 flex flex-col gap-4 overflow-y-auto">
        <ProductsView />
      </main>
    </PolarProviders>
  );
}
