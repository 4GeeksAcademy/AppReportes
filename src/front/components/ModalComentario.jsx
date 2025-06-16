import React, { useState } from "react";

export const ModalComentario = ({ visible, onClose, onSubmit }) => {
  const [texto, setTexto] = useState("");

  const handleEnviar = () => {
    if (texto.trim()) {
      onSubmit(texto);
      setTexto("");
    }
  };

  if (!visible) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white rounded-4">
          <div className="modal-header border-0">
            <h5 className="modal-title">Nuevo comentario</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Escribe tu comentario aquí..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-footer border-0">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleEnviar}>
              Enviar comentario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
