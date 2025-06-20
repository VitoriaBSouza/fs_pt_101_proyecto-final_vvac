import React from 'react';


export const BottomSection = () => {
  return (
    <section className="bg-light py-5" >
      <div className="container " >
        <h2 className="text-center fw-bold mb-5 display-6">Explore Our Meal Options</h2>
        <div className="row g-4">
            <div className="col-md-4" >
              <div className="card h-100 shadow-sm " style={{border: "2px solid #ca3e49"}}>
                <img
                  src="src/front/assets/img/VeganDiet.jpg"
                  alt=""
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)"}}
                />
                <div className="card_bottom">
                  <h2 className="card-title"> VEGAN DIET </h2>
                  <p>Recipes made entirely with plant-based ingredients.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm" style={{border: "2px solid #ca3e49"}}>
                <img
                  src="src/front/assets/img/GlutenFree.jpg"
                  alt=""
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
                />
                <div className="card_bottom">
                  <h5 className="card-title">GLUTEN FREE</h5>
                  <p>Recipes without wheat, barley, or rye.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm" style={{border: "2px solid #ca3e49"}}>
                <img
                  src="src/front/assets/img/Proteic.jpg"
                  alt=""
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
                />
                <div className="card_bottom">
                  <h5 className="card-title">HIGH PROTEIC</h5>
                  <p>Meals rich in protein for muscle and energy.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm" style={{border: "2px solid #ca3e49"}}>
                <img
                  src="src/front/assets/img/low-calorie.jpg"
                  alt=""
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
                />
                <div className="card_bottom">
                  <h5 className="card-title">LOW CALORIES</h5>
                  <p> Light recipes to help you stay in shape.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm" style={{border: "2px solid #ca3e49"}}>
                <img
                  src="src/front/assets/img/FastRecipes.jpg"
                  alt=""
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
                />
                <div className="card_bottom">
                  <h5 className="card-title">FAST RECIPES</h5>
                  <p>Quick meals ready in 30 minutes or less.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm" style={{border: "2px solid #ca3e49"}}>
                <img
                  src="src/front/assets/img/CheatMeals.jpg"
                  alt=""
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover', border: "2px solid rgb(0, 0, 0)" }}
                />
                <div className="card_bottom">
                  <h5 className="card-title">CHEAT MEALS</h5>
                  <p>Indulgent treats to enjoy without guilt.</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};