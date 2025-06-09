import React, { useEffect, useState } from "react";

export const Moderador = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
    const [contenido, setContenido] = useState([]);
    const [editandoComentarioId, setEditandoComentarioId] = useState(null);
    const [nuevoTexto, setNuevoTexto] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetch(`${backendUrl}/api/users`)
            .then(res => res.json())
            .then(data => setUsuarios(data))
            .catch(err => console.error("Error al cargar usuarios:", err));
    }, []);

    const handleUsuarioChange = async (e) => {
        const userId = e.target.value;
        setUsuarioSeleccionado(userId);
        const res = await fetch(`${backendUrl}/api/user/${userId}/content`);
        const data = await res.json();
        setContenido(data);
    };

    const eliminarFoto = async (photoId) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta foto y todos sus comentarios?");
    if (!confirmar) return;

    try {
        const res = await fetch(`${backendUrl}/api/photo/${photoId}`, { method: "DELETE" });
        if (res.ok) {
            setContenido(prev => prev.filter(p => p.photo_id !== photoId));
        } else {
            console.error("Error al eliminar la foto");
        }
    } catch (err) {
        console.error("Error al comunicarse con el servidor:", err);
    }
};



    const eliminarComentario = async (commentId) => {
        await fetch(`${backendUrl}/api/comment/${commentId}`, { method: "DELETE" });
        setContenido(prev => prev.map(p => ({
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
        })));
    };

    const guardarComentarioEditado = async (commentId) => {
        await fetch(`${backendUrl}/api/comment/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: nuevoTexto })
        });

        setContenido(prev => prev.map(p => ({
            ...p,
            comments: p.comments.map(c =>
                c.id === commentId ? { ...c, content: nuevoTexto } : c
            )
        })));
        setEditandoComentarioId(null);
        setNuevoTexto("");
    };

    return (
        <div className="container mt-4">
            <h2>Moderación de contenido</h2>

            <div className="mb-3">
                <label htmlFor="usuario" className="form-label">Selecciona un usuario:</label>
                <select
                    id="usuario"
                    className="form-select"
                    value={usuarioSeleccionado}
                    onChange={handleUsuarioChange}
                >
                    <option value="">-- Selecciona un usuario --</option>
                    {usuarios.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.email}
                        </option>
                    ))}
                </select>
            </div>

            <div className="row">
                {contenido.map(item => (
                    <div key={item.photo_id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={item.url} className="card-img-top" alt="foto" />
                            <div className="card-body">
                                <h5 className="card-title">Comentarios</h5>
                                {item.comments.map(comment => (
                                    <div key={comment.id} className="mb-2">
                                        {editandoComentarioId === comment.id ? (
                                            <>
                                                <textarea
                                                    className="form-control mb-2"
                                                    value={nuevoTexto}
                                                    onChange={e => setNuevoTexto(e.target.value)}
                                                />
                                                <button className="btn btn-success btn-sm me-2"
                                                    onClick={() => guardarComentarioEditado(comment.id)}>
                                                    Guardar
                                                </button>
                                                <button className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditandoComentarioId(null)}>
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <p>{comment.content}</p>
                                                <button className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() => {
                                                        setEditandoComentarioId(comment.id);
                                                        setNuevoTexto(comment.content);
                                                    }}>
                                                    Editar
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm"
                                                    onClick={() => eliminarComentario(comment.id)}>
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <button
                                    className="btn btn-danger mt-2"
                                    onClick={() => eliminarFoto(item.photo_id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
