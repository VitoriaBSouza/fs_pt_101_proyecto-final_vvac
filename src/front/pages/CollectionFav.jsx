import { useState, useEffect } from "react"
import { LinksMenu } from "../components/LinksMenu"
import { RightMenu } from "../components/RightMenu"

export const CollectionFav = () => {

    //Datos para all, your recipes y saved

    const [activeTab, setActiveTab] = useState("all");      
    const [allItems, setAllItems] = useState([]);
    const [recipeItems, setRecipeItems] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] =useState(null)

    //-----------------------------------------
    //Pendiente cómo cargar aqui "All" + uso de endopoint para obtener productos! Esta en recipeservices.js....
    //-----------------------------------------

    

    //-----------------------------------------
    //Pendiente cards... componente? o lo incorporo aqui?
    //-----------------------------------------

    

    return (

        <div className="main-row-all vh-100">

            <div className="profile-container">

                {/* COLUMNA LATERAL IZQ */}

                <div className="container text-center sidebar-left-profile">
                    <div className="row align-items-start">
                        <div className="col-3">

                            <LinksMenu />

                        </div>

                        {/* COLUMNA PRINCIPAL  */}
                        <div className="col-6 main-column-content">

                            <div className="d-flex align-items-start flex-column mb-3 edit-perfil">

                                <h2 className="mb-3">Collection</h2>
                                <p>All, Your Recipes & Saved </p>

                                {/* Nav tabs: */}

                                <ul className="nav nav-tabs ">
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")} type="button">All</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === "your-recipes" ? "active" : ""}`} onClick={() => setActiveTab("your-recipes")} type="button">Your Recipes</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === "saved" ? "active" : ""}`} onClick={() => setActiveTab("saved")} type="button">Saved</button>
                                    </li>
                                </ul>
                               
                                {/* //Contenido pestaña activa// */}

                                <div className="tab-content">
                                    {activeTab === "all" && (

                                        <div className="tab-pane active">
                                            <p>**AQUI IRÁ CARD RENDERIZADA --- ALL ITEMS</p>
                                        </div>    
                    
                                    )}
                                    
                                    {activeTab === "your-recipes" && (

                                        <div className="tab-pane active">
                                            <p>**AQUI IRÁ CARD RENDERIZADA --- YOUR RECIPES</p>
                                        </div>

                                    )}

                                    {activeTab === "saved" && (

                                        <div className="tab-pane active">
                                            <p>**AQUI IRÁ CARD RENDERIZADA --- YOUR RECIPES</p>
                                            <p>
                                                You don't have any saved recipes yet. Search "All" or "Recipes" and click the save icon (collection) to add them here.
                                            </p>
                                        </div>

                                    )}



                                </div>
                                


                            </div>
                        </div>


                        {/* COLUMNA LATERAL DERECHA */}
                        <div className="col-3 right-profile">

                            <div className="d-grid row-gap-5 b-grids-right h-100">
                                <RightMenu />

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


