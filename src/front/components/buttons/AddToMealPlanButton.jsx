// src/front/components/buttons/AddToMealPlanButton.jsx

import { useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import mealPlanServices from "../../services/recetea_API/mealplan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

export const AddToMealPlanButton = ({ recipe }) => {
  const { store, dispatch } = useGlobalReducer();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    meal_type: "",
    time: "12:00",
    date: new Date().toISOString().slice(0, 10) // YYYY-MM-DD format
  });

  const handleAddToCalendar = () => {
    setModalVisible(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [hours, minutes] = formData.time.split(":" );
      const datetime = new Date(formData.date);
      datetime.setHours(+hours);
      datetime.setMinutes(+minutes);

      const payload = {
        date: datetime.toISOString(),
        recipe_id: recipe.id,
        meal_type: formData.meal_type,
      };

      await mealPlanServices.addEntry(payload);
      setModalVisible(false);
    } catch (err) {
      console.error("Error saving meal plan entry:", err);
    }
  };

  if (!store.user?.id) return null;

  return (
    <>
      <button
        type="button"
        className="btn border-0"
        onClick={handleAddToCalendar}
      >
        <FontAwesomeIcon
          icon={faCalendarDays}
          className="ms-4 fs-2 color_icons"
        />
      </button>

      {modalVisible && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-semibold">Add Meal Plan Entry</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalVisible(false)}></button>
              </div>
              <form onSubmit={handleSubmit} className="needs-validation p-3">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Date</label>
                  <input
                    type="date"
                    className="form-control border-1 border-secondary shadow-sm"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Meal Type</label>
                  <select
                    className="form-select border-1 border-secondary shadow-sm"
                    name="meal_type"
                    value={formData.meal_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select one</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="morning_snack">Morning Snack</option>
                    <option value="brunch">Brunch</option>
                    <option value="lunch">Lunch</option>
                    <option value="afternoon_snack">Afternoon Snack</option>
                    <option value="dinner">Dinner</option>
                    <option value="supper">Supper</option>
                    <option value="snack">Snack</option>
                    <option value="pre_workout">Pre-workout</option>
                    <option value="post_workout">Post-workout</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Time</label>
                  <input
                    type="time"
                    className="form-control border-1 border-secondary shadow-sm"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="modal-footer border-0 pt-3">
                  <button type="submit" className="btn btn-danger px-4">
                    Save
                  </button>
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setModalVisible(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
