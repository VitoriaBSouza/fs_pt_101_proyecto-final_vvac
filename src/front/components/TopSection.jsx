import React from 'react';

export const TopSection = () => {
    return (
        <div className="row m-0 justify-content-center row_home_top">
            <div className="col-12 position-relative p-0 home_img">

                <img
                    src="src/front/assets/img/alimentosTop.jpg"
                    alt="Fondo"
                    className="w-100 h-100 object-fit-cover mx-auto p-4"
                />

                <div className="position-absolute top-50 end-0 translate-middle-y 
                bg-dark bg-opacity-75 text-white p-4 rounded-2 me-4 top_div">

                    <h1 className="fw-bold text-warning">Descubre Recetea</h1>
                    <br />
                    <h5 className="mb-2">Reúne todas tus recetas en un mismo lugar</h5>
                    <p className="mb-2">Planifica tu menú y crea tu lista de compras</p>
                    <p className="mb-2">Descubre nuevos sabores</p>
                    <p className="mb-0">Come más sano</p>

                </div>

            </div>
        </div>
    );
};
