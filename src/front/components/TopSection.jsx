import React from 'react';

export const TopSection = () => {
    return (
        <div className="row m-0 ">
            <div className="col-12 d-flex justify-content-center">
                <div class="card bg-danger text-white h-75 w-75 g-0 rounded-0 border-0">
                    <img
                        src="src/front/assets/img/alimentosTop.jpg"
                        alt="Fondo"
                        className="img-fluid w-100 h-100 rounded-0 m-1 mx-auto"
                    />
                    <div class="card-img-overlay d-flex ms-auto align-items-center justify-content-center border-0">
                        <div className="bg-dark w-50 h-30  m-3 ms-auto align-items-center">
                            <h1 className="display-5 fw-bold mb-">Discover Recetea!</h1>
                            <p className="fs-4">-Build your own recipes collection.</p>
                            <p className="fs-4">-Taste new flavours.</p>
                            <p className="fs-4">-Plan your meals.</p>
                            <p className="fs-4">-Eat healthier and organized.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};