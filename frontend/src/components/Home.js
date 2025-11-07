import React from "react";
import "./Auth.css";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>
          Welcome to <span>Health & Fitness Pro</span> 💪
        </h1>
        <p>
          Transform your lifestyle with fitness tracking, personalized diet plans, and daily wellness goals.
          Join thousands taking charge of their health!
        </p>

        {!user ? (
          <div className="home-buttons">
            <button onClick={() => (window.location.href = "/login")}>
              Login
            </button>
            <button onClick={() => (window.location.href = "/signup")}>
              Sign Up
            </button>
          </div>
        ) : (
          <button
            className="get-started-btn"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Go to Dashboard →
          </button>
        )}
      </div>

      <div className="benefits">
        <div className="benefit-card" onClick={() => (window.location.href = "/workout")}>
          <h3>🏋️ Personalized Fitness</h3>
          <p>Set your fitness goals and follow custom workout recommendations.</p>
        </div>
        <div className="benefit-card" onClick={() => (window.location.href = "/diet")}>
          <h3>🥗 Smart Diet Plans</h3>
          <p>Get diet charts tailored to your BMI and calorie needs.</p>
        </div>
        <div className="benefit-card" onClick={() => (window.location.href = "/daily")}>
          <h3>📅 Daily Planning</h3>
          <p>Organize workouts, track meals, and stay productive daily.</p>
        </div>
        <div className="benefit-card" onClick={() => (window.location.href = "/bmi")}>
          <h3>📊 BMI Records</h3>
          <p>Monitor BMI, daily tasks, and health statistics over time.</p>
        </div>
      </div>

      <section className="about-section">
        <h2>Why Choose Health & Fitness Pro?</h2>
        <p>
          Our platform brings together fitness tracking and data-driven insights. Whether you want to lose weight, build muscle, or just stay active — we help you plan, track, and achieve your fitness goals with confidence.
        </p>
      </section>
    </div>
  );
}

export default Home;
