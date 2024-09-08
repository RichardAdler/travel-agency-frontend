"use client"
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Footer from '../../components/global/Footer';
import { FaPencilAlt } from 'react-icons/fa';
import { sendPasswordResetEmail } from 'firebase/auth'; // Import the function to send a password reset email

const UserProfile = () => {
    const [user, loading] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('/images/default-profile.png'); // Default profile image
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false); // State for reset password modal
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newCountry, setNewCountry] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [resetEmail, setResetEmail] = useState(''); // State for the email input in reset modal
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserInfo(data);
                    setNewName(data.name || '');
                    const [city, country] = (data.location || '').split(', ');
                    setNewCity(city || '');
                    setNewCountry(country || '');
                    setNewDescription(data.description || '');
                    // Load profile picture if available, otherwise use default
                    if (data.profileImageUrl) {
                        setProfileImageUrl(data.profileImageUrl);
                    } else {
                        setProfileImageUrl('/images/default-profile.png');
                    }
                }
            }
        };

        fetchUserInfo();
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const storageRef = ref(storage, `users/${user.uid}/profile-picture`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update Firestore with the new profile picture URL
        await updateDoc(doc(db, 'users', user.uid), { profileImageUrl: downloadURL });

        setProfileImageUrl(downloadURL);
        setUploading(false);
        setShowUploadModal(false); // Close the modal after uploading
    };

    const handleSave = async () => {
        setEditing(false);
        const newLocation = `${newCity}, ${newCountry}`;
        await updateDoc(doc(db, 'users', user.uid), {
            name: newName,
            location: newLocation,
            description: newDescription,
        });
        setUserInfo({ ...userInfo, name: newName, location: newLocation, description: newDescription });
    };

    const handleResetPassword = () => {
        sendPasswordResetEmail(auth, user.email)
            .then(() => alert('Password reset link sent to your email.'))
            .catch(error => alert('Failed to send reset email. Please try again.'));
    };

    const goToBookings = () => {
        router.push('/dashboard/user/my-bookings'); // Navigate to My Bookings page
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>You must be logged in to view this page.</p>;

    return (
        <>
        <div className="min-h-[30vh] bg-gradient-to-r from-orange-700 to-pink-500"></div>
        <div className="min-h-[40vh] max-h-[70vh] bg-gradient-to-r from-orange-700 to-pink-500 flex items-end justify-center pb-[10vh]">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full text-center relative">
                <div className="relative w-32 h-32 mx-auto -top-[75px]"> {/* Adjusted from -top-[80px] to -top-[40px] */}
                    <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                        onClick={() => setShowUploadModal(true)} // Show modal on click
                    />
                    <div className="absolute bottom-0 left-0 right-0 text-center bg-white bg-opacity-75 text-black text-xs py-1 cursor-pointer rounded-b-full"
                        onClick={() => setShowUploadModal(true)}>
                        Change Picture
                    </div>
                </div>
                
                {/* Name and Location Section */}
                
                <div className="text-lg font-bold -mt-[50px]">{userInfo?.name || "User Name"}</div> {/* Changed mt-10 to mt-0 */}
                <div className="text-gray-500">{userInfo?.location || "Location"}</div>
                <div className="text-sm m-2 text-gray-600 italic">{userInfo?.description || "No description available."} 
                    <FaPencilAlt
                        onClick={() => setEditing(true)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer inline ml-2"
                    /></div>
    
                {/* Buttons */}
                <div className="flex flex-col items-center mt-10 space-y-4">
                    <button
                        onClick={goToBookings}
                        className="bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 px-6 rounded-full hover:from-pink-600 hover:to-orange-600"
                    >
                        My Bookings
                    </button>
    
                    <button
                        onClick={handleResetPassword}
                        className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition"
                    >
                        Reset Password
                    </button>
                </div>
               
                {/* Modals */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-96 relative">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                            >
                                &times;
                            </button>
                            <h3 className="text-xl font-semibold mb-4 text-center">Upload Profile Picture</h3>
                            <div className="flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full mb-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition"
                                />
                                {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="bg-red-500 text-white py-2 px-6 rounded-lg mt-2 hover:bg-red-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
    
                {showResetModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-96 relative">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                            >
                                &times;
                            </button>
                            <h3 className="text-xl font-semibold mb-4 text-center">Reset Password</h3>
                            <div className="flex flex-col items-center justify-center">
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter your email"
                                />
                                <button
                                    onClick={handleSendResetEmail}
                                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </div>
                    </div>
                )}
    
                {editing && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-96 relative">
                            <button
                                onClick={() => setEditing(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                            >
                                &times;
                            </button>
                            <h3 className="text-xl font-semibold mb-4 text-center">Edit Profile</h3>
                            <div className="flex flex-col items-center justify-center">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Name"
                                />
                                <div className="flex space-x-2 mb-4">
                                    <input
                                        type="text"
                                        value={newCity}
                                        onChange={(e) => setNewCity(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="City"
                                    />
                                    <input
                                        type="text"
                                        value={newCountry}
                                        onChange={(e) => setNewCountry(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Country"
                                    />
                                </div>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Short Description"
                                    rows="3"
                                />
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <Footer />
    </>
    
    );
};

export default UserProfile;
