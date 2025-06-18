import { useAuth } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router"

export const PrivateRoutes = () => {
    const { userBackend, loading } = useAuth();
    if (loading) {
        return null
    }
    return userBackend ? <Outlet /> : <Navigate to="/firebase-login" replace />
}