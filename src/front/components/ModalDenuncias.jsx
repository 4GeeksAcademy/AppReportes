import React, { useState } from "react";

const motivosReporte = [
  "Contenido inapropiado",
  "Spam o publicidad no deseada",
  "Información falsa o engañosa",
  "Violación de derechos de autor",
  "Discurso de odio o discriminación",
  "Suicidio o autolesiones",
  "Violencia gráfica o contenido perturbador",
  "Otro",
];

const motivosComentario = [
  "Insultos o lenguaje ofensivo",
  "Amenazas o acoso",
  "Spam o enlaces maliciosos",
  "Comentario fuera de tema o irrelevante",
  "Información falsa o engañosa",
  "Discurso de odio o discriminación",
  "Otro",
];

export const ModalDenuncias = ({ visible, onClose, onSubmit, tipo }) => {
  const [motivo, setMotivo] = useState("");

  if (!visible) return null;

  const opciones = tipo === "reporte" ? motivosReporte : motivosComentario;

  const handleEnviar = () => {
    if (!motivo) {
      alert("Por favor selecciona un motivo");
      return;
    }
    onSubmit(motivo);
    setMotivo("");
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ background: "rgba(0,0,0,0.6)", zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="p-4 rounded-4"
        style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(15px)", minWidth: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="mb-3 text-white">Selecciona un motivo para denunciar</h5>
        <select
          className="form-select mb-3"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <option value="">-- Elige un motivo --</option>
          {opciones.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setMotivo("");
              onClose();
            }}
          >
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleEnviar}>
            Enviar denuncia
          </button>
        </div>
      </div>
    </div>
  );
};
