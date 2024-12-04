import { createContext, PropsWithChildren, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Polar } from "@polar-sh/sdk";
import { Organization } from "@polar-sh/sdk/models/components";

// @ts-expect-error
export const queryClient = new QueryClient();

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
