import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, getBytes } from 'firebase/storage';
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
const storage = getStorage(app);
export { db, auth, app };

export async function userExists(uid: any) {
    const docRef = doc(db, 'user', uid);
    const res = await getDoc(docRef);
    console.log(res);
    return res.exists();
}

export async function existsUser(email){
    console.log(email)
    const users = [];
    const docsRef = collection(db, 'user');
    const q = query(docsRef, where('email', "==", email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    console.log(users)
    return users.length > 0 ? users[0].uid : null;
}

export async function registerNewUser(user){
    try {
        const collectionRef = collection(db, 'user');
        const docRef = doc(collectionRef, user.uid);
        await setDoc(docRef, user);
    } catch (error) {
    }
}

export async function updateUser(user) {
    try {
        const collectionRef = collection(db, 'user');
        const docRef = doc(collectionRef, user.uid);
        await setDoc(docRef, user);
    } catch (error) {
        
    }
}