// server-layout.js
import { Playfair_Display, Rubik } from "next/font/google";
import "./globals.css";
import Navbar from './components/global/Navbar';
import Footer from './components/global/Footer';
import React from 'react';

// Load Google Fonts
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Holiday Havens",
  description: "Where Technology Meets Wanderlust",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.className} ${rubik.className}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <div id="portal-root"></div>
      </body>
    </html>
  );
}
