import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const BuscadorModerador = () => {
  const [query, setQuery] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No hay token de autenticación");

      // Obtener información del usuario actual
      const resUserInfo = await fetch(`${BACKEND_URL}/api/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resUserInfo.ok) throw new Error("Error al obtener info de usuario");
      const dataUserInfo = await resUserInfo.json();
      setCurrentUserId(Number(dataUserInfo.user.id));

      // Obtener usuarios
      const resUsers = await fetch(`${BACKEND_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resUsers.ok)
        throw new Error(`Error ${resUsers.status}: ${resUsers.statusText}`);
      const usersData = await resUsers.json();

      // Obtener reportes
      const resReportes = await fetch(`${BACKEND_URL}/api/reportes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resReportes.ok)
        throw new Error(`Error ${resReportes.status}: ${resReportes.statusText}`);
      const reportesData = await resReportes.json();

      setUsuarios(usersData);
      setReportes(reportesData);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setUsuarios([]);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsuarios = Array.isArray(usuarios)
    ? usuarios.filter((u) =>
        u.fullname?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredReportes = Array.isArray(reportes)
    ? reportes.filter((r) =>
        r.titulo?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleVerClick = (tipo, id) => {
    alert(`Ver ${tipo} con ID ${id}`);
  };

  if (loading) {
    return (
      <p style={{ color: "white", textAlign: "center" }}>
        Cargando datos...
      </p>
    );
  }

  return (
    <div
      className="d-flex min-vh-100 justify-content-center align-items-start pt-4"
      style={{
        background:
          "url('/path-to-some-background.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        color: "white",
        padding: "1rem",
      }}
    >
      <main style={{ width: "95%", maxWidth: "900px" }}>
        {/* Contenedor del título y buscador */}
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
            🔍 Buscador Moderador
          </h1>
          <input
            type="text"
            placeholder="Buscar usuarios o reportes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "1rem",
              fontSize: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Contenedor con tablas */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1rem",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Tabla Usuarios */}
          <h2>Usuarios</h2>
          <table
            className="table table-borderless text-white"
            style={{
              minWidth: "700px",
              backgroundColor: "transparent",
              color: "inherit",
              whiteSpace: "nowrap",
              marginBottom: "2rem",
            }}
          >
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map(({ id, fullname, email }) => (
                  <tr
                    key={id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <td>
                      {fullname}{" "}
                      {id === currentUserId && <em>(Tú)</em>}
                    </td>
                    <td>{email}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleVerClick("usuario", id)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Tabla Reportes */}
          <h2>Reportes</h2>
          <table
            className="table table-borderless text-white"
            style={{
              minWidth: "700px",
              backgroundColor: "transparent",
              color: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredReportes.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No se encontraron reportes.
                  </td>
                </tr>
              ) : (
                filteredReportes.map(({ id, titulo, descripcion }) => (
                  <tr
                    key={id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <td>{titulo}</td>
                    <td>{descripcion || "Sin descripción"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleVerClick("reporte", id)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
