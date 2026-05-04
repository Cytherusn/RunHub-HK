# RunHub HK - Project Structure & Usage

RunHub HK is a modern community-driven platform for runners in Hong Kong, featuring race hosting, community feeds, and personal profiles.

## 📂 Directory Structure

### `client/`
Contains the frontend React application built with Vite and Tailwind CSS.
- `public/`: Static assets like icons and the web manifest.
- `src/components/`: Reusable UI components (shadcn/ui).
- `src/context/`: React context providers (e.g., AuthContext).
- `src/hooks/`: Custom React hooks.
- `src/pages/`: Main application pages including [landing.tsx](file:///c:/Users/user/Desktop/RunHub-HK/client/src/pages/landing.tsx), [community-feed.tsx](file:///c:/Users/user/Desktop/RunHub-HK/client/src/pages/community-feed.tsx), and the new [profile.tsx](file:///c:/Users/user/Desktop/RunHub-HK/client/src/pages/profile.tsx).
- `src/App.tsx`: Main application router and layout.

### `server/`
Contains the Express.js backend.
- `auth.ts`: Passport.js authentication configuration.
- `storage.ts`: Database connection and storage interface (using SQLite).
- `routes.ts` & `community-routes.ts`: API route definitions.
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
- `.env`: Environment variables (Port, Secrets).
- `data.db`: SQLite database file.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- **Windows Users**: Ensure [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) are installed for `better-sqlite3` native compilation.

### Installation
```bash
npm install
```

### Running Locally
To start the development server (both frontend and backend):
```bash
npm run dev
```
The app will be available at `http://localhost:5000`.

### Production Build
```bash
npm run build
npm start
```

---

## 🔒 Security & Optimization
- **Helmet**: Integrated for secure HTTP headers.
- **Node.js Native Env**: Uses `--env-file` (Node v20+) for environment variable management.
- **Dependencies**: Optimized to remove unused packages and minimize bundle size.

## 🛠 Database
The project uses **SQLite** for local development. Tables are automatically initialized and seeded when the server starts via [index.ts](file:///c:/Users/user/Desktop/RunHub-HK/server/index.ts).
