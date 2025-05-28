// src/front/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseAuth";

// 1. Creamos el contexto
const AuthContext = createContext();

// 2. Provider para envolver la app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // para saber si Firebase ya respondió

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false); // ya tenemos respuesta
    });

    return () => unsubscribe(); // limpiamos listener al desmontar
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook para acceder al contexto
export const useAuth = () => useContext(AuthContext);
