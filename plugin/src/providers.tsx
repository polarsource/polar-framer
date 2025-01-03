import { createContext, PropsWithChildren, useState } from "react";
import { QueryClientProvider, QueryClient, QueryCache } from "@tanstack/react-query";
import { Polar } from "@polar-sh/sdk";
import { Organization } from "@polar-sh/sdk/models/components";
import { Tokens } from "./containers/LoginView";
import { AUTH_BACKEND } from "./utils";

// @ts-expect-error
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (
        error.message.includes("401")
      ) {
        const tokens = JSON.parse(localStorage.getItem("tokens") ?? "{}") as Tokens;

        fetch(`${AUTH_BACKEND}/refresh?code=${tokens.refresh_token}`, {
          method: "POST",
        })
          .then((response) => response.json())
          .then((tokens) => {
            localStorage.setItem("tokens", JSON.stringify(tokens));
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error refreshing tokens", error);
            localStorage.removeItem("tokens");
            window.location.reload();
          });
      }
    },
  }),
});

// @ts-expect-error
export const PolarAPIContext = createContext<Polar>(() => {
  throw new Error("PolarAPIContext not found");
});

// @ts-expect-error 
export const OrganizationContext = createContext<{
  organization: Organization | undefined;
  setOrganization: (organization: Organization | undefined) => void;
}>({ organization: undefined, setOrganization: () => {} });

const OrganizationProvider = ({ children }: PropsWithChildren) => {
  const [organization, setOrganization] = useState<Organization | undefined>(undefined);

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const PolarAPIProvider = ({
  children,
  polar,
}: PropsWithChildren<{ polar: Polar }>) => {
  if (!polar) {
    throw new Error("PolarAPIProvider not found");
  }

  return (
    <PolarAPIContext.Provider value={polar}>
      {children}
    </PolarAPIContext.Provider>
  );
};

export const PolarProviders = ({
  children,
  polar,
}: PropsWithChildren<{ polar: Polar }>) => {
  return (
    <PolarAPIProvider polar={polar}>
      <QueryClientProvider client={queryClient}>
        <OrganizationProvider>{children}</OrganizationProvider>
      </QueryClientProvider>
    </PolarAPIProvider>
  );
};
