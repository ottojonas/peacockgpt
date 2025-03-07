import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthContext";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      session={pageProps.session}
    >
      <AuthProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
