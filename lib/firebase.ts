import { initializeApp, getApps, getApp } from "firebase/app";
// Add addDoc and serverTimestamp to whatever you already have imported here!
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // We use `as string` to tell TypeScript "Don't worry, this definitely exists!"
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
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