import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Denuncias = () => {
  const [denuncias, setDenuncias] = useState([]);
  const navigate = useNavigate();

  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  const fetchDenuncias = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/denuncias`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener denuncias");

      const data = await res.json();

      const processedData = data.map((denuncia) => ({
        ...denuncia,
        tipo: denuncia.comment_id ? "comentario" : "reporte",
      }));

      setDenuncias(processedData);
    } catch (error) {
      console.error("Error al cargar denuncias:", error);
    }
  };

  useEffect(() => {
    fetchDenuncias();
  }, []);

  const handleActionClick = async (action, denuncia) => {
    const token = await getToken();
    if (!token) {
      alert("No autenticado");
      return;
    }

    const { id, user_id, denunciado_fullname, motivo } = denuncia;

    try {
      if (action === "ver") {
        const reporteId = denuncia.reporte_id || id;
        navigate(`/reporte/${reporteId}`);
      } else if (action === "ignorar") {
        const res = await fetch(`${BACKEND_URL}/api/denuncias/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al eliminar denuncia");
        setDenuncias((prev) => prev.filter((d) => d.id !== id));
      } else if (action === "banear") {
        if (!user_id) {
          alert("No se encontró el user_id para banear");
          return;
        }

        const res = await fetch(`${BACKEND_URL}/api/sancion`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id,
            fullname: denunciado_fullname,
            motivo: motivo || "Sanción administrativa",
            estado: "baneado",
          }),
        });

        if (res.status === 201) {
          setDenuncias((prev) => prev.filter((d) => d.id !== id));
          alert(`Usuario ${denunciado_fullname} baneado exitosamente`);
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al banear usuario");
        }
      }
    } catch (error) {
      console.error(error);
      alert(`Error en la acción ${action}: ${error.message}`);
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
      <main style={{ width: "95%", maxWidth: "1200px" }}>
        {/* Contenedor título con blur */}
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
            📋 Denuncias Pendientes
          </h1>
        </div>

        {/* Tabla con blur y scroll */}
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
            className="table table-borderless text-white"
            style={{
              minWidth: "1000px",
              backgroundColor: "transparent",
              color: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            <thead style={{ backgroundColor: "transparent" }}>
              <tr style={{ backgroundColor: "transparent" }}>
                <th style={{ backgroundColor: "transparent" }}>Denunciante</th>
                <th style={{ backgroundColor: "transparent" }}>Denunciado</th>
                <th style={{ backgroundColor: "transparent" }}>Tipo</th>
                <th style={{ backgroundColor: "transparent" }}>Reporte Título</th>
                <th style={{ backgroundColor: "transparent" }}>Comentario Texto</th>
                <th style={{ backgroundColor: "transparent" }}>Motivo</th>
                <th style={{ backgroundColor: "transparent" }}>Fecha</th>
                <th style={{ backgroundColor: "transparent" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {denuncias.map((denuncia) => {
                const {
                  id,
                  denunciante_fullname,
                  denunciado_fullname,
                  tipo,
                  reporte_titulo,
                  comment_text,
                  motivo,
                  created_at,
                } = denuncia;

                return (
                  <tr
                    key={id}
                    style={{
                      backgroundColor: "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <td style={{ backgroundColor: "transparent" }}>{denunciante_fullname}</td>
                    <td style={{ backgroundColor: "transparent" }}>{denunciado_fullname}</td>
                    <td style={{ backgroundColor: "transparent" }}>{tipo}</td>
                    <td style={{ backgroundColor: "transparent" }}>{reporte_titulo}</td>
                    <td style={{ backgroundColor: "transparent" }}>{comment_text || "-"}</td>
                    <td style={{ backgroundColor: "transparent" }}>{motivo}</td>
                    <td style={{ backgroundColor: "transparent" }}>
                      {new Date(created_at).toLocaleDateString()}
                    </td>
                    <td style={{ backgroundColor: "transparent" }}>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleActionClick("ver", denuncia)}
                      >
                        Ver
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => handleActionClick("ignorar", denuncia)}
                      >
                        Ignorar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleActionClick("banear", denuncia)}
                      >
                        Banear
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
