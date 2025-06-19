import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseAuth";
import { useNavigate, Link } from "react-router-dom";
import { authWithFirebase } from "../fetch/apifetch";
// import cityFondo from "../assets/img/city_fondo3.jpg"; // asegúrate de que esté importado

export const FirebaseLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idToken = await user.getIdToken(); // ← Token de Firebase


      const res = await authWithFirebase(idToken);
      alert("✅ Login exitoso");
      navigate("/feed");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("❌ Error: " + error.message);
    }
  };


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const idToken = await user.getIdToken();

      const res = await authWithFirebase(idToken);
      alert("✅ Login con Google exitoso");
      res.user.is_moderator ? navigate("/moderador") : navigate("/feed");
    } catch (error) {
      console.error("Error en Google login:", error.message);
      alert("❌ Error con Google: " + error.message);
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
          maxWidth: "360px",
          color: "white",
        }}
      >
        <h3 className="text-center mb-4 fw-light">Iniciar Sesión</h3>
        <form onSubmit={handleLogin}>
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
            className="btn w-100 mb-2"
            style={{
              backgroundColor: "white",
              color: "#1c1c1e",
              borderRadius: "50px",
              fontWeight: 500,
            }}
          >
            Iniciar sesión
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/reset-password" style={{ color: "#ccc", fontSize: "0.9rem" }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <hr className="my-4" style={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <button
          className="btn w-100"
          onClick={handleGoogleLogin}
          style={{
            backgroundColor: "#db4437",
            color: "white",
            borderRadius: "50px",
            fontWeight: 500,
          }}
        >
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};
