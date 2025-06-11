import React from "react";
import { SidebarUsuario } from "../components/SidebarUsuario.jsx";

export const MisDatos = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <SidebarUsuario />
      <main className="flex-grow-1 p-4">
        <h2>Mis Datos</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input type="text" className="form-control" id="nombre" />
          </div>

          <div className="mb-3">
            <label htmlFor="fotoPerfil" className="form-label">
              Foto de perfil
            </label>
            <input type="file" className="form-control" id="fotoPerfil" />
          </div>

          <div className="mb-3">
            <button type="button" className="btn btn-warning me-2">
              Cambiar contraseña
            </button>
          </div>

          <button type="submit" className="btn btn-primary me-2">
            Guardar
          </button>
          <button type="button" className="btn btn-secondary">
            Cancelar
          </button>
        </form>
      </main>
    </div>
  );
};
