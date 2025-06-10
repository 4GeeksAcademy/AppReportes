import { useState } from "react";
import { SidebarUsuario } from "../components/SidebarUsuario";

const ReportForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("El título es obligatorio");

    const newReport = {
      id: Date.now(),
      title,
      description,
      imageUrl,
      currentUserId: "123", // ejemplo de usuario actual
      likes: 0,
      positiveVotes: 0,
      negativeVotes: 0,
      comments: [],
    };

    onSubmit(newReport);

    // Limpiar formulario
    setTitle("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Título del reporte</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Bache en calle principal"
          required
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
        />
      </div>

      <div className="mb-3">
        <label className="form-label">URL de la imagen</label>
        <input
          type="url"
          className="form-control"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Subir reporte
      </button>
    </form>
  );
};

const ReportCard = ({ report }) => {
  return (
    <div className="card w-100">
      {report.imageUrl && (
        <img src={report.imageUrl} className="card-img-top" alt={report.title} />
      )}
      <div className="card-body">
        <h5 className="card-title">{report.title}</h5>
        <p className="card-text">{report.description}</p>
      </div>
    </div>
  );
};

export const SubirReporte = () => {
  const [reports, setReports] = useState([]);

  const addReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <div className="bg-light min-vh-100 d-flex">
      {/* Sidebar a la izquierda */}
      <SidebarUsuario />

      {/* Contenido principal a la derecha */}
      <main className="flex-grow-1 container pt-5 mt-4">
        <h1 className="mb-4">Subir un nuevo reporte</h1>

        <ReportForm onSubmit={addReport} />

        {reports.length === 0 && (
          <p className="text-center text-muted my-5">Aún no hay reportes publicados.</p>
        )}

        <div className="row gy-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
            >
              <ReportCard report={report} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
