import React, { useRef, useState } from 'react';
import Image from 'next/image';

const PopularDestinations = () => {
    const carouselRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);

    const destinations = [
        { name: 'Amsterdam', location_string: 'Netherlands' },
        { name: 'Budapest', location_string: 'Hungary' },
        { name: 'Rome', location_string: 'Italy' },
        { name: 'London', location_string: 'United Kingdom' },
        { name: 'Paris', location_string: 'France' },
        { name: 'Tenerife', location_string: 'Spain' },
        { name: 'Marmaris', location_string: 'Turkey' },
    ];

    const scrollTo = (index) => {
        if (carouselRef.current) {
            const scrollAmount = index * carouselRef.current.offsetWidth;
            carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            setScrollIndex(index);
        }
    };

    const handlePrev = () => {
        if (scrollIndex > 0) {
            scrollTo(scrollIndex - 1);
        }
    };

    const handleNext = () => {
        if (scrollIndex < destinations.length - 1) {
            scrollTo(scrollIndex + 1);
        }
    };

    return (
        <section className="py-8 sm:py-16 bg-white">
            <div className="container mx-auto px-4 relative">
                <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-8">
                    {/* Buttons on the left side */}
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <button 
                            onClick={handlePrev} 
                            className="bg-[#172432] text-white rounded-lg p-2 hover:bg-[#2d3748] disabled:opacity-50"
                            disabled={scrollIndex === 0}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                />
                            </svg>
                        </button>
                        <button 
                            onClick={handleNext} 
                            className="bg-[#E16A3D] text-white rounded-lg p-2 hover:bg-[#f9744d] disabled:opacity-50"
                            disabled={scrollIndex === destinations.length - 1}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="text-center md:text-right">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-playfair">Popular Destinations</h2>
                        <div className="w-24 sm:w-48 md:w-64 h-0.5 bg-[#E16A3D] mt-2 mx-auto md:ml-auto"></div>
                        <p className="text-base sm:text-lg text-gray-600 font-rubik mt-2">
                            Most popular destinations around the world, from historical places to natural wonders.
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <div ref={carouselRef} className="flex overflow-x-scroll space-x-6 scrollbar-hide">
                        {destinations.map((destination, index) => (
                            <div key={index} className="min-w-[240px] flex-shrink-0">
                                <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ height: '300px' }}>
                                    <Image
                                        src={`/images/countries/${destination.name}.jpg`}
                                        alt={destination.name}
                                        width={330}   
                                        height={350}  
                                        quality={35}  
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-35 p-4 flex flex-col justify-end">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl drop-shadow-xl font-semibold text-white mb-1">{destination.name}</h3>
                                        <p className="text-sm text-white">{destination.location_string}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PopularDestinations;
