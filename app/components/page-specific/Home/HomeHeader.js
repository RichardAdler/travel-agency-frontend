// app/components/page-specific/Home/HomeHeader.js
import React from 'react';


const HomeHeader = ({ toggleChat }) => {   

    return (
        <header className="relative h-[60vh] sm:h-[60vh] md:h-[60vh] lg:h-[60vh]">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('/images/Header4.jpg')` }} // Use your image
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Explore the World with Holiday Havens</h1>
            <p className="text-lg">Your personal travel booking assistant. Let us help you plan your perfect trip.</p>
            {/* The button to toggle the chat window */}
            <button
              onClick={toggleChat} // Ensure toggleChat is triggered here
              className="mt-6 bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-500 transition-colors duration-300 hover:scale-110 drop-shadow-sm"
            >
              Start Chat with Your AI Travel Assistant
            </button>
          </div>
        </header>
      );
    };

export default HomeHeader;
