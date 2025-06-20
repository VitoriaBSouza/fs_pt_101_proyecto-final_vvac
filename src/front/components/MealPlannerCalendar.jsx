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
import "../index.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: {},
});

const calendarViews = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA];

const mapEntriesToEvents = (entries) => {
  return entries.map((entry) => {
    const datetime = new Date(entry.date);
    const start = new Date(datetime);
    const end = new Date(datetime);
    start.setHours(12);
    end.setHours(13);
    return {
      title: `${entry.recipe_title} (${entry.meal_type})`,
      start,
      end,
      allDay: false,
      resource: {
        id: entry.id,
        recipe_id: entry.recipe_id,
        meal_type: entry.meal_type,
      },
    };
  });
};

export const MealPlannerCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ recipe_id: "", meal_type: "", time: "12:00" });
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { store, dispatch } = useGlobalReducer();
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

  useEffect(() => {
    if (store.selectedCalendarRecipe) {
      setFormData({
        recipe_id: store.selectedCalendarRecipe.id.toString(),
        meal_type: "",
        time: "12:00",
      });
      dispatch({ type: "set_calendar_entry_recipe", payload: null });
    }
  }, [store.selectedCalendarRecipe, dispatch]);

  const handleSelectEvent = (event) => {
    const entry = events.find(e => e.resource.id === event.resource.id);
    if (!entry) return;
    const datetime = new Date(entry.start);
    const time = datetime.toTimeString().split(":" ).slice(0, 2).join(":" );
    setFormData({
      recipe_id: entry.resource.recipe_id,
      meal_type: entry.resource.meal_type,
      time,
    });
    setSelectedSlot(datetime);
    setEditingEvent(entry);
    setModalVisible(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo.start);
    setFormData({ recipe_id: "", meal_type: "", time: "12:00" });
    setEditingEvent(null);
    setModalVisible(true);
  };

  const handleModalChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const [hours, minutes] = formData.time.split(":" );
      const datetime = new Date(selectedSlot);
      datetime.setHours(+hours);
      datetime.setMinutes(+minutes);

      const payload = {
        date: datetime.toISOString(),
        recipe_id: parseInt(formData.recipe_id),
        meal_type: formData.meal_type,
      };

      if (editingEvent) {
        await mealPlanServices.updateEntry(editingEvent.resource.id, payload);
      } else {
        await mealPlanServices.addEntry(payload);
      }

      setFormData({ recipe_id: "", meal_type: "", time: "12:00" });
      setModalVisible(false);
      setEditingEvent(null);
      await loadMealPlanEntries();
    } catch (err) {
      alert("Error saving meal plan entry.");
    }
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    try {
      await mealPlanServices.deleteEntry(editingEvent.resource.id);
      setModalVisible(false);
      setEditingEvent(null);
      await loadMealPlanEntries();
    } catch (err) {
      alert("Error deleting meal plan entry.");
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
                <h5 className="modal-title fw-semibold">
                  {editingEvent ? "Edit Meal Plan Entry" : "Add Meal Plan Entry"}
                </h5>
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
                      store.collections.map((item) => (
                        <option key={item.recipe_id} value={item.recipe_id}>
                          {item.recipe_title}
                        </option>
                      ))}
                    {store.selectedCalendarRecipe &&
                      !store.collections.some((item) => item.recipe_id === store.selectedCalendarRecipe.id) && (
                        <option value={store.selectedCalendarRecipe.id}>
                          {store.selectedCalendarRecipe.title}
                        </option>
                      )}
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
                    onChange={handleModalChange}
                    required
                  />
                </div>
                <div className="modal-footer border-0 pt-3">
                  {editingEvent && (
                    <button type="button" className="btn btn-outline-danger me-auto" onClick={handleDelete}>
                      Delete
                    </button>
                  )}
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
