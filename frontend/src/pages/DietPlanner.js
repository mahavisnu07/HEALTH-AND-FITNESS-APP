import React, { useState, useEffect } from "react";
import "./Pages.css";

function DietPlanner() {
  const [title, setTitle] = useState("");
  const [planDetails, setPlanDetails] = useState("");
  const [plans, setPlans] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPlans = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/diet/${user.id}`);
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error("Error fetching diet plans:", err);
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    if (!title.trim() || !planDetails.trim()) {
      alert("Please fill out both title and plan details.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          title: title.trim(),
          plan_details: planDetails.trim(),
        }),
      });

      if (res.ok) {
        setTitle("");
        setPlanDetails("");
        fetchPlans();
      } else {
        console.error("Failed to save diet plan");
      }
    } catch (err) {
      console.error("Error adding diet plan:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/diet/${id}`, { method: "DELETE" });
      fetchPlans();
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  useEffect(() => {
    if (user) fetchPlans();
  }, [user]);

  return (
    <div className="page-container">
      <h2>🥗 Diet Planner</h2>

      <form onSubmit={handleAddPlan} className="form-container">
        <input
          type="text"
          placeholder="Meal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Describe your meal or nutrition plan"
          value={planDetails}
          onChange={(e) => setPlanDetails(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="btn">Add Plan</button>
      </form>

      <div className="list-container">
        {plans.map((p) => (
          <div key={p.id} className="card">
            <h4>{p.title}</h4><hr></hr>
            <p>{p.plan_details}</p>
            <p><small>Created on: {new Date(p.created_at).toLocaleString()}</small></p>
            <button onClick={() => handleDelete(p.id)} className="btn delete">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DietPlanner;
