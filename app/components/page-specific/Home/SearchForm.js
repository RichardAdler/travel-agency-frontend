import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import HotelCard from '../../global/HotelCard';
import { FaUser } from 'react-icons/fa';  // Removed unused icons
import { useRouter } from 'next/navigation'; // Correct import for Next.js app directory

const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [adults, setAdults] = useState(2);
  const [nights, setNights] = useState(7);
  const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 1000);

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
    setSearchClicked(true);
    if (!checkInDate) {
      setError('Please select a check-in date');
      return;
    }
    try {
      const searchParams = {
        query: searchQuery,
        checkInDate,
        nights,
        adults
      };

      const response = await axios.get(`${backendUrl}/api/search-locations`, {
        params: searchParams
      });

      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Error fetching search results');
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-8 py-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold font-playfair mb-4">Quick Search</h2>
        <div className="w-24 sm:w-52 h-0.5 bg-[#E16A3D] mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2 font-semibold">Destination</label>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
            placeholder="Enter destination..."
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
        <div>
          <label className="block mb-2 font-semibold">Check-in Date</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Nights</label>
          <select
            value={nights}
            onChange={(e) => setNights(e.target.value)}
            className="border p-2 w-full rounded"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map(night => (
              <option key={night} value={night}>{night} {night === 1 ? 'night' : 'nights'}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <label className="block mb-2 font-semibold">Person(s)</label>
          <button
            className="border p-2 w-full rounded text-left flex items-center justify-between"
            type="button"
            onClick={() => setIsPeopleDropdownOpen(!isPeopleDropdownOpen)}
          >
            <div className="flex items-center gap-2">
              <FaUser className="inline mr-2" />{adults}
            </div>
            <svg className="h-4 w-4 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {isPeopleDropdownOpen && (
            <div className="absolute bg-white border border-gray-300 mt-1 w-full rounded shadow-lg z-10">
              <div className="p-4">
                <label className="block mb-2"><FaUser className="inline mr-2" />Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="border p-2 w-full rounded"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(adult => (
                    <option key={adult} value={adult}>{adult}</option>
                  ))}
                </select>
              </div>
              <button
                className="w-full bg-blue-500 text-white p-2 rounded-b"
                onClick={() => setIsPeopleDropdownOpen(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="text-center">
        <button onClick={handleSearch} className="bg-orange-500 text-white py-2 px-6 md:px-12 rounded">
          Search
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {searchClicked && results.length === 0 && (
        <p className="text-center text-xl mt-4">No results found.</p>
      )}
      <div className="ml-[50px] md:ml-[100px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full">
        {results.slice(0, 6).map((hotel, index) => (
          <HotelCard
            key={index}
            hotel={hotel}
            checkInDate={checkInDate}
            nights={nights}
            adults={adults}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchForm;
