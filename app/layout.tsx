import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import AnimatedPage from "./_components/AnimatedPage";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cedric Guerrero - Video Editor & Content Creator",
  description: "Professional video editor and content creator specializing in YouTube content, thumbnails, and content strategy.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AnimatedPage>
          <Navbar />
          <main className="mobile-optimized">{children}</main>
          <Footer />
        </AnimatedPage>
      </body>
    </html>
  );
}
