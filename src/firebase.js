
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // your config here
  apiKey: "AIzaSyBzM5OnMUdBrGWBcZotDxlRh0qEnwLvtNk",
    authDomain: "arco-trailers.firebaseapp.com",
    projectId: "arco-trailers",
    storageBucket: "arco-trailers.appspot.com",
    messagingSenderId: "557877308737",
    appId: "1:557877308737:web:1aaaed23f6537f4ca585c0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


