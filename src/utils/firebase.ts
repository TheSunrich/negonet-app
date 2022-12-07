import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, getBytes, uploadBytesResumable, } from 'firebase/storage';
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
export { db, auth, app, storage };

export async function userExists(uid: any) {
    const docRef = doc(db, 'user', uid);
    const res = await getDoc(docRef);
    console.log(res);
    console.log(res.exists());
    return res.exists();
}

export async function existsUser(email) {
    const users = [];
    const docsRef = collection(db, 'user');
    const q = query(docsRef, where('email', "==", email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    return users.length > 0 ? users[0].uid : null;
}

export async function getUser(uid) {
    const docRef = doc(db, 'user', uid);
    const res = await getDoc(docRef);
    return res.data();
}

export async function registerNewUser(user) {
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

export async function createService(service) {
    try {
        const collectionRef = collection(db, 'service');
        const docRef = addDoc(collectionRef, service);
    } catch (error) {
    }
}

/*list to get categories and las especialidades (no sé cómo escribirlo jaja)*/
export async function getCategories() {
    const categories = [];
    const docsRef = collection(db, 'category');
    const q = query(docsRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        categories.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return categories;
}

export async function getSpecialty(categoryId) {
    const specialty = [];
    const docsRef = collection(db, 'specialty');
    const q = query(docsRef, where('categoryId', "==", categoryId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        specialty.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return specialty;
}


/* Obtener todos los servicios para mostrarlos */
export async function getServices() {
    const categories = [];
    const docsRef = collection(db, 'service');
    const q = query(docsRef, where('isActive', "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        categories.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return categories;
}

export async function getServiceByUser(uid) {
    const services = [];
    const docsRef = collection(db, 'service');
    const q = query(docsRef, where('userId', "==", uid), where('isActive', "==", true));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        services.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return services;
}

export async function searchService(searchOptions) {
    const services = [];
    const docsRef = collection(db, 'service');
    const q = query(docsRef, where('categoryId', "==", searchOptions.categoryId), where('specialtyId', "==", searchOptions.specialtyId), where('isActive', "==", true));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        services.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return services;
}

export async function deleteServiceFirebase(service) {
    try {
        const collectionRef = collection(db, 'service');
        const docRef = doc(collectionRef, service.id);
        await setDoc(docRef, service);
    } catch (error) {

    }
}


export async function uploadImage(image, path): Promise<string> {
    const storageRef = ref(storage, path + image.name);
    const uploadTask = await uploadBytes(storageRef, image);
    return await getDownloadURL(uploadTask.ref).then((downloadURL) => {
        return downloadURL;
    });
}
export async function editService(service) {
    try {
        const collectionRef = collection(db, 'service');
        const docRef = doc(collectionRef, service.id);
        await setDoc(docRef, service);
    } catch (error) {

    }
}