import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import corazonVacio from "../assets/img/corazon_vacio.png";
import corazonVacioNegro from "../assets/img/corazon_vacio_negro.png";

export const ReportesDeUsuario = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("publicaciones");
  const navigate = useNavigate();

  // Carga reportes del usuario
  const fetchUserReports = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${id}/reportes`);
      if (!res.ok) throw new Error(`Error en reportes del usuario: ${res.status}`);
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
      setUsername(data.user.fullname || "Usuario");
    } catch (error) {
      setError(error.message);
    }
  };

  // Carga reportes que le gustan al usuario
  const fetchLikedReports = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("No hay usuario autenticado");

      const token = await user.getIdToken();

      const res = await fetch(`${BACKEND_URL}/api/users/${id}/favoritos`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error en favoritos del usuario: ${res.status} - ${text}`);
      }

      const data = await res.json();

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
            reporte.author?.propile_picture || // typo fallback
            "https://i.pravatar.cc/50",
        },
      }));

      setLikedPosts(mappedLiked);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      await fetchUserReports();
      await fetchLikedReports();
      setLoading(false);
    };
    if (id) loadAll();
  }, [id]);

  // Función para togglear el favorito (quitar de likedPosts)
  const toggleLike = async (postId, e) => {
    e.stopPropagation(); // para que no dispare el onClick de la imagen
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No hay usuario autenticado");

      const token = await user.getIdToken();

      const res = await fetch(`${BACKEND_URL}/api/reportes/${postId}/favorito`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al cambiar favorito");

      // Actualizar likedPosts removiendo o agregando el post
      setLikedPosts((prev) => {
        const exists = prev.find((p) => p.id === postId);
        if (exists) {
          // Si ya existe, removerlo
          return prev.filter((p) => p.id !== postId);
        } else {
          // Si no existe, (opcional) puedes añadirlo aquí si quieres
          return prev;
        }
      });
    } catch (error) {
      console.error("Error al cambiar estado de favorito:", error);
    }
  };

  // Función para ir a detalle del reporte, ruta igual que Favoritos.jsx
  const goToDetail = (postId) => {
    navigate(`/reporte/${postId}`);
  };

  const postsToRender = activeTab === "publicaciones" ? posts : likedPosts;

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
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

      {loading && <p className="text-center text-muted">Cargando reportes...</p>}

      {error && (
        <p className="text-center text-danger" style={{ whiteSpace: "pre-wrap" }}>
          {error}
        </p>
      )}

      {!loading && !error && postsToRender.length === 0 && (
        <p className="text-center text-muted">
          No hay {activeTab === "publicaciones" ? "publicaciones" : "me gustas"} para este usuario.
        </p>
      )}

      {!loading && !error && postsToRender.length > 0 && (
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
                  cursor: "pointer",
                }}
                onClick={() => goToDetail(post.id)}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-100 h-100"
                  style={{ objectFit: "cover", borderRadius: "10px" }}
                />
                {activeTab === "megustan" && (
                  <img
                    src={corazonVacioNegro}
                    alt="favorito"
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
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
