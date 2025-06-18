import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseAuth";
import { authWithFirebase } from "../fetch/apifetch";

export const FirebaseSignup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const defaultProfilePic =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Actualizamos nombre y foto
      await updateProfile(user, {
        displayName: fullname,
        photoURL: defaultProfilePic,
      });

      // Recargamos el usuario para que los datos se sincronicen
      await user.reload();


      // Obtenemos un nuevo token con la info actualizada
      const idToken = await user.getIdToken(true);

      // Mandamos el token al backend
      await authWithFirebase(idToken);

      alert("✅ Registro exitoso");
      navigate("/");
    } catch (error) {
      console.error("Error al registrar:", error.message);
      alert("❌ Error: " + error.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // En Google no es necesario updateProfile ni reload, porque ya vienen
      // displayName y photoURL en el token
      const idToken = await user.getIdToken();

      await authWithFirebase(idToken);

      alert("✅ Registro con Google exitoso");
      navigate("/");
    } catch (error) {
      console.error("Error en Google Signup:", error.message);
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        paddingTop: "10vh",
        paddingBottom: "5vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        className="p-4 shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          width: "90vw",
          maxWidth: "380px",
          color: "white",
        }}
      >
        <h3 className="text-center mb-4 fw-light">Crear cuenta</h3>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                borderRadius: "10px",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                borderRadius: "10px",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                borderRadius: "10px",
              }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 mb-1"
            style={{
              backgroundColor: "white",
              color: "#1c1c1e",
              borderRadius: "50px",
              fontWeight: 500,
            }}
          >
            Registrarse
          </button>
        </form>

        <hr className="my-4" style={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <button
          onClick={handleGoogleSignup}
          className="btn w-100"
          style={{
            backgroundColor: "#db4437",
            color: "white",
            borderRadius: "50px",
            fontWeight: 500,
          }}
        >
          Registrarse con Google
        </button>
      </div>
    </div>
  );
};
