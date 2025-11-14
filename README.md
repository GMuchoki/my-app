# Task Planner

## Project Overview

Task Planner is a full-stack web application designed to help users manage their tasks efficiently. It consists of a backend API server and a React-based frontend client.

The backend provides secure user authentication and task management APIs, while the frontend offers a responsive and user-friendly interface.

## Project Structure

### Backend Structure
```
backend/
├── config/               # Configuration files
├── controllers/          # Route controllers
│   ├── authControllers.js
│   ├── todoControllers.js
│   └── userControllers.js
├── db/                   # Database configuration
│   └── database.js
├── middleware/           # Custom middleware
│   ├── authMiddleware.js
│   └── rateLimitMiddleware.js
├── models/               # Database models
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── todoProtectedRoutes.js
│   └── userProtectedRoutes.js
├── utils/                # Utility functions
│   └── validator.js
├── .env                  # Environment variables
├── app.js                # Express app configuration
├── package.json
└── server.js             # Server entry point
```

### Frontend Structure
```
frontend/
├── public/               # Static files
└── src/
    ├── components/       # Reusable components
    │   ├── Navbar.jsx
    │   ├── Navbar.css
    │   └── ProtectedRoute.jsx
    ├── contexts/         # React contexts
    │   └── AuthContext.jsx
    ├── pages/            # Page components
    │   ├── Dashboard.jsx
    │   ├── Login.jsx
    │   ├── Profile.jsx
    │   ├── Settings.jsx
    │   ├── Signup.jsx
    │   ├── Todos.jsx
    │   └── *.css         # Page-specific styles
    ├── services/         # API service modules
    │   ├── api.js
    │   ├── authService.js
    │   ├── todoService.js
    │   └── userService.js
    ├── utils/            # Utility functions
    │   └── validation.js
    ├── App.jsx           # Main App component
    ├── main.jsx          # Application entry point
    ├── index.css         # Global styles
    └── style.css         # Additional global styles
```

---

## Backend

### Description

The backend is built with Node.js and Express, using SQLite as the database. It handles user authentication, authorization, and CRUD operations for tasks.

### Features
- User registration and login with JWT authentication
- Password hashing with bcryptjs
- Rate limiting to prevent abuse
- Environment variable configuration with dotenv
- RESTful API endpoints for tasks and user management

### Technologies
- Node.js
- Express
- SQLite (better-sqlite3)
- bcryptjs
- jsonwebtoken
- dotenv
- express-rate-limit

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend server will start on http://localhost:3000 by default.

### API Endpoints

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive a JWT token
- `GET /todos` - Get all todos for the authenticated user
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo by ID
- `DELETE /todos/:id` - Delete a todo by ID
- `GET /profile` - Get user profile information

---

## Frontend

### Description

The frontend is a React application built with Vite. It provides a seamless user experience with protected routes and state management.

### Features
- User authentication and protected routes
- Task management UI
- Profile and settings pages
- Responsive design

### Technologies
- React
- React Router DOM
- Axios
- Vite

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173.

---

## Usage

1. Register a new user through the signup page.
2. Login with your credentials.
3. Access the dashboard to view and manage your tasks.
4. Use the todos page to create, update, and delete tasks.
5. Update your profile and settings as needed.

---

## Environment Variables

### Backend

- `PORT` - Port on which the backend server runs (default: 3000)
- `JWT_SECRET` - Secret key for signing JSON Web Tokens

---

## Scripts

### Backend

- `npm run dev` - Start backend server with nodemon for development
- `npm start` - Start backend server

### Frontend

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build

---

## License

ISC

---

This README was generated based on the current backend and frontend setup.
