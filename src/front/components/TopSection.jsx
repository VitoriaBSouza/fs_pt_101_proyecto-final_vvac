import React from 'react';

export const TopSection = () => {
    return (
        <div className="container-fluid p-0">
            <div className="row m-0">
                <div className="col-12 d-flex justify-content-center">
                    <div className="card bg-danger text-white w-100 border-0 rounded-0 position-relative">
                        <img
                            src="src/front/assets/img/alimentosTop.jpg"
                            alt="Fondo"
                            className="img-fluid w-100"
                            style={{ objectFit: "cover", maxHeight: "500px" }}
                        />
                        <div className="card-img-overlay d-flex align-items-center justify-content-end p-0">
                            <div className="bg-dark bg-opacity-75 text-center text-md-start p-4 rounded shadow w-50 w-md-75">
                                <h1 className="display-6 fw-bold">Discover Recetea!</h1>
                                <p className="fs-5 mb-1">- Build your own recipes collection.</p>
                                <p className="fs-5 mb-1">- Taste new flavours.</p>
                                <p className="fs-5 mb-1">- Plan your meals.</p>
                                <p className="fs-5">- Eat healthier and organized.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
