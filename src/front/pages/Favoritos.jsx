import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import corazonVacioNegro from "../assets/img/corazon_vacio_negro.png";

export const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const navigate = useNavigate();

  // Cargar favoritos
  const fetchFavoritos = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const res = await fetch(`${BACKEND_URL}/api/reportes/favoritos`, {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) throw new Error("No se pudieron obtener favoritos");

      const reporteIds = await res.json();

      const reportes = await Promise.all(
        reporteIds.map(async (id) => {
          const res = await fetch(`${BACKEND_URL}/api/reportes/${id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: data.id,
            title: data.titulo,
            imageUrl: data.images?.[0]?.image || "https://placehold.co/400x400",
          };
        })
      );

      setFavoritos(reportes.filter(Boolean));
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    }
  };

  useEffect(() => {
    fetchFavoritos();
  }, []);

  // Función para quitar favorito
  const toggleLike = async (postId, e) => {
    e.stopPropagation(); // evita que dispare navegación

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const res = await fetch(`${BACKEND_URL}/api/reportes/${postId}/favorito`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al cambiar favorito");

      // Actualizar la lista quitando el post
      setFavoritos((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <main className="flex-grow-1 p-3">
        <div className="container">
          <div className="row g-2">
            {favoritos.map((post) => (
              <div
                key={post.id}
                className="col-6 col-md-3 position-relative"
                onClick={() => navigate(`/reporte/${post.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="w-100"
                  style={{
                    aspectRatio: "1",
                    overflow: "hidden",
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", borderRadius: "10px" }}
                  />
                  {/* Corazon para quitar favorito */}
                  <img
                    src={corazonVacioNegro}
                    alt="quitar favorito"
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "24px",
                      height: "24px",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      borderRadius: "50%",
                      padding: "4px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => toggleLike(post.id, e)}
                  />
                </div>
              </div>
            ))}

            {favoritos.length === 0 && (
              <div className="text-center text-muted mt-4">
                No tienes reportes favoritos aún.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
