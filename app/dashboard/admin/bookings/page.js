"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import the ShadCN table components
import { Input } from "@/components/ui/input"; // Import ShadCN Input component
import AdminLayout from "../../../components/page-specific/Admin/AdminLayout"; // Import Admin Layout
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../../firebase/firebase"; // Adjust import path for Firebase

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [error, setError] = useState("");
  const [editingBooking, setEditingBooking] = useState(null); // Store booking to be edited
  const [userNames, setUserNames] = useState({}); // Store user names by userId

  // Fetch user IDs (you may adjust this if you retrieve users from Firebase Authentication)
  const fetchUserIds = async () => {
    try {
      const usersList = []; // Replace with how you fetch users, e.g., from Firestore or Firebase Auth
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      const userNamesMap = {}; // Map to store userId -> name
      usersSnapshot.forEach((userDoc) => {
        usersList.push(userDoc.id);
        const userData = userDoc.data();
        userNamesMap[userDoc.id] = userData.name || "Unknown"; // Assuming `name` is the field holding the user's name
      });

      setUserNames(userNamesMap); // Set user names state
      return usersList; // Returns a list of userIds
    } catch (err) {
      console.error("Error fetching user IDs:", err);
      return [];
    }
  };

  // Fetch all bookings
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        console.log("Attempting to fetch all user IDs...");
        const usersList = await fetchUserIds(); // Fetch all user IDs

        if (usersList.length === 0) {
          console.log("No users found in the system.");
          return;
        }

        const bookingsList = []; // Initialize list to hold all bookings

        // Step 1: Iterate over all user IDs
        for (const userId of usersList) {
          console.log(`Checking bookings for user: ${userId}`);

          // Directly query the userBookings subcollection for this user
          const userBookingsCollection = collection(db, "bookings", userId, "userBookings");
          const userBookingsSnapshot = await getDocs(userBookingsCollection);

          if (!userBookingsSnapshot.empty) {
            console.log(`Bookings found in userBookings for user: ${userId}, Count: ${userBookingsSnapshot.size}`);

            // Step 2: Loop over each booking document and push to bookingsList
            userBookingsSnapshot.forEach((bookingDoc) => {
              bookingsList.push({
                id: bookingDoc.id,
                userId, // Store the user ID
                ...bookingDoc.data(), // Add all booking data
              });
            });
          } else {
            console.log(`No bookings found in userBookings subcollection for user: ${userId}`);
          }
        }

        // Step 3: Update state with fetched bookings
        setBookings(bookingsList);
        setFilteredBookings(bookingsList); // Initially set filtered bookings to the full list
      } catch (err) {
        setError("Failed to fetch bookings. Please try again later.");
        console.error("Error fetching bookings:", err);
      }
    };

    fetchAllBookings();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredBookings(
      bookings.filter(
        (booking) =>
          booking.id.toLowerCase().includes(searchValue) ||
          (userNames[booking.userId] && userNames[booking.userId].toLowerCase().includes(searchValue)) || // Search by user name
          booking.userId.toLowerCase().includes(searchValue) || // Search by user ID
          booking.locationName.toLowerCase().includes(searchValue) // Search by location name
      )
    );
  };

  // Handle delete booking
  const handleDeleteBooking = async (userId, bookingId) => {
    try {
      await deleteDoc(doc(db, "bookings", userId, "userBookings", bookingId));
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      setFilteredBookings(filteredBookings.filter((booking) => booking.id !== bookingId));
    } catch (err) {
      setError("Failed to delete booking. Please try again later.");
      console.error("Error deleting booking:", err);
    }
  };

  // Handle editing booking
  const handleEditBooking = (booking) => {
    setEditingBooking(booking); // Set the booking to be edited
  };

  // Handle update booking details
  const handleUpdateBooking = async (updatedBooking) => {
    try {
      const { userId, id, ...bookingData } = updatedBooking; // Destructure updated booking details
      await updateDoc(doc(db, "bookings", userId, "userBookings", id), bookingData);
      setEditingBooking(null); // Close editing form after update

      // Update bookings list
      setBookings(
        bookings.map((booking) => (booking.id === id ? { ...booking, ...bookingData } : booking))
      );
      setFilteredBookings(
        filteredBookings.map((booking) => (booking.id === id ? { ...booking, ...bookingData } : booking))
      );
    } catch (err) {
      setError("Failed to update booking. Please try again later.");
      console.error("Error updating booking:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex-grow text-left">Manage Bookings</h2>
        <div className="flex justify-center w-full -ml-[500px]"> {/* Center the search bar */}
            <Input
            placeholder="Search by Booking ID, User Name, or Location Name"
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-300 rounded w-[500px]" // Reduced width
            />
        </div>
        </div>
      {error && <p className="text-red-500">{error}</p>}
      <Table>
        <TableCaption>Manage bookings for all users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>User Name</TableHead> {/* Updated to show User Name */}
            <TableHead>Check-in Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Nights</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{userNames[booking.userId] || booking.userId}</TableCell> {/* Show user's name */}
              <TableCell>{booking.checkInDate}</TableCell>
              <TableCell>{booking.locationName}</TableCell>
              <TableCell>{booking.nights}</TableCell>
              <TableCell>
                {/* Modify Button */}
                <button
                  onClick={() => handleEditBooking(booking)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Modify
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteBooking(booking.userId, booking.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modify Booking Form */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Modify Booking</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateBooking(editingBooking);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-bold">Check-in Date</label>
                <Input
                  type="text"
                  value={editingBooking.checkInDate}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, checkInDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-bold">Location</label>
                <Input
                  type="text"
                  value={editingBooking.locationName}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, locationName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-bold">Nights</label>
                <Input
                  type="number"
                  value={editingBooking.nights}
                  onChange={(e) => setEditingBooking({ ...editingBooking, nights: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBookings;
