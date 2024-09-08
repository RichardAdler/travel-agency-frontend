"use client";
import React, { useState } from "react";
import { db } from "../../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const Main = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!name || !email || !message) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      // Add data to Firestore
      await addDoc(collection(db, "contact-us"), {
        name: name,
        email: email,
        message: message,
        submittedAt: new Date(),
      });

      setSuccessMessage("Thank you for contacting us! We will get back to you soon.");
      setErrorMessage(""); // Reset error message
      setName("");
      setEmail("");
      setMessage(""); // Reset form after successful submission

      // Automatically hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrorMessage("There was an error submitting the form. Please try again.");
      console.error("Error adding document: ", error);

      // Automatically hide error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 align-middle content-center min-h-[55vh]">      
      <div className="flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 shadow-md rounded">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Your Message"
                rows={5}
                maxLength={500} // Set the character limit to 500
              />
              <div className="text-gray-600 text-sm mt-1">
                {message.length}/500
              </div> {/* Display character count */}
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <div className="text-center">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Main;
