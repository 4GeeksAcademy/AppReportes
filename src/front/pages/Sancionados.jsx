import React, { useReducer, useState } from "react";
import { SidebarModerador } from "../components/SidebarModerador";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const UsuariosSancionados = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {store,dispatch} = useGlobalReducer()
  const handleActionClick = (action, id) => {
    alert(`Acción "${action}" en usuario id ${id}`);
  };

  const filteredUsers = store.sancionadosData.filter((user) =>
    user.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex bg-light min-vh-100">
      <SidebarModerador />

      <main className="flex-grow-1 p-4">
        <h1 className="mb-4">Usuarios Sancionados</h1>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table table-borderless">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Razón</th>
              <th>Tiempo restante</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(({ id, usuario, estado, razon, tiempo }) => (
                <tr key={id}>
                  <td>{usuario}</td>
                  <td>{estado}</td>
                  <td>{razon}</td>
                  <td>{tiempo}</td>
                  <td>
                    <button
                      className="btn btn-link p-0 me-2"
                      style={{ textDecoration: "none" }}
                      onClick={() => handleActionClick("Levantar sanción", id)}
                    >
                      [Levantar sanción]
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};
