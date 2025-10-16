// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBHZj84m_fEo5yLSU5s-KELIV_E4JsecyM",
    authDomain: "symbaiosis-b224e.firebaseapp.com",
    projectId: "symbaiosis-b224e",
    storageBucket: "symbaiosis-b224e.firebasestorage.app",
    messagingSenderId: "789376695383",
    appId: "1:789376695383:web:b47d80e2ff04532d7d3712",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// New helper function
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        throw error;
    }
};

export { auth, db, provider, signInWithGoogle };