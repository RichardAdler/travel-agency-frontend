"use client"
import { Playfair_Display, Rubik } from "next/font/google";
import "./globals.css";
import Navbar from './components/global/Navbar';
import Footer from './components/global/Footer';
import ChatWidget from './components/global/chatwidget/ChatWidget';
import React, { useEffect, useState } from 'react';

// Load Google Fonts
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "700"] });


export default function RootLayout({ children }) {
  // Move the chat widget state here
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

   // Load the RealEye SDK only once on component mount
  useEffect(() => {
    const initializeRealEyeSDK = () => {
      // Check if script is already added
      if (!document.getElementById("realeye-sdk-script")) {
        const script = document.createElement("script");
        script.src = `https://app.realeye.io/sdk/js/testRunnerEmbeddableSdk-1.6.js?cache-bust=${Date.now()}`;
        script.id = "realeye-sdk-script";
        script.type = "module"; // Use type="module" for the script
        script.defer = true;  // Add defer
        document.head.appendChild(script);

        // Initialize the RealEye SDK when the script loads
        script.onload = () => {
          console.log("RealEye SDK script loaded successfully");

          // Wait until the SDK is available in the window
          if (window.EmbeddedPageSdk) {
            window.reSdk = new window.EmbeddedPageSdk(false);
          } else {
            console.error("EmbeddedPageSdk is not available. Please check the SDK script.");
          }
        };

        script.onerror = () => {
          console.error("Failed to load RealEye SDK script");
        };
      }
    };

    // Initialize SDK after DOM is loaded
    if (document.readyState === "complete") {
      initializeRealEyeSDK();
    } else {
      window.addEventListener("load", initializeRealEyeSDK);
    }

    return () => {
      window.removeEventListener("load", initializeRealEyeSDK);
    };
  }, []);


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
