import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import HotelCard from '../../global/HotelCard';
import { FaUser, FaChild, FaBaby, FaBed } from 'react-icons/fa';
import { AiOutlineCalendar, AiOutlineSearch } from 'react-icons/ai';

const SearchLocation = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [debounceTimeout, setDebounceTimeout] = useState(null); // State to hold the timeout

    const [checkInDate, setCheckInDate] = useState('');
    const [nights, setNights] = useState(1);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [rooms, setRooms] = useState(1);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout); // Clear the existing timeout
        }

        const newTimeout = setTimeout(() => {
            fetchSuggestions();
        }, 1000); // Delay for 1 second

        setDebounceTimeout(newTimeout);

        return () => clearTimeout(newTimeout);
    }, [searchQuery]);

    const fetchSuggestions = async () => {
        if (searchQuery.trim() === '') {
            setSuggestions([]);
            return;
        }

        const citiesRef = collection(db, "cities");
        const q = query(
            citiesRef,
            where("city", ">=", searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase()),
            where("city", "<=", searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase() + '\uf8ff')
        );

        try {
            const querySnapshot = await getDocs(q);
            const fetchedSuggestions = [];
            querySnapshot.forEach(doc => {
                fetchedSuggestions.push({ id: doc.id, ...doc.data() });
            });
            setSuggestions(fetchedSuggestions);
        } catch (err) {
            console.error("Error fetching suggestions:", err);
            setError('Failed to fetch suggestions');
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSelectSuggestion = (suggestion) => {
        setSearchQuery(suggestion.city);
        setSuggestions([]);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/search-locations`, {
                params: { query: searchQuery, category: 'hotels' }
            });
            setResults(response.data.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Error fetching search results');
        }
    };

    return (
        <div className="container mx-auto px-4 py-4">
            <h2 className="text-3xl font-bold mb-4">Search Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        className="border p-2 w-full rounded"
                        placeholder="Enter destination"
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute bg-white border border-gray-300 w-full z-10">
                            {suggestions.map((suggestion, index) => (
                                <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectSuggestion(suggestion)}>
                                    {suggestion.city}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="border p-2 w-full rounded"
                    placeholder="Check-in Date"
                />
                <input
                    type="number"
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                    className="border p-2 w-full rounded"
                    placeholder="Nights"
                />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                    <FaUser />
                    <input
                        type="number"
                        value={adults}
                        onChange={(e) => setAdults(e.target.value)}
                        className="border p-2 w-full rounded"
                        placeholder="Adults"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <FaChild />
                    <input
                        type="number"
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}
                        className="border p-2 w-full rounded"
                        placeholder="Children"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <FaBaby />
                    <input
                        type="number"
                        value={infants}
                        onChange={(e) => setInfants(e.target.value)}
                        className="border p-2 w-full rounded"
                        placeholder="Infants"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <FaBed />
                    <input
                        type="number"
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}
                        className="border p-2 w-full rounded"
                        placeholder="Rooms"
                    />
                </div>
            </div>
            <button onClick={handleSearch} className="bg-yellow-500 text-white p-2 rounded-md flex items-center">
                <AiOutlineSearch className="mr-2" /> Search
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {results.slice(0, 6).map((hotel, index) => (
                    <HotelCard key={index} hotel={hotel} />
                ))}
            </div>
            {results.length === 0 && (
                <p className="text-center text-xl mt-4">No results found.</p>
            )}
        </div>
    );
};

export default SearchLocation;
