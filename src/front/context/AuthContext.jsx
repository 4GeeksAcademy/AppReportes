// src/front/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // Usuario Firebase
  const [userBackend, setUserBackend] = useState(null); // Usuario del backend
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser || null);
      // setUserBackend(null); // Limpiar datos anteriores

      if (firebaseUser && !userBackend) {
        try {
          const token = await firebaseUser.getIdToken();

          // Paso 1: Notificamos al backend y creamos el usuario si no existe
          const authRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/firebase-auth`, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          if (!authRes.ok) {
            const errorText = await authRes.text();
            console.error("Error en /firebase-auth:", authRes.status, errorText);
            setUserBackend(null);
            setLoading(false);
            return;
          }

          // Paso 2: Obtener info del usuario desde el backend
          const infoRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userinfo`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          const text = await infoRes.text();

          try {
            const data = JSON.parse(text);
            setUserBackend(data.user || data);
          } catch (jsonError) {
            console.error("Respuesta no era JSON válida:", jsonError);
            setUserBackend(null);
          }
        } catch (error) {
          console.error("Error al autenticar con backend:", error);
          setUserBackend(null);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userBackend, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
