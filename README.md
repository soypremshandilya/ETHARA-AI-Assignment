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

## Deployment Guidelines (Render)

This application is configured to be deployed as a single Web Service on Render, meaning the Node.js backend will serve the compiled React frontend.

1. Push the entire repository to GitHub.
2. Log into [Render](https://render.com/) and create a new **"Web Service"**.
3. Connect your GitHub repository.
4. **Important Settings for Render:**
   - **Root Directory**: (leave this blank)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Click **Advanced** and add the following **Environment Variables**:
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (Any long secure random string, e.g., `supersecretkey123`)
   - `NODE_ENV`: `production`
6. Click **Create Web Service**.

Render will now install all dependencies, build the React frontend, and start the Node server automatically!
