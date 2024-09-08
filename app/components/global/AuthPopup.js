// AuthPopup.js
import React, { useState } from 'react';
import { auth, googleProvider, db } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Portal from './Portal';
import { FcGoogle } from 'react-icons/fc';

const AuthPopup = ({ onClose, initialMode = 'login' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);

    // Inside your auth signup logic in AuthPopup.js
        const handleAuth = async (e) => {
            e.preventDefault();
            try {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                } else {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    // Set user role in Firestore
                    await setDoc(doc(db, 'users', userCredential.user.uid), {
                        name,
                        email,
                        role: 'user', // Set default role as 'user'
                    });
                }
                onClose(); // Close the popup after successful authentication
            } catch (err) {
                setError(err.message);
                if (isLogin) {
                    setAttemptCount(attemptCount + 1);
                }
            }
        };

        const handleGoogleSignIn = async () => {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (!userDoc.exists()) {
                    // Set user role in Firestore if it's a new user
                    await setDoc(doc(db, 'users', user.uid), {
                        name: user.displayName,
                        email: user.email,
                        role: 'user', // Set default role as 'user'
                    });
                }
                onClose(); // Close the popup after successful authentication
            } catch (err) {
                setError(err.message);
            }
        };


    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email address.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setError('Password reset email sent. Check your inbox.');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Portal>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl flex overflow-hidden">
                    <div className={`relative w-1/2 bg-cover bg-center ${isLogin ? 'login-image' : 'signup-image'}`}>
                        <div className="absolute inset-0 bg-black opacity-15"></div>
                    </div>
                    <div className="w-1/2 p-8 relative">
                        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Sign in to Holiday Havens' : 'Sign up for Holiday Havens'}</h2>
                        <form onSubmit={handleAuth}>
                            {!isLogin && (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full name"
                                    className="w-full p-2 border mb-4"
                                    required
                                />
                            )}
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full p-2 border mb-4"
                                required
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full p-2 border mb-4"
                                required
                            />
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white p-2 rounded-lg mb-4">
                                {isLogin ? 'Continue' : 'Sign Up'}
                            </button>
                            {isLogin && attemptCount > 0 && (
                                <button type="button" onClick={handleForgotPassword} className="text-blue-600 underline mb-4">
                                    Forgot Password?
                                </button>
                            )}
                        </form>
                        <div className="text-center mb-4">
                            <span className="text-gray-600">{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                            <button
                                onClick={() => {
                                    setError('');
                                    setEmail('');
                                    setPassword('');
                                    setIsLogin(!isLogin);
                                    setAttemptCount(0);
                                }}
                                className="text-blue-600 underline ml-1"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </div>
                        <div className="flex justify-center items-center mb-4">
                            <hr className="w-1/4" />
                            <span className="mx-2 text-gray-400">OR</span>
                            <hr className="w-1/4" />
                        </div>
                        <button onClick={handleGoogleSignIn} className="w-full bg-white border p-2 rounded-lg flex items-center justify-center mb-2">
                            <FcGoogle className="w-5 h-5 mr-2" />
                            Sign in with Google
                        </button>
                        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">&times;</button>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default AuthPopup;
