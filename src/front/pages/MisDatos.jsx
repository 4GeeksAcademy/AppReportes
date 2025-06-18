import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // 👈 Asegúrate de tener react-router-dom instalado

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const MisDatos = () => {
  const [nombre, setNombre] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");
  const [userId, setUserId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const subirImagenACloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "perfil_upload");

    const res = await fetch("https://api.cloudinary.com/v1_1/dreejt5u8/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/api/userinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUserId(data.user.id);
          setNombre(data.user.fullname || "");
          setFotoPerfilUrl(data.user.profile_picture || "");
        } else {
          setMensaje(data.error || "Error al cargar usuario");
        }
      } catch {
        setMensaje("Error en la conexión");
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();
    let imagenUrl = fotoPerfilUrl;

    if (fotoPerfil) {
      try {
        imagenUrl = await subirImagenACloudinary(fotoPerfil);
        setFotoPerfilUrl(imagenUrl);
      } catch {
        setMensaje("Error al subir imagen");
        return;
      }
    }

    const data = {
      fullname: nombre,
      profile_picture: imagenUrl,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMensaje("Perfil actualizado correctamente");
      } else {
        setMensaje(result.error || "Error al actualizar perfil");
      }
    } catch (error) {
      setMensaje("Error en la conexión");
    }
  };

  // 🔴 Botón Eliminar Cuenta
  const handleEliminarCuenta = async () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (!confirmacion) return;

    try {
      const token = await getToken();
      const response = await fetch(`${BACKEND_URL}/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Cerrar sesión en Firebase
        const auth = getAuth();
        await auth.signOut();
        alert("Cuenta eliminada correctamente.");
        navigate("/signup"); // o redirige a la home
      } else {
        alert(data.error || "Error al eliminar la cuenta");
      }
    } catch (error) {
      alert("Error al intentar eliminar la cuenta");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <main className="flex-grow-1 d-flex justify-content-center align-items-start p-4">
        <div
          className="p-4 shadow-lg rounded-4"
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            color: "white",
          }}
        >
          <h2 className="text-center mb-4" style={{ fontWeight: 300 }}>
            Mis Datos
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control border-0 shadow-sm"
                id="nombre"
                placeholder="Tu nombre"
                style={{ borderRadius: "10px" }}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <label htmlFor="fotoPerfil" className="form-label mb-0">
                  Foto de perfil
                </label>
                {fotoPerfilUrl && (
                  <img
                    src={fotoPerfilUrl}
                    alt="Foto de perfil"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>

              <input
                type="file"
                className="form-control border-0 shadow-sm"
                id="fotoPerfil"
                style={{ borderRadius: "10px" }}
                onChange={(e) => setFotoPerfil(e.target.files[0])}
              />
            </div>

            {/* Cambiar contraseña */}
            <div className="mb-2">
              <button
                type="button"
                className="btn w-100 rounded-pill"
                style={{
                  backgroundColor: "#003366",
                  color: "white",
                  border: "none",
                }}
              >
                Cambiar contraseña
              </button>
            </div>

            {/* 🔴 Eliminar cuenta */}
            <div className="mb-4">
              <button
                type="button"
                className="btn w-100 rounded-pill"
                style={{
                  backgroundColor: "#cc0000",
                  color: "white",
                  border: "none",
                }}
                onClick={handleEliminarCuenta}
              >
                Eliminar cuenta
              </button>
            </div>

            {/* Guardar / Cancelar */}
            <div className="d-flex justify-content-between gap-2">
              <button
                type="submit"
                className="btn btn-success flex-grow-1 rounded-pill"
              >
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-secondary flex-grow-1 rounded-pill"
                onClick={() => {
                  setNombre("");
                  setFotoPerfil(null);
                  setFotoPerfilUrl("");
                  setMensaje("");
                }}
              >
                Cancelar
              </button>
            </div>
          </form>

          {mensaje && (
            <div className="mt-3 alert alert-info" role="alert">
              {mensaje}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
