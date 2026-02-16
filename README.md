# 🏆 Leaderboard Management System (Supabase + React)

A modern **Leaderboard Management System** built using **React.js** and **Supabase (PostgreSQL)**.  
This project supports **Event Management**, **Participant Management**, and **Real-time Leaderboard Ranking** with a clean premium UI.

---

## 🚀 Features

### ✅ Leaderboard System
- Dynamic ranking system
- Sort leaderboard by points (high → low)
- Filter leaderboard by event
- Auto rank generation
- Update scores instantly
- Delete leaderboard entries
- Real-time updates using Supabase Realtime

### ✅ Event Management (CRUD)
- Create events
- Edit events
- Delete events
- View all events in a premium UI

### ✅ Participant Management (CRUD)
- Add participants
- Update participant details
- Delete participants
- Optional email support

### ✅ Admin Score Management
- Assign participants to events
- Add participant scores
- Update participant points
- Prevent duplicate participant entry in same event


---

## 🛠 Tech Stack

- **Frontend:** React.js
- **Backend / Database:** Supabase (PostgreSQL)
- **Realtime:** Supabase Realtime (Postgres Changes)
- **Hosting:** Vercel / Netlify (recommended)

---

## 📂 Project Structure

```bash
leaderboard-crud/
│
├── src/
│   ├── pages/
│   │   ├── Leaderboard.jsx
│   │   ├── Events.jsx
│   │   ├── Participants.jsx
│   │
│   ├── supabaseClient.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│
├── .env
├── package.json
└── README.md
