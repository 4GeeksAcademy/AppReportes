import React, { useState } from "react";
import corazonVacio from "../assets/img/corazon_vacio.png";
import corazonVacioNegro from "../assets/img/corazon_vacio_negro.png";
import imagen3_4 from "../assets/img/city_fondo_3_4.jpg";

export const Reporte = () => {
  const reporte = {
    titulo:
      "Gran rotura de las vías del tren a la altura de la avenida de América",
    imagen: imagen3_4,
    descripcion:
      "Este es un texto descriptivo del reporte que explica qué pasó, detalles, etc.",
    votosPositivos: 123,
    votosNegativos: 4,
    meGusta: 98,
    usuario: {
      nombre: "Juan Pérez",
      avatar: "https://i.pravatar.cc/50?img=22",
    },
    comentarios: [
      { id: 1, usuario: "Ana", texto: "Muy útil este reporte, gracias!" },
      { id: 2, usuario: "Luis", texto: "¿Hay más detalles disponibles?" },
      { id: 3, usuario: "Maria", texto: "Apoyo esta denuncia." },
    ],
  };

  const [liked, setLiked] = useState(false);
  const toggleLike = () => setLiked((prev) => !prev);

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <div
        className="card mb-4 border-0 overflow-hidden rounded-4 position-relative"
        style={{ background: "transparent" }}
      >
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          {/* Título */}
          <div
            className="border rounded p-3 mb-3"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              color: "white",
              fontSize: "1.25rem",
              fontWeight: "400",
              borderRadius: "0.5rem",
            }}
          >
            {reporte.titulo}
          </div>

          {/* Imagen */}
          <div className="position-relative">
            <img
              src={reporte.imagen}
              alt={reporte.titulo}
              className="w-100"
              style={{
                aspectRatio: "3/4",
                objectFit: "cover",
                borderRadius: "1rem",
              }}
            />

            {/* Usuario */}
            <div
              className="position-absolute top-0 start-0 m-2 d-flex align-items-center gap-2 px-2 py-2"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(4px)",
                borderRadius: "50px",
                color: "white",
                maxWidth: "70%",
              }}
            >
              <img
                src={reporte.usuario.avatar}
                alt={reporte.usuario.nombre}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span
                style={{
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {reporte.usuario.nombre}
              </span>
            </div>

            {/* Me gusta */}
            <button
              onClick={toggleLike}
              className="position-absolute top-0 end-0 m-2 border-0 d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: liked
                  ? "white"
                  : "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                backdropFilter: "blur(3px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              title="Me gusta"
            >
              <img
                src={liked ? corazonVacioNegro : corazonVacio}
                alt="like"
                width={20}
                height={20}
              />
            </button>
          </div>

          {/* Votos y Denunciar */}
          <div
            className="d-flex gap-3 justify-content-center mt-3 flex-wrap"
            style={{ color: "white" }}
          >
            <button
              className="btn btn-sm"
              style={{
                whiteSpace: "nowrap",
                color: "white",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
              }}
              title="Votos positivos"
            >
              Upvote {reporte.votosPositivos}
            </button>
            <button
              className="btn btn-sm"
              style={{
                whiteSpace: "nowrap",
                color: "white",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
              }}
              title="Votos negativos"
            >
              Downvote {reporte.votosNegativos}
            </button>
            <button
              className="btn btn-sm"
              style={{
                whiteSpace: "nowrap",
                color: "white",
                background: "rgba(255, 80, 80, 0.2)",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
              }}
              title="Denunciar este reporte"
            >
              🚩 Denunciar
            </button>
          </div>

          {/* Descripción */}
          <div
            className="border rounded p-3 mt-3"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              color: "white",
              fontSize: "1rem",
              fontWeight: "300",
              borderRadius: "0.5rem",
            }}
          >
            {reporte.descripcion}
          </div>

          {/* Comentarios */}
          <div
            className="border rounded p-3 mt-3"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              color: "white",
              fontSize: "1rem",
              fontWeight: "300",
              borderRadius: "0.5rem",
            }}
          >
            <h5 style={{ color: "white", fontWeight: "500" }}>Comentarios</h5>
            {reporte.comentarios.map(({ id, usuario, texto }) => (
              <div
                key={id}
                className="mb-3 d-flex justify-content-between align-items-start"
              >
                <div>
                  <strong>{usuario}:</strong> <span>{texto}</span>
                </div>
                <button
                  className="btn btn-sm px-2 py-1 ms-2"
                  style={{
                    background: "rgba(255, 80, 80, 0.15)",
                    color: "white",
                    fontSize: "0.75rem",
                    borderRadius: "0.5rem",
                    backdropFilter: "blur(5px)",
                    height: "fit-content",
                  }}
                  title={`Denunciar comentario de ${usuario}`}
                >
                  🚩
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
