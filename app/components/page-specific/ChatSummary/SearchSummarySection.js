'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HotelCard from '../../global/HotelCard';

// Helper function to safely convert date from DD.MM.YYYY to YYYY-MM-DD
const formatDateForInput = (dateStr) => {
    if (!dateStr) return ''; // Return empty string if dateStr is undefined or empty
    const [day, month, year] = dateStr.split('.');
    if (!day || !month || !year) return ''; // Ensure all parts are defined
    return `${year}-${month}-${day}`; // Return formatted date
};
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const SearchSummarySection = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get initial values from URL params with safe parsing
    const initialDate = formatDateForInput(searchParams.get('date')); // Safe date parsing
    const initialDestination = searchParams.get('destination') || '';
    const initialAdults = searchParams.get('adults') || '1';
    const initialCategory = searchParams.get('category') || 'hotels and attractions';
    const initialDuration = searchParams.get('duration');

    // Format duration correctly to pass as `nights`
    const formattedDuration = initialDuration ? initialDuration.replace(' nights', '') : '1';

    // State variables to hold the editable values
    const [date, setDate] = useState(initialDate);
    const [destination, setDestination] = useState(initialDestination);
    const [adults, setAdults] = useState(initialAdults);
    const [category, setCategory] = useState(initialCategory);
    const [duration, setDuration] = useState(formattedDuration);

    // State variables to hold the current displayed values
    const [displayedCategory, setDisplayedCategory] = useState(initialCategory);
    const [locations, setLocations] = useState({
        hotels: [],
        attractions: [],
        restaurants: []
    });
    const [error, setError] = useState(null);
    const [isSearchTriggered, setIsSearchTriggered] = useState(false);

    const handleRefresh = () => {
        setIsSearchTriggered(true); // Trigger search
        setDisplayedCategory(category); // Update displayed category to the selected category
        const queryParams = new URLSearchParams({
            date,
            destination,
            adults,
            duration,
            ...(category !== 'hotels and attractions' && { category }) // Only include category if it's not 'hotels and attractions'
        }).toString();

        // Update the URL parameters and trigger the search
        router.push(`/search-summary?${queryParams}`);
    };

    useEffect(() => {
        // Trigger initial load if URL parameters are present
        if (initialDate && initialDestination && initialAdults && initialDuration) {
            setIsSearchTriggered(true); // Trigger the initial load
        }
    }, []);

    useEffect(() => {
        if (isSearchTriggered && destination) {
            const categories = (displayedCategory && displayedCategory !== 'hotels and attractions') ? [displayedCategory] : ['hotels', 'attractions'];

            const promises = categories.map(cat =>
                axios.get(`${backendUrl}/api/search-locations`, {
                    params: { query: destination, category: cat }
                })
                .then(response => ({ category: cat, data: response.data.data.slice(0, 6) }))
                .catch(error => {
                    console.error(`Error fetching ${cat} locations:`, error);
                    return { category: cat, data: [] };
                })
            );

            Promise.all(promises)
                .then(results => {
                    const updatedLocations = {
                        hotels: [],
                        attractions: [],
                        restaurants: []
                    };

                    results.forEach(result => {
                        updatedLocations[result.category] = result.data;
                    });

                    setLocations(updatedLocations);
                    setIsSearchTriggered(false); // Reset the trigger after loading data
                })
                .catch(error => {
                    setError('Failed to fetch locations');
                    setIsSearchTriggered(false); // Reset even if there's an error
                });
        }
    }, [destination, displayedCategory, date, adults, duration, isSearchTriggered]);

    return (
        <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
                <h1 className="text-4xl text-center font-bold mb-4">Personalised Summary</h1>
                <div className="w-full h-0.5 bg-[#E16A3D] mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-lg"><strong>Destination:</strong></label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="border p-2 rounded"
                        />

                        <label className="text-lg"><strong>Travel Date:</strong></label>
                        <input
                            type="date"
                            value={date} // Ensure the date format is 'yyyy-mm-dd'
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 rounded"
                        />

                        <label className="text-lg"><strong>Duration:</strong></label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value.replace(' nights', ''))}
                            className="border p-2 rounded"
                        >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(night => (
                                <option key={night} value={night}>{night} {night === 1 ? 'night' : 'nights'}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-lg"><strong>Number of Adults:</strong></label>
                        <select
                            value={adults}
                            onChange={(e) => setAdults(e.target.value)}
                            className="border p-2 rounded"
                        >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>

                        <label className="text-lg"><strong>Interested in:</strong></label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="hotels">Hotels</option>
                            <option value="attractions">Attractions</option>
                            <option value="hotels and attractions">Hotels and Attractions</option>
                        </select>
                    </div>
                </div>
                <div className="text-center">
                    <button
                        onClick={handleRefresh}
                        className="mt-4 bg-blue-500 text-white py-2 px-6 rounded"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {displayedCategory ? (
                displayedCategory === 'hotels and attractions' ? (
                    // Display results for both hotels and attractions
                    ['hotels', 'attractions'].map(cat => (
                        <div key={cat} className="mb-8">
                            <h2 className="text-5xl font-semibold py-4">
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </h2>
                            <div className="border rounded-lg shadow-lg p-4">
                                <div className="grid grid-cols-3 gap-4">
                                    {locations[cat] && locations[cat].length > 0 ? (
                                        locations[cat].map((location, index) => (
                                            <HotelCard 
                                                key={index} 
                                                hotel={location} 
                                                checkInDate={date}  // Pass the date as check-in date
                                                nights={duration}   // Pass the duration as nights
                                                adults={adults}     // Pass the number of adults
                                            />
                                        ))
                                    ) : (
                                        <p>No {cat} found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Display results for the specified category only
                    <div className="mb-8">
                        <h2 className="text-5xl font-semibold py-4">
                            {displayedCategory.charAt(0).toUpperCase() + displayedCategory.slice(1)}
                        </h2>
                        <div className="border rounded-lg shadow-lg p-4">
                            <div className="grid grid-cols-3 gap-4">
                                {locations[displayedCategory] && locations[displayedCategory].length > 0 ? (
                                    locations[displayedCategory].map((location, index) => (
                                        <HotelCard 
                                            key={index} 
                                            hotel={location} 
                                            checkInDate={date}  // Pass the date as check-in date
                                            nights={duration}   // Pass the duration as nights
                                            adults={adults}     // Pass the number of adults
                                        />
                                    ))
                                ) : (
                                    <p>No {displayedCategory} found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <p>No category selected.</p>
            )}
        </div>
    );
};

export default SearchSummarySection;
