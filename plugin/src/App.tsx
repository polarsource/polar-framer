import { framer } from "framer-plugin";
import "./App.css";
import { Login, Tokens } from "./components/Login";
import { useCallback, useState } from "react";
import { PolarProviders } from "./providers";
import { buildAPIClient } from "./api/polar";
import { ProductsView } from "./containers/ProductsView";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  MemoryRouter,
} from "react-router";
import { ProductView } from "./containers/ProductView";
import { OrganizationLayout } from "./layouts/OrganizationLayout";

framer.showUI({
  position: "top right",
  width: 320,
  height: 460,
});

export function App() {
  return (
    <MemoryRouter>
      <main className="flex flex-col p-0">
        <PluginRoutes />
      </main>
    </MemoryRouter>
  );
}

const PluginRoutes = () => {
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const navigate = useNavigate();

  const onLoginSuccess = useCallback(
    (tokens: Tokens) => {
      setTokens(tokens);
      navigate("/");
    },
    [navigate]
  );

  return (
    <PolarProviders polar={buildAPIClient(tokens?.access_token ?? "")}>
      <Routes>
        <Route index path="/login" element={<Login onSuccess={onLoginSuccess} />} />
        <Route path="/" element={<OrganizationLayout />}>
          <Route path="/:organizationId/products" element={<ProductsView />} />
          <Route path="/:organizationId/products/:id" element={<ProductView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PolarProviders>
  );
};
