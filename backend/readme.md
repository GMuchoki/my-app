# 🧠 Backend API - Todo App

A simple and secure backend built with **Node.js**, **Express**, and **SQLite** for user authentication and todo management.

---

## 🚀 Features

* User registration and login with **JWT authentication**
* Passwords hashed securely using **bcryptjs**
* Full CRUD operations for Todos (Create, Read, Update, Delete)
* SQLite database managed via **better-sqlite3**
* Input validation using reusable regex validators
* Middleware-protected routes for authenticated users
* Clean, modular folder structure

---

## 🗂️ Project Structure

```
backend/
├── app.js                  # Main Express app setup
├── server.js               # Starts the server
├── .env                    # Environment variables
├── db/
│   └── database.js         # SQLite setup and schema creation
├── controllers/
│   ├── authController.js   # Handles signup and login
│   └── todoController.js   # Handles CRUD for todos
├── middleware/
│   └── authMiddleware.js   # JWT authentication middleware
├── routes/
│   ├── authRoutes.js       # /api/auth endpoints
│   └── todoRoutes.js       # /api/todos endpoints
└── utils/
    └── validators.js       # Regex and validation helpers
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install express cors bcryptjs jsonwebtoken dotenv better-sqlite3
```

### 3. Create Environment Variables

Create a file named `.env` in the root of the backend folder:

```bash
PORT=4000
JWT_SECRET=<your-secret-key>
```

*(Use a long, random string for `JWT_SECRET`)*

### 4. Run the Server

```bash
node server.js
```

The server will start at:

```
http://localhost:4000
```

---

## 🔐 Authentication Endpoints

### **POST /api/auth/signup**

Registers a new user.

**Body:**

```json
{
  "first_name": "John",
  "middle_name": "M",
  "last_name": "Doe",
  "username": "johndoe",
  "password": "Password@123"
}
```

**Response:**

```json
{
  "message": "User created successfully"
}
```

---

### **POST /api/auth/login**

Authenticates a user and returns a JWT token.

**Body:**

```json
{
  "username": "johndoe",
  "password": "Password@123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "first_name": "John",
    "middle_name": "M",
    "last_name": "Doe",
    "username": "johndoe"
  }
}
```

---

## 📝 Todo Endpoints (Protected)

All todo routes require an **Authorization header**:

```
Authorization: Bearer <jwt_token>
```

### **GET /api/todos**

Returns all todos for the authenticated user.

### **POST /api/todos**

Creates a new todo.

**Body:**

```json
{
  "task": "Learn Express",
  "completed": 0
}
```

### **PUT /api/todos/:id**

Updates an entire todo (task and completed fields).

### **PATCH /api/todos/:id**

Partially updates a todo (only the fields you send).

### **DELETE /api/todos/:id**

Deletes a todo by ID.

---

## ✅ Validators

Defined in `/utils/validators.js`:

* **Password** → At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
* **Username** → 3–20 chars, only letters, numbers, underscores
* **Name** → 2–50 chars, letters, spaces, hyphens

---

## 🧩 Example Flow

1. User signs up → credentials validated and stored securely
2. User logs in → receives JWT token
3. Frontend stores token (e.g., localStorage)
4. Token used for all `/api/todos` requests

---

## 🧰 Technologies Used

* **Node.js** + **Express** – Server framework
* **Better-SQLite3** – Lightweight local database
* **BcryptJS** – Password hashing
* **JWT** – Authentication
* **CORS** – Cross-origin requests
* **Dotenv** – Environment variables

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

### 💡 Next Steps

* Connect with the frontend React app
* Add user profile or password reset endpoints
* Implement database migrations for production
