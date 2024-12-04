import LogoIcon from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useEffect, useRef } from "react";

const isLocal = () => false; //window.location.hostname.includes("localhost");

// Set a global variable with the endpoint.
const AUTH_BACKEND = isLocal()
  ? "https://localhost:8787"
  : "https://framer.polar.sh";

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface LoginProps {
  onSuccess(tokens: Tokens): void;
}

export const Login = ({ onSuccess }: LoginProps) => {
  const pollInterval = useRef<number>();

  useEffect(() => {
    // Check for tokens on first load.
    const serializedTokens = window.localStorage.getItem("tokens");
    if (!serializedTokens) return;

    const tokens = JSON.parse(serializedTokens);
    onSuccess(tokens);
  }, [onSuccess]);

  const pollForTokens = (readKey: string): Promise<Tokens> => {
    // Clear any previous interval timers, one may already exist
    // if this function was invoked multiple times.
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }

    return new Promise((resolve) => {
      pollInterval.current = setInterval(async () => {
        const response = await fetch(
          `${AUTH_BACKEND}/poll?readKey=${readKey}`,
          { method: "POST" }
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
    onSuccess(tokens);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-4 w-full">
      <LogoIcon size={50} />
      <h1 className="text-lg font-medium text-center text-pretty px-4">
        Digital Products & Payments <span className="text-neutral-500">made easy</span>
      </h1>
        <Button className="w-fit px-6 rounded-full" onClick={login}>
          <span>Get Started</span>
          <KeyboardArrowRight className="w-6 h-6" />
        </Button>
    </div>
  );
};
