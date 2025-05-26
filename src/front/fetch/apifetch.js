const apiURL=import.meta.env.VITE_BACKEND_URL 
// Cuidado porque su BACKEND-URL termina en api

export const publicFetch=async(endpoint, method = "GET", body=null)=>{
    // Inicializar los parámetros de la petición con el método
    let params={
        method,
        headers:{
            "Access-Control-Allow-Origin":"*"
        }
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

            //return await response.json()
        }
        return await response.json()
    } catch(error){
        console.error(error)
        return null
    }
}

export const privateFetch=async(endpoint, method = "GET", body=null)=>{
    // Inicializar los parámetros de la petición con el método
    let params={
        method,
        headers:{
            "Access-Control-Allow-Origin":"*",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
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