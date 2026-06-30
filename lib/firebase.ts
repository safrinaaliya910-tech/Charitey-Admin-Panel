import { initializeApp, getApps, getApp } from "firebase/app";
// Add addDoc and serverTimestamp to whatever you already have imported here!
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQIj6th0aijxmeHmzkRGRekZPXhP63C08",
  authDomain: "charitey-37ce8.firebaseapp.com",
  projectId: "charitey-37ce8",
  storageBucket: "charitey-37ce8.firebasestorage.app",
  messagingSenderId: "49324937832",
  appId: "1:49324937832:web:2483eb7807d59da3a561dd",
  measurementId: "G-GG71PRX0JD"
};

// This safely starts Firebase for your web dashboard
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
// 🛠️ THE MASTER AUDIT LOGGER
export const logAdminAction = async (adminName: string, action: string, details: string) => {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      adminName: adminName,
      action: action,
      details: details,
      timestamp: serverTimestamp(),
      ipAddress: 'Admin Panel', 
    });
    console.log("Audit log saved:", action);
  } catch (error) {
    console.error("Failed to save audit log:", error);
  }
};