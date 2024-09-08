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

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authPopupMode, setAuthPopupMode] = useState(null);
  const [user, loading] = useAuthState(auth);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(
    "/images/default-profile.png"
  ); // Default profile image
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
          setUserRole(userDoc.data().role); // Ensure role is correctly set
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
          <nav className="flex-1 flex justify-center space-x-8 text-xl">
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
            <Link href="/blog" className="text-white hover:underline">
              Blog
            </Link>
            <Link href="/contact-us" className="text-white hover:underline">
              Contact Us
            </Link>
            {user && userRole === "user" && (
              <Link
                href="/dashboard/user/my-bookings"
                className="text-white hover:underline"
              >
                My Bookings
              </Link>
            )}
            {user && userRole === "admin" && (
              <Link
                href="/dashboard/admin"
                className="text-white hover:underline"
              >
                Admin
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={userRole === "admin" ? "/dashboard/admin" : "/dashboard/user"}
                >
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
      </header>
      {authPopupMode && (
        <AuthPopup onClose={closeAuthPopup} initialMode={authPopupMode} />
      )}
    </>
  );
};

export default Navbar;
