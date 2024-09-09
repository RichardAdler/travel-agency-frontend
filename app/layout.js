"use client"
import { Playfair_Display, Rubik } from "next/font/google";
import "./globals.css";
import Navbar from './components/global/Navbar';
import Footer from './components/global/Footer';
import ChatWidget from './components/global/chatwidget/ChatWidget';
import React, { useState } from 'react';

// Load Google Fonts
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "700"] });


export default function RootLayout({ children }) {
  // Move the chat widget state here
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  

  return (
    <html lang="en">
      <body className={`${playfair.className} ${rubik.className}`}>
        <Navbar />
        {/* Pass the state to ChatWidget */}
        <ChatWidget isOpen={isChatOpen} toggleChat={toggleChat} />
        <main>{children}</main>        
        <div id="portal-root"></div>
      </body>
    </html>
  );
}
