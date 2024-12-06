import { framer } from "framer-plugin";
import "./App.css";
import { LoginView, Tokens } from "./containers/LoginView";
import { useCallback, useEffect, useState } from "react";
import { PolarProviders, queryClient } from "./providers";
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
import { EditProductView } from "./containers/EditProductView";

framer.showUI({
  position: "top right",
  width: 320,
  height: 460,
});

export function App() {

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateBodyClass = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    };

    if (darkModeMediaQuery.matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    darkModeMediaQuery.addEventListener("change", updateBodyClass);

    return () => {
      darkModeMediaQuery.removeEventListener("change", updateBodyClass);
    };
  }, []);

  
  return (
    <MemoryRouter>
      <main className="flex flex-col p-0 dark:bg-neutral-950 bg-white text-black dark:text-white">
        <PluginRoutes />
      </main>
    </MemoryRouter>
  );
}

const PluginRoutes = () => {
  const [apiClient, setApiClient] = useState<Polar>(new Polar());
  const navigate = useNavigate();

  const onLogout = useCallback(() => {
    localStorage.removeItem("tokens");
    queryClient.clear();
    queryClient.resetQueries();
    setApiClient(new Polar());
  }, [setApiClient]);

  const onLoginSuccess = useCallback(
    (tokens: Tokens) => {
      const apiClient = buildAPIClient(tokens.access_token);
      setApiClient(apiClient);

      queryClient.fetchQuery({
        queryKey: ["organizations"],
        queryFn: () => apiClient.organizations.list({ limit: 1 }),
      }).then((organizations) => {
        if (organizations.result.items.length === 0) {
          navigate("/onboarding");
        } else {
          navigate("/products");
        }
      });
    },
    [navigate]
  );

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem("tokens") ?? "{}") as Tokens;
    
    if (!tokens.access_token) {
      navigate("/");
    }
  }, []);

  return (
    <PolarProviders polar={apiClient}>
      <Routes>
        <Route index path="/" element={<LoginView onSuccess={onLoginSuccess} />} />
        <Route path="/onboarding" element={<OnboardingView />} />
        <Route path="/products" element={<OrganizationLayout onLogout={onLogout} />}>
          <Route index element={<ProductsView />} />
          <Route path=":id" element={<ProductView />} />
          <Route path=":id/edit" element={<EditProductView />} />
          <Route path="new" element={<CreateProductView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PolarProviders>
  );
};
