import React from 'react';

export const TopSection = () => {
    return (
        <div className="row m-0 justify-content-center row_home_top">
            <div className="col-12 position-relative p-0 top_home_img">

                <img
                    src="src/front/assets/img/alimentosTop.jpg"
                    alt="Fondo"
                    className="w-100 h-100 object-fit-cover mx-auto p-4"
                />

                <div className="position-absolute top-50 end-0 translate-middle-y 
                text-white p-4 rounded-2 me-4 top_intro_text">

                    <h1 className="fw-bold text-warning display-5">Descubre Recetea</h1>
                    <h5 className="mb-0 fs-4">Reúne todas tus recetas en un mismo lugar</h5>
                    <h5 className="mb-0 fs-4">Planifica tu menú y crea tu lista de compras</h5>
                    <h5 className="mb-0 fs-4">Descubre nuevos sabores</h5>
                    <h5 className="mb-0 fs-4">Come más sano</h5>

                </div>

            </div>
        </div>
    );
};
