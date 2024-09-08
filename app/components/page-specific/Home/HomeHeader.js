// app/components/page-specific/Home/HomeHeader.js
import React, { useEffect, useState } from 'react';

const imagePaths = [
    '/images/Header1.jpg',
    '/images/Header2.jpg',
    '/images/Header3.jpg',
    '/images/Header4.jpg',
    '/images/Header5.jpg',
];

const HomeHeader = ({ toggleChat }) => {
    const [currentImage, setCurrentImage] = useState(imagePaths[0]);

    useEffect(() => {
        const changeImage = () => {
            setCurrentImage(prevImage => {
                const currentIndex = imagePaths.indexOf(prevImage);
                const nextIndex = (currentIndex + 1) % imagePaths.length;
                return imagePaths[nextIndex];
            });
        };
        const interval = setInterval(changeImage, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="relative h-[60vh] sm:h-[60vh] md:h-[60vh] lg:h-[60vh]">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${currentImage})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Explore the World with Holiday Havens</h1>
                <p className="text-lg">Your personal travel booking assistant. Let us help you plan your perfect trip.</p>
                {/* When this button is clicked, it will trigger the toggleChat function */}
                <button
                    onClick={toggleChat}
                    className="mt-6 bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-500 transition-colors duration-300 hover:scale-110 drop-shadow-sm"
                >
                    Start Chat with Your AI Travel Assistant
                </button>
            </div>
        </header>
    );
};

export default HomeHeader;
