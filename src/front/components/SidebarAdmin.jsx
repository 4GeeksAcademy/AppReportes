// SidebarAdmin.jsx
import React from "react";
import { Link } from "react-router-dom";

export const SidebarAdmin = () => {
  return (
    <nav className="bg-light border-end" style={{ width: "220px", padding: "1rem" }}>
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link className="btn btn-outline-dark w-100" to="/gestionar-usuarios">
            Gestionar usuarios
          </Link>
        </li>
        <li className="mb-3">
          <Link className="btn btn-outline-dark w-100" to="/mis-datos">
            Mis datos
          </Link>
        </li>
        <li className="mb-3">
          <Link className="btn btn-outline-dark w-100" to="/buscador-admin">
            Buscador
          </Link>
        </li>
        <li className="mb-3">
          <Link className="btn btn-outline-dark w-100" to="/usuarios-sancionados">
            Usuarios sancionados
          </Link>
        </li>
      </ul>
    </nav>
  );
};
