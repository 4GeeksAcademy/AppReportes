import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseAuth";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      console.error("Error enviando email:", err.message);
      setError("Correo no válido o no registrado");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Restablecer contraseña</h2>
      {sent ? (
        <div className="alert alert-success">
          📧 Se ha enviado un correo para restablecer tu contraseña.
        </div>
      ) : (
        <form onSubmit={handleReset}>
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
          <button type="submit" className="btn btn-warning">Enviar email</button>
        </form>
      )}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};
