import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebaseAuth"; // Asegúrate de que esta ruta sea correcta
import { onAuthStateChanged, signOut } from "firebase/auth";

export const Navbar = () => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser);
		});
		return () => unsubscribe();
	}, []);

	const handleLogout = async () => {
		await signOut(auth);
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>

				<div className="ml-auto d-flex gap-2">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>

					{user ? (
						<button className="btn btn-danger" onClick={handleLogout}>
							Cerrar sesión
						</button>
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
