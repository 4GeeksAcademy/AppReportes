import React from "react";
import imagen3_4 from "../assets/img/city_fondo_3_4.jpg";

// import { SidebarUsuario } from "../components/SidebarUsuario"; // Actívalo si lo necesitas

const posts = [
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
  {
    id: 5,
    user: { name: "Pedro Gómez", avatar: "https://i.pravatar.cc/50?img=25" },
    imageUrl: imagen3_4,
  },
  {
    id: 6,
    user: { name: "Lucía Fernández", avatar: "https://i.pravatar.cc/50?img=5" },
    imageUrl: imagen3_4,
  },
  {
    id: 7,
    user: { name: "Lucía Fernández", avatar: "https://i.pravatar.cc/50?img=5" },
    imageUrl: imagen3_4,
  },
  {
    id: 8,
    user: { name: "Lucía Fernández", avatar: "https://i.pravatar.cc/50?img=5" },
    imageUrl: imagen3_4,
  },
  {
    id: 9,
    user: { name: "Lucía Fernández", avatar: "https://i.pravatar.cc/50?img=5" },
    imageUrl: imagen3_4,
  },
  {
    id: 10,
    user: { name: "Lucía Fernández", avatar: "https://i.pravatar.cc/50?img=5" },
    imageUrl: imagen3_4,
  },
];

export const MisReportes = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* <SidebarUsuario /> */}
      <main className="flex-grow-1 p-3">
        <div className="container">
          <div className="row g-2">
            {posts.map((post) => (
              <div key={post.id} className="col-6 col-md-3">
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
                    alt="reporte"
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
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
