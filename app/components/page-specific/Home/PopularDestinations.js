import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';

const PopularDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [error, setError] = useState(null);
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/popular-destinations`);
                const destinationsData = response.data.data;
                setDestinations(destinationsData);

                const imagePromises = destinationsData.map(async (destination) => {
                    try {
                        const imageResponse = await axios.get(`${backendUrl}/api/photos`, {
                            params: { locationId: destination.location_id }
                        });
                        const photos = imageResponse.data.data;
                        const photoUrl = photos && photos.length > 0 && photos[0].images.original.url
                            ? photos[0].images.original.url
                            : <Image
                            src={images[destination.location_id] || '/images/default-hotel.jpg'}
                            alt={destination.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />;

                        setImages((prevImages) => ({
                            ...prevImages,
                            [destination.location_id]: photoUrl,
                        }));
                    } catch (imageError) {
                        console.error(`Failed to fetch image for location ${destination.location_id}`, imageError);
                        setImages((prevImages) => ({
                            ...prevImages,
                            [destination.location_id]: '/images/default-hotel.jpg',
                        }));
                    }
                });

                await Promise.all(imagePromises);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching destinations:', err);
                setError('Failed to fetch destinations');
            }
        };

        fetchDestinations();
    }, [backendUrl]);

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

    if (error) {
        return <p className="text-red-500 text-center mt-4">{error}</p>;
    }

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
                        {destinations.map((destination) => (
                            <div key={destination.location_id} className="min-w-[240px]">
                                <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ height: '320px' }}>
                                    {loading || !images[destination.location_id] ? (
                                        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                                    ) : (
                                        <Image
                                            src={images[destination.location_id]}
                                            alt={destination.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    )}
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
