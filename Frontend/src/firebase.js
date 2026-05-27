import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzE-qWayNygELI658X58ns3Aju6xngUFQ",
  authDomain: "gasconnect-2f643.firebaseapp.com",
  projectId: "gasconnect-2f643",
  storageBucket: "gasconnect-2f643.firebasestorage.app",
  messagingSenderId: "438302529734",
  appId: "1:438302529734:web:42c40ce09c3d00341a5fc7"
};

const appFirebase = initializeApp(firebaseConfig);

export const authFirebase = getAuth(appFirebase);
export const dbFirebase = getFirestore(appFirebase);

export default appFirebase;
