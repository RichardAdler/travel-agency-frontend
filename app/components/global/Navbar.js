"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AuthPopup from "./AuthPopup";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for hamburger and close button

const Navbar = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authPopupMode, setAuthPopupMode] = useState(null);
  const [user, loading] = useAuthState(auth);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("/images/default-profile.png");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
          setUserRole(userDoc.data().role);
          if (userDoc.data().profileImageUrl) {
            setProfileImageUrl(userDoc.data().profileImageUrl);
          }
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const openAuthPopup = (mode) => {
    setAuthPopupMode(mode);
  };

  const closeAuthPopup = () => {
    setAuthPopupMode(null);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-gray-950 bg-opacity-50 backdrop-blur-sm shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/white-logo-no-background.png"
                alt="Logo"
                width={200}
                height={100}
                className="mr-3"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center space-x-8 text-xl">
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
            <Link href="/blog" className="text-white hover:underline">
              Blog
            </Link>
            <Link href="/contact-us" className="text-white hover:underline">
              Contact Us
            </Link>
            <Link href="/faq" className="text-white hover:underline">
              FAQ
            </Link>
            {user && userRole === "user" && (
              <Link href="/dashboard/user/my-bookings" className="text-white hover:underline">
                My Bookings
              </Link>
            )}
            {user && userRole === "admin" && (
              <Link href="/dashboard/admin" className="text-white hover:underline">
                Admin
              </Link>
            )}
          </nav>

           {/* Mobile Hamburger Icon */}
           <div className="md:hidden">
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <FaTimes className="text-white w-8 h-8" />
              ) : (
                <FaBars className="text-white w-8 h-8" />
              )}
            </button>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href={userRole === "admin" ? "/dashboard/admin" : "/dashboard/user"}>
                  <button className="bg-orange-500 text-white px-2 py-1 rounded-md flex items-center">
                    <Image
                      src={profileImageUrl}
                      alt="Profile Picture"
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                    {userName}
                  </button>
                </Link>
                <button className="text-white" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-white"
                  onClick={() => openAuthPopup("login")}
                >
                  Login
                </button>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-md"
                  onClick={() => openAuthPopup("signup")}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-gray-900 text-white space-y-4 p-4 absolute top-16 left-0 right-0 z-40">
            <Link href="/" className="block text-white hover:underline" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link href="/blog" className="block text-white hover:underline" onClick={toggleMobileMenu}>
              Blog
            </Link>
            <Link href="/contact-us" className="block text-white hover:underline" onClick={toggleMobileMenu}>
              Contact Us
            </Link>
            <Link href="/faq" className="block text-white hover:underline" onClick={toggleMobileMenu}>
              FAQ
            </Link>
            {user && userRole === "user" && (
              <Link
                href="/dashboard/user/my-bookings"
                className="block text-white hover:underline"
                onClick={toggleMobileMenu}
              >
                My Bookings
              </Link>
            )}
            {user && userRole === "admin" && (
              <Link
                href="/dashboard/admin"
                className="block text-white hover:underline"
                onClick={toggleMobileMenu}
              >
                Admin
              </Link>
            )}
            <div className="border-t border-gray-700 pt-4">
              {user ? (
                <>
                  <button
                    className="text-white block w-full text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-white block w-full text-left"
                    onClick={() => {
                      openAuthPopup("login");
                      toggleMobileMenu();
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="bg-orange-500 text-white w-full text-left px-4 py-2 rounded-md mt-2"
                    onClick={() => {
                      openAuthPopup("signup");
                      toggleMobileMenu();
                    }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      {authPopupMode && (
        <AuthPopup onClose={closeAuthPopup} initialMode={authPopupMode} />
      )}
    </>
  );
};

export default Navbar;
