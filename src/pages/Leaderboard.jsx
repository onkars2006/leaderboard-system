import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Leaderboard() {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const [filterEvent, setFilterEvent] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [points, setPoints] = useState("");

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("name");
    setEvents(data || []);
  };

  const fetchParticipants = async () => {
    const { data } = await supabase
      .from("participants")
      .select("*")
      .order("name");
    setParticipants(data || []);
  };

  const fetchLeaderboard = useCallback(async () => {
    let query = supabase
      .from("leaderboard")
      .select("id, points, event_id, participant_id, events(name), participants(name)")
      .order("points", { ascending: false });

    if (filterEvent !== "") {
      query = query.eq("event_id", filterEvent);
    }

    const { data } = await query;
    setLeaderboard(data || []);
  }, [filterEvent]);

  useEffect(() => {
    fetchEvents();
    fetchParticipants();
  }, []);

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel("leaderboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leaderboard" },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  const addScore = async () => {
    if (selectedEvent === "" || selectedParticipant === "" || points.trim() === "") {
      alert("Select event, participant and points");
      return;
    }

    const { error } = await supabase.from("leaderboard").insert([
      {
        event_id: selectedEvent,
        participant_id: selectedParticipant,
        points: parseInt(points)
      }
    ]);

    if (error) {
      if (error.message.includes("unique_event_participant")) {
        alert("This participant already exists in this event. Update points instead.");
        return;
      }
      alert(error.message);
      return;
    }

    setPoints("");
    fetchLeaderboard();
  };

  const updateScore = async (id) => {
    const newPoints = prompt("Enter new points");
    if (newPoints === null) return;
    if (newPoints.trim() === "" || isNaN(newPoints)) return;

    const { error } = await supabase
      .from("leaderboard")
      .update({ points: parseInt(newPoints) })
      .eq("id", id);

    if (error) alert(error.message);
    fetchLeaderboard();
  };

  const deleteScore = async (id) => {
    await supabase.from("leaderboard").delete().eq("id", id);
    fetchLeaderboard();
  };

  return (
    <div className="card">
      <h2 className="title">Leaderboard</h2>
      <p className="subtitle">Track ranking and scores event-wise</p>

      <div className="input-row">
        <select
          className="input-box"
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
        >
          <option value="">All Events</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card" style={{ marginTop: "20px" }}>
        <h3 className="title" style={{ fontSize: "18px" }}>
          Add Participant Score
        </h3>

        <div className="input-row">
          <select
            className="input-box"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">Select Event</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>

          <select
            className="input-box"
            value={selectedParticipant}
            onChange={(e) => setSelectedParticipant(e.target.value)}
          >
            <option value="">Select Participant</option>
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            className="input-box"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="Points"
            type="number"
          />

          <button className="btn btn-primary" onClick={addScore}>
            Add Score
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Event</th>
              <th>Participant</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <span className="badge badge-green">{index + 1}</span>
                </td>
                <td>{row.events?.name}</td>
                <td>{row.participants?.name}</td>
                <td>
                  <span className="badge badge-blue">{row.points}</span>
                </td>
                <td>
                  <div className="action-row">
                    <button className="btn btn-secondary" onClick={() => updateScore(row.id)}>
                      Update
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteScore(row.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {leaderboard.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No leaderboard data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
