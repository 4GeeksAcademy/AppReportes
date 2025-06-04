import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Moderador = () => {
    const { dispatch } = useGlobalReducer();
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
    const [contenido, setContenido] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Cargar usuarios desde el backend
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/users`);
                const data = await res.json();
                setUsuarios(data);
            } catch (err) {
                console.error("Error al obtener usuarios:", err);
            }
        };
        fetchUsuarios();
    }, []);

    // Cuando se selecciona un usuario, cargar su contenido
    const handleUsuarioChange = async (e) => {
        const userId = e.target.value;
        setUsuarioSeleccionado(userId);

        try {
            const res = await fetch(`${backendUrl}/api/user/${userId}/content`);
            const data = await res.json();
            setContenido(data);
        } catch (err) {
            console.error("Error al cargar contenido del usuario:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Panel de Moderador</h2>

            {/* Selector de usuario */}
            <div className="mb-3">
                <label htmlFor="usuario" className="form-label">Seleccionar Usuario:</label>
                <select
                    id="usuario"
                    className="form-select"
                    value={usuarioSeleccionado}
                    onChange={handleUsuarioChange}
                >
                    <option value="">-- Selecciona un usuario --</option>
                    {usuarios.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.email}
                        </option>
                    ))}
                </select>
            </div>

            {/* Mostrar fotos y comentarios */}
            <div className="row">
                {contenido.map((item) => (
                    <div key={item.photo_id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={item.url} className="card-img-top" alt="Foto publicada" />
                            <div className="card-body">
                                {item.comments.map((comment) => (
                                    <p key={comment.id} className="card-text">{comment.content}</p>
                                ))}
                                <button
                                    className="btn btn-danger mt-2"
                                    onClick={() => handleEliminar(item.photo_id)}
                                >
                                    Eliminar Foto
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
