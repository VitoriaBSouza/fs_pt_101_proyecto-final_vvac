import React from 'react';


export const BottomSection = () => {
  return (

    <div className="container_bottom w-100 bg-opacity-50">
      <h2 className="title_Recipe_bottom text-center fw-bold mb-0 text-dark">Explore Our Meal Options</h2>
      <div className="scroll-bottom-row">
        <div className="card card_scroll_bottom h-100 shadow-sm " style={{ border: "2px solid #ca3e49" }}>
          <img
            src="src/front/assets/img/VeganDiet.jpg"
            alt="img"
            className="card-img-bottom"
            style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
          />
          <div className="card_bottom w-100 bg-opacity-50">
            <h5 className="bottom_title text-center fw-bold"> VEGAN DIET </h5>
            <p className='text-center fw-bold'>Recipes made entirely with plant-based ingredients.</p>
          </div>
        </div>

        <div className="card card_scroll_bottom h-100 shadow-sm" style={{ border: "2px solid #ca3e49" }}>
          <img
            src="src/front/assets/img/GlutenFree.jpg"
            alt="img"
            className="card-img-bottom"
            style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
          />
          <div className="card_bottom w-100 bg-opacity-50">
            <h5 className="bottom_title text-center fw-bold">GLUTEN FREE</h5>
            <p className='text-center fw-bold'>Recipes without wheat, barley, or rye.</p>
          </div>
        </div>
        <div className="card card_scroll_bottom h-100 shadow-sm" style={{ border: "2px solid #ca3e49" }}>
          <img
            src="src/front/assets/img/Proteic.jpg"
            alt="img"
            className="card-img-bottom"
            style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
          />
          <div className="card_bottom w-100 bg-opacity-50">
            <h5 className="bottom_title text-center fw-bold">HIGH PROTEIC</h5>
            <p className='text-center fw-bold'>Meals rich in protein for muscle and energy.</p>
          </div>
        </div>
      </div>


      <div className="scroll-bottom-row">
        <div className=" card card_scroll_bottom h-100 shadow-sm" style={{ border: "2px solid #ca3e49" }}>
          <img
            src="src/front/assets/img/low-calorie.jpg"
            alt="img"
            className="card-img-bottom"
            style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
          />
          <div className="card_bottom w-100 bg-opacity-50">
            <h5 className="bottom_title text-center fw-bold">LOW CALORIES</h5>
            <p className='text-center fw-bold'> Light recipes to help you stay in shape.</p>
          </div>
        </div>
        <div className="card card_scroll_bottom h-100 shadow-sm" style={{ border: "2px solid #ca3e49" }}>
          <img
            src="src/front/assets/img/FastRecipes.jpg"
            alt="img"
            className="card-img-bottom"
            style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
          />
          <div className="card_bottom w-100 bg-opacity-50">
            <h5 className="bottom_title text-center fw-bold">FAST RECIPES</h5>
            <p className='text-center fw-bold'>Quick meals ready in 30 minutes or less.</p>
          </div>
        </div>
        <div className="card card_scroll_bottom h-100 shadow-sm" style={{ border: "2px solid #ca3e49" }}>
          <img
            src="src/front/assets/img/CheatMeals.jpg"
            alt="img"
            className="card-img-bottom"
            style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
          />
          <div className="card_bottom w-100 bg-opacity-50">
            <h5 className="bottom_title text-center fw-bold ">CHEAT MEALS</h5>
            <p className='text-center fw-bold'>Indulgent treats to enjoy without guilt.</p>
          </div>
        </div>
      </div>














    </div>
  )
}