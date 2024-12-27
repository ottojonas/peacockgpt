import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.css";
import "@/styles/register.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
