import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getinfo } from "../fetch/user.js";

import { DebugToken } from "../components/DebugToken"; // ajusta la ruta si está en otro lugar
import { useAuth } from "../context/AuthContext";

export const Home = () => {

	const { token } = useAuth();
  	const { store, dispatch } = useGlobalReducer();

	useEffect(() => {
		if (token) {
		getinfo(dispatch, token);
		}
	}, [token]);

	return (
		<div className="text-center mt-5">
			<DebugToken />
			<h1 className="display-4">Chao Rigo!!</h1>
			{/* <p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p> */}
			{/* <ProfilePicturePicker /> */}

			{store.message}
			<div className="alert alert-info">
				{/* {store.userInfo && store.userInfo.user ? (
					<span>{JSON.stringify(store.userInfo.user)}</span>
					) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)} */}
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
			</div>
		</div>
	);
}; 