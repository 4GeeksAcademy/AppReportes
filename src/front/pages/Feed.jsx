import React, { useState } from "react";
import { Link } from "react-router-dom";
import imagen3_4 from "../assets/img/city_fondo_3_4.jpg";
import corazonVacio from "../assets/img/corazon_vacio.png";
import corazonVacioNegro from "../assets/img/corazon_vacio_negro.png";

const votedPosts = {
  1: { up: true, down: false },
  2: { up: false, down: false },
};

const posts = [
  {
    id: 1,
    user: { name: "Juan Pérez", avatar: "https://i.pravatar.cc/50?img=10" },
    imageUrl: imagen3_4,
    title: "Bache enorme en la calle principal",
    likes: 34,
    positiveVotes: 40,
    negativeVotes: 5,
    comments: [],
  },
  {
    id: 2,
    user: { name: "María López", avatar: "https://i.pravatar.cc/50?img=20" },
    imageUrl: imagen3_4,
    title: "Luminaria rota en el parque",
    likes: 18,
    positiveVotes: 20,
    negativeVotes: 2,
    comments: [],
  },
  {
    id: 3,
    user: { name: "Luis García", avatar: "https://i.pravatar.cc/50?img=15" },
    imageUrl: imagen3_4,
    title: "Contenedor de basura desbordado",
    likes: 25,
    positiveVotes: 30,
    negativeVotes: 3,
    comments: [],
  },
];

export const Feed = () => {
  const [likedPosts, setLikedPosts] = useState({});

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      {posts.map((post) => {
        const voted = votedPosts[post.id] || { up: false, down: false };
        const isLiked = likedPosts[post.id];

        return (
          <div
            key={post.id}
            className="card mb-4 border-0 shadow-lg overflow-hidden rounded-4 position-relative"
            style={{ background: "transparent" }}
          >
            <div className="position-relative">
              {/* Imagen que redirige a /reporte */}
              <Link to="/reporte">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-100"
                  style={{
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    borderRadius: "1rem",
                  }}
                />
              </Link>

              {/* Usuario que redirige a /mis-reportes */}
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

              {/* Botón like */}
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

              {/* Título */}
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

              {/* Botones de votación */}
              <div
                className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2"
                style={{
                  flexWrap: "nowrap",
                  maxWidth: "95%",
                  overflowX: "auto",
                }}
              >
                <button
                  className="btn btn-sm"
                  style={{
                    whiteSpace: "nowrap",
                    color: voted.up ? "white" : "lightgray",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50px",
                    backdropFilter: "blur(3px)",
                    minWidth: "fit-content",
                  }}
                >
                  Upvote {post.positiveVotes}
                </button>
                <button
                  className="btn btn-sm"
                  style={{
                    whiteSpace: "nowrap",
                    color: voted.down ? "white" : "lightgray",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50px",
                    backdropFilter: "blur(3px)",
                    minWidth: "fit-content",
                  }}
                >
                  Downvote {post.negativeVotes}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
