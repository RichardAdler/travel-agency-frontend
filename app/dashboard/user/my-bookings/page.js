"use client"
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase/firebase'; // Adjust the import path based on your folder structure
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '@/components/global/Footer';

const MyBookings = () => {
    const [user, loading] = useAuthState(auth);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState('checkInDate'); // Default sorting by check-in date
    const [showConfirm, setShowConfirm] = useState(false); // State to control confirmation modal
    const [bookingToDelete, setBookingToDelete] = useState(null); // Store booking to be deleted
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/'); // Redirect to home if not logged in
        }

        const fetchBookings = async () => {
            if (user) {
                try {
                    const bookingsRef = collection(db, 'bookings', user.uid, 'userBookings');
                    const bookingsQuery = query(bookingsRef);
                    const querySnapshot = await getDocs(bookingsQuery);
                    const bookingsData = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id // Include the unique booking ID
                    }));

                    // Sort bookings based on selected order
                    const sortedBookings = bookingsData.sort((a, b) => {
                        if (sortOrder === 'checkInDate') {
                            return new Date(a.checkInDate) - new Date(b.checkInDate);
                        } else if (sortOrder === 'locationName') {
                            return a.locationName.localeCompare(b.locationName);
                        } else {
                            return a.timestamp?.seconds - b.timestamp?.seconds;
                        }
                    });

                    setBookings(sortedBookings);
                } catch (err) {
                    setError('Failed to fetch bookings. Please try again later.');
                    console.error('Error fetching bookings:', err);
                }
            }
        };

        fetchBookings();
    }, [user, loading, router, sortOrder]);

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleCancelBooking = (booking) => {
        setBookingToDelete(booking);
        setShowConfirm(true); // Show confirmation modal
    };

    const confirmCancellation = async () => {
        if (bookingToDelete) {
            try {
                await deleteDoc(doc(db, 'bookings', user.uid, 'userBookings', bookingToDelete.id));
                setBookings(bookings.filter(booking => booking.id !== bookingToDelete.id)); // Update state to remove deleted booking
                setBookingToDelete(null);
                setShowConfirm(false); // Hide confirmation modal
            } catch (err) {
                setError('Failed to cancel booking. Please try again later.');
                console.error('Error canceling booking:', err);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>You must be logged in to view this page.</p>;

    return (
        <>
            <div className="min-h-[70vh] bg-gradient-to-r from-orange-700 to-pink-500 flex items-end pb-[10vh]">
                <div className="container mx-auto p-6 mt-12 min-h-[55vh] w-[80%]">
                    <h1 className="text-3xl font-bold mb-6 mt-12 text-white">My Bookings</h1>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    
                    {/* Sorting Options */}
                    <div className="mb-8 flex justify-center items-center">
                        <label className="text-white mr-2">Sort by:</label>
                        <select 
                            value={sortOrder} 
                            onChange={handleSortChange} 
                            className="bg-white text-gray-700 border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-150"
                        >
                            <option value="checkInDate">Check-in Date</option>
                            <option value="locationName">Name</option>
                            <option value="timestamp">Booking Date</option>
                        </select>
                    </div>

                    {/* Bookings List */}
                    <div className="flex flex-col items-center gap-6">
                        {bookings.map((booking, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-4 flex w-full max-w-2xl transform hover:scale-105 transition-transform duration-300">
                                <div className="w-4/5 h-full">
                                    <Image
                                        src={booking.mainImageUrl}
                                        alt={booking.locationName}
                                        width={500}
                                        height={500}
                                        className="rounded-md"
                                    />
                                </div>
                                <div className="w-full pl-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 py-2">{booking.locationName}</h2>
                                    <p className="text-gray-600 font-bold pb-1">Check-in Date: <span className="font-normal">{booking.checkInDate}</span></p>
                                    <p className="text-gray-600 font-bold pb-1">Nights: <span className="font-normal">{booking.nights}</span></p>
                                    <p className="text-gray-600 font-bold pb-1">Adults: <span className="font-normal">{booking.adults}</span></p>
                                    <p className="text-gray-500 text-sm mt-2">Booked on: {new Date(booking.timestamp?.seconds * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                    <p className="text-gray-500 text-sm mt-2">Booking ID: {booking.id}</p>
                                </div>
                                <div className="flex justify-end items-center ml-auto">
                                    <button 
                                        onClick={() => handleCancelBooking(booking)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition  duration-150"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Confirm Cancellation</h3>
                        <p>Are you sure you want to cancel this booking?</p>
                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={confirmCancellation}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600 transition duration-150"
                            >
                                Confirm
                            </button>
                            <button 
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-150"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default MyBookings;
