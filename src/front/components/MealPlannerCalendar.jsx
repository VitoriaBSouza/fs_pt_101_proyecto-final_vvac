// src/front/components/MealPlannerCalendar.jsx

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import mealPlanServices from "../services/recetea_API/mealplan";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../index.css"; // ✅ Forma de importación acordada

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: {},
});

const calendarViews = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA];

const mapEntriesToEvents = (entries) => {
  return entries.map((entry) => ({
    title: `${entry.recipe_title} (${entry.meal_type})`,
    start: new Date(entry.date),
    end: new Date(entry.date),
    allDay: true,
    resource: {
      id: entry.id,
      recipe_id: entry.recipe_id,
      meal_type: entry.meal_type,
    },
  }));
};

export const MealPlannerCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ recipe_id: "", meal_type: "" });
  const [currentDate, setCurrentDate] = useState(new Date());
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  const loadMealPlanEntries = useCallback(async () => {
    try {
      const entries = await mealPlanServices.getAllEntries();
      const mappedEvents = mapEntriesToEvents(entries);
      setEvents(mappedEvents);
    } catch (err) {
      console.error("Error loading calendar data:", err);
      setError("Failed to load calendar entries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMealPlanEntries();
  }, [loadMealPlanEntries]);

  const handleSelectEvent = (event) => {
    const recipeId = event.resource.recipe_id;
    navigate(`/recipes/${recipeId}`);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo.start);
    setModalVisible(true);
  };

  const handleModalChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        date: selectedSlot.toISOString().split("T")[0],
        recipe_id: parseInt(formData.recipe_id),
        meal_type: formData.meal_type,
      };

      await mealPlanServices.addEntry(payload);
      setFormData({ recipe_id: "", meal_type: "" });
      setModalVisible(false);
      await loadMealPlanEntries();
    } catch (err) {
      alert("Error saving meal plan entry.");
    }
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const updatedDate = new Date(currentDate);
    updatedDate.setMonth(newMonth);
    setCurrentDate(updatedDate);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const updatedDate = new Date(currentDate);
    updatedDate.setFullYear(newYear);
    setCurrentDate(updatedDate);
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="container my-5">
      <div className="card shadow border-0 bg-white rounded-4">
        <div className="card-body px-5 py-4">
          <h2 className="text-center text-danger-emphasis fw-bold mb-4 display-6">Meal Plan</h2>

          <div className="d-flex justify-content-center gap-3 mb-4">
            <div className="dropdown">
              <button className="btn btn-outline-danger dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {monthOptions[currentDate.getMonth()]}
              </button>
              <ul className="dropdown-menu">
                {monthOptions.map((month, index) => (
                  <li key={index}>
                    <button className="dropdown-item" onClick={() => handleMonthChange({ target: { value: index } })}>
                      {month}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dropdown">
              <button className="btn btn-outline-danger dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {currentDate.getFullYear()}
              </button>
              <ul className="dropdown-menu">
                {yearOptions.map((year) => (
                  <li key={year}>
                    <button className="dropdown-item" onClick={() => handleYearChange({ target: { value: year } })}>
                      {year}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : (
            <div className="calendar-wrapper calendar-theme p-4 rounded">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={calendarViews}
                defaultView={Views.MONTH}
                date={currentDate}
                onNavigate={setCurrentDate}
                style={{ height: 700 }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                popup
                toolbar={true}
              />
            </div>
          )}
        </div>
      </div>

      {modalVisible && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-semibold">Add Meal Plan Entry</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalVisible(false)}></button>
              </div>
              <form onSubmit={handleModalSubmit} className="needs-validation p-3">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Recipe</label>
                  <select
                    className="form-select border-1 border-secondary shadow-sm"
                    name="recipe_id"
                    value={formData.recipe_id}
                    onChange={handleModalChange}
                    required
                  >
                    <option value="">Select a recipe</option>
                    {store.collections &&
                      store.collections.map((recipe) => (
                        <option key={recipe.recipe_id} value={recipe.recipe_id}>
                          {recipe.recipe_title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Meal Type</label>
                  <select
                    className="form-select border-1 border-secondary shadow-sm"
                    name="meal_type"
                    value={formData.meal_type}
                    onChange={handleModalChange}
                    required
                  >
                    <option value="">Select one</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
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
    </div>
  );
};
