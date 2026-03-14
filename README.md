# ProjectManager

A full-stack project management web application built with a modern React + Node.js stack. It supports workspaces, projects, tasks, team collaboration, and real-time activity tracking — designed to demonstrate end-to-end full-stack engineering including authentication, security, data visualisation, and responsive UI.

---

## Live Demo

[project-manager5.vercel.app](https://project-manager5.vercel.app)

---

## Features

### Authentication & Security
- Email/password registration with **email verification** via SendGrid
- JWT-based login with 7-day token expiry
- Forgot password / reset password flow via secure time-limited tokens
- Bot detection, rate limiting, and disposable email blocking via **Arcjet**
- Protected routes with automatic redirect on token expiry

### Workspaces
- Create multiple colour-coded workspaces
- Invite members by email (sends a verification link) or via a shareable invite link
- Role-based membership: `owner`, `admin`, `member`, `viewer`
- Workspace-level member directory with list and card views

### Projects
- Create projects with title, description, status, start/due dates, and tags
- Assign workspace members to projects with per-member roles (`manager`, `contributor`, `viewer`)
- Track progress automatically based on task completion
- Filter projects by status (Planning, In Progress, On Hold, Completed, Cancelled)

### Tasks
- Kanban-style board view grouped by status (`To Do`, `In Progress`, `Done`)
- Create tasks with title, description, priority, due date, and assignees
- Inline editing for title, description, status, priority, and assignees
- **Subtasks** with individual completion tracking
- **Comments** thread per task
- **Watchers** — subscribe to task updates
- **Archive / unarchive** tasks
- Task activity log showing a timestamped history of all changes

### Dashboard & Analytics
- Overview stats: total projects, tasks, in-progress counts, to-do counts
- **Task Trends** line chart — daily task status changes over the last 7 days
- **Project Status** donut chart — breakdown by Planning / In Progress / Completed
- **Task Priority** donut chart — High / Medium / Low distribution
- **Workspace Productivity** bar chart — completed vs total tasks per project
- Upcoming tasks panel (due within the next 7 days)
- Recent projects panel

### My Tasks
- Personal task list across all workspaces
- Filter by status or priority, sort by due date, full-text search
- List view and Kanban board view

### User Profile
- Update display name and profile picture
- Change password (requires current password confirmation)

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [React Router v7](https://reactrouter.com/) | Client-side routing + SSR-ready layouts |
| [TanStack Query v5](https://tanstack.com/query) | Server state management, caching, mutations |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | Accessible, composable UI primitives |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form management and schema validation |
| [Recharts](https://recharts.org/) | Data visualisation |
| [Axios](https://axios-http.com/) | HTTP client with interceptors |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [date-fns](https://date-fns.org/) | Date formatting and manipulation |
| [Lucide React](https://lucide.dev/) | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | REST API server |
| [TypeScript (ES Modules)](https://www.typescriptlang.org/) | Module system |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database + ODM |
| [JWT](https://jwt.io/) (`jsonwebtoken`) | Stateless authentication |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Password hashing |
| [Zod](https://zod.dev/) + [zod-express-middleware](https://github.com/express-validator/zod-express-middleware) | Request validation |
| [Arcjet](https://arcjet.com/) | Bot detection, rate limiting, email validation |
| [SendGrid](https://sendgrid.com/) | Transactional email (verification, password reset, invites) |
| [Morgan](https://github.com/expressjs/morgan) | HTTP request logging |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |

---

## Architecture Overview

```
┌─────────────────────────────┐      ┌──────────────────────────────────┐
│         Frontend            │      │            Backend                │
│  React + React Router v7    │ HTTP │  Express REST API                 │
│  TanStack Query cache layer │ ───► │  /api-v1/auth                    │
│  Zod schema validation      │      │  /api-v1/workspaces              │
│  Tailwind + shadcn/ui       │      │  /api-v1/projects                │
└─────────────────────────────┘      │  /api-v1/tasks                   │
                                     │  /api-v1/users                   │
                                     └──────────┬───────────────────────┘
                                                │
                                     ┌──────────▼──────────┐
                                     │   MongoDB Atlas      │
                                     │  Users, Workspaces   │
                                     │  Projects, Tasks     │
                                     │  Comments, Activity  │
                                     └─────────────────────┘
```

**Key design decisions:**
- JWT stored in `localStorage`; a global Axios response interceptor dispatches a `force-logout` event on any 401 response, clearing state application-wide without coupling components to auth logic.
- TanStack Query's `invalidateQueries` is used after every mutation to keep the UI consistent without manual cache manipulation.
- Zod schemas are declared once on the backend (`validate-schema.js`) and mirrored on the frontend (`lib/schema.ts`), ensuring request payloads are validated at both layers.
- Arcjet sits in front of the registration endpoint to block bot registrations and disposable email addresses before any database write occurs.

---

## Data Models

```
User            Workspace         Project
────            ─────────         ───────
_id             _id               _id
email           name              title
password        description       description
name            color             status
profilePicture  owner → User      workspace → Workspace
isEmailVerified members[]         members[]
lastLogin         user → User     tasks[]
                  role            tags[]
                projects[]        startDate / dueDate
                                  createdBy → User

Task            Comment           ActivityLog
────            ───────           ───────────
_id             _id               _id
title           text              user → User
description     task → Task       action (enum)
status          author → User     resourceType
priority        reactions[]       resourceId
assignees[]     attachments[]     details
watchers[]
subtasks[]
comments[]
dueDate
isArchived
createdBy → User
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB instance (local or Atlas)
- SendGrid account + verified sender
- Arcjet account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/project-manager.git
cd project-manager
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/projectmanager
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
SEND_GRID_API=SG.xxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
ARCJET_KEY=ajkey_xxxxxxxxxxxxxxxxxxxx
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api-v1
```

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api-v1/auth/register` | Register + send verification email |
| POST | `/api-v1/auth/login` | Login, returns JWT |
| POST | `/api-v1/auth/verify-email` | Verify email token |
| POST | `/api-v1/auth/reset-password-request` | Send reset email |
| POST | `/api-v1/auth/reset-password` | Reset password with token |
| GET | `/api-v1/workspaces` | List user's workspaces |
| POST | `/api-v1/workspaces` | Create workspace |
| GET | `/api-v1/workspaces/:id/projects` | Get workspace projects |
| GET | `/api-v1/workspaces/:id/stats` | Dashboard statistics |
| POST | `/api-v1/workspaces/:id/invite-member` | Invite by email |
| POST | `/api-v1/projects/:workspaceId/create-project` | Create project |
| GET | `/api-v1/projects/:id/tasks` | Get project + tasks |
| POST | `/api-v1/tasks/:projectId/create-task` | Create task |
| PUT | `/api-v1/tasks/:id/status` | Update task status |
| PUT | `/api-v1/tasks/:id/assignees` | Update assignees |
| POST | `/api-v1/tasks/:id/add-subtask` | Add subtask |
| POST | `/api-v1/tasks/:id/add-comment` | Add comment |
| POST | `/api-v1/tasks/:id/watch` | Toggle watch |
| POST | `/api-v1/tasks/:id/archived` | Toggle archive |
| GET | `/api-v1/tasks/my-tasks` | Current user's tasks |
| GET | `/api-v1/tasks/:id/activity` | Task activity log |

All endpoints except auth routes require `Authorization: Bearer <token>`.

---

## Project Structure

```
project-manager/
├── backend/
│   ├── controllers/        # Route handlers (auth, workspace, project, task, user)
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── libs/               # Utilities (arcjet, sendgrid, zod schemas, activity logger)
│   └── index.js            # App entry point
│
└── frontend/
    └── app/
        ├── components/     # UI components (dashboard, task, project, workspace, ui/)
        ├── hooks/          # TanStack Query hooks per domain
        ├── lib/            # Axios client, Zod schemas, utilities
        ├── provider/       # AuthContext, ReactQueryProvider
        ├── routes/         # File-based routes (auth/, dashboard/, user/)
        └── types/          # TypeScript interfaces
```

---

## Potential Improvements

- [ ] Real-time updates via WebSockets (Socket.io) — task changes, comments
- [ ] File attachments on tasks (cloud storage integration)
- [ ] Drag-and-drop Kanban board
- [ ] Notification centre
- [ ] Two-factor authentication (2FA schema already in the User model)
- [ ] Project-level analytics export (CSV/PDF)
- [ ] Dark mode toggle

---

## Author

**Hau Nguyen**
[LinkedIn](https://www.linkedin.com/in/hau-nguyen-521233254/) · [GitHub](https://github.com/Kiev2k4)
