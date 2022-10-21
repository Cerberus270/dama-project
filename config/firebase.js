// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-D88f_phfP1AWq2HqVCAp_aX2KgzB694",
    authDomain: "dama-project-c83f4.firebaseapp.com",
    projectId: "dama-project-c83f4",
    storageBucket: "dama-project-c83f4.appspot.com",
    messagingSenderId: "1010125777441",
    appId: "1:1010125777441:web:142f91eca9c0b22f0f5160",
    measurementId: "G-D2F00Q77NB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
//const analytics = getAnalytics(app);

export {
    app,
    auth,
    db,
}