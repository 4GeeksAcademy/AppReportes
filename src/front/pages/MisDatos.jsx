import React from "react";
import { SidebarUsuario } from "../components/SidebarUsuario.jsx";

export const MisDatos = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* <SidebarUsuario /> */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-start p-4">
        <div
          className="p-4 shadow-lg rounded-4"
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            color: "white",
          }}
        >
          <h2 className="text-center mb-4" style={{ fontWeight: 300 }}>
            Mis Datos
          </h2>

          <form>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control border-0 shadow-sm"
                id="nombre"
                placeholder="Tu nombre"
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fotoPerfil" className="form-label">
                Foto de perfil
              </label>
              <input
                type="file"
                className="form-control border-0 shadow-sm"
                id="fotoPerfil"
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="mb-4">
              <button
                type="button"
                className="btn w-100 rounded-pill"
                style={{
                  backgroundColor: "#003366",
                  color: "white",
                  border: "none",
                }}
              >
                Cambiar contraseña
              </button>

            </div>

            <div className="d-flex justify-content-between gap-2">
              <button
                type="submit"
                className="btn btn-success flex-grow-1 rounded-pill"
              >
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-secondary flex-grow-1 rounded-pill"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
