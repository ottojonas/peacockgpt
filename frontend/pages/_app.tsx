import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthContext";

import type { AppProps } from "next/app";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
