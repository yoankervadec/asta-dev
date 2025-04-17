# Asta POS

A web-based Point of Sale (POS) system built with **React**, **Express**, and **MySQL**, designed for fast and scalable transaction and inventory management. It supports deep-linkable modals, reusable logic, persistent filters, and efficient client/server communication.

---

## Features

- Full-featured POS interface
- Responsive and modal-first layout
- Deep-linkable, stackable modals
- Persistent filters via cookies & URL params
- Smart fuzzy & exact search across multiple fields
- Payment and refund tracking via normalized tables
- Auth with session management (`express-session`)
- Reusable API helpers and validation logic
- Route protection with middleware
- Configurable for both dev and production environments with minimal downtime during deployment

---

## Tech Stack

| Frontend              | Backend         | Database       | Deployment         |
| --------------------- | --------------- | -------------- | ------------------ |
| React (Vite)          | Express.js      | MySQL          | PM2 on ThinkCenter |
| Zustand (modal state) | REST API        | mysql2/promise | Ubuntu Server      |
| React Router DOM      | express-session |                |                    |

---

## Project Structure

```bash
/
├── client/
│   ├── src/
│   │   ├── api/                  # Helper functions for API calls
│   │   ├── assets/               # CSS
│   │   ├── components/           # Includes Modals but not limited to
│   │   ├── hooks/                # Reusable hooks
│   │   ├── pages/                # Main pages
│   │   ├── store/                # Store for modals
│   │   ├── utils/                # Reusable search
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── back-end/
│   │   ├── configs/                # Database connections
│   │   ├── controllers/            # Extract body + params
│   │   ├── mapping/                # Map to table + column and basic validation
│   │   ├── middleware/             # Just authentication check
│   │   ├── models/                 # Database interaction
│   │   ├── routes/
│   │   ├── services/               # Business logic
│   │   ├── templates/              # HTML templates used for invoices, sales orders...
│   │   └── utils/                  # Reusable for standard reponses, error formatting...
│   ├── jobs/                       # Jobs for allocating reservations, updating order status...
│   │   ├── schedulers/
│   │   ├── handleReservations.js
│   │   └── ...
│   ├── .env
│   ├── index.js
│   └── package.json
├── sql/
│   └── schema.sql
└── README.md
```

---

## Key Concepts

## Deep-Linkable Modals

Modals open via base64 encoded URL and can stack. Closing a modal reverts the previous one without re-rendering the page.

- Exemple URL:\
  `/customer-orders?posted=false&quote=false&modal=eyJ0eXBlIjoiY3VzdG9tZXJPcmRlckNhcmQiLCJvcmRlck5vIjoxMTd9`
- Decoded:\
  `...&modal={"type":"customerOrderCard","orderNo":117}`

## Smart Search

- Exact match for fields like phone numbers or item numbers
- Fuzzy search for product and client names, descriptions, etc

## Reusable Logic

- API requests via `apiHelper` and `fetchHelper` / `postHelper`
- Shared validation logic for multiple modal types
- Central client-side error handling via `ErrorModal` handled with `apiHelper`

## Filters

- Stored in both URL and cookies
- Auto-loaded on page open
- Can persist between sessions

---

## Setup Instructions

### 1. Recommended Project Structure

```bash
/
├── dev/
│   ├── client/
│   └── server/
├── production/
│   ├── client/
│   └── server/
├── scripts/
└── ecosystem.config.js
```

---

### 2. Initial Setup

```bash
# Create required directories
mkdir dev production scripts

# Clone the repo into /dev
cd dev
git clone https://github.com/yoankervadec/asta-dev.git

# Install dependencies
cd client && npm install
cd ../server && npm install
```

---

### 3. Environment Variables

Create a `.env` file inside `/dev/server` and `/production/server`:

```bash
# Example .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_db_name
SESSION_SECRET=yourSecret
```

---

### 4. Define PM2 Config (`ecosystem.config.js`)

At the root of your project:

```js
module.exports = {
  apps: [
    {
      name: "asta-client-dev",
      script: "npm",
      args: "run dev",
      cwd: "./dev/client",
      watch: false,
      env: {
        NODE_ENV: "development",
        VITE_PORT: 3300,
        VITE_BACKEND: "http://localhost:8080",
      },
    },
    {
      name: "asta-server-dev",
      script: "npm",
      args: "run dev",
      cwd: "./dev/server",
      watch: true,
      env: {
        NODE_ENV: "development",
        PORT: 8080,
        CORS_ORIGINS: "http://localhost:3300",
      },
    },
    {
      name: "asta-client-prod",
      script: "npm",
      args: "run preview",
      cwd: "./production/client",
      watch: false,
      env: {
        NODE_ENV: "production",
        VITE_PORT: 4173,
        VITE_BACKEND: "http://localhost:8081",
      },
    },
    {
      name: "asta-server-prod",
      script: "npm",
      args: "run start",
      cwd: "./production/server",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 8081,
        CORS_ORIGINS: "http://localhost:4173",
      },
    },
  ],
};
```

---

### 5. Start Development or Production Environment

> **Note:** Make sure to build the production client before starting production mode.

```bash
# For development
pm2 start ecosystem.config.js --only asta-client-dev,asta-server-dev

# For production (after running `npm run build` in /production/client)
pm2 start ecosystem.config.js --only asta-client-prod,asta-server-prod
```

---

### 6. Deployment Script (`/scripts/deploy.sh`)

For pulling and deploying latest production changes from remote:

```bash
set -e

echo "Stopping PM2 production processes..."
pm2 stop asta-server-prod
pm2 stop asta-client-prod

echo "Switching to production project directory..."
cd ~/apps/asta/production

git reset --hard HEAD
git clean -fd -e .env
git pull origin main

echo "Installing new dependencies and building client..."
cd client
npm install
npm run build
cd ../server
npm install

echo "Restarting PM2 production processes..."
cd ../
pm2 start asta-server-prod
pm2 start asta-client-prod

echo "Deployment from remote complete!"
```

---

## Environment Config

- Separate **development** and **production** environments
- Each uses its own database
- PM2 handles process management, restarts, and environment-specific setup

---

## Authentication

- Session-based auth using `express-session`
- All API responses include `authentication: true/false`
- Auto-redirects to `/login` on the frontend if not authenticated

---

## Database Schema

Schema is defined in [`/sql/schema.sql`](./sql/schema.sql)

To import:

```bash
mysql -u root -p db_name < sql/schema.sql
```

---

## Testing & Validation

- Frontend validation using shared validation logic
- Confirmation modals before critical actions (e.g., voiding a transaction) triggered by API response
- Backend validates request data in services/controllers

---

## Future Improvements

- [ ] Add offline support for intermittent connectivity during inventory sessions
- [ ] Enable print receipts (PDF)
- [ ] Add user permissions/roles

---
