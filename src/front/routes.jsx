import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { FirebaseLogin } from "./pages/FirebaseLogin";
import { FirebaseSignup } from "./pages/FirebaseSignup";
import { PrivateRoute } from "./components/PrivateRoute";
import { ResetPassword } from "./pages/ResetPassword";
import { UserProfile } from "./pages/UserProfile"; // 👈 nuevo import


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* Rutas públicas */}
      <Route path="/firebase-login" element={<FirebaseLogin />} />
      <Route path="/signup" element={<FirebaseSignup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rutas privadas */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/single/:theId"
        element={
          <PrivateRoute>
            <Single />
          </PrivateRoute>
        }
      />
      <Route
        path="/demo"
        element={
          <PrivateRoute>
            <Demo />
          </PrivateRoute>
        }
      />
    </Route>
  )
);
