// import React, { useEffect } from "react";
// import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

// export const Perfil = () => {

//     const { store, dispatch } = useGlobalReducer();

//     const loadMessage = async () => {
//         try {
//             const backendUrl = import.meta.env.VITE_BACKEND_URL;

//             if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

//             const response = await fetch(backendUrl + "/api/hello");
//             const data = await response.json();

//             if (response.ok) dispatch({ type: "set_hello", payload: data.message });

//             return data;

//         } catch (error) {
//             if (error.message) throw new Error(
//                 `Could not fetch the message from the backend.
//                 Please check if the backend is running and the backend port is public.`
//             );
//         }
//     };

//     useEffect(() => {
//         loadMessage();
//     }, []);

//     return (
//         <div className="d-flex justify-content-center align-items-center vh-100">
//             <div className="card shadow p-4 border border-dark rounded-4" style={{ width: "100%", maxWidth: "600px", borderWidth: "5px" }}>
//                 <h2 className="card-title text-center mb-4">Perfil de Usuario</h2>
//                 <form>
//                     <div className="form-group">
//                         <label htmlFor="inputUser">Usuario</label>
//                         <input type="text" className="form-control" id="inputAddress" placeholder="" />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="inputFirstname">Nombre</label>
//                         <input type="text" className="form-control" id="inputAddress" placeholder="" />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="inputLastname">Apellidos</label>
//                         <input type="text" className="form-control" id="inputAddress" placeholder="" />
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label htmlFor="inputEmail4">Email</label>
//                             <input type="email" className="form-control" id="inputEmail4" placeholder="" />
//                         </div>
//                         <div className="form-group col-md-6">
//                             <label htmlFor="inputPassword4">Password</label>
//                             <input type="password" className="form-control" id="inputPassword4" placeholder="" />
//                         </div>
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="inputAddress">Dirección</label>
//                         <input type="text" className="form-control" id="inputAddress" placeholder="" />
//                     </div>

//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label htmlFor="inputCity">Ciudad</label>
//                             <input type="text" className="form-control" id="inputCity" />
//                         </div>

//                         <div className="form-group col-md-2">
//                             <label htmlFor="inputZip" className="text-nowrap">Código Postal</label>

//                             <input type="text" className="form-control" id="inputZip" />
//                         </div>
//                         <span></span>
//                     </div>
//                     <h1></h1>

//                     <button type="submit" className="btn btn-primary btn-block">Actualizar datos</button>
//                 </form>
//             </div>

//         </div>
//     );
// };
