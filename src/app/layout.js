import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "World Countries Explorer",
  description: "Discover the world, one country at a time. Explore flags, capitals, and detailed information about countries around the globe.",
  keywords: "countries, world, flags, capitals, geography, exploration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
