// HomeAdmin.jsx
import React from "react";
import { SidebarAdmin } from "../components/SidebarAdmin";

export const HomeAdmin = () => {
  return (
    <div className="d-flex bg-light min-vh-100">
      <SidebarAdmin />
      <main className="flex-grow-1 p-4">
        <h1 className="mb-4">👑 Panel del Administrador</h1>
        <p>👥 Usuarios registrados: <strong>1,324</strong></p>
        <p>⛔ Usuarios sancionados: <strong>42</strong></p>
      </main>
    </div>
  );
};