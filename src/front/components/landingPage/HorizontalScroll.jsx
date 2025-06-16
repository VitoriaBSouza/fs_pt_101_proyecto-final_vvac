import React from 'react';

export const HorizontalScroll = () => {
  return (
    <div className="bg-gray-100 p-6 overflow-x-auto whitespace-nowrap">
      <div className="inline-block w-[300px] h-[200px] bg-white m-2 rounded shadow inline-flex items-center justify-center">
        Carta 1
      </div>
      <div className="inline-block w-[300px] h-[200px] bg-white m-2 rounded shadow inline-flex items-center justify-center">
        Carta 2
      </div>
      <div className="inline-block w-[300px] h-[200px] bg-white m-2 rounded shadow inline-flex items-center justify-center">
        Carta 3
      </div>
      {/* Agrega más cartas cuando quieras */}
    </div>
  );
};

