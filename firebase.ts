import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBaI9Q4gpAww4OJZ7T5n6CNv1rtLhluyjo",
  authDomain: "chat-with-pdf-f71a0.firebaseapp.com",
  projectId: "chat-with-pdf-f71a0",
  storageBucket: "chat-with-pdf-f71a0.appspot.com",
  messagingSenderId: "1036576450098",
  appId: "1:1036576450098:web:2671d9fc1416a84997be2b",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
