// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXpPDyEUqGbkoFOlJz7YI8TQaDoz1wgA8",
    authDomain: "test-5c3a2.firebaseapp.com",
    projectId: "test-5c3a2",
    storageBucket: "test-5c3a2.appspot.com",
    messagingSenderId: "830947974853",
    appId: "1:830947974853:web:94a075f39126438e725aac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
