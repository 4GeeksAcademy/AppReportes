import React from "react";
import { SidebarUsuario } from "../components/SidebarUsuario";

export const Reporte = () => {
  // Datos dummy para ejemplo
  const reporte = {
    titulo: "Reporte de ejemplo",
    imagen:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    descripcion:
      "Este es un texto descriptivo del reporte que explica qué pasó, detalles, etc.",
    votosPositivos: 123,
    votosNegativos: 4,
    meGusta: 98,
    comentarios: [
      { id: 1, usuario: "Ana", texto: "Muy útil este reporte, gracias!" },
      { id: 2, usuario: "Luis", texto: "¿Hay más detalles disponibles?" },
      { id: 3, usuario: "Maria", texto: "Apoyo esta denuncia." },
    ],
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <SidebarUsuario />

      <main className="flex-grow-1 p-4">
        {/* Título y botón denunciar */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>{reporte.titulo}</h1>
          <button className="btn btn-danger">Denunciar</button>
        </div>

        {/* Imagen grande */}
        <img
          src={reporte.imagen}
          alt="Imagen del reporte"
          className="img-fluid mb-3"
          style={{ maxHeight: "400px", width: "100%", objectFit: "cover", borderRadius: "8px" }}
        />

        {/* Descripción */}
        <div className="border p-3 rounded mb-3" style={{ backgroundColor: "white" }}>
          <p>{reporte.descripcion}</p>
        </div>

        {/* Votos y me gusta */}
        <div className="d-flex align-items-center mb-3 gap-3">
          {/* Votos positivos y negativos */}
          <div className="d-flex gap-3">
            <div className="d-flex align-items-center px-3 py-2 border rounded" style={{ backgroundColor: "#e6f4ea" }}>
              <span style={{ color: "green", fontSize: "1.3rem", marginRight: "6px" }}>⬆️</span>
              <strong>{reporte.votosPositivos}</strong>
            </div>
            <div className="d-flex align-items-center px-3 py-2 border rounded" style={{ backgroundColor: "#fdecea" }}>
              <span style={{ color: "red", fontSize: "1.3rem", marginRight: "6px" }}>⬇️</span>
              <strong>{reporte.votosNegativos}</strong>
            </div>
          </div>

          {/* Botón corazón y me gusta */}
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            style={{ fontSize: "1.2rem" }}
            title="Me gusta"
          >
            ❤️ {reporte.meGusta}
          </button>
        </div>

        {/* Comentarios */}
        <div className="border rounded p-3" style={{ backgroundColor: "white" }}>
          <h5>Comentarios</h5>
          {reporte.comentarios.map((comentario) => (
            <div key={comentario.id} className="mb-2">
              <strong>{comentario.usuario}:</strong> <span>{comentario.texto}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
