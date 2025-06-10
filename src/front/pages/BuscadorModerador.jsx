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
    <div className="d-flex bg-light min-vh-100">
      <SidebarModerador />

      <main className="flex-grow-1 p-4">
        <h1 className="mb-4">🔍 Buscador Moderador</h1>

        <input
          type="text"
          className="form-control mb-4"
          placeholder="Buscar usuarios o reportes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Usuarios */}
        <h4 className="mb-3">👤 Usuarios</h4>
        {filteredUsuarios.length > 0 ? (
          <ul className="list-group mb-4">
            {filteredUsuarios.map((u) => (
              <li
                key={u.id}
                className="list-group-item d-flex justify-content-between align-items-center"
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

        {/* Reportes */}
        <h4 className="mb-3">📄 Reportes</h4>
        {filteredReportes.length > 0 ? (
          <ul className="list-group">
            {filteredReportes.map((r) => (
              <li
                key={r.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{r.titulo}</strong> — por <em>{r.autor}</em>
                </span>
                <button className="btn btn-sm btn-outline-primary">
                  Revisar reporte
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No se encontraron reportes.</p>
        )}
      </main>
    </div>
  );
};
