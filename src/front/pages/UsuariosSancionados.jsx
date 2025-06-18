import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const UsuariosSancionados = () => {
  const [usuariosSancionados, setUsuariosSancionados] = useState([]);

  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  useEffect(() => {
    const fetchUsuariosSancionados = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${BACKEND_URL}/api/sancion`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al obtener usuarios sancionados");

        const data = await res.json();
        setUsuariosSancionados(data);
      } catch (error) {
        console.error("Error al cargar usuarios sancionados:", error);
      }
    };

    fetchUsuariosSancionados();
  }, []);

  const handleActionClick = async (action, id) => {
    const token = await getToken();
    if (!token) return;

    if (action === "eliminar usuario") {
      const confirm = window.confirm("¿Estás seguro de eliminar al usuario?");
      if (!confirm) return;

      try {
        // Paso 1: Registrar eliminación
        const res1 = await fetch(`${BACKEND_URL}/api/eliminados`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!res1.ok) {
          const err = await res1.json();
          throw new Error(err.error || "Error al registrar en eliminados");
        }

        // Paso 2: Eliminar usuario
        const res2 = await fetch(`${BACKEND_URL}/api/sancion/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res2.ok) {
          const err = await res2.json();
          throw new Error(err.error || "Error al eliminar usuario");
        }

        // Actualizar UI local
        setUsuariosSancionados((prev) => prev.filter((u) => u.id !== id));
        alert("Usuario eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar el usuario.");
      }
    }

    if (action === "quitar ban") {
      try {
        const res = await fetch(`${BACKEND_URL}/api/quitarban`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: id }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al quitar ban");
        }

        alert("Ban quitado correctamente.");

        // Opcional: actualizar la lista para reflejar el cambio
        setUsuariosSancionados((prev) => prev.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Error al quitar ban:", error);
        alert("No se pudo quitar el ban.");
      }
    }
  };

  const handleEliminar = async (id, fullname, mail, motivo) => {
    const token = await getToken();
    if (!token) return;

    if (!window.confirm("¿Eliminar usuario definitivamente?")) return;

    try {
      // 1. POST a /api/eliminados para registrar el eliminado
      const postRes = await fetch(`${BACKEND_URL}/api/eliminados`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullname, email: mail, motivo }),
      });

      if (!postRes.ok) {
        const errorData = await postRes.json();
        throw new Error(errorData.error || "Error al registrar eliminado");
      }

      // 2. DELETE a /api/sancion/:id para borrar usuario y sanciones
      const delRes = await fetch(`${BACKEND_URL}/api/sancion/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!delRes.ok) {
        const errorData = await delRes.json();
        throw new Error(errorData.error || "Error al eliminar usuario");
      }

      // Actualizar el estado para sacar al usuario eliminado de la lista
      setUsuariosSancionados((prev) => prev.filter((u) => u.id !== id));
      alert("Usuario eliminado y registrado correctamente.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div
      className="d-flex min-vh-100 justify-content-center align-items-start pt-4"
      style={{
        background:
          "url('/path-to-some-background.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        color: "white",
        padding: "1rem",
        whiteSpace: "nowrap",
      }}
    >
      <main style={{ width: "95%", maxWidth: "900px" }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1.5rem 1rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontWeight: "300",
              fontFamily: "'Segoe UI', Tahoma",
              margin: 0,
            }}
          >
            📋 Usuarios Sancionados
          </h1>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            padding: "1rem",
            overflowX: "auto",
          }}
        >
          <table
            className="table table-borderless text-white"
            style={{ minWidth: "700px", whiteSpace: "nowrap" }}
          >
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosSancionados.map(
                ({ id, fullname, mail, motivo, created_at }) => (
                  <tr
                    key={id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}
                  >
                    <td>{fullname}</td>
                    <td>{mail}</td>
                    <td>{motivo}</td>
                    <td>{new Date(created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleActionClick("quitar ban", id)}
                      >
                        Quitar Ban
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminar(id, fullname, mail, motivo)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
