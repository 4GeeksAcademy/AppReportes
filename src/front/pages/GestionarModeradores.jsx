import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const GestionarModeradores = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  const fetchUsuarios = async () => {
    const token = await getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar usuarios");

      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const cambiarRol = async (email, accion) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/${accion}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        console.error("Error al cambiar rol");
        return;
      }

      await fetchUsuarios(); // Refrescar usuarios
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    u.fullname.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
        <div
      className="d-flex justify-content-center pt-4"
      style={{
        background:
          "url('/path-to-some-background.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        color: "white",
        padding: "1rem",
        minHeight: "100vh",
      }}
    >
      <main style={{ width: "95%", maxWidth: "900px", marginBottom: "2rem" }}>
        {/* Título con blur */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1.5rem 1rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontWeight: "300",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              margin: 0,
            }}
          >
            ⚙️ Gestión de Moderadores
          </h1>

          <input
            type="text"
            className="form-control mt-3"
            placeholder="Buscar usuario por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ maxWidth: "400px", margin: "0 auto" }}
          />
        </div>

        {/* Tabla con blur */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1rem",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table
            className="table table-borderless text-white text-center"
            style={{
              minWidth: "700px",
              backgroundColor: "transparent",
              color: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "transparent" }}>
                <th style={{ backgroundColor: "transparent", textAlign: "center" }}>Usuario</th>
                <th style={{ backgroundColor: "transparent", textAlign: "center" }}>Rol</th>
                <th style={{ backgroundColor: "transparent", textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    backgroundColor: "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <td style={{ backgroundColor: "transparent", textAlign: "center" }}>
                    {user.fullname}
                  </td>
                  <td style={{ backgroundColor: "transparent", textAlign: "center" }}>
                    <span
                      className={`badge ${
                        user.is_moderator ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {user.is_moderator ? "Moderador" : "Usuario"}
                    </span>
                  </td>
                  <td style={{ backgroundColor: "transparent", textAlign: "center" }}>
                    {!user.is_moderator && (
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => cambiarRol(user.email, "make-moderator")}
                      >
                        🟡 Hacer Moderador
                      </button>
                    )}
                    {user.is_moderator && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => cambiarRol(user.email, "remove-moderator")}
                      >
                        🔴 Quitar Moderador
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>

  );
};
