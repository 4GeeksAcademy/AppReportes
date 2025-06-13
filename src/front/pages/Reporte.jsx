import React, { useState } from "react";
import { Link } from "react-router-dom";
import corazonVacio from "../assets/img/corazon_vacio.png";
import corazonVacioNegro from "../assets/img/corazon_vacio_negro.png";
import imagen3_4 from "../assets/img/city_fondo_3_4.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Reporte = () => {

  const {store,dispatch} = useGlobalReducer()
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
            {store.reporte.titulo}
          </div>

          {/* Imagen */}
          <div className="position-relative">
            <img
              src={store.reporte.imagen}
              alt={store.reporte.titulo}
              className="w-100"
              style={{
                aspectRatio: "3/4",
                objectFit: "cover",
                borderRadius: "1rem",
              }}
            />

            {/* Usuario envuelto con Link */}
            <Link
              to="/mis-reportes"
              className="position-absolute top-0 start-0 m-2 d-flex align-items-center gap-2 px-2 py-2 text-white text-decoration-none"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(4px)",
                borderRadius: "50px",
                maxWidth: "70%",
              }}
            >
              <img
                src={store.reporte.usuario.avatar}
                alt={store.reporte.usuario.nombre}
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
                {store.reporte.usuario.nombre}
              </span>
            </Link>

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
              Upvote {store.reporte.votosPositivos}
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
              Downvote {store.reporte.votosNegativos}
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
            {store.reporte.descripcion}
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
            {store.reporte.comentarios.map(({ id, usuario, texto }) => (
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
