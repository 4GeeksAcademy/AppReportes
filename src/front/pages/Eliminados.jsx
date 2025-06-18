import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Eliminados = () => {
  const [usuarios, setUsuarios] = useState([]);

  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  useEffect(() => {
    const fetchEliminados = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${BACKEND_URL}/api/eliminados`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener usuarios eliminados");

        const data = await res.json();
        setUsuarios(data);
      } catch (error) {


        console.error("Error al cargar usuarios eliminados:", error);
      }
    };

    fetchEliminados();
  }, []);

  const handleEliminar = (id) => {
    if (window.confirm("¿Eliminar registro definitivamente del sistema?")) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      // Opcional: hacer un DELETE al backend si querés borrar también del registro
    }
  };

  return (
    <div
      className="d-flex min-vh-100 justify-content-center align-items-start pt-4"
      style={{
        background: "url('/path-to-some-background.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        color: "white",
        padding: "1rem",
      }}
    >
      <main style={{ width: "95%", maxWidth: "900px" }}>
        {/* Header */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1.5rem 1rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontWeight: "300", fontFamily: "'Segoe UI', Tahoma" }}>
            🚫 Usuarios Eliminados
          </h1>
        </div>

        {/* Tabla */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1rem",
            overflowX: "auto",
          }}
        >
          <table
            className="table table-borderless text-white"
            style={{ minWidth: "700px", whiteSpace: "nowrap" }}
          >
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Mail</th>
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(({ id, fullname, email, motivo, created_at }) => (
                <tr key={id} style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}>
                  <td>{fullname}</td>
                  <td>{email}</td>
                  <td>{motivo}</td>
                  <td>{new Date(created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleEliminar(id)}
                    >
                      Eliminar
                    </button>
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
