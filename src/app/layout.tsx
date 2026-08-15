import type { Metadata } from "next";
import { Geist, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "NontonX",
    template: "%s | NontonX",
  },
  description:
    "NontonX adalah platform streaming video modern yang menghadirkan berbagai konten dalam satu tempat. Dengan tampilan yang sederhana, navigasi yang mudah, kategori terorganisir, dan pemutar video yang responsif, NontonX dirancang untuk memberikan pengalaman menonton yang nyaman di berbagai perangkat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground antialiased",
          poppins.className,
          geist.variable,
        )}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
