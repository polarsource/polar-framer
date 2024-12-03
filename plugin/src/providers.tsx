import { createContext, PropsWithChildren } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Polar } from "@polar-sh/sdk";

export const queryClient = new QueryClient();

// @ts-expect-error
export const PolarAPIContext = createContext<Polar>(() => {
  throw new Error("PolarAPIContext not found");
});

export const PolarAPIProvider = ({ children, polar }: PropsWithChildren<{polar: Polar}>) => {
  if (!polar) {
    throw new Error("PolarAPIProvider not found");
  }

  return <PolarAPIContext.Provider value={polar}>{children}</PolarAPIContext.Provider>;
};

export const PolarProviders = ({ children, polar }: PropsWithChildren<{polar: Polar}>) => {
  return (
    <PolarAPIProvider polar={polar}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PolarAPIProvider>
  );
};
