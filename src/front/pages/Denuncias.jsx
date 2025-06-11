import React from "react";
import { SidebarModerador } from "../components/SidebarModerador";

const denunciasData = [
  {
    id: 1,
    contenido: "Publicación con lenguaje ofensivo",
    usuario: "usuario123",
    motivo: "Lenguaje inapropiado",
    fecha: "2025-06-10",
  },
  {
    id: 2,
    contenido: "Spam en comentarios",
    usuario: "spamBot",
    motivo: "Spam",
    fecha: "2025-06-09",
  },
  {
    id: 3,
    contenido: "Foto no autorizada",
    usuario: "user456",
    motivo: "Violación de privacidad",
    fecha: "2025-06-08",
  },
];

export const Denuncias = () => {
  const handleActionClick = (action, id) => {
    alert(`Acción "${action}" en denuncia id ${id}`);
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <SidebarModerador />

      <main className="flex-grow-1 p-4">
        <h1 className="mb-4">Denuncias</h1>

        <table className="table table-borderless">
          <thead>
            <tr>
              <th>Contenido</th>
              <th>Usuario</th>
              <th>Motivo</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {denunciasData.map(({ id, contenido, usuario, motivo, fecha }) => (
              <tr key={id}>
                <td>{contenido}</td>
                <td>{usuario}</td>
                <td>{motivo}</td>
                <td>{fecha}</td>
                <td>
                  <button
                    className="btn btn-link p-0 me-2"
                    style={{ textDecoration: "none" }}
                    onClick={() => handleActionClick("Aprobar", id)}
                  >
                    [Aprobar]
                  </button>
                  <button
                    className="btn btn-link p-0 text-danger"
                    style={{ textDecoration: "none" }}
                    onClick={() => handleActionClick("Rechazar", id)}
                  >
                    [Rechazar]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};
