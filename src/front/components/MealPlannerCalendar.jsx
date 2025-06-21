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
import recipeServices from "../services/recetea_API/recipeServices";
import collectionServices from "../services/recetea_API/collectionServices";
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
  const [allOptions, setAllOptions] = useState([]);
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

  const loadRecipeOptions = useCallback(async () => {
    try {
      const [collectionsRespRaw, userRecipesResp, mealEntries] = await Promise.all([
        collectionServices.getUserCollections(),
        recipeServices.getAllUserRecipes(),
        mealPlanServices.getAllEntries(),
      ]);

      const collectionsResp = collectionsRespRaw.success && Array.isArray(collectionsRespRaw.collections)
        ? collectionsRespRaw.collections
        : [];

      const optionsMap = new Map();

      collectionsResp.forEach((item) => optionsMap.set(item.recipe_id, item.recipe_title));
      userRecipesResp.forEach((r) => optionsMap.set(r.id, r.title));
      mealEntries.forEach((entry) => optionsMap.set(entry.recipe_id, entry.recipe_title));

      const finalOptions = Array.from(optionsMap.entries()).map(([id, title]) => ({ id, title }));

      setAllOptions(finalOptions);
    } catch (err) {
      console.error("Error loading recipe options:", err);
    }
  }, []);

  useEffect(() => {
    loadMealPlanEntries();
    loadRecipeOptions();
  }, [loadMealPlanEntries, loadRecipeOptions]);

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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Meal Planner Calendar</h3>
        <div className="d-flex gap-2">
          <select value={currentDate.getMonth()} onChange={handleMonthChange} className="form-select">
            {monthOptions.map((month, i) => (
              <option key={i} value={i}>{month}</option>
            ))}
          </select>
          <select value={currentDate.getFullYear()} onChange={handleYearChange} className="form-select">
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={calendarViews}
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          date={currentDate}
          onNavigate={setCurrentDate}
        />
      )}

      {modalVisible && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleModalSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editingEvent ? "Edit" : "Add"} Meal Plan Entry</h5>
                <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Recipe</label>
                  <select
                    name="recipe_id"
                    className="form-select"
                    value={formData.recipe_id}
                    onChange={handleModalChange}
                    required
                  >
                    <option value="">Select a recipe</option>
                    {allOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Meal Type</label>
                  <select
                    name="meal_type"
                    className="form-select"
                    value={formData.meal_type}
                    onChange={handleModalChange}
                    required
                  >
                    <option value="">Select meal type</option>
                    {Object.values({
                      BREAKFAST: "Breakfast",
                      MORNING_SNACK: "Morning Snack",
                      BRUNCH: "Brunch",
                      LUNCH: "Lunch",
                      AFTERNOON_SNACK: "Afternoon Snack",
                      DINNER: "Dinner",
                      SUPPER: "Supper",
                      SNACK: "Snack",
                      PRE_WORKOUT: "Pre-workout",
                      POST_WORKOUT: "Post-workout",
                      OTHER: "Other",
                    }).map((type, idx) => (
                      <option key={idx} value={type.toLowerCase().replace(/ /g, '_')}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    className="form-control"
                    value={formData.time}
                    onChange={handleModalChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                {editingEvent && (
                  <button type="button" className="btn btn-danger me-auto" onClick={handleDelete}>
                    Delete
                  </button>
                )}
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
