import React, { useEffect } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//assets
import rigoImageUrl from "../assets/img/rigo-baby.jpg";


//components
import { RecipeCard } from "../components/RecipeCard.jsx";
import { HorizontalScroll } from '../components/landingPage/HorizontalScroll.jsx';
import { BottomSection } from '../components/landingPage/BottomSection.jsx';

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="container-fluid">
			<div className="row">			
				<div className="container-fluid">
					<HorizontalScroll />
					<BottomSection />
				</div>
			</div>
		</div>
	);
}; 