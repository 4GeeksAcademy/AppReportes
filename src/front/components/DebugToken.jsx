// // src/front/components/DebugToken.jsx
// import { useEffect } from "react";
// import { getAuth } from "firebase/auth";

// export const DebugToken = () => {
//   useEffect(() => {
//     const fetchToken = async () => {
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (user) {
//         const token = await user.getIdToken();
//         console.log("🔐 Token Firebase:", token);
//       } else {
//         console.warn("⚠️ No hay usuario logueado.");
//       }
//     };

//     fetchToken();
//   }, []);

//   return <p>Revisa la consola para ver el token de Firebase 🔍</p>;
// };
