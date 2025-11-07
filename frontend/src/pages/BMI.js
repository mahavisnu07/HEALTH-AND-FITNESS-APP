import React, { useState, useEffect } from "react";
import "./Pages.css";

function BMI() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [latest, setLatest] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch the latest BMI record
  const fetchLatest = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bmi/${user.id}`);
      const data = await res.json();

      if (res.ok && data && data.bmi) {
        setLatest(data);
      } else {
        setLatest(null);
      }
    } catch (err) {
      console.error("Error fetching latest BMI:", err);
    }
  };

  // ✅ Save new BMI record
  const saveToDatabase = async (bmiValue, bmiCategory) => {
    try {
      const res = await fetch("http://localhost:5000/api/bmi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          height,
          weight,
          age,
          gender,
          bmi: bmiValue,
          category: bmiCategory,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ BMI record saved successfully!");
        fetchLatest(); // ✅ Immediately reload last record
      } else {
        setMessage(data.message || "Failed to save BMI record.");
      }
    } catch (err) {
      console.error("Error saving BMI record:", err);
      setMessage("Server error while saving BMI.");
    }
  };

  // ✅ Calculate BMI
  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight) return;

    const h = height / 100; // convert cm to meters
    const bmiValue = (weight / (h * h)).toFixed(2);
    setBmi(bmiValue);

    let bmiCategory = "";
    if (bmiValue < 18.5) bmiCategory = "Underweight";
    else if (bmiValue < 24.9) bmiCategory = "Normal weight";
    else if (bmiValue < 29.9) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    setCategory(bmiCategory);
    saveToDatabase(bmiValue, bmiCategory);
  };
useEffect(() => {
  const getLatest = async () => {
    if (user) {
      await fetchLatest();
    }
  };
  getLatest();
}, [user, fetchLatest]);



  return (
    <div className="page-container">
      <h2>BMI Calculator 🧮</h2>

      <form onSubmit={calculateBMI} className="bmi-form">
        <input className = "in"
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />
        <input className = "in"
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
        <input className = "in"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <select className = "in" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option>Male</option>
          <option>Female</option>
        </select>
        <button type="submit" className="btn">
          Calculate
        </button>
      </form>

      {bmi && (
        <div className="bmi-result">
          <h3>Your BMI: {bmi}</h3>
          <p>Category: {category}</p>
        </div>
      )}

      {message && <p className="message">{message}</p>}

      <div className="bmi-history">
        <h4>📜 Last Recorded BMI:</h4>
        {latest ? (
          <>
            <p><strong>BMI:</strong> {latest.bmi}</p>
            <p><strong>Category:</strong> {latest.category}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(latest.created_at).toLocaleString()}
            </p>
          </>
        ) : (
          <p>No previous BMI record found.</p>
        )}
      </div>
    </div>
  );
}

export default BMI;
