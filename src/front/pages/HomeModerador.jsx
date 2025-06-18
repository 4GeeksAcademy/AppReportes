import React from "react";
import { useNavigate } from "react-router-dom";

export const HomeModerador = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: "📋 Denuncias pendientes",

      link: "/denuncias",
    },
    {
      label: "⛔ Usuarios sancionados",
      link: "/usuarios-sancionados",
    },
    {
      label: "🚫 Usuarios eliminados",
      link: "/eliminados",
    },
    {
      label: "🆕 Ranking reportes",
      link: "/ranking-reportes",
    },
    {
      label: "👥 Gestionar moderadores",
      link: "/gestionar-moderadores",
    },
  ];

  return (
    <div
      className="d-flex min-vh-100"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* <SidebarModerador /> */}

      <main
        className="flex-grow-1 p-4 d-flex flex-column gap-3"
        style={{ color: "#fff" }}
      >
        {items.map((item, index) => {
          const isClickable = Boolean(item.link);
          const showValue = item.value !== undefined;

          return (
            <div
              key={index}
              onClick={() => isClickable && navigate(item.link)}
              className="p-4"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "15px",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
                color: "#fff",
                fontWeight: 300,
                fontSize: "1.25rem",
                cursor: isClickable ? "pointer" : "default",
                userSelect: isClickable ? "none" : "auto",
                transition: isClickable ? "background 0.3s ease" : undefined,
                textAlign: "center",
                letterSpacing: "0.03em",
                display: "block",
              }}
              onMouseEnter={(e) => {
                if (isClickable)
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)";
              }}
              onMouseLeave={(e) => {
                if (isClickable)
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }}
            >
              <span>{item.label}</span>
              {showValue && <span> — {item.value}</span>}
            </div>
          );
        })}

        {/* Bloque Buscar */}
        <div
          onClick={() => navigate("/buscador-moderador")}
          className="p-4"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
            color: "#fff",
            fontWeight: 300,
            fontSize: "1.25rem",
            cursor: "pointer",
            userSelect: "none",
            textAlign: "center",
            letterSpacing: "0.03em",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")
          }
        >
          🔎 Buscar
        </div>
      </main>
    </div>
  );
};
