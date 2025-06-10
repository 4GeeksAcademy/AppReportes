import React from "react";
import { Link } from "react-router-dom";

export const SidebarUsuario = () => {
  return (
    <nav
      className="bg-light border-end"
      style={{ width: "220px", padding: "1rem" }}
    >
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link className="btn btn-outline-primary w-100" to="/mis-reportes">
            Mis reportes
          </Link>
        </li>
        <li className="mb-3">
          <Link className="btn btn-outline-primary w-100" to="/favoritos">
            Favoritos
          </Link>
        </li>
        <li className="mb-3">
          <Link className="btn btn-outline-primary w-100" to="/subir-reporte">
            Subir reporte
          </Link>
        </li>
        <li className="mb-3">
          <Link className="btn btn-outline-primary w-100" to="/mis-datos">
            Mis datos
          </Link>
        </li>
      </ul>
    </nav>
  );
};
