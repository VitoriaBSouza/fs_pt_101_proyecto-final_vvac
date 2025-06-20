import React from 'react';


export const BottomSection = () => {
  return (
    <section className="bg-light py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5 display-6">Explore Our Meal Options</h2>
        <div className="row g-4">
          {diets.map((diet, index) => (
            <div className="col-md-4" key={index}>
              <div className="card h-100 shadow-sm">
                <img
                  src={diet.image}
                  alt={diet.title}
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title"></h5>
                  <ul className="list-unstyled small mb-0">
                    
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};