// import React from "react";
// import { useAuth } from "../context/AuthContext"; // 👈 usamos el contexto
// import { useNavigate } from "react-router-dom";

// export const UserProfile = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate(); // ✅ FALTABA ESTO

//   if (!user) return <p>Cargando perfil...</p>;

//   return (
//     <div className="container mt-5">
//       <h2>Perfil del Usuario</h2>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>UID:</strong> {user.uid}</p>
//       {user.displayName && <p><strong>Nombre:</strong> {user.displayName}</p>}
//       {user.photoURL && (
//         <img
//           src={user.photoURL}
//           alt="Foto de perfil"
//           style={{ maxWidth: "150px", borderRadius: "50%" }}
//         />
//       )}

//       <button
//         className="btn btn-warning mt-3"
//         onClick={() => navigate("/reset-password")}
//       >
//         Cambiar contraseña
//       </button>
//     </div>
//   );
// };
