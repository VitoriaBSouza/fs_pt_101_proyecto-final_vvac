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

// Configure the date-fns localizer
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: {},
});

// Define allowed calendar views
const calendarViews = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA];

// Utility function to transform meal plan entries to calendar events
const mapEntriesToEvents = (entries) => {
  return entries.map((entry) => ({
    title: `${entry.recipe_title} (${entry.meal_type})`,
    start: new Date(entry.date),
    end: new Date(entry.date),
    allDay: true,
    resource: {
      id: entry.id,
      recipe_id: entry.recipe_id,
      meal_type: entry.meal_type
    }
  }));
};

export const MealPlannerCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ recipe_id: "", meal_type: "" });
  const navigate = useNavigate();

  const loadMealPlanEntries = useCallback(async () => {
    try {
      const entries = await mealPlanServices.getAllEntries();
      setEvents(mapEntriesToEvents(entries));
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
      setModalVisible(false);
      setFormData({ recipe_id: "", meal_type: "" });
      loadMealPlanEntries();
    } catch (err) {
      alert("Error saving meal plan entry.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h2 className="card-title mb-4 text-center">Your Meal Plan Calendar</h2>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : (
            <div className="calendar-wrapper">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={calendarViews}
                defaultView={Views.MONTH}
                style={{ height: 700 }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                popup
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal for adding new entry */}
      {modalVisible && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Meal Plan Entry</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <form onSubmit={handleModalSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Recipe ID</label>
                    <input
                      type="number"
                      className="form-control"
                      name="recipe_id"
                      value={formData.recipe_id}
                      onChange={handleModalChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Meal Type</label>
                    <select
                      className="form-select"
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
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                  >
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
