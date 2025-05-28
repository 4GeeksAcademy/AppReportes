import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseAuth"; // Tu configuración de Firebase
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


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
      console.log("Login exitoso:", user);
      navigate("/"); // Redirigir al home
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Email o contraseña incorrectos");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Login con Google exitoso:", user);
      navigate("/"); // Redirigir al home
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
      alert("❌ Error con Google: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
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
        <button className="btn btn-primary mb-3" type="submit">Iniciar sesión</button>
      </form>
      <p className="mt-3">
        <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
      </p>   

      <hr />

      <button className="btn btn-danger" onClick={handleGoogleLogin}>
        Iniciar sesión con Google
      </button>


    </div>
  );
};
