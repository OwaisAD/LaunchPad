import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/clerk-react";

// should be dependent on the environment

const isDev = import.meta.env.MODE === "development";

const PUBLISHABLE_KEY = isDev
  ? "pk_test_dGlnaHQta2lkLTc0LmNsZXJrLmFjY291bnRzLmRldiQ"
  : "pk_live_Y2xlcmsuc3BvcnRpYS5kayQ";

if (!PUBLISHABLE_KEY) {
  throw new Error("VITE_CLERK_FRONTEND_API_KEY is not defined");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/sign-in" proxyUrl="https://api.launchpad.sportia.dk">
      <BrowserRouter>
        <HelmetProvider>
          <App />
          <Toaster />
        </HelmetProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
