import { useState, useEffect } from "react"
import { TurnHome } from "../components/buttons/TurnHome"
import { LinksMenu } from "../components/LinksMenu"
import { RightMenu } from "../components/RightMenu"
import { RecipeCard } from "../components/RecipeCard"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import recipeServices from "../services/recetea_API/recipeServices.js"
import collectionServices from "../services/recetea_API/collectionServices.js"
import { useNavigate } from "react-router-dom"
import scoreServices from "../services/recetea_API/scoreServices.js"

export const CollectionFav = () => {
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer()

  // ——————————————————————————————————————————————————
  // Tabs & data for “All” / “Your Recipes”:
  // ——————————————————————————————————————————————————
  const [activeTab, setActiveTab] = useState("all")
  const [allItems, setAllItems] = useState([])
  const [recipeItems, setRecipeItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ——————————————————————————————————————————————————
  // Data for “Saved” tab:
  // ——————————————————————————————————————————————————
  const [savedRecipes, setSavedRecipes] = useState(null)   // null = loading
  const [savedLoading, setSavedLoading] = useState(false)
  const [savedError, setSavedError] = useState(null)
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // ——————————————————————————————————————————————————
  // Fetch “All” and “Your Recipes” based on activeTab
  // ——————————————————————————————————————————————————
  useEffect(() => {
    if (activeTab === "all" && allItems.length === 0) {
      setLoading(true)
      setError(null)
      collectionServices
        .getUserCollections()
        .then(data => {
          const formatted = (Array.isArray(data.collection) ? data.collection : []).map(item => ({
            code: item.code,
            product_name: item.product_name || "No name",
            image_front_small_url: item.image_front_small_url || "",
            nutrition_grades: item.nutri_score || null,
          }))
          setAllItems(formatted)
          dispatch({ type: "get_user_collections", payload: formatted })
        })
        .catch(err => {
          console.error(err)
          setError("Failed to load “All recipes”")
        })
        .finally(() => setLoading(false))
    } else if (activeTab === "your-recipes" && recipeItems.length === 0) {
      setLoading(true)
      setError(null)
      recipeServices
        .getAllUserRecipes()
        .then(resp => {
          const arr = Array.isArray(resp) ? resp : resp.recipes || []
          const formatted = arr.map(r => ({
            id: r.id,
            name: r.title,
            imageUrl: r.media?.[0]?.url || "",
            nutriScore: r.nutri_score || null,
          }))
          setRecipeItems(formatted)
        })
        .catch(err => {
          console.error(err)
          setError("Failed to load “Your recipes”")
        })
        .finally(() => setLoading(false))
    }
  }, [activeTab, allItems.length, recipeItems.length, dispatch])

  // ——————————————————————————————————————————————————
  // Fetch “Saved” recipes when user selects that tab
  // ——————————————————————————————————————————————————
  useEffect(() => {
    if (activeTab === "saved" && savedRecipes === null) {
      setSavedLoading(true)
      setSavedError(null)

      const fetchSaved = async () => {
        try {
          if (!user.user_id) {
            setSavedRecipes([])
            return
          }
          const scores = await scoreServices.getAllScoresUser(user.user_id)
          if (!scores.length) {
            setSavedRecipes([])
          } else {
            const fetched = await Promise.all(
              scores.map(s => recipeServices.getOneRecipe(s.recipe_id))
            )
            setSavedRecipes(fetched)
          }
        } catch (err) {
          console.error("Error fetching saved recipes", err)
          setSavedError(err)
          setSavedRecipes([])
        } finally {
          setSavedLoading(false)
        }
      }

      fetchSaved()
    }
  }, [activeTab, user.user_id, savedRecipes])

  // ——————————————————————————————————————————————————
  // Renderers for each tab
  // ——————————————————————————————————————————————————
  const renderAllCards = () => {
    if (loading) return <p>Please wait, loading recipes…</p>
    if (error) return <p className="text-danger">{error}</p>
    if (!allItems.length) return <p>Sorry! No recipes found.</p>

    return (
      <div className="cards-grid">
        {allItems.map(item => (
          <RecipeCard
            key={item.code}
            id={item.code}
            name={item.product_name}
            imageUrl={item.image_front_small_url}
            nutriScore={item.nutrition_grades}
            isSaved={false}
            onClick={() => console.log("Detail for", item.code)}
          />
        ))}
      </div>
    )
  }

  const renderYourRecipes = () => {
    if (loading) return <p>Please wait, loading YOUR recipes…</p>
    if (error) return <p className="text-danger">{error}</p>
    if (!recipeItems.length) return <p>Wait! You still have no personal recipes…</p>

    return (
      <div className="cards-grid">
        {recipeItems.map(item => (
          <RecipeCard
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            nutriScore={item.nutriScore}
            isSaved={false}
            onClick={() => console.log("User recipe detail", item.id)}
          />
        ))}
      </div>
    )
  }

  const renderSavedCards = () => {
    if (savedLoading) return <p>Please wait, loading saved recipes…</p>
    if (savedError) return <p className="text-danger">Error: {savedError.message}</p>
    if (!savedRecipes || savedRecipes.length === 0)
      return (
        <p>
          Aún no tienes recetas guardadas. Ve a “All” o “Your Recipes” y haz clic en el icono de guardar.
        </p>
      )

    return (
      <div className="cards-grid">
        {savedRecipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            name={recipe.name}
            imageUrl={recipe.imageUrl}
            nutriScore={recipe.nutriScore}
            isSaved={true}
            onClick={() => console.log("Detalle de guardado", recipe.id)}
          />
        ))}
      </div>
    )
  }

  // ——————————————————————————————————————————————————
  // Main render
  // ——————————————————————————————————————————————————
  return (
    <div className="main-row-all vh-100">
      <div className="profile-container">
        <div className="container text-center sidebar-left-profile">
          <div className="row align-items-start">
            <div className="col-12 col-md-3">
              <div className="d-flex align-items-start">
                <TurnHome />
                <LinksMenu />
              </div>
            </div>

            <div className="col-6 main-column-content">
              <div className="d-flex align-items-start flex-column mb-3 edit-perfil">
                <h2 className="mb-3">Collection</h2>
                <p>All, Your Recipes & Saved</p>

                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                      onClick={() => setActiveTab("all")}
                    >
                      All
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "your-recipes" ? "active" : ""}`}
                      onClick={() => setActiveTab("your-recipes")}
                    >
                      Your Recipes
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "saved" ? "active" : ""}`}
                      onClick={() => setActiveTab("saved")}
                    >
                      Saved
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  {activeTab === "all" && <div className="tab-pane active">{renderAllCards()}</div>}
                  {activeTab === "your-recipes" && (
                    <div className="tab-pane active">{renderYourRecipes()}</div>
                  )}
                  {activeTab === "saved" && <div className="tab-pane active">{renderSavedCards()}</div>}
                </div>
              </div>
            </div>

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
