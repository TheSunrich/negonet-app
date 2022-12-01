const admin = require("firebase-admin");
const functions = require("firebase-functions");
const db = admin.firestore();

exports.createUser = functions.https.onCall(async (user) => {
  // create user with firebase auth sdk
  return await admin
    .auth()
    .createUser({
      email: user.email,
      emailVerified: false,
      password: user.password,
    })
    .then((userRecord) => {
      try {
        return db.collection("users").doc(userRecord.uid).set(user);
      } catch (error) {
        console.log("Error creating new user:", error);
        return error;
      }
    });
});

exports.updateUser = functions.https.onCall(async (user) => {
    // update user with firebase auth sdk
    return await admin
        .auth()
        .updateUser(user.uid, {
        email: user.email,
        emailVerified: false,
        password: user.password,
        })
        .then((userRecord) => {
        try {
            return db.collection("users").doc(userRecord.uid).set(user);
        } catch (error) {
            console.log("Error updating user:", error);
            return error;
        }
        });

});

exports.deleteUser = functions.https.onCall(async (user) => {
    // delete user with firebase auth sdk
    return await admin
        .auth()
        .deleteUser(user.uid)
        .then(() => {
        try {
            return db.collection("users").doc(user.uid).delete();
        } catch (error) {
            console.log("Error deleting user:", error);
            return error;
        }
        });
});

exports.getUser = functions.https.onCall(async (user) => {
    // get user with database sdk
    return await db
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
        if (doc.exists) {
            return doc.data();
        } else {
            return "No such document!";
        }
        })
});


exports.getUsers = functions.https.onCall(async (user) => {
    // get users with database sdk
    return await db
        .collection("users")
        .get()
        .then((querySnapshot) => {
        try {
            return querySnapshot;
        } catch (error) {
            console.log("Error getting users:", error);
            return error;
        }
        });

});