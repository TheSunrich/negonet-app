import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAD64vbbFCLso2nennhePArHrvykiZ8GXo",
    authDomain: "negonet-1fb9c.firebaseapp.com",
    databaseURL: "https://negonet-1fb9c-default-rtdb.firebaseio.com",
    projectId: "negonet-1fb9c",
    storageBucket: "negonet-1fb9c.appspot.com",
    messagingSenderId: "151124370514",
    appId: "1:151124370514:web:87db106d02f150bcd6eb8b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };