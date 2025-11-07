import React, { useState, useEffect } from "react";
import "./Pages.css";

function Workout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [workoutType, setWorkoutType] = useState("Pushups");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState(0);
  const [workouts, setWorkouts] = useState([]);

  // Predefined MET values
  const METS = {
    Pushups: 7,
    Squats: 5,
    Running: 10,
    Cycling: 8,
    Plank: 4,
    JumpingJacks: 8,
  };

  // Fetch workouts
  const fetchWorkouts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/workouts/${user.id}`);
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      console.error("Error fetching workouts:", err);
    }
  };

  // Calculate calories locally
  const calculateCalories = () => {
    let cals = 0;
    if (duration) cals = Math.round(METS[workoutType] * duration * 5);
    else if (reps) cals = Math.round(METS[workoutType] * reps * 0.5);
    setCalories(cals);
  };

  // Save workout
  const handleSaveWorkout = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          workout_type: workoutType,
          reps: reps || null,
          duration_minutes: duration || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Workout saved! Calories burned: ${data.calories_burned}`);
        setReps("");
        setDuration("");
        fetchWorkouts();
      } else {
        alert("Failed to save workout.");
      }
    } catch (err) {
      console.error("Error saving workout:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/workouts/${id}`, { method: "DELETE" });
      fetchWorkouts();
    } catch (err) {
      console.error("Error deleting workout:", err);
    }
  };

  useEffect(() => {
    if (user) fetchWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [user]);

  useEffect(() => {
    calculateCalories();
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [workoutType, reps, duration]);

  return (
    <div className="page-container">
      <h2>💪 Workout Tracker</h2>

      <form onSubmit={handleSaveWorkout} className="form-container">
        <select calssName = "work" value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
          <option>Pushups</option>
          <option>Squats</option>
          <option>Running</option>
          <option>Cycling</option>
          <option>Plank</option>
          <option>JumpingJacks</option>
        </select>

        <input
          type="number"
          placeholder="Reps (optional)"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <input
          type="number"
          placeholder="Duration (mins)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <p><strong>🔥 Estimated Calories Burned: {calories}</strong></p>

        <button type="submit" className="btn">Save Workout</button>
      </form>

      <div className="list-container">
        {workouts.map((w) => (
          <div key={w.id} className="card">
            <h4>{w.workout_type}</h4>
            {w.reps && <p>Reps: {w.reps}</p>}
            {w.duration_minutes && <p>Duration: {w.duration_minutes} min</p>}
            <p>🔥 Calories: {w.calories_burned}</p>
            <p>📅 {new Date(w.created_at).toLocaleString()}</p>
            <button onClick={() => handleDelete(w.id)} className="btn delete">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workout;
