// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, get, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB_kBT99dJeBfMcFqwiUpWz8TBilwlxefc",
    authDomain: "pointstudents-4b175.firebaseapp.com",
    projectId: "pointstudents-4b175",
    storageBucket: "pointstudents-4b175.firebasestorage.app",
    messagingSenderId: "402858251660",
    appId: "1:402858251660:web:96fdef36b4977fbf06f2a9",
    measurementId: "G-T4ZYY15V84",
    databaseURL: "https://pointstudents-4b175-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, get, push, onValue, update, remove };
