import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import useGlobalReducer from "../hooks/useGlobalReducer";
import corazonVacio from "../assets/img/corazon_vacio.png";

export const ReportesDeUsuario = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("publicaciones");
  const { store } = useGlobalReducer();

  const fetchUserReports = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${id}/reportes`);
      if (!res.ok) throw new Error("Error en reportes del usuario");
      const data = await res.json();

      const mappedPosts = data.reports.map((reporte) => ({
        id: reporte.id,
        title: reporte.titulo,
        text: reporte.texto || "",
        imageUrl: reporte.images?.[0]?.image || "https://placehold.co/400x400",
        positiveVotes: reporte.votes?.filter((v) => v.is_upvote).length || 0,
        negativeVotes: reporte.votes?.filter((v) => !v.is_upvote).length || 0,
        user: {
          id: data.user.id,
          name: data.user.fullname || "Anónimo",
          avatar: data.user.profile_picture || "https://i.pravatar.cc/50",
        },
      }));

      setPosts(mappedPosts);
      setUsername(data.user.fullname);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    }
  };

  const fetchLikedReports = async () => {
    try {
      const token = store?.jwt;
      const res = await fetch(`${BACKEND_URL}/api/users/${id}/favoritos`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Respuesta no válida:", data);
        throw new Error("Error en favoritos del usuario");
      }

      const mappedLiked = data.likes.map((reporte) => ({
        id: reporte.id,
        title: reporte.titulo,
        text: reporte.texto || "",
        imageUrl: reporte.images?.[0]?.image || "https://placehold.co/400x400",
        positiveVotes: reporte.votes?.filter((v) => v.is_upvote).length || 0,
        negativeVotes: reporte.votes?.filter((v) => !v.is_upvote).length || 0,
        user: {
          id: reporte.author?.id || 0,
          name: reporte.author?.fullname || "Desconocido",
          avatar:
            reporte.author?.profile_picture ||
            reporte.author?.propile_picture || // fallback por el typo
            "https://i.pravatar.cc/50",
        },
      }));

      setLikedPosts(mappedLiked);
    } catch (error) {
      console.error("Error al cargar reportes favoritos:", error);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await fetchUserReports();
      await fetchLikedReports();
      setLoading(false);
    };
    loadAll();
  }, [id]);

  const postsToRender = activeTab === "publicaciones" ? posts : likedPosts;

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      {/* Nombre del usuario */}
      <div
        className="p-3 mb-3 text-white"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(3px)",
          borderRadius: "12px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "1.25rem",
          textAlign: "center",
        }}
      >
        {username}
      </div>

      {/* Pestañas */}
      <div className="d-flex justify-content-center gap-3 mb-3">
        <button
          className={`btn ${
            activeTab === "publicaciones" ? "btn-primary" : "btn-outline-primary"
          } px-4`}
          onClick={() => setActiveTab("publicaciones")}
        >
          Publicaciones
        </button>
        <button
          className={`btn ${
            activeTab === "megustan" ? "btn-primary" : "btn-outline-primary"
          } px-4`}
          onClick={() => setActiveTab("megustan")}
        >
          Me gustan
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <p className="text-center text-muted">Cargando reportes...</p>
      ) : postsToRender.length === 0 ? (
        <p className="text-center text-muted">
          No hay {activeTab === "publicaciones" ? "publicaciones" : "me gustas"} para este usuario.
        </p>
      ) : (
        <div className="row g-2">
          {postsToRender.map((post) => (
            <div key={post.id} className="col-6 col-md-3 position-relative">
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
                {activeTab === "megustan" && (
                  <img
                    src={corazonVacio}
                    alt="favorito"
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "rgba(255,255,255,0.6)",
                      borderRadius: "50%",
                      padding: "4px",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
