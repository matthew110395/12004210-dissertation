// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, httpsCallable, httpsCallableFromURL } from 'firebase/functions';
import axios from "axios";

import {
  GoogleAuthProvider, getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore, query,
  getDocs,
  collection,
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  doc
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABeHwTqws0VeJlgPmehuxyz9-nd2Y9yf0",
  authDomain: "dissertation-feed8.firebaseapp.com",
  projectId: "dissertation-feed8",
  storageBucket: "dissertation-feed8.appspot.com",
  messagingSenderId: "272008450563",
  appId: "1:272008450563:web:4d1acde765438a8093b436",
  measurementId: "G-SR6VHP05JY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    return err
  }
};
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    return err
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    return(err);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};

const getUser = () => {

  const user = auth.currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const userDetails = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      uid: user.uid
    };
    return userDetails
  } else {
    console.log("No User Logged In");
  }
};

//Add document to collection
//collection = String containing collection name
//data = JSON object of data to be entered
const setDocument = async (collectionName, data) => {
  data.timestamp = serverTimestamp();
  const docRef = await addDoc(collection(db, collectionName), data);
  //console.log("Document written with ID: ", docRef.id);
  return docRef.id;
};
//Add Score to existing Document

const setSubDocument = async (collectionName, subCollection, docID, data) => {
  data.timestamp = serverTimestamp();
  const docRef = doc(db, collectionName, docID);
  const subRef = await addDoc(collection(docRef, subCollection), data);
  console.log("Document written with ID: ", subRef.id);
};

//Add to array in Doc
const addArray = async (collectionName, docID, item, newData) => {
  const docRef = doc(db, collectionName, docID);
  let updateJSON = {};
  updateJSON[item] = arrayUnion(newData);
  await updateDoc(docRef, updateJSON);
  console.log("Document updated with ID: ", docRef.id);
}

//Get Documents from collection
//collection = String containing collection name
//query = Firebase Query
const getDocuments = async (collectionName, whereVar) => {
  const queryVar = query(collection(db, collectionName), whereVar);
  const data = await getDocs(queryVar);
  let retData = [];
  data.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    let retbuild = doc.data();
    retbuild.id = doc.id;
    retData.push(retbuild);
  });
  return retData;

};
//Get Sub Documents from collection
//collection = String containing collection name
//query = Firebase Query
const getSubDocuments = async (collectionName, subCollection, docID) => {
  const docRef = doc(db, collectionName, docID);

  const queryVar = collection(docRef, subCollection);
  const data = await getDocs(queryVar);
  let retData = [];
  data.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    let retbuild = doc.data();
    retbuild.id = doc.id;
    retData.push(retbuild);
  });
  return retData;

};
const getUserName = async (uid) => {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const data = await getDocs(q);
  let retData = [];
  data.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const user = doc.data();
    retData.push(user.name);
  });
  return retData[0]

}

//Calculate Score
const fnScore = async (baseNotes, overlayNotes) => {
  return new Promise((resolve, reject) => {
    const payload = {
      "base": baseNotes,
      "over": overlayNotes
    };
    console.log(payload)
    const dtweuclidean = httpsCallableFromURL(functions, "https://dtweuclidean-octtayfiya-uc.a.run.app");
    //const dataret = await dtweuclidean(payload)

    dtweuclidean(payload)
      .then((result) => {
        resolve(result)
      })
      .catch(err => {
        reject(err)
      })

  })
}

const fnBasicPitch = async (audioBuffer) => { 
  return new Promise((resolve, reject) => {

    //const functions = getFunctions();
    const formData = new FormData();
    formData.append("File", audioBuffer);

    //const basicPitchPredictor = httpsCallableFromURL(functions, 'https://basicpitch-cloud-octtayfiya-uc.a.run.app');
    //basicPitchPredictor(formData)
     axios.post('https://basicpitch-cloud-octtayfiya-uc.a.run.app',formData,{
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((result) => {
        resolve(result.data)
      })
      .catch(err => {
        reject(err)
      })
  });

}

const fnMagenta = async (audioBuffer) => { 
  return new Promise((resolve, reject) => {

    //const functions = getFunctions();
    const formData = new FormData();
    formData.append("File", audioBuffer);

     axios.post('https://magenta-octtayfiya-uc.a.run.app',formData,{
     //axios.post('http://localhost:8080',formData,{
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((result) => {
        resolve(result.data)
      })
      .catch(err => {
        reject(err)
      })
  });

}

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getUser,
  setDocument,
  getDocuments,
  fnScore,
  fnBasicPitch,
  fnMagenta,
  setSubDocument,
  getSubDocuments,
  getUserName,
  addArray
};