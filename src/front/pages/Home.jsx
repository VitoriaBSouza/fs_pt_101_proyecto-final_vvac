import React, { useEffect } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//assets
import rigoImageUrl from "../assets/img/rigo-baby.jpg";


//components
import { TopSection } from "../components/TopSection.jsx";
import { RecipeScroller } from '../components/RecipeScroller.jsx';
import { BottomSection } from '../components/BottomSection.jsx';
import { SearchFilter } from "../components/SearchFilter.jsx";

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
		<div className="container-fluid m-0 p-0 g-0">
			<TopSection />
			<div className="row p-4">
				<h2 className="p-4 text-danger">Latest Recipes</h2>
				<div className="col-12 p-4">
					<div className="scroll-container d-flex p-3">

						{/* maping over RecipeCards to create cards based on the data */}
						{

							store.recipes?.map((el) => <RecipeScroller
								key={el.id}
								id={el.id}
								name={el.title}
								url={el.media?.[0]?.url}

							/>)
						}
					</div>

				</div>
			</div>
			<BottomSection />
		</div>
	);
}; 