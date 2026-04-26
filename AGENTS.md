# Squadra Project Guide for AI Agents

## Tech Stack (Current)
- **Framework:** React + Vite + TypeScript (Migrated from Next.js)
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** TanStack Query (React Query)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Git Workflow: Labels & Milestones

### 🏷️ Labels Set
All issues should be categorized using these labels:

- **Type Labels:**
  - `Feature`: New functionality or requirements.
  - `Bug`: Something is not working correctly.
  - `Refactor`: Code improvements without functional changes.
  - `UI/UX`: Visual or user experience changes.
  - `Documentation`: Improvements to the documentation.
- **Priority Labels:**
  - `High Priority`: Immediate attention required.
- **System Labels:**
  - `Infrastructure`: DevOps, database, or scripts tasks.
- **Module Labels:**
  - `Module: Core`: Central system functionality.
  - `Module: Tasks`: Task management module.
  - `Module: Inventory`: Inventory and stock module.
  - `Module: Staff`: Personnel and profile management.
  - `Module: Equipment`: Tools and fixed assets management.
  - `Module: Measurements`: Custom areas of interest and measurements (Pools, Boiler Room, etc).

### 🎯 Milestones
- **Milestone #1: "Primera version"**
  - Target: June 1st, 2026.
  - Goal: Initial prototype for Nato and the board. Complete MVP features including generalized measurement modules.

## Architectural Notes
- The "Piscinas" module is being refactored into a generalized "Measurements" system where Admins can define custom points of interest and parameters.
- Data currently resides in `src/data/mock.ts`. Future migration to Supabase is planned.
