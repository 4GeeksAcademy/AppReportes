import { useState } from "react";
import cityFondo from "../assets/img/city_fondo3.jpg"; // mismo fondo

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
      currentUserId: "123",
      likes: 0,
      positiveVotes: 0,
      negativeVotes: 0,
      comments: [],
    };

    onSubmit(newReport);

    setTitle("");
    setDescription("");
    setImageUrl("");
  };

  return (
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
        <label className="form-label">URL de la imagen</label>
        <input
          type="url"
          className="form-control"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "none",
            color: "white",
            borderRadius: "10px",
          }}
        />
      </div>

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
        Subir reporte
      </button>
    </form>
  );
};

const ReportCard = ({ report }) => {
  return (
    <div
      className="card w-100"
      style={{
        background: "rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        color: "white",
        overflow: "hidden",
      }}
    >
      {report.imageUrl && (
        <img
          src={report.imageUrl}
          className="card-img-top"
          alt={report.title}
          style={{ objectFit: "cover", height: "180px" }}
        />
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
    <div
      className="d-flex justify-content-center"
      style={{
        paddingTop: "10vh",
        paddingBottom: "5vh",
        fontFamily: "'Segoe UI', sans-serif",
        minHeight: "10vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
        <h3 className="text-center mb-4 fw-light">Subir un nuevo reporte</h3>

        <ReportForm onSubmit={addReport} />

        {reports.length === 0 ? (
          <p className="text-center mt-4" style={{ color: "#ccc" }}>
            Aún no hay reportes publicados.
          </p>
        ) : (
          <div className="mt-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
