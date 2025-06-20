// src/front/pages/MealPlanner.jsx

import { TurnHome } from "../components/buttons/TurnHome";
import { LinksMenu } from "../components/LinksMenu";
import { RightMenu } from "../components/RightMenu";
import { MealPlannerCalendar } from "../components/MealPlannerCalendar";

export const MealPlanner = () => {
  return (
 
        <div className="container text-center sidebar-left-profile">
          <div className="row align-items-start">
            {/* Left Sidebar */}
            <div className="col-12 col-md-3">
              <div className="d-flex align-items-start">
                <TurnHome />
                <LinksMenu />
              </div>
            </div>

            {/* Main Content */}
            <div className="col-12 planner-page">
              <MealPlannerCalendar />
            </div>

            {/* Right Sidebar */}
            <div className="col-12 col-md-3">
              <RightMenu />
            </div>
          </div>
        </div>

  );
};
