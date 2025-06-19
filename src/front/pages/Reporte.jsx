import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import corazonVacio from "../assets/img/corazon_vacio.png";
import corazonVacioNegro from "../assets/img/corazon_vacio_negro.png";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getAuth } from "firebase/auth";
import { ModalDenuncias } from "../components/ModalDenuncias";
import { ModalComentario } from "../components/ModalComentario";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// console.log("BACKEND_URL", BACKEND_URL);

export const Reporte = () => {
  const { id } = useParams();
  const { store, dispatch } = useGlobalReducer();

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [votedPosts, setVotedPosts] = useState({});

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportModalTipo, setReportModalTipo] = useState("reporte"); // "reporte" o "comentario"
  const [reportModalComentarioId, setReportModalComentarioId] = useState(null);

  const [comentarioModalVisible, setComentarioModalVisible] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  // const fetchCurrentUserId = async () => {
  //   const auth = getAuth();
  //   const user = auth.currentUser;
  //   console.log(user)
  //   if (user) {
  //     setCurrentUserId(user.uid);
  //   }
  // };


  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  const fetchReporte = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/reportes/${id}`);
      if (!res.ok) throw new Error("No se pudo cargar el reporte");
      const data = await res.json();


      dispatch({
        type: "SET_REPORTE",
        payload: {
          id: data.id,
          titulo: data.titulo,
          imagen: data.images?.[0]?.image || "https://placehold.co/400x400",
          descripcion: data.text,
          usuario: {
            id: data.author?.id,
            nombre: data.author?.fullname || "Usuario",
            avatar: data.author?.profile_picture || "https://placehold.co/100x100",
          },
          positiveVotes: data.votes?.filter((v) => v.is_upvote).length || 0,
          negativeVotes: data.votes?.filter((v) => !v.is_upvote).length || 0,
          comentarios: data.comments?.map((c) => ({
            id: c.id,
            texto: c.comment_text,
            usuario: {
              id: c.usuario?.id,
              fullname: c.usuario?.fullname || "Usuario"
            }
          })) || []

          ,
        },
      });
    } catch (err) {
      console.error("Error al cargar el reporte:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${BACKEND_URL}/api/reportes/favoritos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener favoritos");
      const favoriteIds = await res.json();
      setLiked(favoriteIds.includes(Number(id)));
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${BACKEND_URL}/api/reportes/mis-votos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener votos");
      const data = await res.json();

      const votesMap = {};
      data.forEach(({ reporte_id, is_upvote }) => {
        votesMap[reporte_id.toString()] = is_upvote ? "upvote" : "downvote";
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

      const res = await fetch(`${BACKEND_URL}/api/reportes/${postId}/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al votar");

      // Actualizar datos tras votar
      await fetchReporte();
      await fetchUserVotes();
    } catch (error) {
      console.error("Error al votar:", error);
    }
  };

  const toggleLike = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/reportes/${id}/favorito`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al cambiar favorito");

      setLiked((prev) => !prev);
    } catch (error) {
      console.error("Error al cambiar estado de favorito:", error);
    }
  };

  // Abrir modal para denunciar reporte o comentario
  const abrirModalDenuncia = (tipo, comentarioId = null) => {
    setReportModalTipo(tipo);
    setReportModalComentarioId(comentarioId);
    setReportModalVisible(true);
  };

  const cerrarModalDenuncia = () => {
    setReportModalVisible(false);
    setReportModalComentarioId(null);
  };

  const enviarDenuncia = async (motivo) => {

    try {
      const token = await getToken();
      if (!token) return;

      const url = `${BACKEND_URL}/api/denuncias`;

      const body = {
        motivo,
        ...(reportModalTipo === "reporte"
          ? { reporte_id: Number(id) }
          : { comment_id: Number(reportModalComentarioId) }),
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al enviar denuncia");

      alert("Denuncia enviada correctamente.");
      cerrarModalDenuncia();
    } catch (error) {
      console.error("Error al enviar denuncia:", error);
      alert("Hubo un error al enviar la denuncia.");
    }
  };

  const enviarComentario = async (commentText) => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/reportes/${id}/comentarios`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment_text: commentText }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Error al enviar comentario");
        return;
      }

      // Recargar comentarios
      await fetchReporte();
      setComentarioModalVisible(false);
    } catch (error) {
      console.error("Error al comentar:", error);
      alert("Hubo un error al enviar el comentario.");
    }
  };

  const fetchCurrentUserBackendId = async () => {
    const token = await getToken();
    const res = await fetch(`${BACKEND_URL}/api/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    // console.log("🔁 Userinfo id:",data.user.id)
    setCurrentUserId(Number(data.user.id));

  };

  const eliminarReporte = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/reportes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.msg || "Error al eliminar el reporte.");
        return;
      }

      alert("Reporte eliminado correctamente.");
      navigate("/feed");
    } catch (error) {
      console.error("Error al eliminar reporte:", error);
      alert("Error al intentar eliminar el reporte.");
    }
  };

  const eliminarComentario = async (commentId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;

    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/comentarios/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.msg || "Error al eliminar comentario.");
        return;
      }

      alert("Comentario eliminado correctamente.");
      await fetchReporte(); // Recargar comentarios
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      alert("Hubo un error al eliminar el comentario.");
    }
  };


  useEffect(() => {
    fetchReporte();
    fetchUserFavorites();
    fetchUserVotes();
    fetchCurrentUserBackendId();
  }, [id]);



  if (loading) {
    return <div className="text-white text-center mt-5">Cargando reporte...</div>;
  }



  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <div className="card mb-4 border-0 overflow-hidden rounded-4 position-relative" style={{ background: "transparent" }}>
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          <div
            className="border rounded p-3 mb-3"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(50px)",
              color: "white",
              fontSize: "1.25rem",
              fontWeight: "400",
              borderRadius: "0.5rem",
            }}
          >
            {store.reporte.titulo}
          </div>

          <div className="position-relative">
            <img
              src={store.reporte.imagen}
              alt={store.reporte.titulo}
              className="w-100"
              style={{ aspectRatio: "3/4", objectFit: "cover", borderRadius: "1rem" }}
            />

            <Link
              to={`/users/${store.reporte.usuario.id}/reportes`}
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
                style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
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

            {currentUserId == store.reporte.usuario.id && (
              <div className="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-2">
                <Link
                  to={`/editar-reporte/${store.reporte.id}`}
                  className="btn btn-sm btn-warning"
                  title="Editar reporte"
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: "10px 10px",
                    fontSize: "0.75rem",
                    borderRadius: "50px",
                  }}
                >
                  ✏️
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  title="Eliminar reporte"
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: "6px 10px",
                    fontSize: "0.75rem",
                    borderRadius: "50px",
                  }}
                  onClick={() => {
                    if (confirm("¿Estás seguro de que deseas eliminar este reporte?")) {
                      eliminarReporte();
                    }
                  }}
                >
                  🗑️
                </button>
                <button
                  onClick={toggleLike}
                  className="border-0 d-flex align-items-center justify-content-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: liked ? "white" : "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    backdropFilter: "blur(3px)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  title="Me gusta"
                >
                  <img src={liked ? corazonVacioNegro : corazonVacio} alt="like" width={20} height={20} />
                </button>
              </div>
            )}



            <button
              onClick={toggleLike}
              className="position-absolute top-0 end-0 m-2 border-0 d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: liked ? "white" : "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                backdropFilter: "blur(3px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              title="Me gusta"
            >
              <img src={liked ? corazonVacioNegro : corazonVacio} alt="like" width={20} height={20} />
            </button>
          </div>

          <div className="d-flex gap-3 justify-content-center mt-3 flex-wrap" style={{ color: "white" }}>
            <button
              onClick={() => handleVote(id, "upvote")}
              className="btn btn-sm"
              style={{
                whiteSpace: "nowrap",
                color: votedPosts[id] === "upvote" ? "white" : "lightgray",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50px",
                backdropFilter: "blur(100px)",
                border: votedPosts[id] === "upvote" ? "2px solid white" : "none", // <-- Añade esta línea
              }}
            >
              ↑ Upvote {store.reporte.positiveVotes}
            </button>
            <button
              onClick={() => handleVote(id, "downvote")}
              className="btn btn-sm"
              style={{
                whiteSpace: "nowrap",
                color: votedPosts[id] === "downvote" ? "white" : "lightgray",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50px",
                backdropFilter: "blur(100px)",
                border: votedPosts[id] === "downvote" ? "2px solid white" : "none", // <-- Añade esta línea
              }}
            >
              ↓ Downvote {store.reporte.negativeVotes}
            </button>

            <button
              onClick={() => abrirModalDenuncia("reporte")}
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

          <div
            className="border rounded p-3 mt-3"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              color: "white",
              fontSize: "1rem",
              fontWeight: "300",
              borderRadius: "0.5rem",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <h5 style={{ color: "white", fontWeight: "500" }}>Comentarios</h5>
              <button
                onClick={() => setComentarioModalVisible(true)}
                className="btn btn-sm"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(20px)",
                  color: "white",
                  borderRadius: "50px",
                }}
                title="Agregar comentario"
              >
                💬
              </button>
            </div>

            {store.reporte.comentarios.map(({ id: commentId, usuario, texto }) => (
              <div key={commentId} className="mb-3 d-flex justify-content-between align-items-start">
                <div>
                  <strong>{usuario.fullname}:</strong> <span>{texto}</span>
                </div>

                {Number(usuario.id) === Number(currentUserId) ? (
                  <button
                    className="btn btn-sm px-2 py-1 ms-2"
                    onClick={() => eliminarComentario(commentId)}
                    style={{
                      background: "rgba(255, 0, 0, 0.3)",
                      color: "white",
                      fontSize: "0.75rem",
                      borderRadius: "0.5rem",
                      backdropFilter: "blur(5px)",
                    }}
                    title="Eliminar mi comentario"
                  >
                    🗑️
                  </button>
                ) : (
                  <button
                    className="btn btn-sm px-2 py-1 ms-2"
                    onClick={() => abrirModalDenuncia("comentario", commentId)}
                    style={{
                      background: "rgba(255, 80, 80, 0.15)",
                      color: "white",
                      fontSize: "0.75rem",
                      borderRadius: "0.5rem",
                      backdropFilter: "blur(5px)",
                    }}
                    title="Denunciar comentario"
                  >
                    🚩
                  </button>
                )}
              </div>
            ))}

          </div>
        </div>
      </div>

      <ModalDenuncias
        visible={reportModalVisible}
        onClose={cerrarModalDenuncia}
        onSubmit={enviarDenuncia}
        tipo={reportModalTipo}
      />
      <ModalComentario
        visible={comentarioModalVisible}
        onClose={() => setComentarioModalVisible(false)}
        onSubmit={enviarComentario}
      />
    </div>
  );
};
