import React, { useEffect, useState } from "react";
import "./Pages.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      setError("You must be logged in to view your profile.");
      setLoading(false);
      return;
    }

    setUser(storedUser);

    // Fetch profile stats
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/${storedUser.id}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load profile");
        setStats(data.stats);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        setError("Unable to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="loading">Loading your profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="page-container">
        <div className="card">
          <h2>{user.username}'s Profile</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <hr />

          <h3 style={{ color: "black" }}>Your Progress</h3>
          <div className="stats">
            <p><strong>BMI Records:</strong> {stats?.bmicount || 0}</p>
            <p><strong>Diet Plans Created:</strong> {stats?.dietCount || 0}</p>
            <p><strong>Daily Tasks:</strong> {stats?.totalTasks || 0}</p>
            <p><strong>Completed Tasks:</strong> {stats?.completedTasks || 0}</p>
            <p><strong>Weekly Progress:</strong> {stats?.weeklyProgress || 0}%</p>
            <p><strong>Monthly Progress:</strong> {stats?.monthlyProgress || 0}%</p>
          </div>
        </div>
      </div> 
    </>
  );
}

export default Profile;
