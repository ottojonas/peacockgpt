import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContenxt";
import "../styles/globals.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
