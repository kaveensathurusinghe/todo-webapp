# Todo Webapp

A full-stack web application for managing personal tasks. Users can register, log in, and manage their own todo list with support for searching, filtering, and sorting.

---

## Table of Contents

- [About](#about)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup and Running](#setup-and-running)
- [Project Structure](#project-structure)
- [Concepts Used](#concepts-used)

---

## About

This is a full-stack todo application with a Laravel backend and a Next.js frontend. The backend handles all the data and authentication, while the frontend provides the user interface.

---

## Screenshots

**Dashboard — All Tasks (sorted by Created)**

![Dashboard showing all tasks sorted by created date](screenshots/Screenshot%202026-07-20%20094412.png)

**Dashboard — All Tasks (sorted by Due Date)**

![Dashboard showing all tasks sorted by due date](screenshots/Screenshot%202026-07-20%20094431.png)

**Dashboard — Completed Tasks Filter**

![Dashboard filtered to show only completed tasks](screenshots/Screenshot%202026-07-20%20094438.png)

**New Todo Modal**

![Modal dialog for creating a new todo](screenshots/Screenshot%202026-07-20%20094453.png)

---

## Tech Stack

**Backend**
- PHP 8.3 and Laravel 13
- Laravel Sanctum for authentication
- PostgreSQL database

**Frontend**
- Next.js 16 with React 19
- Axios for API requests
- Tailwind CSS for styling

---

## Features

- User registration and login
- Create, edit, and delete todos
- Mark todos as complete or pending
- Search todos by title or description
- Filter by status and sort by date

---

## Prerequisites

Make sure these are installed on your machine before starting:

- PHP 8.3 or higher
- Composer
- Node.js 20 or higher
- PostgreSQL
- Git

---

## Setup and Running

### 1. Clone the repository

```bash
git clone https://github.com/your-username/todo-webapp.git
cd todo-webapp
```

---

### 2. Set up the backend

```bash
cd backend
```

Install dependencies:

```bash
composer install
```

Copy the environment file:

```bash
cp .env.example .env
```

Open `.env` and update the database section with your PostgreSQL credentials:

```env
DB_DATABASE=todo_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Generate the application key:

```bash
php artisan key:generate
```

Create the database in PostgreSQL:

```sql
CREATE DATABASE todo_db;
```

Run the migrations to create the tables:

```bash
php artisan migrate
```

---

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Copy the environment file:

```bash
cp .env.example .env.local
```

The default value in `.env.local` should already be correct:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

### 4. Run the application

You need two terminals open at the same time.

**Terminal 1 — Backend:**

```bash
cd backend
php artisan serve
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Then open your browser and go to: `http://localhost:3000`

---

## Project Structure

```
todo-webapp/
├── backend/              # Laravel REST API
│   ├── app/
│   │   ├── Controllers/  # Handle requests (Auth, Todo)
│   │   ├── Models/       # User and Todo models
│   │   └── Requests/     # Input validation
│   ├── database/
│   │   └── migrations/   # Database table definitions
│   └── routes/
│       └── api.php       # API endpoints
│
└── frontend/             # Next.js application
    ├── app/              # Pages (Dashboard, Login, Register)
    ├── components/       # Reusable UI components
    ├── context/          # Global authentication state
    └── lib/
        └── api.js        # All API calls in one place
```

---

## Concepts Used

**REST API**
The backend exposes a set of endpoints that the frontend calls to get or save data. Each action (create, read, update, delete) uses the appropriate HTTP method.

**Token-based Authentication**
When a user logs in, the server returns a token. The frontend stores this token and sends it with every request to prove the user is logged in.

**Form Validation**
All data sent to the backend is validated before being saved, ensuring required fields are present and in the correct format.

**Authorization**
Users can only access their own todos. The backend checks ownership before allowing any update or delete action.

**React Context**
The logged-in user's information is stored in a shared context so any page or component can access it without passing it manually through props.

**Eloquent ORM**
The backend uses Laravel's built-in ORM to interact with the database using simple PHP methods instead of writing raw SQL.

**Database Migrations**
The database schema is defined in migration files, making it easy to set up the same tables on any machine by running a single command.
