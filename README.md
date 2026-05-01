# Team Task Manager

A production-ready full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) featuring role-based access control, JWT authentication, and a modern dark-themed UI.

## Features
- **Authentication**: JWT-based secure login and registration with bcrypt password hashing.
- **Role-Based Access**: 
  - Admin: Can create/delete projects, manage team members, and manage any tasks.
  - Member: Can view assigned projects and update task status.
- **Task Management**: Kanban-style task board with status updates (To Do, In Progress, Done), priority levels, and due dates.
- **Dashboard**: Overview of tasks with overdue highlighting and quick stats.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, React Router, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas via Mongoose.

## Local Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account and cluster

### 1. Database Configuration
Create an `.env` file in the `backend` directory based on the `.env.example` (or the provided `.env`). Update the `MONGO_URI` with your MongoDB Atlas connection string.

`backend/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/team-task-manager?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey12345
```

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm run dev` (or `node index.js`)
   - The server will run on http://localhost:5000.

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Create an `.env` file in `frontend` with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Install dependencies: `npm install`
4. Start the Vite dev server: `npm run dev`
   - The app will run on http://localhost:5173.

## Deployment Guidelines

### Backend (Render)
1. Push the repository to GitHub.
2. In Render, create a new "Web Service" and connect your repository.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `node index.js`
6. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).
7. Deploy.

### Frontend (Vercel)
1. In Vercel, import your GitHub repository.
2. Set the Root Directory to `frontend`.
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable: `VITE_API_URL` (Set this to your Render backend URL, e.g., `https://your-backend.onrender.com/api`).
7. Deploy.
