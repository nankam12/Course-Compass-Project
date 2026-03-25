# Course Resource Hub

A full-stack web application that helps university students find and share academic support resources for specific courses.

## Features

- **User Authentication** — Register and log in with JWT-based sessions
- **Course Browser** — Search and filter courses by department or keyword
- **Course Detail Pages** — View professor info, TAs, office hours, and semester details
- **Resource Sharing** — Submit videos, notes, textbooks, websites, and practice problems
- **Voting System** — Upvote helpful resources so the best ones rise to the top
- **Student Tips** — Leave comments with course advice to help fellow students

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Vite |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |

## Project Structure

```
Course Compass Project/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Route-level page components
│   │   └── services/    # Axios API service
│   └── package.json
├── server/              # Express backend API
│   ├── config/          # Database connection
│   ├── controllers/     # Route handler logic
│   ├── middleware/       # JWT auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── seed.js          # Sample data seeder
│   └── server.js        # App entry point
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Set up the server

```bash
cd server
npm install
```

Copy the example environment file and fill in your values:

```bash
copy .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course_resource_hub
JWT_SECRET=replace_with_a_long_random_secret_string
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 2. Seed the database (optional)

Populate the database with sample courses:

```bash
cd server
npm run seed
```

### 3. Set up the client

```bash
cd client
npm install
```

### 4. Run the application

In one terminal, start the backend:

```bash
cd server
npm run dev
```

In another terminal, start the frontend:

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Courses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List courses (supports `?search=`, `?department=`, `?page=`) |
| GET | `/api/courses/departments` | List all departments |
| GET | `/api/courses/:id` | Get a single course |
| POST | `/api/courses` | Create a course (authenticated) |

### Resources
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses/:courseId/resources` | Get resources for a course |
| POST | `/api/courses/:courseId/resources` | Add a resource (authenticated) |
| POST | `/api/resources/:id/vote` | Toggle upvote (authenticated) |
| DELETE | `/api/resources/:id` | Delete a resource (owner or admin) |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses/:courseId/comments` | Get comments for a course |
| POST | `/api/courses/:courseId/comments` | Add a comment (authenticated) |
| DELETE | `/api/comments/:id` | Delete a comment (author or admin) |
