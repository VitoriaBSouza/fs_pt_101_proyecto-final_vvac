import { Link } from "react-router-dom";

export const SearchFilter = () => {

    return (
        <nav className="filter-links"> //se quedan vacios a la espera de 
            <ul>
                <li> 
                    <Link to="/" className="filter-links">
                        <i className="fa-regular fa-user"></i>
                        <span>sin asignar</span>
                    </Link>
                </li>
                <li>
                    <Link to="/" className="filter-links">
                        <i className="fa-regular fa-user"></i>
                        <span>sin asignar</span>
                    </Link>
                </li>
            </ul>
            
        </nav>

    );

};