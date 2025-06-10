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
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // imagen por defecto

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 🧑 Setear nombre y foto por defecto
      await updateProfile(user, {
        displayName: fullname,
        photoURL: defaultProfilePic,
      });

      // 🔁 Refrescar perfil y token
      await user.reload();
      const updatedUser = auth.currentUser;
      const idToken = await updatedUser.getIdToken(true);

      console.log("🔐 Token generado (signup):", idToken);

      // 🔐 Mandar token al backend
      const res = await authWithFirebase(idToken);
      console.log("Usuario registrado y autenticado:", res);

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

      const idToken = await user.getIdToken();
      console.log("🔐 Token generado (Google signup):", idToken);

      const res = await authWithFirebase(idToken);
      console.log("Google login:", res);

      alert("✅ Registro con Google exitoso");
      navigate("/");
    } catch (error) {
      console.error("Error en Google Signup:", error.message);
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registro con Firebase</h2>

      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
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
          />
        </div>

        <button type="submit" className="btn btn-success">Registrarse</button>
      </form>

      <hr />

      <button onClick={handleGoogleSignup} className="btn btn-danger mt-2">
        Registrarse con Google
      </button>
    </div>
  );
};
