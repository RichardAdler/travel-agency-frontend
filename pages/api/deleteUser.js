import admin from "../../app/firebase/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { uid } = req.body;
    
    try {
      console.log(`Attempting to delete user with UID: ${uid}`);
      
      // Use Firebase Admin SDK to delete the user
      await admin.auth().deleteUser(uid);
      console.log("User deleted from Firebase Authentication");

      res.status(200).json({ message: "User deleted from Firebase Authentication." });
    } catch (error) {
      console.error("Error deleting user from Firebase Auth:", error.message); // Log the error
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
