import React from 'react';

export const TopSection = () => {
  return (
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/ruta/a/tu/imagen.jpg')" }}>
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-6 rounded shadow-lg max-w-sm">
        <h1 className="text-3xl font-bold mb-2">Título Impactante</h1>
        <p className="text-gray-700">Aquí va tu mensaje principal o llamado a la acción.</p>
      </div>
    </div>
  );
};

