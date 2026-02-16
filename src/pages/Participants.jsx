import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Participants() {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchParticipants = useCallback(async () => {
    const { data } = await supabase
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });

    setParticipants(data || []);
  }, []);

  useEffect(() => {
    fetchParticipants();

    const channel = supabase
      .channel("participants-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants" },
        () => fetchParticipants()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchParticipants]);

  const addParticipant = async () => {
    if (name.trim() === "") return;

    await supabase.from("participants").insert([
      {
        name: name.trim(),
        email: email.trim() === "" ? null : email.trim()
      }
    ]);

    setName("");
    setEmail("");
    fetchParticipants();
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setName(p.name);
    setEmail(p.email || "");
  };

  const updateParticipant = async () => {
    if (!editId) return;
    if (name.trim() === "") return;

    await supabase
      .from("participants")
      .update({
        name: name.trim(),
        email: email.trim() === "" ? null : email.trim()
      })
      .eq("id", editId);

    setEditId(null);
    setName("");
    setEmail("");
    fetchParticipants();
  };

  const deleteParticipant = async (id) => {
    await supabase.from("participants").delete().eq("id", id);
    fetchParticipants();
  };

  return (
    <div className="card">
      <h2 className="title">Participants</h2>
      <p className="subtitle">Manage participant details for leaderboard events</p>

      <div className="input-row">
        <input
          className="input-box"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Participant Name"
        />

        <input
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional)"
        />

        <button
          className={editId ? "btn btn-secondary" : "btn btn-primary"}
          onClick={editId ? updateParticipant : addParticipant}
        >
          {editId ? "Update Participant" : "Add Participant"}
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Participant ID</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {participants.map((p) => (
              <tr key={p.id}>
                <td>
                  <span className="badge badge-blue">{p.name}</span>
                </td>
                <td>{p.email}</td>
                <td>{p.id}</td>
                <td>
                  <div className="action-row">
                    <button className="btn btn-secondary" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteParticipant(p.id)}>
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
