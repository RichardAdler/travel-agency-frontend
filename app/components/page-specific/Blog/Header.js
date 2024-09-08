import React, { useEffect, useState } from 'react';

const imagePaths = [
    '/images/Header1.jpg',
    '/images/Header2.jpg',
    '/images/Header3.jpg',
    '/images/Header4.jpg',
    '/images/Header5.jpg',
];

const Header = ({ toggleChat }) => {
    
    return (
        <header className="relative h-[45vh] sm:h-[45vh] md:h-[45vh] lg:h-[45vh]">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('/images/blog.jpg')` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Our Blog</h1>                                
            </div>
        </header>
    );
};

export default Header;
