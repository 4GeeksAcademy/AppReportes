// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export const PrivateRoute = ({ children }) => {
//   const { user, loading } = useAuth(); // usamos nuestro contexto

//   if (loading) return <p>Cargando sesión...</p>;

//   if (!user) return <Navigate to="/signup" />;

//   return children;
// };
