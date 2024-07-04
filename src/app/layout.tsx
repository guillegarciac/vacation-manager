'use client';
import React from "react";
import { Barlow } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import lightTheme from "./themes/lightTheme";

const barlow = Barlow({ weight: "400", subsets: ["latin"], display: "swap" });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={lightTheme}>
          <html lang="en" className={barlow.className}>
            <body>
              {children}
            </body>
          </html>
      </ThemeProvider>
    </SessionProvider>
  );
}
