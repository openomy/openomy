"use client";

import { ThemeProvider } from "next-themes";

export default function Theme({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme?: string | null;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme || "dark"}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
