import React from 'react';
import imgTop from '../assets/img/img-Top.jpg';

export const TopSection = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${imgTop})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '400px'
      }}
    >
      {/* Contenido aquí */}
    </div>
  );
};
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-6 rounded shadow-lg max-w-sm">
        
        <p className="text-gray-700">Aquí va tu mensaje principal o llamado a la acción.</p>
      </div>
    </div>
  );
};