// pages/RootRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Usamos el contexto

export const RootRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 Obtenemos el usuario del contexto

  useEffect(() => {
    if (user) {
      navigate("/feed", { replace: true });
    } else {
      navigate("/firebase-login", { replace: true });
    }
  }, [user, navigate]);

  return null; // no renderiza nada
};
