import React, { useState, useEffect } from "react";
import "./Pages.css";

function DailyPlanner() {
  const [task, setTask] = useState("");
  const [reminder, setReminder] = useState("");
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/daily/${user.id}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return alert("Please enter a task");

    try {
      const res = await fetch("http://localhost:5000/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          task,
          reminder_time: reminder || null,
        }),
      });

      if (res.ok) {
        setTask("");
        setReminder("");
        fetchTasks();
      } else {
        console.error("Failed to add task");
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Toggle completion
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      await fetch(`http://localhost:5000/api/daily/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/daily/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // Progress calculation
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progress =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="page-container">
      <h2>🗓️ Daily Planner</h2>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-text">
        {progress}% Tasks Completed ({completedCount}/{tasks.length})
      </p>

      <form onSubmit={handleAddTask} className="form-container">
        <input
          type="text"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <input
          type="time"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        />
        <button type="submit" className="btn">Add Task</button>
      </form>

      <div className="list-container">
        {tasks.map((t) => (
          <div
            key={t.id}
            className={`card ${t.status === "completed" ? "completed" : "pending"}`}
          >
            <h4>{t.task}</h4>
            <p>Status: {t.status}</p>
            {t.reminder_time && (
              <p>⏰ Reminder: {t.reminder_time.slice(0, 5)}</p>
            )}
            <div className="actions">
              <button
                onClick={() => handleToggleStatus(t.id, t.status)}
                className="btn toggle"
              >
                {t.status === "completed" ? "Mark Pending" : "Mark Done"}
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="btn delete"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyPlanner;
