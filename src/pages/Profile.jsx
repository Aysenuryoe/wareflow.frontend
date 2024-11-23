import React, { useEffect, useState } from "react";
import "../styles/Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Kein Token gefunden. Bitte einloggen.");
        }

        const response = await fetch(`http://localhost:3001/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          

        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Benutzerdaten");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {userData ? (
        <div>
          <label>E-Mail:</label>
          <input type="email" value={userData.email} readOnly />

          <label>Password:</label>
          <input type="password" placeholder="Password" />
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Profile;
