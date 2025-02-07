  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
  import {  getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
  import {  getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
   
  
  const firebaseConfig = {
    apiKey: "AIzaSyBaULG15IREUNM1OAeBh4bKhhSlVhLFE3U",
    authDomain: "user-aut-60bf0.firebaseapp.com",
    projectId: "user-aut-60bf0",
    storageBucket: "user-aut-60bf0.firebasestorage.app",
    messagingSenderId: "562929223456",
    appId: "1:562929223456:web:94b2a4822706ef2cd6b945"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);