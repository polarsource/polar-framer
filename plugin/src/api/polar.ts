import { isLocal } from "@/utils";
import { Polar } from "@polar-sh/sdk";

export const buildAPIClient = (token: string) =>
  new Polar({
    accessToken: token,
    serverURL: isLocal() ? "http://127.0.0.1:8000" : "https://api.polar.sh",
  });
