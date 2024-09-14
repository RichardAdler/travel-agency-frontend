// RootLayout.js

"use client"
import { Playfair_Display, Rubik } from "next/font/google";
import "./globals.css";
import Cookies from 'js-cookie';
import Navbar from './components/global/Navbar';
import Footer from './components/global/Footer';
import ChatWidget from './components/global/chatwidget/ChatWidget';
import React, { useEffect, useState } from 'react';
import CookieConsent from './components/global/CookieConsent'; 
import Hotjar from '@hotjar/browser';

const siteId = 3660453;
const hotjarVersion = 6;

// Load Google Fonts
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function RootLayout({ children }) {
  // Move the chat widget state here
  const [isChatOpen, setIsChatOpen] = useState(false); // Separate state for chat
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Separate state for mobile menu

  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (consent === 'true') {
      Hotjar.init(siteId, hotjarVersion);
    }
  }, []);   
  
  return (
    <html lang="en">
      <body className={`${playfair.className} ${rubik.className}`}>
        {/* Pass the state to Navbar */}
        <Navbar 
          isMobileMenuOpen={isMobileMenuOpen} 
          toggleMobileMenu={toggleMobileMenu}  
        />
        
        {/* Pass the state to ChatWidget */}
        <ChatWidget isOpen={isChatOpen} toggleChat={toggleChat} />
        
        <main>{children}</main>  
        <CookieConsent />      
        <div id="portal-root"></div>
      </body>
    </html>
  );
}
