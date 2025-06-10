import { publicFetch, privateFetch } from "./apifetch"

export const login=async(dispatch,email,password)=>{
    let response=await publicFetch("/login","POST",{email,password})
    if(!response.token){
        return response
    }
    // console.log(response)
    localStorage.setItem("token",response.token)
    dispatch({type:"SET_TOKEN", payload:response.token})
    return response
}

export const logout=async(dispatch)=>{
    // try {
    //         await privateFetch("/logout", "POST");
    //     } catch (err) {
    //         console.warn("Error al cerrar sesión (posiblemente token inválido):", err.message);
    //     }
    //     localStorage.removeItem("token");
    //     dispatch({ type: "CLEAR_SESSION" });
}

export const register=async(dispatch, email, username, password)=>{
    // try {
    //     const response = await publicFetch("/register", "POST", { email, username, password });
    //     if (!response || response.msg) {
    //         console.error("Registro fallido:", response?.msg || "Respuesta inválida");
    //         return response;
    //     }
    //     // Login automático tras registrar
    //     return await login(dispatch, email, password);
    // } catch (err) {
    //     console.error("Register failed:", err.message);
    //     return null;
    // }
}

export const getinfo = async (dispatch, token) => {
  if (!token) {
    console.warn("No token para getinfo");
    return null;
  }

  const response = await privateFetch("/userinfo", "GET", null, token);

  if (!response) {
    console.error("No se pudo obtener información del usuario");
    return null;
  }

  dispatch({ type: "SET_USER_INFO", payload: response });
  return response;
};


// export const getinfo = async (dispatch) => {
//     let response = await privateFetch("/userinfo", "GET");

//     if (!response) {
//         console.error("No se pudo obtener información del usuario (respuesta nula)");
//         return null;
//     }

//     if (response.msg) {
//         console.error(response.msg);
//         return null;
//     }

//     dispatch({ type: "SET_USER_INFO", payload: response });
//     return response;
// };