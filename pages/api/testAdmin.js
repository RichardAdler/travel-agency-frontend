import admin from "../../app/firebase/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { uid } = req.query;

    try {
      console.log(`Fetching user with UID: ${uid}`);
      
      // Test retrieving a user from Firebase Authentication
      const userRecord = await admin.auth().getUser(uid);
      console.log("User found:", userRecord);
      
      res.status(200).json({ message: "Admin SDK is working", user: userRecord });
    } catch (error) {
      console.error("Error fetching user from Firebase Auth:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
