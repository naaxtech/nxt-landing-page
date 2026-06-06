import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naaxtech — Your Technology Execution Partner",
  description: "One team that runs your operations, grows your revenue, and makes every part of your business work together. No agencies, no fragmented freelancers — just results.",
  metadataBase: new URL("https://naaxtech.com"),
  openGraph: {
    title: "Naaxtech — Your Technology Execution Partner",
    description: "One team that runs your operations, grows your revenue, and makes every part of your business work together.",
    url: "https://naaxtech.com",
    siteName: "Naaxtech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naaxtech — Your Technology Execution Partner",
    description: "One team that runs your operations, grows your revenue, and makes every part of your business work together.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
