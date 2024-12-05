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
import { Polar } from "@polar-sh/sdk";

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
  const [apiClient, setApiClient] = useState<Polar>(new Polar());
  const navigate = useNavigate();

  const onLoginSuccess = useCallback(
    (tokens: Tokens) => {
      const apiClient = buildAPIClient(tokens.access_token);
      setApiClient(apiClient);

      apiClient.organizations.list({ limit: 1 }).then((organizations) => {
        if (organizations.result.items.length === 0) {
          navigate("/onboarding");
        } else {
          navigate("/products");
        }
      });
    },
    [navigate]
  );

  return (
    <PolarProviders polar={apiClient}>
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
