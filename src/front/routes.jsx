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
import { Moderador } from "./pages/Moderador";
import { SubirReporte } from "./pages/SubirReporte";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      
   
      <Route path="firebase-login" element={<FirebaseLogin />} />
      <Route path="signup" element={<FirebaseSignup />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="feed" element={<Feed />} />
      <Route path="subir-reporte" element={<SubirReporte />} />
   
      {/* <Route
        index
        element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="single/:theId"
        element={
          <PrivateRoute>
            <Single />
          </PrivateRoute>
        }
      />
      <Route
        path="demo"
        element={
          <PrivateRoute>
            <Demo />
          </PrivateRoute>
        }
      />
      <Route
        path="profile"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />
      <Route
        path="moderador"
        element={
          <PrivateRoute>
            <Moderador />
          </PrivateRoute>
        }
      />
    </Route>
  )
);

