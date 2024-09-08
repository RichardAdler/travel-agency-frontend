const { getFirestore, getDocs, collection } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfbiFhsDiTbHVzMRUfQFBG5jj-BHNFlA8",
    authDomain: "travelagency-a568e.firebaseapp.com",
    projectId: "travelagency-a568e",
    storageBucket: "travelagency-a568e.appspot.com",
    messagingSenderId: "156145917406",
    appId: "1:156145917406:web:4d209b91edb57d57fed14f",
    measurementId: "G-4VHL3SN48Q"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testQuery = async () => {
  const userId = "Uid0ahOqfCfIZegdamkYnpCzdIE3"; // Replace with an actual userId that has bookings
  const userBookingsCollection = collection(db, "bookings", userId, "userBookings");

  const bookingSnapshot = await getDocs(userBookingsCollection);

  if (!bookingSnapshot.empty) {
    bookingSnapshot.forEach((doc) => {
      console.log(`Booking ID: ${doc.id}`, doc.data());
    });
  } else {
    console.log("No bookings found for this user!");
  }
};

testQuery();