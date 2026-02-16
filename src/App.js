import React, { useState } from "react";
import Leaderboard from "./pages/Leaderboard";
import Events from "./pages/Events";
import Participants from "./pages/Participants";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("leaderboard");

  return (
    <div className="app">
      <div className="navbar">
        <div className="logo">
          <span className="logo-icon">🏆</span> Leaderboard Management
        </div>

        <div className="nav-buttons">
          <button
            className={page === "leaderboard" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("leaderboard")}
          >
            Leaderboard
          </button>

          <button
            className={page === "events" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("events")}
          >
            Events
          </button>

          <button
            className={page === "participants" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("participants")}
          >
            Participants
          </button>
        </div>
      </div>

      <div className="container">
        {page === "leaderboard" && <Leaderboard />}
        {page === "events" && <Events />}
        {page === "participants" && <Participants />}
      </div>
    </div>
  );
}
