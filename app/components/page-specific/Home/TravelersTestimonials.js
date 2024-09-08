import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { FaTripadvisor } from "react-icons/fa";

const TravelersTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [error, setError] = useState(null);
    const carouselRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const locationId = 186338; 
                const response = await axios.get(`${backendUrl}/api/location/${locationId}/reviews`);
                const testimonialsData = response.data.data;
                setTestimonials(testimonialsData);
            } catch (err) {
                console.error('Error fetching testimonials:', err);
                setError('Failed to fetch testimonials');
            }
            };
        
            fetchTestimonials();
        }, [backendUrl]); // Add backendUrl as a dependency

    const scrollTo = (index) => {
        if (carouselRef.current) {
            const scrollAmount = index * carouselRef.current.clientWidth;
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
        if (scrollIndex < testimonials.length - 3) { 
            scrollTo(scrollIndex + 1);
        }
    };

    if (error) {
        return <p className="text-red-500 text-center mt-4">{error}</p>;
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 relative">
                <div className="text-right mb-8">
                <h2 className="text-5xl font-bold font-playfair">Traveler&apos;s Experiences</h2>
                    <div className="w-56 h-0.5 bg-[#E16A3D] mt-2 ml-auto"></div> 
                    <p className="text-lg text-gray-600 font-rubik mt-1">
                        Here some awesome feedback from our travelers
                    </p>
                </div>
                <div className="relative">
                    <div ref={carouselRef} className="flex overflow-hidden space-x-6 py-8">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>

                    <div className="flex space-x-2 justify-end mt-4 mb-11">
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
                </div>
            </div>
        </section>
    );
};

const TestimonialCard = ({ testimonial }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const truncateText = (text, limit) => {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flex-none w-full md:w-1/3 px-4">
            <div className="relative bg-[#F8FAFC] rounded-lg p-6 shadow-lg h-full flex flex-col justify-between">
                <div className="absolute -top-8 left-6 w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden">
                    <Image
                        src={testimonial.user?.avatar?.thumbnail || '/images/logo.png'}
                        alt={testimonial.user?.username || 'Unknown User'}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="rounded-full"
                    />
                </div>
                <div className="mt-6 flex-grow">
                    <p className="text-gray-600 mb-4 text-justify">
                        {isExpanded ? testimonial.text : truncateText(testimonial.text, 600)}
                    </p>
                    {testimonial.text.length > 600 && (
                        <button onClick={handleToggleExpand} className="text-[#E16A3D] hover:underline">
                            {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    )}
                </div>
                <div className="flex flex-col justify-end">
                    <div className="flex items-center mb-2">
                        <FaTripadvisor className="h-5 w-5"/>
                        <Image
                            src={testimonial.rating_image_url}
                            alt={`Rating ${testimonial.rating}`}
                            width={100}
                            height={20}
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">{testimonial.user?.username || 'Anonymous'}</h3>
                            <p className="text-sm text-gray-500">{testimonial.user?.user_location?.name || 'Unknown Location'}</p>
                        </div>
                        <p className="text-gray-500 text-sm">Date: {new Date(testimonial.published_date).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelersTestimonials;
