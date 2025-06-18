// pages/RootRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RootRedirect = () => {
  const navigate = useNavigate();
  const { userBackend, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (userBackend) {
      navigate("/feed", { replace: true });
    } else {
      navigate("/firebase-login", { replace: true });
    }
  }, [userBackend, loading, navigate]);

  return null;
};
