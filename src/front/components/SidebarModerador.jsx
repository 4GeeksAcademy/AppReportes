import React from "react";
import { Link } from "react-router-dom";

export const SidebarModerador = () => {
  return (
    <nav
      className="bg-light border-end"
      style={{ width: "220px", padding: "1rem", minHeight: "100vh" }}
    >
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link className="btn btn-outline-primary w-100" to="/denuncias">
            Denuncias
          </Link>
        </li>
        <li className="mb-3">
          <Link className="btn btn-outline-primary w-100" to="/mis-datos">
            Mis datos
          </Link>
        </li>
        <li className="mb-3">
          <Link className="btn btn-outline-primary w-100" to="/buscador-moderador">
            Buscador
          </Link>
        </li>
        <li className="mb-3">
          <Link className="btn btn-outline-primary w-100" to="/usuarios-sancionados">
            Usuarios sancionados
          </Link>
        </li>
      </ul>
    </nav>
  );
};
