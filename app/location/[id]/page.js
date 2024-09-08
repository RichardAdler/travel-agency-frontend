'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Modal from 'react-modal'; // Import Modal for the map popup
import dynamic from 'next/dynamic'; // Import dynamic from next
import {
    FaWifi,
    FaWheelchair,
    FaPaw,
    FaTv,
    FaSmokingBan,
    FaGlobe,
    FaLanguage,
    FaParking,
} from 'react-icons/fa';
import { GrLounge } from "react-icons/gr";
import { IoIosFitness } from "react-icons/io";
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import Header from '@/components/page-specific/Details/Header';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../../firebase/firebase'; // Import auth, db, and storage from firebase config
import { collection, doc, setDoc, getDoc, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'; // Add query, where, getDocs, addDoc, serverTimestamp
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Dynamically import MapPopup to avoid SSR issues
const MapPopup = dynamic(() => import('../../components/page-specific/Details/MapPopup'), {
    ssr: false, // Disable SSR for MapPopup
});

const amenitiesIcons = {
    Internet: <FaGlobe />,
    'Wheelchair access': <FaWheelchair />,
    'Pets Allowed': <FaPaw />,
    Wifi: <FaWifi />,
    'Paid Internet': <FaWifi />,
    'Non-smoking rooms': <FaSmokingBan />,
    'Multilingual Staff': <FaLanguage />,
    'Accessible rooms': <FaWheelchair />,
    'Parking': <FaParking />,
    'Non-smoking hotel': <FaSmokingBan />,
    'Flatscreen TV': <FaTv />,
    English: <FaLanguage />,
    German: <FaLanguage />,
    Hungarian: <FaLanguage />,
    'Paid Wifi': <FaWifi />,
    'Fitness / Spa Locker Rooms': <IoIosFitness />,
    'Bar/Lounge': <GrLounge />
};

const LocationDetails = () => {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const [user] = useAuthState(auth);
    const [bookingDetails, setBookingDetails] = useState({
        checkInDate: searchParams.get('checkInDate') || '',
        nights: searchParams.get('nights') || 1,
        adults: searchParams.get('adults') || 1
    });

    const [locationDetails, setLocationDetails] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [error, setError] = useState('');
    const [showMoreAmenities, setShowMoreAmenities] = useState(false);
    const [bookingMessage, setBookingMessage] = useState('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [isMapOpen, setIsMapOpen] = useState(false); // State for map modal

    useEffect(() => {
        const fetchLocationDetails = async () => {
            try {
                const detailsResponse = await axios.get(
                    `${backendUrl}/api/location/${id}/details`
                );
                setLocationDetails(detailsResponse.data);
            } catch (err) {
                setError('Failed to fetch location details');
                console.error('Error fetching location details:', err);
            }
        };

        const fetchLocationPhotos = async () => {
            try {
                const photosResponse = await axios.get(
                    `${backendUrl}/api/location/${id}/photos`
                );
                const photosData = photosResponse.data.data;
                setPhotos(photosData);
                setCurrentPhoto(photosData[0]);
            } catch (err) {
                setError('Failed to fetch photos');
                console.error('Error fetching photos:', err);
            }
        };

        fetchLocationDetails();
        fetchLocationPhotos();
    }, [id]);

    const toggleShowMoreAmenities = () => {
        setShowMoreAmenities(!showMoreAmenities);
    };

    const saveMapDetailsToFirestore = async () => {
        if (!locationDetails || !currentPhoto) return;

        try {
            const mapRef = doc(db, 'map', id); // Map collection, location ID as document ID

            // Check if location already exists in Firestore
            const existingLocation = await getDoc(mapRef);
            if (!existingLocation.exists()) {
                // Save map details to Firestore
                await setDoc(mapRef, {
                    locationId: id,
                    latitude: locationDetails.latitude,
                    longitude: locationDetails.longitude,
                    name: locationDetails.name,
                    address: locationDetails.address_obj?.address_string,
                    imageUrl: currentPhoto.images.large.url,
                });

                console.log('Map details saved to Firestore');
            }
        } catch (error) {
            console.error('Error saving map details to Firestore:', error);
        }
    };

    const openMapModal = () => {
        saveMapDetailsToFirestore(); // Save map details when modal is opened
        setIsMapOpen(true);
    };

    const closeMapModal = () => setIsMapOpen(false); // Close map modal

    const handleBookingChange = (e) => {
        setBookingDetails({
            ...bookingDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleBookingSubmit = async () => {
        if (!user) {
            setBookingMessage("Please log in to book or plan a visit.");
            return;
        }
    
        try {
            console.log('Attempting to submit booking...');
            
            const bookingsRef = collection(db, 'bookings', user.uid, 'userBookings');
            const q = query(bookingsRef, where('locationID', '==', id), where('checkInDate', '==', bookingDetails.checkInDate));
            const existingBookings = await getDocs(q);
    
            if (!existingBookings.empty) {
                console.log('Existing booking found');
                setBookingMessage("You have already booked this location for the selected date.");
                setTimeout(() => setBookingMessage(''), 5000);
                return;
            }
    
            console.log('No existing booking, uploading image...');
            const imageRef = ref(storage, `users/${user.uid}/bookings/${id}.jpg`);
            const response = await fetch(currentPhoto.images.large.url);
            const blob = await response.blob();
            await uploadBytes(imageRef, blob);
    
            console.log('Image uploaded, saving booking to Firestore...');
            const imageUrl = await getDownloadURL(imageRef);
    
            await addDoc(bookingsRef, {
                locationID: id,
                locationName: locationDetails.name,
                checkInDate: bookingDetails.checkInDate,
                nights: bookingDetails.nights,
                adults: bookingDetails.adults,
                mainImageUrl: imageUrl,
                timestamp: serverTimestamp()
            });
    
            console.log('Booking successfully submitted');
            setBookingMessage("Booking successfully submitted!");
            setTimeout(() => setBookingMessage(''), 5000);
        } catch (error) {
            console.error("Error booking:", error);
            setBookingMessage("Failed to submit booking. Please try again.");
            setTimeout(() => setBookingMessage(''), 5000);
        }
    };
    
    

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!locationDetails) {
        return <p>Loading...</p>;
    }

    const isHotel = locationDetails.category?.name === 'hotel';
    const isAttraction = locationDetails.category?.name === 'attraction';

    const defaultDescription = "Discover this location and enjoy a variety of experiences. Whether you're exploring or relaxing, this place offers something for everyone.";
    const defaultRatingText = "No ratings yet. Be the first to review this location!";
    const defaultRankingText = "Explore the charm of this location, a perfect spot to enjoy memorable moments.";

    return (
        <>
            <Header />
            <div className="container mx-auto p-6 mt-12">
                <h1 className="text-4xl font-bold mb-6">{locationDetails.name}</h1>                
                <p>
                    <button
                        onClick={openMapModal} // Button to open map
                        className="text-gray-600 mb-2 underline"
                    >
                        {locationDetails.address_obj?.address_string}
                    </button>
                </p>
                <p>
                    <a
                        href={locationDetails.write_review}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 underline"
                    >
                        Write a review
                    </a>
                </p>    

                 {/* Map Modal */}
                 <Modal
                    isOpen={isMapOpen}
                    onRequestClose={closeMapModal}
                    contentLabel="Map Modal"
                    className="fixed inset-0 flex items-center justify-center z-50"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                >
                    <div className="bg-white rounded-lg p-4 max-w-3xl w-full text-end">
                        <button
                            onClick={closeMapModal}
                            className="text-red-500 text-lg mb-2 hover:text-red-600"
                        >
                            Close Map
                        </button>
                        <MapPopup
                            latitude={parseFloat(locationDetails.latitude)}
                            longitude={parseFloat(locationDetails.longitude)}
                            name={locationDetails.name}
                            imageUrl={currentPhoto?.images.large.url} // Pass the image URL
                            locationId={id} // Pass location ID for Firestore
                            address={locationDetails.address_obj?.address_string} // Pass address for Firestore
                        />
                    </div>
                </Modal>    

                <div className="flex mb-6">
                    <div className="flex-shrink-0 w-1/2 mr-4">
                        {currentPhoto && (
                            <div className="relative w-full h-[500px] overflow-hidden rounded shadow-lg mt-6">
                                <img
                                    src={currentPhoto.images.large.url}
                                    alt="Large view"
                                    className="w-full h-full object-cover"
                                />
                                {locationDetails.awards?.length > 0 && (
                                    <img
                                        src={locationDetails.awards[0].images.small}
                                        alt="Award"
                                        className="absolute top-4 left-4 w-12 h-12"
                                    />
                                )}
                            </div>
                        )}
                        <div className="mt-4 flex space-x-2 overflow-x-auto">
                            {photos.map((photo) => (
                                <img
                                    key={photo.id}
                                    src={photo.images.thumbnail.url}
                                    alt="Thumbnail"
                                    className="w-16 h-16 rounded cursor-pointer hover:opacity-75"
                                    onClick={() => setCurrentPhoto(photo)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-1/2 ml-4 mt-6 p-4 border rounded-lg shadow-lg bg-white">
                        <h2 className="text-2xl font-semibold mb-4">{isHotel ? 'Book this place' : 'Plan your visit'}</h2>
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">{isHotel ? 'Check-in Date' : 'Date'}</label>
                            <input
                                type="date"
                                name="checkInDate"
                                value={bookingDetails.checkInDate}
                                onChange={handleBookingChange}
                                className="border p-2 w-full rounded"
                            />
                        </div>
                        {isHotel && (
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Nights</label>
                                <input
                                    type="number"
                                    name="nights"
                                    value={bookingDetails.nights}
                                    onChange={handleBookingChange}
                                    className="border p-2 w-full rounded"
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">Adults</label>
                            <input
                                type="number"
                                name="adults"
                                value={bookingDetails.adults}
                                onChange={handleBookingChange}
                                className="border p-2 w-full rounded"
                            />
                        </div>
                        <button
                            onClick={handleBookingSubmit}
                            className={`py-2 px-4 rounded w-full ${user ? 'bg-orange-500 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                            disabled={!user}
                        >
                            {isHotel ? 'Book Now' : 'Plan Visit'}
                        </button>
                        <p className="text-center mt-4">
                            {bookingMessage && (
                                <span className={`text-sm ${bookingMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                                    {bookingMessage}
                                </span>
                            )}
                        </p>
                        {!user && (
                            <p className="text-center text-red-500 mt-2">Please log in to book or plan a visit.</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 p-6 border rounded-lg bg-white shadow-md">
                    <h2 className="text-2xl font-semibold mb-6">About</h2>
                    <div className="flex">
                        <div className="w-2/3 pr-6">
                            <div className="flex items-center mb-4">
                                {locationDetails.rating_image_url ? (
                                    <>
                                        <img
                                            src={locationDetails.rating_image_url}
                                            alt="Rating"
                                            className="h-8 mr-2"
                                        />
                                        <div>
                                            <p className="text-xl font-bold">
                                                {locationDetails.rating || 'N/A'} Very good
                                            </p>
                                            <span className="text-gray-600">
                                                {locationDetails.num_reviews || '0'} reviews
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xl font-bold">
                                        {defaultRatingText}
                                    </p>
                                )}
                            </div>
                            <p className="mb-4 text-gray-700">
                                {locationDetails.ranking_data?.ranking_string || defaultRankingText}
                            </p>
                            {locationDetails.subratings && (
                                <div className="space-y-2 mb-6">
                                    {Object.values(locationDetails.subratings).map(
                                        (subrating, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2"
                                            >
                                                <span className="text-sm text-gray-600 w-24">
                                                    {subrating.localized_name}
                                                </span>
                                                <div className="flex items-center">
                                                    <img
                                                        src={subrating.rating_image_url}
                                                        alt={subrating.localized_name}
                                                        className="h-4 mr-2"
                                                    />
                                                    <span className="text-sm text-gray-600">
                                                        {subrating.value}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                            <p className="text-lg text-gray-700">
                                {locationDetails.description || defaultDescription}
                            </p>
                        </div>
                        <div className="w-1/3">
                            {isHotel && locationDetails.amenities && (
                                <>
                                    <h3 className="text-lg font-semibold mb-2">Property amenities</h3>
                                    <ul className="list-none grid grid-cols-2 gap-2 mb-4">
                                        {locationDetails.amenities.slice(0, showMoreAmenities ? undefined : 20).map((amenity, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center text-gray-700 space-x-2"
                                            >
                                                {amenitiesIcons[amenity] || <FaGlobe />} <span>{amenity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {locationDetails.amenities.length > 20 && (
                                        <button onClick={toggleShowMoreAmenities} className="text-blue-500 flex items-center">
                                            {showMoreAmenities ? <MdExpandLess /> : <MdExpandMore />} 
                                            <span className="ml-1">{showMoreAmenities ? 'Show less' : 'Show more'}</span>
                                        </button>
                                    )}
                                </>
                            )}
                            {isAttraction && locationDetails.trip_types && (
                                <>
                                    <h3 className="text-lg font-semibold mb-2">Trip Types</h3>
                                    <ul className="list-none">
                                        {locationDetails.trip_types.map((trip, index) => (
                                            <li key={index} className="text-gray-700">
                                                {trip.localized_name}: {trip.value}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            <h3 className="text-lg font-semibold mb-2 mt-4">Location Type</h3> 
                            <p className="text-gray-700 mb-4"> {locationDetails.category?.localized_name || 'General'} </p> 
                            {isHotel && ( <> <p className="text-gray-700">HOTEL CLASS</p> 
                                    <img src="https://static.tacdn.com/img2/ratings/traveler/ss4.0.svg" alt="Hotel Class" className="h-5 my-2" /> 
                                    <p className="text-gray-700">HOTEL STYLE</p> 
                                    <p className="text-gray-700">{locationDetails.styles?.join(', ') || 'Not specified'}</p> </> )} 
                                    <p className="text-gray-700 mt-4">LANGUAGES SPOKEN</p> 
                                    <p className="text-gray-700">English</p> 
                                    </div> 
                                </div>
                             </div> 
                             </div> 
                             </> ); };

export default LocationDetails;
