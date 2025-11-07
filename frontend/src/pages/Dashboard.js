import React from "react";
import "./Pages.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
    
      <div className="page-container">
        <h2>Welcome back, {user?.username || "User"} 👋</h2>
        <p className="dashboard-intro">
          This is your personal dashboard — track your fitness, monitor your progress, 
          and manage your health journey.
        </p>

        <div className="dashboard-cards">
          <div className="card" onClick={() => (window.location.href = "/bmi")}>
            <h3 style={{ color: "black" }}>🏋️ BMI Records</h3>
            <p style={{ color: "black" }}>Track your BMI progress and stay in the healthy range.</p>
          </div>

          <div className="card" onClick={() => (window.location.href = "/daily")}>
            <h3 style={{ color: "black" }}>📅 Daily Planner</h3>
            <p style={{ color: "black" }}>Plan workouts, routines, and daily goals easily.</p>
          </div>

          <div className="card" onClick={() => (window.location.href = "/diet")}>
            <h3 style={{ color: "black" }}>🥗 Diet Plans</h3>
            <p style={{ color: "black" }}>Keep a record of your meals and calorie intake.</p>
          </div>

          <div className="card" onClick={() => (window.location.href = "/workout")}>
            <h3 style={{ color: "black" }}>🥊Workout Tracker</h3>
            <p style={{ color: "black" }}>Keep a record of your workout and calorie burns.</p>
          </div>

          <div className="card" onClick={() => (window.location.href = "/contact")}>
            <h3 style={{ color: "black" }}>💬 Help Desk</h3>
            <p style={{ color: "black" }}>Need help? Get in touch with our support team.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
