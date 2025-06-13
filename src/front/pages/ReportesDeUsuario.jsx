import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ReportesDeUsuario = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const { store, dispatch } = useGlobalReducer();

  const fetchUserReports = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${id}/reportes`);
      if (!res.ok) throw new Error("Error en la respuesta");
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReports();
  }, [id]);

  if (loading) return <p>Cargando reportes...</p>;
  if (!posts.length) return <p>No hay reportes para este usuario.</p>;

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
        <div
            className=" p-3 mb-3 text-white"
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
      <div className="row g-2">
        {posts.map((post) => (
          <div key={post.id} className="col-6 col-md-3">
            <div
              className="w-100"
              style={{
                aspectRatio: "1",
                overflow: "hidden",
                borderRadius: "10px",
              }}
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-100 h-100"
                style={{ objectFit: "cover", borderRadius: "10px" }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Usuario abajo, con blur y estilo */}

    </div>
  );
};
