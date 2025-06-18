import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

export const EditarReporte = () => {
  const { id } = useParams(); // reporte ID
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();


    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setMensaje("Debes estar logueado para editar el reporte");
          return;
        }

        // Obtener el usuario actual
        const userRes = await fetch(`${BACKEND_URL}/api/userinfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await userRes.json();
        const currentUserId = userData.user.id;

        // Obtener el reporte
        const reporteRes = await fetch(`${BACKEND_URL}/api/reportes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const reporteData = await reporteRes.json();

        if (!reporteRes.ok) {
          setMensaje(reporteData.error || "Error al obtener el reporte");
          return;
        }

        // Verificar permisos
        if (reporteData.author_id !== currentUserId) {
          setMensaje("No tienes permiso para editar este reporte");
          return;
        }

        setUserId(currentUserId);
        setTitle(reporteData.titulo);
        setDescription(reporteData.text);
        // podés setear imagen acá si querés
      } catch (error) {
        console.error(error);
        setMensaje("Error al cargar el reporte");
      }
    };

  useEffect(() => {


    fetchData();
}, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!title.trim()) return alert("El título es obligatorio");

    try {
      const token = await getToken();
      if (!token || !userId) {
        setMensaje("No autorizado");
        return;
      }

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await subirImagenACloudinary(imageFile);
      }

      const body = {
        titulo: title,
        text: description,
      };

      if (imageUrl) {
        body.images = [imageUrl]; // el backend espera un array
      }

      const res = await fetch(`${BACKEND_URL}/api/users/${userId}/reportes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("Reporte actualizado correctamente");
        setTimeout(() => navigate("/mis-reportes"), 1500); // redirige si quieres
      } else {
        setMensaje(data.error || "Error al actualizar el reporte");
      }
    } catch (error) {
      setMensaje("Error en la conexión");
    }
  };

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        paddingTop: "10vh",
        paddingBottom: "5vh",
        fontFamily: "'Segoe UI', sans-serif",
        minHeight: "10vh",
        color: "white",
      }}
    >
      <div
        className="p-4 shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          width: "90vw",
          maxWidth: "400px",
        }}
      >
        <h3 className="text-center mb-4 fw-light">Editar reporte</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Título del reporte</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Bache en calle principal"
              required
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                borderRadius: "10px",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe el reporte"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                borderRadius: "10px",
                resize: "vertical",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Imagen (opcional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                borderRadius: "10px",
              }}
            />
          </div>

          {mensaje && (
            <div className="alert alert-info py-1 mt-3" role="alert">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "white",
              color: "#1c1c1e",
              borderRadius: "50px",
              fontWeight: 500,
            }}
          >
            Actualizar reporte
          </button>
        </form>
      </div>
    </div>
  );
};
