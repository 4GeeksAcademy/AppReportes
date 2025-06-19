import { getAuth } from "firebase/auth";

const apiURL=import.meta.env.VITE_BACKEND_URL 

export const publicFetch=async(endpoint, method = "GET", body=null)=>{
    // Inicializar los parámetros de la petición con el método
    let params={
        method,
        headers:{}
    };
    // Si hay un body se agrega al parámetro y se agrega la cabecera
    if(body){
        params.body=JSON.stringify(body)
        params.headers["Content-Type"]="application/json"     
    }
    try {
        let response=await fetch(apiURL + endpoint,params)
        if(response.status>=500){
            console.error(response.status,response.statusText)
            return null
        }
        if(response.status>=400){
            console.error(response.status,response.statusText)

        }
        return await response.json()
    } catch(error){
        console.error(error)
        return null
    }
}

export const privateFetch = async (endpoint, method = "GET", body = null, token) => {
  if (!token) {
    console.warn("No token para privateFetch");
    return null;
  }

  let params = {
    method,
    headers: {
      "Authorization": "Bearer " + token,
    },
  };

  if (body) {
    params.body = JSON.stringify(body);
    params.headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(apiURL + endpoint, params);
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Respuesta no es JSON válida");
      return null;
    }
  } catch (err) {
    console.error("Error en privateFetch:", err);
    return null;
  }
};

export const authWithFirebase = async (idToken) => {
    try {
        if (!idToken) {
            console.warn("No se recibió token como argumento en login()");
            return null;
        }

        const res = await fetch(`${apiURL}/api/firebase-auth`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + idToken
            }
        });



        if (!res.ok) {
            const err = await res.json();
            console.error("Login backend error:", err);
            return null;
        }

        const data = await res.json();

        return data;
    } catch (error) {
        console.error("Error en función login:", error);
        return null;
    }
}
