import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
import "../styles/globals.css";
import { AuthProvider } from '../context/AuthContext'

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
