# 📟 POS System

A web-based Point of Sale (POS) system built with **React**, **Express**, and **MySQL**, designed for fast and scalable transaction management. It supports deep-linkable modals, reusable logic, persistent filters, and efficient client/server communication optimized for Raspberry Pi hosting.

---

## 🚀 Features

- Full-featured POS interface
- Responsive and modal-first layout
- Deep-linkable, stackable modals
- Persistent filters via cookies & URL params
- Smart fuzzy & exact search across multiple fields
- Payment and refund tracking via normalized tables
- Auth with session management (`express-session`)
- Reusable API helpers and validation logic
- Lazy rendering for large tables
- Route protection with middleware
- Configurable for both dev and production environments

---

## 🧱 Tech Stack

| Frontend         | Backend         | Database       | Deployment              |
| ---------------- | --------------- | -------------- | ----------------------- |
| React (Vite)     | Express.js      | MySQL          | PM2 on Raspberry Pi     |
| Zustand          | REST API        | mysql2/promise | Ubuntu Server           |
| React Router DOM | express-session |                | WireGuard VPN & Pi-hole |

---

## 📂 Project Structure

```bash
/
├── client/                  # Frontend (React)
│   ├── components/
│   ├── pages/
│   ├── modals/
│   ├── hooks/
│   ├── helpers/             # apiHelper, modal logic, etc.
│   └── App.jsx
├── server/                  # Backend (Express)
│   ├── controllers/
│   ├── routes/
│   ├── services/            # Business logic
│   ├── middleware/          # Auth, error handling, etc.
│   └── db.config.js
├── .env
├── package.json
└── README.md
```

---

## 🧹 Key Concepts

### 🔗 Deep-Linkable Modals

Modals open via URL (`/product/123?modal=edit`) and can stack. Closing a modal reverts the previous one without re-rendering the page.

### 🔍 Smart Search

- Exact match for fields like phone numbers or item numbers
- Fuzzy search for product names and descriptions

### 🧠 Reusable Logic

- API requests via `apiHelper`
- Shared validation logic for multiple modal types
- Central error handling via `ErrorModal`

### 🗝 Filters

- Stored in both URL and cookies
- Auto-loaded on page open
- Can persist between sessions

---

## ⚙️ Setup Instructions

### 💽 Local Development

```bash
# 1. Clone the repo
git clone https://github.com/your-username/your-pos-project.git
cd your-pos-project

# 2. Install dependencies
npm install && cd client && npm install

# 3. Create a .env file
# Example:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=pos
SESSION_SECRET=yourSecret

# 4. Start backend (in root)
npm run dev

# 5. Start frontend (in /client)
npm run dev
```

---

## 🛠️ Environment Config

Separate environments for **development** and **production** with isolated databases. PM2 handles process management.

---

## 🔐 Authentication

- Session-based auth with `express-session`
- Auth status is included in every API response (`authentication: true/false`)
- Auto-redirects to `/login` if unauthenticated

---

## 📦 Database Schema

The database schema is defined in [`/sql/schema.sql`](./sql/schema.sql).  
To import the structure:

```bash
mysql -u root -p db_name < sql/schema.sql
```

---

## 🤪 Testing & Validation

- Frontend validation using shared validation logic
- Confirmation modals before critical actions (e.g., voiding a transaction)
- Backend validates request data in services/controllers

---

## 📦 Deployment

- Hosted on **Raspberry Pi 5**
- Reverse proxy via **NGINX**
- Accessible via VPN (WireGuard)
- Uses **Pi-hole + Cloudflare DNS**

---

## 📊 Future Improvements

- [ ] Add offline support for intermittent connectivity
- [ ] Enable print receipts
- [ ] Add user permissions/roles
- [ ] Export sales reports
- [ ] More tests!

---

## 🙌 Acknowledgements

Built with ❤️, coffee, and lots of console logs.
