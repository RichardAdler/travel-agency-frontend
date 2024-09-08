import React, { useRef, useState } from 'react';
import Image from 'next/image';

const PopularDestinations = () => {
    const carouselRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);

    // Example destination names, assuming these match the image names in /public/images/countries/
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
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 relative">
                <div className="flex justify-between items-center mb-4">
                    {/* Buttons on the left side */}
                    <div className="flex space-x-2">
                        <button onClick={handlePrev} className="bg-[#172432] text-white rounded-lg p-2 hover:bg-[#2d3748]">
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
                        <button onClick={handleNext} className="bg-[#E16A3D] text-white rounded-lg p-2 hover:bg-[#f9744d]">
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
                    <div className="text-right">
                        <h2 className="text-5xl font-bold font-playfair">Popular Destinations</h2>
                        <div className="w-64 h-0.5 bg-[#E16A3D] mt-2 ml-auto"></div>
                        <p className="text-lg text-gray-600 font-rubik mt-1">
                            Most popular destinations around the world, from historical places to natural wonders.
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <div ref={carouselRef} className="flex overflow-hidden space-x-6">
                        {destinations.map((destination, index) => (
                            <div key={index} className="min-w-[240px]">
                                <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ height: '300px' }}>
                                    <Image
                                        src={`/images/countries/${destination.name}.jpg`}
                                        alt={destination.name}
                                        width={330}   // Adjust width to optimize
                                        height={350}  // Adjust height to optimize
                                        quality={30}  // Lower quality to reduce file size
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-35 p-4 flex flex-col justify-end">
                                        <h3 className="text-3xl drop-shadow-xl font-semibold text-white mb-1">{destination.name}</h3>
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