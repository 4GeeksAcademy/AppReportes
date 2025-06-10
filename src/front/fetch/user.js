import { publicFetch, privateFetch } from "./apifetch"

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