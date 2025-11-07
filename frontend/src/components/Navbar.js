import React, { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showDropdown, setShowDropdown] = useState(false);
  const [stats, setStats] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [motive, setMotive] = useState("");

 // ✅ Trigger backend logout before local logout
const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/api/session/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });
  } catch (err) {
    console.error("Error logging out session:", err);
  }
  localStorage.removeItem("user");
  window.location.href = "/";
};


// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  const handleBeforeUnload = async () => {
    if (user) {
      await fetch("http://localhost:5000/api/session/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, [user]);



  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const startSession = async () => {
      if (user) {
        await fetch("http://localhost:5000/api/session/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
      }
    };
    startSession();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${user.id}/stats`);
      const data = await res.json();
      setStats(data);

      const timeRes = await fetch(`http://localhost:5000/api/session/${user.id}/total-time`);
      const timeData = await timeRes.json();
      setTotalTime(Math.round(timeData.total_time));
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!password.trim()) return alert("Please confirm your password");

    try {
      const res = await fetch("http://localhost:5000/api/profile/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          password,
          motive,
        }),
      });

      if (res.ok) {
        alert("Account deleted successfully.");
        localStorage.removeItem("user");
        window.location.href = "/";
      } else {
        const data = await res.json();
        alert(data.message || "Error deleting account");
      }
    } catch (err) {
      console.error(err);
      alert("Server error deleting account");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => (window.location.href = "/")}>
        <h2>⚒ Health & Fitness App</h2>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <button onClick={() => (window.location.href = "/home")}>Home</button>
            <button onClick={() => (window.location.href = "/dashboard")}>Dashboard</button>
            <button onClick={() => (window.location.href = "/contact")}>Contact</button>

            <div className="profile-container">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="profile"
                className="profile-icon"
                onClick={() => setShowDropdown(!showDropdown)}
              />

              {showDropdown && (
                <div className="profile-dropdown">
                  <h4>{user.username}</h4>
                  <p>📧 {user.email}</p>
                  <hr />
                  <p>🔥 Calories Burned: {stats.calories_burned || 0}</p>
                  <p>✅ Tasks Completed: {stats.completed_tasks || 0}</p>
                  <p>📊 BMI Records: {stats.total_bmi || 0}</p>
                  <p>🥗 Diet Plans: {stats.total_diets || 0}</p>
                  <p>🕒 Time on App: {totalTime} min</p>
                  <hr />
                  <button style={{color : "black"}} onClick={handleLogout}>Logout</button>
                  <button
                    className="danger-btn"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => (window.location.href = "/home")}>Home</button>
            <button onClick={() => (window.location.href = "/signup")}>Sign Up</button>
            <button onClick={() => (window.location.href = "/login")}>Login</button>
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Delete Account</h3>
            <p>Please confirm your password to delete your account.</p>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <textarea
              placeholder="Tell us why you're leaving (optional)"
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleDeleteAccount} className="danger-btn">
                Confirm Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
