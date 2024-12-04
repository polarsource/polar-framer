import { framer } from "framer-plugin";
import "./App.css";
import { LoginView, Tokens } from "./containers/LoginView";
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
import { CreateProductView } from "./containers/CreateProductView";
import { OnboardingView } from "./containers/OnboardingView";

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
      navigate("/onboarding");
    },
    [navigate]
  );

  return (
    <PolarProviders polar={buildAPIClient(tokens?.access_token ?? "")}>
      <Routes>
        <Route index path="/" element={<LoginView onSuccess={onLoginSuccess} />} />
        <Route path="/onboarding" element={<OnboardingView />} />
        <Route path="/products" element={<OrganizationLayout />}>
          <Route index element={<ProductsView />} />
          <Route path=":id" element={<ProductView />} />
          <Route path="new" element={<CreateProductView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PolarProviders>
  );
};
