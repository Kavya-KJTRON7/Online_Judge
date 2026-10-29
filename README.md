# AlgoUni Online Judge — Scalable Competitive Programming Platform

A full-stack Online Judge platform built with the **MERN** stack, featuring a secure **Docker containerized execution sandbox** for evaluating C++ submissions and an asynchronous **RabbitMQ** task queue architecture.

---

## Key Features

- **Problem Management (CRUD):**
  - Create, view, update, and delete coding problems with difficulty levels (Easy, Medium, Hard), tags, and custom test cases.
  - Role-based authorization: Public problem browsing; admin-restricted problem creation and deletion.

- **Isolated Docker Sandbox Execution:**
  - C++ solutions are compiled and executed inside disposable, lightweight Linux containers (`gcc:latest`).
  - **Network Isolation:** `--network none` flag blocks unauthorized network requests or malicious calls.
  - **Resource Capping:** Capped memory (`--memory=256m`) and CPU (`--cpus=1`) to prevent denial-of-service and infinite loops.
  - **Automatic Cleanup:** `--rm` ensures containers are destroyed immediately upon task completion.
  - **Strict Verdict Detection:** Handles `Accepted`, `Wrong Answer`, `Time Limit Exceeded (TLE)`, `Compilation Error (CE)`, and `Runtime Error (RTE)`.

- **Asynchronous Task Queue (RabbitMQ):**
  - Submissions are queued via an AMQP message broker to decouple HTTP ingestion from heavy compiler workloads.
  - Worker concurrency control (`prefetch(1)`) prevents server starvation and guarantees fair resource distribution during contest submission spikes.

- **Authentication & Security:**
  - Password hashing with SHA-256 and session tracking in MongoDB.
  - Dual-token flow: Short-lived JWT `accessToken` (15m) + secure rotating `refreshToken` cookie.
  - Role-Based Access Control (RBAC): `authenticate` and `authorizeRoles("admin")` middleware.

- **Interactive Frontend (React + Vite):**
  - Dark-mode user interface.
  - **Monaco Code Editor:** Embedded VS Code editor with C++ syntax highlighting, auto-indentation, and dark theme.
  - Real-time submission evaluation and execution time benchmarking.

---

## System Architecture

```
[ React Client (Monaco Editor) ]
               │
               │ HTTP POST /api/submissions (with JWT Bearer Token)
               ▼
[ Express API Server (Node.js) ]
               │
               ├── (Option A: Direct Execution) ──► [ Docker Sandbox (gcc:latest) ]
               │                                            │
               └── (Option B: Async Queue)                  ▼
                        │                      [ Compiles & Evaluates Test Cases ]
                        ▼                                   │
               [ RabbitMQ Queue ]                           ▼
                        │                        [ MongoDB Database ]
                        ▼                     (Saves Verdict & Execution Time)
               [ Background Worker ]
```

---

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, `@monaco-editor/react`
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Execution & Sandboxing:** Docker Desktop (`gcc:latest`)
- **Queue / Broker:** RabbitMQ (`amqplib`)
- **Authentication:** JSON Web Tokens (JWT), Cookies, Crypto

---

## Project Structure

```
Algouni_MERN_Proj/
├── client/                     # Frontend React + Vite application
│   ├── src/
│   │   ├── api.js              # Axios instance with automatic JWT interceptor
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── ProblemList.jsx     # Coding problems directory
│   │   ├── ProblemDetail.jsx   # Split workspace with Monaco Editor
│   │   ├── Login.jsx           # Authentication interface
│   │   ├── App.jsx             # React Router route configuration
│   │   └── main.jsx            # React root mount
│   └── package.json
│
├── config/                     # Environment and database setup
│   ├── config.js
│   └── database.js
│
├── controllers/                # Request handlers and business logic
│   ├── auth.controller.js
│   ├── problem.controller.js
│   └── submission.controller.js
│
├── middleware/                 # Route guards
│   └── auth.middleware.js      # authenticate & authorizeRoles
│
├── models/                     # Mongoose data schemas
│   ├── user.model.js
│   ├── session.model.js
│   ├── problem.model.js
│   └── submission.model.js
│
├── routes/                     # Express REST API routes
│   ├── auth.routes.js
│   ├── problem.routes.js
│   └── submission.routes.js
│
├── services/                   # Execution engine and message broker
│   ├── judge.service.js        # Docker C++ compilation and test runner
│   └── mq.service.js           # RabbitMQ producer and consumer
│
├── src/
│   └── app.js                  # Express middleware & router assembly
├── server.js                   # Main application entry point
└── package.json
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running for the code execution sandbox)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Kavya-KJTRON7/Online_Judge.git
cd Online_Judge
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_DB=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/algouni?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
RABBITMQ_URL=amqp://localhost:5672
```

### 3. Pull Docker Images & Start RabbitMQ
```bash
# Pull GCC image for C++ sandboxing
docker pull gcc:latest

# Start RabbitMQ container with management dashboard
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### 4. Start the Backend Server
```bash
npm install
npm run dev
```

### 5. Start the React Frontend
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login and receive JWT access token
- `GET  /api/auth/get-me` — Retrieve current authenticated user
- `GET  /api/auth/refresh` — Refresh access token using cookie
- `GET  /api/auth/logout` — Revoke active session

### Problems
- `GET    /api/problems` — List all problems (Public)
- `GET    /api/problems/:id` — Retrieve problem details (Public)
- `POST   /api/problems` — Create new problem *(Admin only)*
- `PUT    /api/problems/:id` — Update problem *(Admin only)*
- `DELETE /api/problems/:id` — Delete problem *(Admin only)*

### Submissions
- `POST /api/submissions` — Submit code for Docker evaluation *(Authenticated)*
- `GET  /api/submissions/:id` — Retrieve submission status and verdict

---

## License
This project is open-source and available under the [ISC License](LICENSE).
