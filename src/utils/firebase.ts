import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, getBytes, uploadBytesResumable, } from 'firebase/storage';
import { id } from "date-fns/locale";
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

/*list to get categories and las especialidades (no s?? c??mo escribirlo jaja)*/
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
export async function getServices(user) {
    const service = [];
    const docsRef = collection(db, 'service');
    const q = query(docsRef, where('isActive', "==", true), where('userId', "!=", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        service.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return service;
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

export async function checkAvailabilityService(service, dateStart, dateEnd){
    console.log("Checamos la disponibilidad", service, dateStart, dateEnd)
    const collectionRef = collection(db, 'appointment');
    const q = query(collectionRef, where('dateStart', '>=', dateStart), where('serviceId', '==', service));
    
    return await getDocs(q).then((docs) => {
        if (docs.empty) {

            console.log("No matching documents for docID: " + service);
            return true
          } else {
            // for each doc in docs
            let available
            // @ts-ignore
            docs.docs.forEach(doc => {
              let data = doc.data() as any
              console.log("Comparando fechas", data.dateStart.toDate(), dateEnd)
              if (data.dateStart.toDate() < dateEnd) {
                available = false
              }
    
            })
            console.log("Qu?? trais", available)
            return available == undefined
          }
    });

}

export async function addAppointment(appointment) {
    try {
        const collectionRef = collection(db, 'appointment');
        const docRef = addDoc(collectionRef, appointment);
        return docRef
    } catch (error) {
        return null

    }

}
    


/* obtener appointments */

export async function getAppointmentAll(uid){
    const appointment = [];
    const docsRef = collection(db, 'appointment');
    const q = query(docsRef, where('isCanceled', '==', false), where('userClientId', "!=", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        appointment.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return appointment;
}

export async function getAppointmentActual(uid){
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let tomorrow2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);
    const appointment = [];
    const docsRef = collection(db, 'appointment');
    const q = query(docsRef, where('userClientId', "==", uid), where('dateStart', ">=", today), where('dateStart', "<", tomorrow2));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        appointment.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return appointment;
}
export async function getAppointmentActualProvider(uid){
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let tomorrow2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);
    const appointment = [];
    const docsRef = collection(db, 'appointment');
    const q = query(docsRef, where('isCanceled', '==', false), where('userProviderId', "==", uid), where('dateStart', ">=", today), where('dateStart', "<", tomorrow2));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        appointment.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return appointment;
}
export async function getAppointmentPast(uid){
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let tomorrow2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);
    const appointment = [];
    const docsRef = collection(db, 'appointment');
    const q = query(docsRef, where('userClientId', "==", uid), where('dateStart', "<", today));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        appointment.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return appointment;
}
export async function getAppointmentCompleteProvider(uid){
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let tomorrow2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const appointment = [];
    const docsRef = collection(db, 'appointment');
    const q = query(docsRef, where('isCanceled', '==', false), where('userProviderId', "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if( doc.data().status== "Completado"){
            appointment.push({
                id: doc.id,
                ...doc.data()
            });
        }

    });
    return appointment;
}
export async function getAppointmentFuture(uid){
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let tomorrow2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);
    const appointment = [];
    const docsRef = collection(db, 'appointment');
    const q = query(docsRef, where('userClientId', "==", uid), where('dateStart', ">=", tomorrow2));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        appointment.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return appointment;
}
export async function getAppointmentFutureProvider(uid){
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let tomorrow2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const appointment = [];
    const docsRef = collection(db, 'appointment');
    const q = query(docsRef, where('isCanceled', '==', false), where('userProviderId', "==", uid), where('dateStart', ">=", tomorrow2));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if( doc.data().status !== "Completado"){

        appointment.push({
            id: doc.id,
            ...doc.data()
        });
    }
    });
    return appointment;
}

export async function getAppointmentCancelProvider(uid){
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let tomorrow2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const appointment = [];
    const docsRef = collection(db, 'appointment');
    const q = query(docsRef, where('isCanceled', '==', true), where('userProviderId', "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        appointment.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return appointment;

}

export async function cancelAppointment(appointment){
    try {
        const collectionRef = collection(db, 'appointment');
        const docRef = doc(collectionRef, appointment.id);
        await setDoc(docRef, appointment);
    } catch (error) {

    }
}
