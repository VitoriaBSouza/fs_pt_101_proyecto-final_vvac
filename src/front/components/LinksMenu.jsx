import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export const LinksMenu = () => {
  return (
    <div className="card card-sidebar d-inline-block sidebar-left-profile rounded border-0">
      <div className="card-body p-0">
        <nav className="linksmenu">
          <ul>
            {[
              { to: "/", icon: "fa-house", label: "Home" },
              { to: "/search", icon: "fa-search", label: "Search" },
              { to: "/profile", icon: "fa-user", label: "Profile" },
              { to: "/your-collection", icon: "fa-book-bookmark", label: "Your collection" },
              { to: "/shopping-list", icon: "fa-cart-shopping", label: "Shopping list" },
              { to: "/meal-planner", icon: "fa-calendar-days", label: "Meal planner" },
            ].map(({ to, icon, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="d-flex align-items-center text-white text-decoration-none px-3 py-2 rounded"
                >
                  <i className={`fa-solid ${icon} me-3`}></i>
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
