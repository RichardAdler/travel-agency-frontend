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

    // Function to dynamically load the SDK script
    const loadRealEyeSDK = () => {
      return new Promise((resolve, reject) => {
        if (!document.getElementById("realeye-sdk-script")) {
          const script = document.createElement("script");
          script.src = `https://app.realeye.io/sdk/js/testRunnerEmbeddableSdk-1.6.js?cache-bust=${Date.now()}`;
          script.id = "realeye-sdk-script";
          script.type = "module"; 
          document.head.appendChild(script);
  
          script.onload = () => {
            console.log("RealEye SDK script loaded successfully");
  
            // Check for SDK availability at intervals
            const checkInterval = setInterval(() => {
              if (window.EmbeddedPageSdk) {
                clearInterval(checkInterval);
                resolve(window.EmbeddedPageSdk);
              } else {
                console.log("Waiting for EmbeddedPageSdk to become available...");
              }
            }, 100); // Check every 100ms
          };
  
          script.onerror = () => {
            console.error("Failed to load RealEye SDK script");
            reject(new Error("Failed to load RealEye SDK script"));
          };
        } else {
          // If the script is already loaded, resolve it immediately
          resolve(window.EmbeddedPageSdk);
        }
      });
    };
  
    useEffect(() => {
      loadRealEyeSDK()
        .then(EmbeddedPageSdk => {
          // Initialize the RealEye SDK after ensuring it's available
          if (EmbeddedPageSdk) {
            setTimeout(() => {
              window.reSdk = new EmbeddedPageSdk(false);
              console.log("RealEye SDK initialized successfully:", window.reSdk);
            }, 500); // Delay to ensure all is loaded
          }
        })
        .catch(err => {
          console.error("Error initializing RealEye SDK:", err);
        });
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
