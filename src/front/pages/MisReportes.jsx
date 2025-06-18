import React from "react";
import imagen3_4 from "../assets/img/city_fondo_3_4.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer";

// import { SidebarUsuario } from "../components/SidebarUsuario"; // Actívalo si lo necesitas

export const MisReportes = () => {
  const {store,dispatch} = useGlobalReducer()
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* <SidebarUsuario /> */}
      <main className="flex-grow-1 p-3">
        <div className="container">
          <div className="row g-2">
            {store.posts.map((post) => (
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
