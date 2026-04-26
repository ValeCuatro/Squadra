# Club Malvín — Mantenimiento

App web para la gestión de mantenimiento del Club Malvín.

## Requisitos

- Node.js (recomendado: LTS)
- npm

## Desarrollo local

```sh
npm install
npm run dev
```

## Build (producción)

```sh
npm run build
npm run preview
```

## Deploy en Vercel

- Importá el repo en Vercel.
- Configuración sugerida:
  - **Framework**: Vite
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

Este proyecto incluye `vercel.json` con rewrite para SPA (React Router), así los refresh en rutas como `/tickets` no rompen.
