"use client";
import React, { useState, useEffect } from 'react';
import { db } from "../../../firebase/firebase"; // Firebase setup
import { collection, addDoc } from "firebase/firestore"; // For adding documents to Firestore

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email input
        if (!email || !email.includes("@")) {
            setErrorMessage("Please enter a valid email address.");
            clearMessages(); // Clear messages after 5 seconds
            return;
        }

        try {
            // Add email to Firestore 'newsletter' collection
            await addDoc(collection(db, "newsletter"), {
                email: email,
                subscribedAt: new Date(),
            });
            setSuccessMessage("Successfully subscribed!");
            setErrorMessage(""); // Reset any error message
            setEmail(""); // Clear email input after success
            clearMessages(); // Clear messages after 5 seconds
        } catch (error) {
            setErrorMessage("There was an error subscribing. Please try again.");
            console.error("Error subscribing to newsletter: ", error);
            clearMessages(); // Clear messages after 5 seconds
        }
    };

    // Function to clear messages after 5 seconds
    const clearMessages = () => {
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000); // Clear messages after 3 seconds
    };

    return (
        <section className="flex bg-white relative -pb-64 mt-12 -mb-12">
            <div className="inset-0 flex absolute items-center justify-center ">
                <div className="container ">
                    <div className="relative border border-slate-200 bg-white shadow-lg rounded-lg py-10 px-6 max-w-3xl mx-auto md:flex items-center justify-between -mt-24 z-10">
                        <h2 className="text-4xl font-playfair text-gray-500 ">Our Newsletter</h2>
                        <form onSubmit={handleSubmit} className="md:ml-8 mt-4 md:mt-0 flex flex-col md:flex-row md:items-center">
                            <div className="flex flex-col md:mr-4">
                                <label htmlFor="email" className="text-gray-500 text-sm mb-2">Email</label>
                                <div className="flex gap-4">
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} // Capture email input
                                        placeholder="Enter your email"
                                        className="px-4 py-2 rounded-md bg-orange-100 text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        type="submit"
                                        className="mt-4 md:mt-0 px-6 py-2 rounded-md bg-[#E16A3D] text-white font-semibold hover:bg-[#f9744d] transition-all"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                                {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
