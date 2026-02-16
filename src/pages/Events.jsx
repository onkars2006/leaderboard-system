import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    setEvents(data || []);
  }, []);

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel("events-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  const addEvent = async () => {
    if (name.trim() === "") return;

    await supabase.from("events").insert([{ name: name.trim() }]);
    setName("");
    fetchEvents();
  };

  const startEdit = (event) => {
    setEditId(event.id);
    setName(event.name);
  };

  const updateEvent = async () => {
    if (!editId) return;
    if (name.trim() === "") return;

    await supabase.from("events").update({ name: name.trim() }).eq("id", editId);
    setEditId(null);
    setName("");
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  };

  return (
    <div className="card">
      <h2 className="title">Events</h2>
      <p className="subtitle">Create, update and manage competition events</p>

      <div className="input-row">
        <input
          className="input-box"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event Name"
        />

        <button
          className={editId ? "btn btn-secondary" : "btn btn-primary"}
          onClick={editId ? updateEvent : addEvent}
        >
          {editId ? "Update Event" : "Add Event"}
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event ID</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <span className="badge badge-blue">{event.name}</span>
                </td>
                <td>{event.id}</td>
                <td>
                  <div className="action-row">
                    <button className="btn btn-secondary" onClick={() => startEdit(event)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteEvent(event.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
