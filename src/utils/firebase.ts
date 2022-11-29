import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import { getStorage } from "firebase/storage";

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
const analytics = getAnalytics(app);
//type the auth and firestore functions
const auth = getAuth();
const firestore = getFirestore(app);
const performance = getPerformance(app);
const storage = getStorage(app);

export { analytics, auth, firestore, performance, storage };