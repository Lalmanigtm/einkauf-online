import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";


import * as Sentry from "@sentry/react";


import { ClerkProvider } from "@clerk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { SentryErrorFallback } from "./components/SentryErrorFallback.tsx";
import { SentryUserSync } from "./components/SentryUserSync.tsx";
const queryClient = new QueryClient();

const apiBase = import.meta.env.VITE_API_URL ?? ""

const tracePropagationTargets = apiBase.length > 0 ? [apiBase] : typeof window !== "undefined" ? [window.location.origin] : [];

// in simple terms, 'browserTracingIntegration' lets Sentry see things like:
// - page load timing
// - route/navigation timing
// - slow frontend interactions
// - outgoing fetch / API requests
// - frontend-to-backend trace linking,

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    // todo: explain this in detail once we get there
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1,
  tracePropagationTargets: tracePropagationTargets,
  replaysSessionSampleRate: 1,
  replaysOnErrorSampleRate: 1,
  enableLogs: true,
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <SentryUserSync />
      <QueryClientProvider client={queryClient}>

        <BrowserRouter>

          <Sentry.ErrorBoundary fallback={<SentryErrorFallback />}>

            <App />{" "}

          </Sentry.ErrorBoundary>

        </BrowserRouter>
      </QueryClientProvider>

    </ClerkProvider>
  </StrictMode>
);
