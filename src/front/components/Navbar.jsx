import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseAuth";
import logo from "../assets/img/beacon-sinfondo.png";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/firebase-login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark rounded-5 m-2 px-3 py-2 position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center w-100">
        {/* Botón hamburguesa a la izquierda */}
        <button
          className="btn btn-outline-light"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Centro: logo (solo si el menú está cerrado) */}
        {!menuOpen && (
          <Link
            to="/feed"
            className="position-absolute top-50 start-50 translate-middle"
          >
            <img src={logo} alt="Logo" style={{ height: "40px" }} />
          </Link>
        )}

        {/* Menú desplegable horizontal (dentro del navbar) */}
        {menuOpen && (
          <div className="d-flex gap-2 mx-auto">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <button className="btn btn-outline-light">Perfil</button>
                </Link>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <button className="btn btn-outline-light">Sign Up</button>
                </Link>
                <Link to="/firebase-login" onClick={() => setMenuOpen(false)}>
                  <button className="btn btn-outline-light">Log In</button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Botón circular con + para subir reporte */}
		<button
		onClick={() => navigate("/subir-reporte")}
		title="Subir reporte"
		style={{
			border: "1px solid white",
			borderRadius: "50%",
			background: "transparent",
			color: "lightgrey",
			width: "38px",
			height: "38px",
			fontSize: "24px",
			lineHeight: "38px",  // Igual que el height del botón
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			cursor: "pointer",
			userSelect: "none"
		}}
		aria-label="Subir reporte"
		>
		+
		</button>

      </div>
    </nav>
  );
};
