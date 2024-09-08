// app/components/page-specific/HomeHeader.js
import React, { useEffect, useState } from 'react';

const imagePaths = [
    '/images/Header1.jpg',
    '/images/Header2.jpg',
    '/images/Header3.jpg',
    '/images/Header4.jpg',
    '/images/Header5.jpg',
];

const Header = () => {
    const [currentImage, setCurrentImage] = useState(imagePaths[0]);

    useEffect(() => {
        // Optional: Change images every few seconds for a slideshow effect
        const changeImage = () => {
            setCurrentImage(prevImage => {
                const currentIndex = imagePaths.indexOf(prevImage);
                const nextIndex = (currentIndex + 1) % imagePaths.length;
                return imagePaths[nextIndex];
            });
        };
        const interval = setInterval(changeImage, 15000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="relative h-[40vh] sm:h-[40vh] md:h-[40vh] lg:h-[40vh]">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${currentImage})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-45 flex flex-col justify-center items-center text-white p-4">
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Search Summary</h1>
                
            </div>
        </header>
    );
};

export default Header;
