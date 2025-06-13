import React, { useState } from "react";
import { SidebarModerador } from "../components/SidebarModerador";

const mockUsuarios = [
  { id: 1, nombre: "juanito", estado: "Activo" },
  { id: 2, nombre: "toxictroll", estado: "Suspendido" },
  { id: 3, nombre: "spammer98", estado: "Baneado" },
];

const mockReportes = [
  { id: 1, titulo: "Parque sucio", autor: "juanito" },
  { id: 2, titulo: "Farola rota", autor: "vecina22" },
  { id: 3, titulo: "Bache peligroso", autor: "spammer98" },
];

export const BuscadorModerador = () => {
  const [query, setQuery] = useState("");

  const filteredUsuarios = mockUsuarios.filter((u) =>
    u.nombre.toLowerCase().includes(query.toLowerCase())
  );

  const filteredReportes = mockReportes.filter((r) =>
    r.titulo.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="d-flex min-vh-100"
      style={{
        color: "white",
        background:
          "url('/path-to-some-background.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        padding: "1rem",
      }}
    >
      {/* <SidebarModerador /> */}

      <main style={{ flexGrow: 1, maxWidth: 900, margin: "0 auto", width: "95%" }}>
        {/* Título con blur */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 15,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1.5rem 1rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontWeight: 300,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              margin: 0,
            }}
          >
            🔍 Buscador Moderador
          </h1>
        </div>

        {/* Input con blur */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 15,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Buscar usuarios o reportes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
            }}
          />
        </div>

        {/* Usuarios */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 15,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h4 style={{ marginBottom: "1rem" }}>👤 Usuarios</h4>
          {filteredUsuarios.length > 0 ? (
            <ul className="list-group">
              {filteredUsuarios.map((u) => (
                <li
                  key={u.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: "transparent", border: "none", color: "white" }}
                >
                  <span>
                    <strong>{u.nombre}</strong> — <em>{u.estado}</em>
                  </span>
                  <button className="btn btn-sm btn-outline-danger">
                    {u.estado === "Activo" ? "Suspender" : "Ver detalles"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No se encontraron usuarios.</p>
          )}
        </div>

        {/* Reportes */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 15,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1rem",
          }}
        >
          <h4 style={{ marginBottom: "1rem" }}>📄 Reportes</h4>
          {filteredReportes.length > 0 ? (
            <ul className="list-group">
              {filteredReportes.map((r) => (
                <li
                  key={r.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: "transparent", border: "none", color: "white" }}
                >
                  <span>
                    <strong>{r.titulo}</strong> — por <em>{r.autor}</em>
                  </span>
                  <button className="btn btn-sm btn-outline-primary">
                    Revisar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No se encontraron reportes.</p>
          )}
        </div>
      </main>
    </div>
  );
};
