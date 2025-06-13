import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Denuncias = () => {
  const {store,dispatch} = useGlobalReducer()
  const handleActionClick = (action, id) => {
    alert(`Acción "${action}" en denuncia ID ${id}`);
  };

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
            📋 Denuncias Pendientes
          </h1>
        </div>

        {/* Contenedor tabla con blur y scroll */}
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
                <th style={{ backgroundColor: "transparent" }}>Denunciante</th>
                <th style={{ backgroundColor: "transparent" }}>Denunciado</th>
                <th style={{ backgroundColor: "transparent" }}>Tipo</th>
                <th style={{ backgroundColor: "transparent" }}>Motivo</th>
                <th style={{ backgroundColor: "transparent" }}>Fecha</th>
                <th style={{ backgroundColor: "transparent" }}>Estado</th>
                <th style={{ backgroundColor: "transparent" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {store.denunciasData.map(
                ({ id, denunciante, denunciado, tipo, motivo, fecha, estado }) => (
                  <tr
                    key={id}
                    style={{
                      backgroundColor: "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <td style={{ backgroundColor: "transparent" }}>{denunciante}</td>
                    <td style={{ backgroundColor: "transparent" }}>{denunciado}</td>
                    <td style={{ backgroundColor: "transparent" }}>{tipo}</td>
                    <td style={{ backgroundColor: "transparent" }}>{motivo}</td>
                    <td style={{ backgroundColor: "transparent" }}>{fecha}</td>
                    <td style={{ backgroundColor: "transparent" }}>
                      <span
                        className={`badge ${
                          estado === "pendiente"
                            ? "bg-warning text-dark"
                            : estado === "revisado"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {estado}
                      </span>
                    </td>
                    <td style={{ backgroundColor: "transparent" }}>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleActionClick("Aprobar", id)}
                      >
                        ✅
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleActionClick("Rechazar", id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
