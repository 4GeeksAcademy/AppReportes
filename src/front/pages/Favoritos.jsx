import React from "react";
import imagen3_4 from "../assets/img/city_fondo_3_4.jpg";
import corazonVacioNegro from "../assets/img/corazon_vacio_negro.png"; // corazón lleno (activo)
import { SidebarUsuario } from "../components/SidebarUsuario"; // activado

const favoritos = [
  {
    id: 1,
    user: { name: "Juan Pérez", avatar: "https://i.pravatar.cc/50?img=10" },
    imageUrl: imagen3_4,
  },
  {
    id: 2,
    user: { name: "María López", avatar: "https://i.pravatar.cc/50?img=20" },
    imageUrl: imagen3_4,
  },
  {
    id: 3,
    user: { name: "Luis García", avatar: "https://i.pravatar.cc/50?img=15" },
    imageUrl: imagen3_4,
  },
  {
    id: 4,
    user: { name: "Ana Ruiz", avatar: "https://i.pravatar.cc/50?img=30" },
    imageUrl: imagen3_4,
  },
];

export const Favoritos = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* <SidebarUsuario /> */}
      <main className="flex-grow-1 p-3">
        <div className="container">
          <div className="row g-2">
            {favoritos.map((post) => (
              <div key={post.id} className="col-6 col-md-3 position-relative">
                {/* Imagen del reporte */}
                <div
                  className="w-100"
                  style={{
                    aspectRatio: "1",
                    overflow: "hidden",
                    borderRadius: "10px",
                  }}
                >
                  <img
                    src={post.imageUrl}
                    alt="reporte favorito"
                    className="w-100 h-100"
                    style={{ objectFit: "cover", borderRadius: "10px" }}
                  />
                </div>

                {/* Corazón activo */}
                <div
                  className="position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    backdropFilter: "blur(3px)",
                  }}
                >
                  <img
                    src={corazonVacioNegro}
                    alt="favorito"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
