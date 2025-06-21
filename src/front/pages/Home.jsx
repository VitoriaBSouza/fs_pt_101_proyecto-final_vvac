import React, { useEffect } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//assets
import rigoImageUrl from "../assets/img/rigo-baby.jpg";


//components
import { TopSection } from "../components/TopSection.jsx";
import { RecipeScroller } from '../components/RecipeScroller.jsx';
import { BottomSection } from '../components/BottomSection.jsx';


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
		<div className="container-fluid container_home">
			<TopSection />
			<RecipeScroller />
			<div className="row bg-light">
				<div className="col-12">
					<h2 className="text-danger">Latest Recipes</h2>

					<div className="col-12">
						<div className="scroll-container d-flex">

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
			</div>
			<BottomSection />
		</div>
	);
}; 