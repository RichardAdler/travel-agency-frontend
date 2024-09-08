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
import AdminLayout from "../../../components/page-specific/Admin/AdminLayout"; // Import Admin Layout
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../../firebase/firebase"; // Adjust import path for Firebase
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai"; // React icons for sorting

const AdminContactUs = () => {
  const [entries, setEntries] = useState([]);
  const [sortedEntries, setSortedEntries] = useState([]);
  const [error, setError] = useState("");
  const [viewingEntry, setViewingEntry] = useState(null); // Store the entry to view in popup
  const [sortOrder, setSortOrder] = useState("desc"); // Ascending or Descending

  // Fetch all contact-us entries from Firebase
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entriesList = [];
        const contactUsCollection = collection(db, "contact-us");

        // Fetch all documents from the contact-us collection
        const contactUsDocs = await getDocs(contactUsCollection);

        if (contactUsDocs.empty) {
          console.log("No contact-us entries found.");
        } else {
          contactUsDocs.forEach((doc) => {
            entriesList.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        }

        setEntries(entriesList);
        sortEntries(entriesList, sortOrder); // Sort by default
      } catch (err) {
        setError("Failed to fetch contact-us entries. Please try again later.");
        console.error("Error fetching contact-us entries:", err);
      }
    };

    fetchEntries();
  }, [sortOrder]);

  // Handle delete contact-us entry
  const handleDeleteEntry = async (entryId) => {
    try {
      await deleteDoc(doc(db, "contact-us", entryId));
      const updatedEntries = entries.filter((entry) => entry.id !== entryId);
      setEntries(updatedEntries);
      sortEntries(updatedEntries, sortOrder); // Re-sort after delete
    } catch (err) {
      setError("Failed to delete contact-us entry. Please try again later.");
      console.error("Error deleting contact-us entry:", err);
    }
  };

  // Sorting function
  const sortEntries = (entriesList, order) => {
    const sortedList = entriesList.sort((a, b) => {
      const dateA = new Date(a.submittedAt.seconds * 1000);
      const dateB = new Date(b.submittedAt.seconds * 1000);

      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    setSortedEntries([...sortedList]); // Set the sorted entries in state
  };

  // Handle sorting order toggle
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Contact Us Entries</h2>

        {/* Sort by date */}
        <button
          className="flex items-center bg-gray-200 px-3 py-1 rounded"
          onClick={toggleSortOrder}
        >
          {sortOrder === "asc" ? (
            <AiOutlineSortAscending className="mr-2" />
          ) : (
            <AiOutlineSortDescending className="mr-2" />
          )}
          Sort by Date
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Table>
        <TableCaption>Manage Contact Us entries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Submitted At</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{new Date(entry.submittedAt.seconds * 1000).toLocaleString()}</TableCell>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.email}</TableCell>
              <TableCell>
                {entry.message.length > 75 ? `${entry.message.substring(0, 75)}...` : entry.message}
              </TableCell>
              <TableCell>
                {/* View Message Button */}
                <button
                  onClick={() => setViewingEntry(entry)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  View Message
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

     {/* View Message Popup */}
            {viewingEntry && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">Message Details</h2>
                <p>
                    <strong>Submitted At:</strong>{" "}
                    {new Date(viewingEntry.submittedAt.seconds * 1000).toLocaleString()}
                </p>
                <p>
                    <strong>Name:</strong> {viewingEntry.name}
                </p>
                <p>
                    <strong>Email:</strong> {viewingEntry.email}
                </p>
                <p>
                    <strong>Message:</strong>
                    <div className="mt-2 p-4 border border-gray-300 rounded-md">
                    {viewingEntry.message}
                    </div>
                </p>
                <div className="flex justify-end mt-4">
                    <button
                    onClick={() => setViewingEntry(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                    Close
                    </button>
                </div>
                </div>
            </div>
            )}

    </AdminLayout>
  );
};

export default AdminContactUs;
