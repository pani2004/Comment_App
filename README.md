# Comment App

A full-stack comment application built with React (Vite), NestJS, PostgreSQL, Prisma, and Docker Compose. It supports user authentication, nested comments, notifications, and a modern UI with Tailwind CSS.

## Features
- User registration and login (JWT-based authentication)
- Post comments and replies (nested comments)
- Edit/delete/restore comments (with time limits)
- Notifications for replies
- PgAdmin for database management
- Fully containerized with Docker Compose

## Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose installed

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/pani2004/Comment_App
   cd Comment_App
   ```

2. **Set up environment variables:**
   - Edit the `.env` file in the project root if you want to change default credentials or secrets.
   - Example `.env`:
     ```env
     POSTGRES_USER=
     POSTGRES_PASSWORD=
     POSTGRES_DB=
     DATABASE_URL=
     JWT_SECRET=supersecretkey
     JWT_EXPIRES_IN=1h
     PGADMIN_DEFAULT_EMAIL=
     PGADMIN_DEFAULT_PASSWORD=
     ```

3. **Start all services with Docker Compose:**
   ```sh
   docker-compose up -d --build
   ```
   This will build and start:
   - Frontend (React, Vite) at [http://localhost:5173](http://localhost:5173)
   - Backend (NestJS) at [http://localhost:5000](http://localhost:5000)
   - PostgreSQL database
   - PgAdmin at [http://localhost:8081](http://localhost:8081) (login with the email and password from `.env`)

4. **Access the app:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.
   - Register a new user and start commenting!

## Useful Commands
- Stop all containers:
  ```sh
  docker-compose down
  ```
- View logs for a service:
  ```sh
  docker-compose logs <service>
  # e.g. docker-compose logs backend
  ```
- Rebuild a specific service:
  ```sh
  docker-compose up -d --build frontend
  ```

## Folder Structure
- `frontend/` - React + Vite app
- `backend/`  - NestJS API, Prisma, and business logic
- `docker-compose.yml` - Multi-service orchestration
- `.env` - Environment variables for all services

## Notes
- Make sure ports 5173, 5000, 5432, and 8081 are free on your machine.
- For development, code changes in `frontend` and `backend` will hot-reload in Docker.
- PgAdmin is optional and for database inspection/management.

---


