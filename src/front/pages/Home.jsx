// import React, { useEffect } from "react";
// import { DebugToken } from "../components/DebugToken";
// import { useAuth } from "../context/AuthContext";
// import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
// import { getinfo } from "../fetch/user.js";
// import { SidebarUsuario } from "../components/SidebarUsuario.jsx";

// export const Home = () => {
//   const { token } = useAuth();
//   const { store, dispatch } = useGlobalReducer();

//   useEffect(() => {
//     if (token) {
//       getinfo(dispatch, token);
//     }
//   }, [token]);

//   return (
//     <div className="d-flex" style={{ minHeight: "100vh" }}>
//       <SidebarUsuario />
//       <main className="flex-grow-1 p-4">
//         <DebugToken />
//         <h1 className="display-4">Chao Rigo!!</h1>
//         {store.message}
//         <div className="alert alert-info">
//           <span className="text-danger">
//             Loading message from the backend (make sure your python 🐍 backend is running)...
//           </span>
//         </div>
//       </main>
//     </div>
//   );
// };
