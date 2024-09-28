import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQlGpVBYcwQm1HPZXVKRObuDTNjIzzN38",
  authDomain: "kartick-9eef9.firebaseapp.com",
  projectId: "kartick-9eef9",
  storageBucket: "kartick-9eef9.appspot.com",
  messagingSenderId: "1061656709800",
  appId: "1:1061656709800:web:0d47ef9505d3224bd5509d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const playersCollection = collection(db, "players");

export { playersCollection };
