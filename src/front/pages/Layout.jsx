import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
// // import { Footer } from "../components/Footer";
import backgroundImg from "../assets/img/city_fondo3.jpg"; // Ruta correcta

export const Layout = () => {
	return (
		<div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
			{/* Fondo semitransparente */}
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundImage: `url(${backgroundImg})`,
					// También podés probar: "linear-gradient(135deg, #1a1a1a, #2e2e2e, #003333)"
					backgroundSize: "cover",
					backgroundPosition: "center",
					opacity: 1,
					zIndex: -1,
					pointerEvents: "none"
				}}
			/>

			{/* Contenido de la app */}
			<ScrollToTop>
				<Navbar />
				<Outlet />
			</ScrollToTop>
		</div>
	);
};
