// BuscadorAdmin.jsx (igual al de moderador)
import React, { useState } from "react";
import { SidebarAdmin } from "../components/SidebarAdmin";

const mockUsuarios = [
  { id: 1, nombre: "pepe", estado: "Activo" },
  { id: 2, nombre: "adminuser", estado: "Suspendido" },
];

const mockReportes = [
  { id: 1, titulo: "Parque destruido", autor: "pepe" },
];

export const BuscadorAdmin = () => {
  const [query, setQuery] = useState("");
  const filteredUsuarios = mockUsuarios.filter((u) =>
    u.nombre.toLowerCase().includes(query.toLowerCase())
  );
  const filteredReportes = mockReportes.filter((r) =>
    r.titulo.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="d-flex bg-light min-vh-100">
      <SidebarAdmin />
      <main className="flex-grow-1 p-4">
        <h1>🔍 Buscador Admin</h1>
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Buscar usuarios o reportes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <h4>👤 Usuarios</h4>
        <ul className="list-group mb-4">
          {filteredUsuarios.map((u) => (
            <li key={u.id} className="list-group-item d-flex justify-content-between">
              <span>
                <strong>{u.nombre}</strong> — <em>{u.estado}</em>
              </span>
              <button className="btn btn-sm btn-outline-danger">
                {u.estado === "Activo" ? "Suspender" : "Ver"}
              </button>
            </li>
          ))}
        </ul>

        <h4>📄 Reportes</h4>
        <ul className="list-group">
          {filteredReportes.map((r) => (
            <li key={r.id} className="list-group-item d-flex justify-content-between">
              <span>
                <strong>{r.titulo}</strong> — por <em>{r.autor}</em>
              </span>
              <button className="btn btn-sm btn-outline-primary">Revisar</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};
