const admin = require("firebase-admin");
const serviceAccount = require("./travelagency-a568e-firebase-adminsdk-7m10m-fb05a2bedd.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;