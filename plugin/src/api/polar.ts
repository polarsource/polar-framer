import { Polar } from "@polar-sh/sdk";

export const buildAPIClient = (token: string) =>
  new Polar({
    accessToken: token,
  });
