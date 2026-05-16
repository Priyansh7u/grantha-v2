# 📚 Grantha v2 — Advanced Library Management System

Full-stack library management with React + Vite + Express.

---

## 🚀 Quick Start

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:5000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## ✨ Features

| Page | Features |
|------|----------|
| **Dashboard** | Live stats, monthly bar chart, genre distribution, due-soon alerts, top books, recent activity |
| **Books** | Grid + list view toggle, search, genre/sort/availability filters, star ratings, tags, cover colors, full CRUD |
| **Members** | Member profiles with history, membership types (Standard/Premium/Student), borrow limits, fine tracking |
| **Transactions** | Issue/Return/Renew, status tabs with counts, overdue highlighting, fine calculation |
| **Reservations** | Reserve books for members, 7-day expiry, status tracking |
| **Fines** | Fine summary cards, pay/pending filter, mark-as-paid |
| **Analytics** | Monthly trend chart, donut chart (membership), genre popularity, top members, collection health |
| **Notifications** | Real-time sidebar panel, read/unread, mark all read |

## 📁 Structure

```
library-v2/
├── backend/
│   ├── src/index.js       # Express API + all routes + seed data
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx        # Nav + notification panel
    │   │   └── Sidebar.css
    │   ├── hooks/
    │   │   └── useToast.js        # Toast notification hook
    │   ├── pages/
    │   │   ├── Dashboard.jsx/css
    │   │   ├── Books.jsx/css
    │   │   ├── Members.jsx/css
    │   │   ├── Transactions.jsx/css
    │   │   ├── Reservations.jsx
    │   │   ├── Fines.jsx/css
    │   │   └── Analytics.jsx/css
    │   ├── services/api.js        # All Axios calls
    │   ├── styles/globals.css     # Design system
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── vite.config.js             # Proxy → port 5000
```

## 🔗 API Endpoints

```
GET  /api/dashboard
GET  /api/analytics
GET  /api/search?q=

GET/POST/PUT/DELETE  /api/books
GET/POST/PUT/DELETE  /api/members
GET/POST             /api/transactions
POST /api/transactions/issue
POST /api/transactions/return/:id
POST /api/transactions/renew/:id

GET/POST/DELETE  /api/reservations
GET              /api/fines
POST             /api/fines/pay/:id

GET  /api/notifications
PUT  /api/notifications/read-all
GET  /api/genres
```
