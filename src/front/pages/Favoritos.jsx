import React from "react";
import { SidebarUsuario } from "../components/SidebarUsuario";

export const Favoritos = () => {
  const imageUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <SidebarUsuario />
      <main className="flex-grow-1 p-4 d-flex justify-content-center gap-4">
        <img
          src={imageUrl}
          alt="Reporte 1"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
        <img
          src={imageUrl}
          alt="Reporte 2"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
        <img
          src={imageUrl}
          alt="Reporte 3"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
      </main>
    </div>
  );
};
