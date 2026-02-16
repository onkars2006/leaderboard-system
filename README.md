# 🏆 Leaderboard Management System (Supabase + React)

A modern **Leaderboard Management System** built using **React.js** and **Supabase (PostgreSQL)**.  
This project supports **Event Management**, **Participant Management**, and **Real-time Leaderboard Ranking** with a clean premium UI.

---
## 🌐 Live Demo

🔗 Live Project URL: https://leaderboard-system-kappa.vercel.app/
---
<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/8626103b-993b-4c5b-acba-2647fc822c74" />

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
## 🧠 Future Improvements

- 🔐 **Admin Login Authentication (Supabase Auth)**  
  Add secure admin login system using Supabase Authentication.

- 🛡️ **Role-Based Access Control (RBAC)**  
  Restrict CRUD operations so only admins can create events, manage participants, and update scores.

- 📊 **CSV Export Leaderboard**  
  Allow exporting leaderboard data into CSV format for reporting and offline use.

- 🔍 **Search & Pagination**  
  Implement search for participants/events and pagination for handling large datasets efficiently.

- 🏅 **Certificate Generator for Winners**  
  Auto-generate certificates (PDF) for top-ranked participants with event name and rank.
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
