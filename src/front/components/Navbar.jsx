import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../firebaseAuth";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/img/beacon-sinfondo.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isModerator, setIsModerator] = useState(false);
  const menuRef = useRef(null);
  const navRef = useRef(null);

  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/firebase-login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const fetchUserData = async () => {
    const unsubscribe = getAuth().onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        setUserId(null);
        setIsModerator(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken();

        const res = await fetch(`${BACKEND_URL}/api/userinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error al cargar /userinfo:", res.status, errorText);
          // Opcional: puedes lanzar un error para manejarlo en un bloque catch superior o mostrar UI
          throw new Error(`Error backend: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        setUserId(data.user.id);
        setIsModerator(data.user.is_moderator === true);
      } catch (error) {
        console.error("Error al obtener userinfo:", error);
        // Opcional: mostrar mensaje de error en UI o hacer algo con el error
        setUserId(null);
        setIsModerator(false);
      }
    });

    return () => unsubscribe();
  };


  useEffect(() => {
    fetchUserData();
  }, []);


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div style={{ position: "relative" }}>
      <nav
        ref={navRef}
        className="navbar navbar-dark bg-dark rounded-5 m-2 px-3 py-2 position-relative"
      >
        <div className="container-fluid d-flex justify-content-between align-items-center w-100">
          <button
            className="btn btn-outline-light"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {(!menuOpen || user) && (
            <Link
              to="/feed"
              className="position-absolute top-50 start-50 translate-middle"
              aria-label="Ir al feed"
            >
              <img src={logo} alt="Logo" style={{ height: "40px" }} />
            </Link>
          )}

          {menuOpen && !user && (
            <div className="d-flex gap-2 mx-auto">
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button className="btn btn-outline-light">Sign Up</button>
              </Link>
              <Link to="/firebase-login" onClick={() => setMenuOpen(false)}>
                <button className="btn btn-outline-light">Log In</button>
              </Link>
            </div>
          )}

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
              lineHeight: "38px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none",
            }}
            aria-label="Subir reporte"
          >
            +
          </button>
        </div>
      </nav>

      {menuOpen && user && (
        <div
          ref={menuRef}
          className="bg-dark rounded-3 shadow position-absolute"
          style={{
            top: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxWidth: "1200px",
            zIndex: 1050,
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.1rem",
            color: "white",
          }}
        >
          {userId && (
            <Link
              to={`/users/${userId}/reportes`}
              onClick={() => setMenuOpen(false)}
              className="text-white text-decoration-none px-3 py-1 rounded hover-bg-secondary"
            >
              Mis reportes
            </Link>
          )}

          <hr className="bg-secondary my-1" />
          <Link
            to="/favoritos"
            onClick={() => setMenuOpen(false)}
            className="text-white text-decoration-none px-3 py-1 rounded hover-bg-secondary"
          >
            Favoritos
          </Link>
          <hr className="bg-secondary my-1" />
          <Link
            to="/mis-datos"
            onClick={() => setMenuOpen(false)}
            className="text-white text-decoration-none px-3 py-1 rounded hover-bg-secondary"
          >
            Mis datos
          </Link>

          {isModerator && (
            <>
              <hr className="bg-secondary my-1" />
              <Link
                to="/moderador"
                onClick={() => setMenuOpen(false)}
                className="text-white text-decoration-none px-3 py-1 rounded hover-bg-secondary"
              >
                Moderador
              </Link>
            </>
          )}

          <hr className="bg-secondary my-1" />
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger mt-2"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
