import { useEffect, useRef, useState } from "react";

const isLocal = () => window.location.hostname.includes("localhost");

// Set a global variable with the endpoint.
const AUTH_BACKEND = isLocal()
  ? "https://localhost:8787"
  : "https://example.com";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const Login = () => {
  const pollInterval = useRef<number>();
  const [tokens, setTokens] = useState<Tokens>();

  useEffect(() => {
    // Check for tokens on first load.
    const serializedTokens = window.localStorage.getItem("tokens");
    if (!serializedTokens) return;

    const tokens = JSON.parse(serializedTokens);
    setTokens(tokens);
  }, []);

  const pollForTokens = (readKey: string): Promise<Tokens> => {
    // Clear any previous interval timers, one may already exist
    // if this function was invoked multiple times.
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }

    return new Promise((resolve) => {
      pollInterval.current = setInterval(async () => {
        const response = await fetch(
          `https://localhost:8787/poll?readKey=${readKey}`,
          { method: "POST" },
        );

        if (response.status === 200) {
          const tokens = (await response.json()) as Tokens;

          clearInterval(pollInterval.current);
          resolve(tokens);
        }
      }, 2500);
    });
  };

  const login = async () => {
    // Retrieve the authorization URL & set of unique read/write keys
    const response = await fetch(`${AUTH_BACKEND}/authorize`, {
      method: "POST",
    });

    if (response.status !== 200) return;

    const authorize = await response.json();

    // Open up the provider's login window.
    window.open(authorize.url);

    // While the user is logging in, poll the backend with the
    // read key. On successful login, tokens will be returned.
    const tokens = await pollForTokens(authorize.readKey);

    // Store tokens in local storage to keep the user logged in.
    window.localStorage.setItem("tokens", JSON.stringify(tokens));

    // Update the component state.
    setTokens(tokens);
  };

  return <div />;
};
