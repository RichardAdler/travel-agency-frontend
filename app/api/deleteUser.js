// /app/api/deleteUser.js
import admin from "../firebase/firebaseAdmin"; 

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { uid } = req.body;
    
    try {
      console.log("Deleting user from Firebase Authentication with UID:", uid); // Debug log

      // Use Firebase Admin SDK to delete the user from Firebase Authentication
      await admin.auth().deleteUser(uid);
      console.log("User deleted from Firebase Auth"); // Debug log

      res.status(200).json({ message: "User deleted from Firebase Authentication." });
    } catch (error) {
      console.error("Error deleting user:", error.message); // Debug log
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}