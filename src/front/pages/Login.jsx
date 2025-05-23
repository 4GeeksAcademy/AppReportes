import React, { useState, useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import { login } from "../fetch/user.js";



export const Login = () => {

    const { store, dispatch } = useGlobalReducer()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()

    useEffect(()=>{
      if(store.token){
        navigate("/")
      }
    },[store.token])

    async function formSubmit(e){
      e.preventDefault()
      if(!password || !email){
        alert("Debe especificar todos los campos")
        return
      }
      let response=await login(dispatch,email,password)
      console.log({response})
      if(!response.token){
        alert(response.msg)
        return
      }
      // Navegar al home
      console.log("Sesion iniciada")
      navigate("/")
    }

    return <div>
        <h1>Login</h1>
        <form onSubmit={formSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1"/>
  </div>
  <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
</form>
    </div>

}