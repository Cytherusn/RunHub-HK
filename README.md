# RunHub HK - Project Structure & Usage

This document provides an overview of the project structure and the purpose of each key file and directory.

## 📂 Directory Structure

### `client/`
Contains the frontend React application built with Vite and Tailwind CSS.
- `public/`: Static assets like icons and the web manifest.
- `src/components/`: Reusable UI components (shadcn/ui).
- `src/context/`: React context providers (e.g., AuthContext).
- `src/hooks/`: Custom React hooks.
- `src/pages/`: Main application pages (Landing, Login, Dashboard, etc.).
- `src/App.tsx`: Main application router and layout.

### `server/`
Contains the Express.js backend.
- `auth.ts`: Passport.js authentication configuration.
- `storage.ts`: Database connection and storage interface (now using SQLite).
- `routes.ts`: API route definitions.
- `seed.ts` & `community-seed.ts`: Scripts for populating the database with test data.
- `vite.ts`: Vite development server integration for Express.

### `shared/`
Contains code shared between the client and server.
- `schema.ts`: Drizzle ORM database schema definitions (SQLite).

### `script/`
- `build.ts`: Custom build script for the project.

---

## 📄 Key Configuration Files

- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Vite configuration for the frontend and development server.
- `tailwind.config.ts` & `postcss.config.js`: Styling configuration.
- `drizzle.config.ts`: Configuration for Drizzle Kit (database migrations).
- `components.json`: Configuration for shadcn/ui components.
- `.env`: Environment variables (Port, Secrets).
- `data.db`: SQLite database file.

---

## 🚀 Usage

### Development
To start the development server (both frontend and backend):
```bash
npm run dev
```

### Build
To build the project for production:
```bash
npm run build
```

### Database
The project uses **SQLite** for local development. Tables are automatically initialized and seeded when the server starts.
