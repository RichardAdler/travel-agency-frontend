"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
const Recommendations = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter(); 
    const { destination, budget, travelDates, numAdults, numChildren, numInfants, travelType } = router.query;

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.post('/api/get-recommendations', {
                    preferences: { destination, budget, travelDates, numAdults, numChildren, numInfants, travelType }
                });
                setResults(response.data.recommendations);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setError('Failed to fetch recommendations.');
            }
        };

        if (destination) fetchRecommendations();
    }, [destination, budget, travelDates, numAdults, numChildren, numInfants, travelType]);

    return (
        <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold mb-4">Your Personalized Travel Recommendations</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {results.length > 0 ? (
                    results.map((item, index) => (
                        <div key={index} className="recommendation-item">
                            <h2 className="text-xl font-semibold">{item.name}</h2>
                            <p>{item.description}</p>
                            <p>Price: {item.price}</p>
                            {/* Add more details as needed */}
                        </div>
                    ))
                ) : (
                    <p>No recommendations found based on your preferences.</p>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
