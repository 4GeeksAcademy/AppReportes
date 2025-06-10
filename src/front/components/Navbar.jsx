import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Usamos el contexto
import { signOut } from "firebase/auth";
import { auth } from "../firebaseAuth";

export const Navbar = () => {
	const navigate = useNavigate();
	const { user } = useAuth(); // 👈 Obtenemos el usuario del contexto

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate("/firebase-login");
		} catch (error) {
			console.error("Error al cerrar sesión:", error.message);
		}
		};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>

				<div className="ml-auto d-flex align-items-center gap-2">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>

					{user ? (
						<>
							<span className="me-2">👋 {user.displayName || user.email}</span> {/* Nombre o email */}
							<Link to="/profile">
								<button className="btn btn-outline-secondary">Mi Perfil</button>
							</Link>
							<button className="btn btn-danger" onClick={handleLogout}>
								Cerrar sesión
							</button>
						</>
					) : (
						<Link to="/firebase-login">
							<button className="btn btn-outline-primary">Iniciar sesión</button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};
