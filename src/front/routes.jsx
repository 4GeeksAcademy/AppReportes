import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Feed } from "./pages/Feed";
import { FirebaseLogin } from "./pages/FirebaseLogin";
import { FirebaseSignup } from "./pages/FirebaseSignup";
import { PrivateRoute } from "./components/PrivateRoute";
import { ResetPassword } from "./pages/ResetPassword";
import { UserProfile } from "./pages/UserProfile";
import { Perfil } from "./pages/Perfil";
// import { Moderador } from "./pages/Moderador";
import { SubirReporte } from "./pages/SubirReporte";
import { MisDatos } from "./pages/MisDatos";
import { MisReportes } from "./pages/MisReportes";
import { Favoritos } from "./pages/Favoritos";
import { Reporte } from "./pages/Reporte";
import { HomeModerador } from "./pages/HomeModerador";
import { Denuncias } from "./pages/Denuncias";
import { UsuariosSancionados } from "./pages/Sancionados";
import { BuscadorModerador } from "./pages/BuscadorModerador";
import { GestionarUsuarios } from "./pages/GestionarUsuarios";
// import { BuscadorAdmin } from "./pages/BuscadorAdmin";
import {RootRedirect} from "./components/RootRedirect";
import { Loader } from "./components/Loader";
import { ReportesDeUsuario } from "./pages/ReportesDeUsuario";
import {PrivateRoutes} from "./components/PrivateRoutes";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<RootRedirect />} />
      <Route path="firebase-login" element={<FirebaseLogin />} />
      <Route path="signup" element={<FirebaseSignup />} />
      <Route path="reset-password" element={<ResetPassword />} />

      <Route  element={<PrivateRoutes/>}>
        <Route path="feed" element={<Feed />} /> 
        <Route path="subir-reporte" element={<SubirReporte />} />
        <Route path="mis-datos" element={<MisDatos />} />
        <Route path="mis-reportes" element={<MisReportes />} />
        <Route path="favoritos" element={<Favoritos />} />
        <Route path="reporte/:id" element={<Reporte />} />
        <Route path="/users/:id/reportes" element={<ReportesDeUsuario />} />
        <Route path="moderador" element={<HomeModerador />} />
        <Route path="denuncias" element={<Denuncias />} />
        <Route path="usuarios-sancionados" element={<UsuariosSancionados />} />
        <Route path="buscador-moderador" element={<BuscadorModerador />} />
        <Route path="gestionar-usuarios" element={<GestionarUsuarios />} />
      </Route>
    
    </Route>
  )
);

