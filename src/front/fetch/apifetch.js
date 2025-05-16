const apiURL=import.meta.env.VITE_BACKEND_URL 
// Cuidado porque su BACKEND-URL termina en api

export const publicFetch=async(endpoint, method = "GET", body=null)=>{
    // Inicializar los parámetros de la petición con el método
    let params={
        method,
        headers:{
            "Access-Control_Allow_Origin":"*"
        }
    }
    // Si hay un body se agrega al parámetro y se agrega la cabecera
    if(body){
        params.body=JSON.stringify(body)
        params.headers["Content-Type"]="applitacion/json"     
    }
    try {
        let response=await fetch(apiURL + endpoint,params)
        if(response.status>=500){
            console.error(response.status,response.statusText)
        }
        if(response.status>=400){
            console.error(response.status,response.statusText)
            let{msg}=await response.json()
            return msg
        }
        return await response.json()
    } catch(error){
        console.error(error)
        return null
    }
}

export const privateFetch=async()=>{

}