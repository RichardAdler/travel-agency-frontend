// Import Playfair Display and Rubik fonts from Google Fonts
import { Playfair_Display, Rubik } from "next/font/google";
import "./globals.css";
import Navbar from './components/global/Navbar';
import ChatWidget from './components/global/chatwidget/ChatWidget';
import React from 'react';
import 'leaflet/dist/leaflet.css';


const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Holiday Havens",
  description: "Where Technology Meets Wanderlust",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <ChatWidget />
        <main>{children}</main>
        <div id="portal-root"></div>
      </body>
    </html>
  );
}
