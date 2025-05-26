// src/front/firebaseAuth.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ este es el correcto para Auth

const firebaseConfig = {
  apiKey: "AIzaSyDTQJp7FOqBXiSILc6AgFYXlzf8QqkammQ",
  authDomain: "appreportes-5fcd3.firebaseapp.com",
  projectId: "appreportes-5fcd3",
  storageBucket: "appreportes-5fcd3.appspot.com",  // corregido también
  messagingSenderId: "798866046412",
  appId: "1:798866046412:web:7f62b320f9566be070b169",
  measurementId: "G-EDG37LPEJQ"
};

// ✅ 1. Inicializa la app
const app = initializeApp(firebaseConfig);

// ✅ 2. Obtén auth DESPUÉS de inicializar
export const auth = getAuth(app);
