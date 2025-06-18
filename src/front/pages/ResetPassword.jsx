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
        <h3 className="text-center mb-4 fw-light">Restablecer contraseña</h3>

        {sent ? (
          <div
            className="alert alert-success"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "white",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
            }}
          >
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
              className="btn w-100"
              style={{
                backgroundColor: "#003366",
                color: "white",
                borderRadius: "50px",
                fontWeight: 500,
              }}
            >
              Enviar email
            </button>
          </form>
        )}

        {error && (
          <div
            className="alert alert-danger mt-3"
            style={{
              backgroundColor: "rgba(255, 0, 0, 0.15)",
              color: "white",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
