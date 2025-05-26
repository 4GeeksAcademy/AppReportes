import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseAuth";

export const FirebaseSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario registrado:", user);
      alert("✅ Registro exitoso");
      navigate("/login"); // Redirige a login
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
      console.log("Registro con Google exitoso:", user);
      alert("✅ Registro con Google exitoso");
      navigate("/"); // Redirige directamente a home
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
