import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import imagen3_4 from "../assets/img/city_fondo_3_4.jpg";
import corazonVacio from "../assets/img/corazon_vacio.png";
import corazonVacioNegro from "../assets/img/corazon_vacio_negro.png";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getAuth } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Feed = () => {
  const [likedPosts, setLikedPosts] = useState({});
  const { store, dispatch } = useGlobalReducer();
  const [votedPosts, setVotedPosts] = useState({});
  const navigate = useNavigate();

  // 🔐 Obtener token actual de Firebase
  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/reportes`);
      const data = await res.json();
      // console.log(data)

      const mappedPosts = data.map((reporte) => ({
        id: reporte.id,
        title: reporte.titulo,
        text: reporte.text,
        imageUrl: reporte.images?.[0]?.image || imagen3_4,
        positiveVotes: reporte.votes?.filter((v) => v.is_upvote).length || 0,
        negativeVotes: reporte.votes?.filter((v) => !v.is_upvote).length || 0,
        user: {
          id: reporte.author?.id,
          name: reporte.author?.fullname || "Anónimo",
          avatar: reporte.author?.profile_picture || "https://i.pravatar.cc/50",
        },
      }));

      dispatch({ type: "LOAD_REPORTS", payload: mappedPosts });
    } catch (error) {
      console.error("Error al obtener reportes:", error);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/reportes/favoritos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener favoritos");

      const favoriteIds = await res.json(); // [1, 3, 5]
      const likedMap = {};
      favoriteIds.forEach((id) => {
        likedMap[id] = true;
      });
      setLikedPosts(likedMap);
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const token = await getToken();
      if (!token) return;

      const isLiked = likedPosts[postId];

      const res = await fetch(
        `${BACKEND_URL}/api/reportes/${postId}/favorito`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al cambiar favorito");

      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !isLiked,
      }));
    } catch (error) {
      console.error("Error al cambiar estado de favorito:", error);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/reportes/mis-votos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener votos");

      const data = await res.json(); // [{ reporte_id: 1, is_upvote: true }, ...]

      const votesMap = {};
      data.forEach(({ reporte_id, is_upvote }) => {
        votesMap[reporte_id] = {
          up: is_upvote,
          down: !is_upvote,
        };
      });

      setVotedPosts(votesMap);
    } catch (error) {
      console.error("Error al obtener votos:", error);
    }
  };

  const handleVote = async (postId, type) => {
    try {
      const token = await getToken();
      if (!token) return;

      const endpoint = type === "upvote" ? "upvote" : "downvote";
      const res = await fetch(`${BACKEND_URL}/api/reportes/${postId}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al votar");

      // Refrescar votos después de votar
      fetchReports();
      fetchUserVotes();
    } catch (error) {
      console.error("Error al votar:", error);
    }
  };


  useEffect(() => {
    fetchReports();
    fetchUserFavorites();
    fetchUserVotes();
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      {store.posts.map((post) => {
        const voted = store.votedPosts[post.id] || { up: false, down: false };
        const isLiked = likedPosts[post.id];

        return (
          <div
            key={post.id}
            className="card mb-4 border-0 shadow-lg overflow-hidden rounded-4 position-relative"
            style={{ background: "transparent" }}
          >
            <div className="position-relative">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-100"
                style={{
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  borderRadius: "1rem",
                }}
                onClick={() => navigate(`/reporte/${post.id}`)}
                role="button"
              />


              <Link
                to={`/users/${post.user.id}/reportes`}
                className="position-absolute top-0 start-0 m-2 d-flex align-items-center gap-2 px-2 py-2 text-white text-decoration-none"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(4px)",
                  borderRadius: "50px",
                  maxWidth: "70%",
                }}
              >
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
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
                  {post.user.name}
                </span>
              </Link>

              <button
                onClick={() => toggleLike(post.id)}
                className="position-absolute top-0 end-0 m-2 border-0 d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: isLiked
                    ? "white"
                    : "rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  backdropFilter: "blur(3px)",
                  transition: "all 0.3s ease",
                }}
              >
                <img
                  src={isLiked ? corazonVacioNegro : corazonVacio}
                  alt="like"
                  width={20}
                  height={20}
                />
              </button>

              <div
                className="position-absolute start-50 translate-middle-x px-3 py-2 mb-2 text-start"
                style={{
                  bottom: "60px",
                  width: "95%",
                  maxWidth: "500px",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(3px)",
                  borderRadius: "10px",
                  color: "white",
                }}
              >
                <h5
                  className="m-0 fw-light"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  {post.title}
                </h5>
              </div>

              <div
                className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2"
                style={{
                  flexWrap: "nowrap",
                  maxWidth: "95%",
                  overflowX: "auto",
                }}
              >
                <button
                  onClick={() => handleVote(post.id, "upvote")}
                  className="btn btn-sm"
                  style={{
                    whiteSpace: "nowrap",
                    color: votedPosts[post.id]?.up ? "white" : "lightgray",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50px",
                    backdropFilter: "blur(100px)",
                    minWidth: "fit-content",
                    border: votedPosts[post.id]?.up ? "2px solid white" : "2px solid transparent",
                  }}
                >
                  ↑ Upvote {post.positiveVotes}
                </button>
                <button
                  onClick={() => handleVote(post.id, "downvote")}
                  className="btn btn-sm"
                  style={{
                    whiteSpace: "nowrap",
                    color: votedPosts[post.id]?.down ? "white" : "lightgray",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50px",
                    backdropFilter: "blur(100px)",
                    minWidth: "fit-content",
                    border: votedPosts[post.id]?.down ? "1.5px solid white" : "1.5px solid transparent",
                  }}
                >
                  ↓ Downvote {post.negativeVotes}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
