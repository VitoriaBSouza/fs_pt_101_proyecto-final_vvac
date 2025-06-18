import React from 'react';

export const TopSection = () => {
  return (
    <div className="position-relative w-100" style={{ height: '80vh', overflow: 'hidden' }}>
      <img
        src="src/front/assets/img/alimentosTop.jpg"
        alt="Fondo"
        className="w-100 h-100 object-fit-cover position-absolute top-0 start-0 z-0"
        style={{ objectFit: 'cover' }}
      />
      <div
        className="position-absolute top-50 end-0 translate-middle-y bg-white text-dark p-5 rounded shadow-lg me-5"
        style={{ maxWidth: '500px' }}
      >
        <h1 className="display-5 fw-bold mb-3">Discover Recetea!</h1>
        <p className="fs-5">-Build your own recipes collection.</p>
        <p className="fs-5">-Taste new flavours.</p>
        <p className="fs-5">-Plan your meals.</p>
        <p className="fs-5">-Eat healthier and more organized.</p>
      </div>
    </div>
  );
};