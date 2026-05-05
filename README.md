# 551 Final Project: Event Management System

An Event Management web application built for DSCI 551 Spring 2026.
The project combines a React + Vite frontend, an Express API server, and a PostgreSQL database.

## Overview

This system supports event browsing, ticket availability queries, venue discovery and booking workflows, and analytics endpoints over seeded event data.

## Tech Stack

- Frontend: React, Vite, TypeScript
- Backend: Node.js, Express
- Database: PostgreSQL
- Database Driver: pg

## Prerequisites

Before running the project, make sure the following are installed:

- Node.js (required)
  - Install from https://nodejs.org/
  - Recommended: Node.js 18+ (LTS)
- npm (included with Node.js)
- PostgreSQL 13+
- psql command line client (usually installed with PostgreSQL)

## Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/99atse/551-final-project.git
   cd 551-final-project
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create and configure environment variables (OPTIONAL):

   Create a `.env` file in the project root with:

   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PORT=5432
   DB_PASSWORD=your_password
   DB_NAME=event_db
   PORT=3000
   ```

   Notes:

   - If `.env` is not provided, the server falls back to defaults in `main.js`.
   - Update the values so they match your local PostgreSQL configuration.

## Database Setup

For the database, set it up in a database management tool for PostgreSQL databases, such as DBeaver, PGAdmin 4, or follow the commands below in your terminal.

1. Create the database:

   ```bash
   createdb event_db
   ```
2. Apply schema:

   ```bash
   psql -d event_db -f database/schema.sql
   ```
3. Seed data:

   ```bash
   psql -d event_db -f database/seed.sql
   ```
4. Create analytics views:

   ```bash
   psql -d event_db -f database/views.sql
   ```

## Running the App

Run the following command in the terminal to start the backend API and frontend dev server together:

```bash
npm run dev
```

Default URLs:

- Frontend (Vite): http://localhost:5173
- Backend (Express API): http://localhost:3000

## Available Scripts

- `npm run dev`: Starts API server and Vite dev server concurrently
- `npm run start`: Starts only the API server
- `npm run build`: Builds the frontend for production

## Project Structure

```text
.
|- database/
|  |- gist_use_case.sql
|  |- mvcc_user_1.sql
|  |- mvcc_user_2.sql
|  |- schema.sql
|  |- seed.sql
|  \- views.sql
|- src/
|  |- app/
|  |  |- components/
|  |  |- App.tsx
|  |  \- routes.ts
|  |- styles/
|  \- main.tsx
|- main.js
|- package.json
|- postcss.config.mjs
|- README.md
\- vite.config.ts
```

## Authors

- Danielle Louie
- Anika Tse

## License

MIT License. See `LICENSE` for details.
