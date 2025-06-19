import React from 'react';

const diets = [
  {
    title: 'Vegan',
    image: 'https://source.unsplash.com/280x180/?vegan-food',
    items: ['100% plant-based', 'Rich in fiber', 'Animal-free'],
  },
  {
    title: 'Vegetarian',
    image: 'https://source.unsplash.com/280x180/?vegetarian',
    items: ['No meat', 'Includes dairy and eggs', 'Balanced nutrition'],
  },
  {
    title: 'Gluten-Free',
    image: 'https://source.unsplash.com/280x180/?gluten-free',
    items: ['Celiac-friendly', 'No wheat, rye or barley', 'Easier digestion'],
  },
  {
    title: 'Allergen-Free',
    image: 'https://source.unsplash.com/280x180/?allergy-food',
    items: ['No common allergens', 'Safe and controlled', 'Tailored options'],
  },
  {
    title: 'Low-Calorie',
    image: 'https://source.unsplash.com/280x180/?low-calorie',
    items: ['Fewer calories', 'Weight management', 'Nutrient-dense'],
  },
  {
    title: 'Cheat Meals',
    image: 'https://source.unsplash.com/280x180/?cheat-meal',
    items: ['Occasional treat', 'High energy', 'Mindful indulgence'],
  },
];

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
                  <h5 className="card-title">{diet.title}</h5>
                  <ul className="list-unstyled small mb-0">
                    {diet.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
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