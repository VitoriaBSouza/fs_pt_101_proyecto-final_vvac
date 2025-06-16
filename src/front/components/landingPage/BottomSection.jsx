import React from 'react';

export const BottomSection = () => {
  return (
    <section className="bg-white p-10">
      <h2 className="text-3xl font-bold text-center mb-8">Recetea no tiene excusas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-gray-100 p-6 rounded shadow">
          <h3 className="font-semibold text-xl mb-2">Tarjeta 1</h3>
          <p>Información útil o motivadora.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded shadow">
          <h3 className="font-semibold text-xl mb-2">Tarjeta 2</h3>
          <p>Más detalles relevantes o beneficios.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded shadow">
          <h3 className="font-semibold text-xl mb-2">Tarjeta 3</h3>
          <p>Otra pieza de información clave.</p>
        </div>
      </div>
    </section>
  );
};