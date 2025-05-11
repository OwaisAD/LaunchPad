import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = "pk_live_Y2xlcmsuc3BvcnRpYS5kayQ";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/sign-in">
      <BrowserRouter>
        <HelmetProvider>
          <App />
          <Toaster />
        </HelmetProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
