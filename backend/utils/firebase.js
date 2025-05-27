// import {v2 as cloudinary} from "cloudinary"
// import dotenv from "dotenv"

// cloudinary.config({
//     cloud_name:process.env.CLOUD_NAME,
//     api_key:process.env.API_KEY,
//     api_secret:process.env.API_SECRET
// })
// export default cloudinary


// firebase.js
import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync("./firebase-admin-sdk.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "insta-clone-82f38.appspot.com", 
});

const bucket = admin.storage().bucket();
export default bucket;
