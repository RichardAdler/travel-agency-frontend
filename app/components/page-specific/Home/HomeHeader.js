import React from 'react';

const HomeHeader = ({ toggleChat }) => {   

    return (
        <header className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh]">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('/images/Header4.jpg')` }} // Use your image
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              Explore the World with Holiday Havens
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl">
              Your personal travel booking assistant. Let us help you plan your perfect trip.
            </p>
            {/* The button to toggle the chat window */}
            <button
              onClick={toggleChat} // Ensure toggleChat is triggered here
              className="mt-6 bg-orange-600 text-white font-semibold py-2 px-4 sm:px-6 sm:py-3 rounded-lg hover:bg-orange-500 transition-colors duration-300 hover:scale-110 drop-shadow-sm"
            >
              Start Chat with Your AI Travel Assistant
            </button>
          </div>
        </header>
    );
};

export default HomeHeader;
