import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
          comentarios:
            data.comments?.map((c) => ({
              id: c.id,
              usuario: c.autor,
              texto: c.comment_text,
            })) || [],
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

    console.log("Enviando denuncia a:", `${BACKEND_URL}/api/denuncia`);
    console.log("Body:", {
      motivo,
      tipo: reportModalTipo,
      id_objetivo: reportModalTipo === "reporte" ? id : reportModalComentarioId,
    });
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


  useEffect(() => {
    fetchReporte();
    fetchUserFavorites();
    fetchUserVotes();
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
              backdropFilter: "blur(10px)",
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
                backdropFilter: "blur(10px)",
              }}
            >
              Upvote {store.reporte.positiveVotes}
            </button>
            <button
              onClick={() => handleVote(id, "downvote")}
              className="btn btn-sm"
              style={{
                whiteSpace: "nowrap",
                color: votedPosts[id] === "downvote" ? "white" : "lightgray",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
              }}
            >
              Downvote {store.reporte.negativeVotes}
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
              backdropFilter: "blur(10px)",
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
                  backdropFilter: "blur(6px)",
                  color: "white",
                  borderRadius: "50px",
                }}
                title="Agregar comentario"
              >
                💬
              </button>
            </div>

            {store.reporte.comentarios.length > 0 ? (
              store.reporte.comentarios.map(({ id: commentId, usuario, texto }) => (
                <div key={commentId} className="mb-3 d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{usuario}:</strong> <span>{texto}</span>
                  </div>
                  <button
                    className="btn btn-sm px-2 py-1 ms-2"
                    onClick={() => abrirModalDenuncia("comentario", commentId)}
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
              ))
            ) : (
              <p className="text-white-50">No hay comentarios todavía.</p>
            )}
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
