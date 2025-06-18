import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const RankingReportes = () => {
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/reportes`);
        const data = await res.json();
        setReportes(data);
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
      }
    };

    fetchReportes();
  }, []);

  const contarVotosPositivos = (votes) =>
    votes?.filter((v) => v.is_upvote).length || 0;

  const reportesOrdenados = [...reportes].sort((a, b) => {
    const votosA = contarVotosPositivos(a.votes);
    const votosB = contarVotosPositivos(b.votes);

    if (votosB !== votosA) {
      return votosB - votosA;
    }

    return a.titulo.localeCompare(b.titulo);
  });

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
            🗳️ Ranking de Reportes
          </h1>
        </div>

        {/* Contenedor tabla con blur y scroll */}
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
              minWidth: "700px",
              backgroundColor: "transparent",
              color: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            <thead style={{ backgroundColor: "transparent" }}>
              <tr style={{ backgroundColor: "transparent" }}>
                <th style={{ backgroundColor: "transparent" }}>Título del Reporte</th>
                <th style={{ backgroundColor: "transparent" }}>Autor</th>
                <th style={{ backgroundColor: "transparent" }}>Votos Positivos</th>
                <th style={{ backgroundColor: "transparent" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {reportesOrdenados.map((reporte) => (
                <tr
                  key={reporte.id}
                  style={{
                    backgroundColor: "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <td style={{ backgroundColor: "transparent" }}>{reporte.titulo}</td>
                  <td style={{ backgroundColor: "transparent" }}>{reporte.author.fullname}</td>
                  <td style={{ backgroundColor: "transparent" }}>{contarVotosPositivos(reporte.votes)}</td>
                  <td style={{ backgroundColor: "transparent" }}>
                    <button
                      onClick={() => navigate(`/reporte/${reporte.id}`)}
                      className="btn btn-sm btn-light"
                    >
                      Ver
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
