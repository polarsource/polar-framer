import { isLocal } from "@/utils";
import { Polar } from "@polar-sh/sdk";



export const buildAPIClient = (token: string) =>
  new Polar({
    server: isLocal() ? 'sandbox' : 'production',
    accessToken: token,
  });
