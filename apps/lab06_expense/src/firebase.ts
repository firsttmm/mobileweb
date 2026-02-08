
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1Qlb4ikO43yghGH297h0lWvmWATRlisk",
  authDomain: "lab06-expense-eea5d.firebaseapp.com",
  projectId: "lab06-expense-eea5d",
  storageBucket: "lab06-expense-eea5d.firebasestorage.app",
  messagingSenderId: "116241416139",
  appId: "1:116241416139:web:63a338372924bc91f8804e"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);