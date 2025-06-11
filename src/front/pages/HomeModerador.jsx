import React from "react";
import { SidebarModerador } from "../components/SidebarModerador";

export const HomeModerador = () => {
  // Datos inventados
  const reportesPendientes = 12;
  const usuariosEnRevision = 5;
  const publicacionesRecientes = 23;

  return (
    <div className="d-flex bg-light min-vh-100">
      <SidebarModerador />

      <main className="flex-grow-1 p-4">
        <h1 className="mb-4">Panel Moderador</h1>

        <div className="mb-3 p-3 bg-white rounded shadow-sm">
          <h3>📋 Reportes pendientes</h3>
          <p className="fs-4">{reportesPendientes}</p>
        </div>

        <div className="mb-3 p-3 bg-white rounded shadow-sm">
          <h3>🔎 Usuarios en revisión</h3>
          <p className="fs-4">{usuariosEnRevision}</p>
        </div>

        <div className="mb-3 p-3 bg-white rounded shadow-sm">
          <h3>🆕 Publicaciones recientes</h3>
          <p className="fs-4">{publicacionesRecientes}</p>
        </div>
      </main>
    </div>
  );
};
