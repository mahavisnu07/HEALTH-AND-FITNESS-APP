import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import BMI from "./pages/BMI";
import Workout from "./pages/Workout";
import DietPlanner from "./pages/DietPlanner";
import DailyPlanner from "./pages/DailyPlanner";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
        
          <Route
             path="/profile"
             element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
             }
            />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bmi"
            element={
              <ProtectedRoute>
                <BMI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet"
            element={
              <ProtectedRoute>
                <DietPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily"
            element={
              <ProtectedRoute>
                <DailyPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
