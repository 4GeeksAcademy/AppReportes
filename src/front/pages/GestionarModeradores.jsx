// GestionarUsuarios.jsx
import React from "react";

const mockUsers = [
  { id: 1, nombre: "juanito", rol: "usuario" },
  { id: 2, nombre: "moderadorx", rol: "moderador" },
  { id: 3, nombre: "admin1", rol: "administrador" },
];

export const GestionarModeradores = () => {
  return (
    <div className="d-flex bg-light min-vh-100">

      <main className="flex-grow-1 p-4">
        <h2>⚙️ Gestionar Usuarios</h2>
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.rol}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2">Cambiar Rol</button>
                  <button className="btn btn-sm btn-danger me-2">Eliminar</button>
                  <button className="btn btn-sm btn-outline-dark">Banear</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};