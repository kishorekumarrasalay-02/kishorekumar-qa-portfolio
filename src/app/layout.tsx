import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import CursorGlow from "@/components/CursorGlow";
import { portfolioData } from "@/data/portfolio";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: portfolioData.site.meta.title,
  description: portfolioData.site.meta.description,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} scroll-smooth font-sans`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative min-h-screen antialiased">
        <CursorGlow />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
