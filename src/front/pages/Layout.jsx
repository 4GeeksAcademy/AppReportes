import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
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
					backgroundSize: "cover",
					backgroundPosition: "center",
					opacity: 0.9,
					zIndex: -1,
					pointerEvents: "none"
				}}
			/>

			{/* Contenido de la app */}
			<ScrollToTop>
				<Navbar />
				<Outlet />
				<Footer />
			</ScrollToTop>
		</div>
	);
};
