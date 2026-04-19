# SKILL_APP: Arquitectura y Frontend Next.js

Este skill rige el desarrollo frontend de Squadra utilizando Next.js (App Router), Tailwind CSS y la arquitectura backend integrada.

## 🏗️ Arquitectura del Proyecto (Next.js App Router)

El sistema soporta concurrentemente dos entornos operativos, segregados a nivel de rutas:

- **`/admin`** (Web Desktop): Panel administrativo.
- **`/mobile`** (Mobile PWA/App): Interfaz para el técnico de campo.
- **`/api`**: Endpoints y Server Actions.

### Estructura de Directorios (Propuesta)

```text
src/
├── app/
│   ├── (auth)/             # Login
│   ├── admin/              # Vistas de Administrador (Layout con Sidebar)
│   │   ├── dashboard/      # Reportes, MTTR, etc.
│   │   ├── tasks/          # Calendario y Gantt
│   │   ├── inventory/      # Ledger y alertas
│   │   └── staff/          # Capacidad y certificaciones
│   ├── mobile/             # Vistas de Técnico (Layout Mobile-first, Tabs)
│   │   ├── tasks/          # Tareas del día y escaneo
│   │   ├── inventory/      # Quick Restock
│   │   └── profile/        # On/Off duty, Certificaciones
│   └── api/                # API Routes REST / GraphQL
├── components/
│   ├── ui/                 # Componentes atomicos (Botones, Inputs) [Base Stitch/Tailwind]
│   ├── admin/              # Componentes compuestos de Admin (Tablas, Gantt)
│   └── mobile/             # Componentes compuestos Mobile (Cards, Scan)
├── lib/
│   ├── db/                 # Instancia de Prisma Cliente
│   └── utils/              # Clases de utilidad Tailwind (clsx, twMerge)
└── store/                  # Estado global (Zustand client-side)
```

## 🎨 Guía de Estilos y UI
1. **Frontend 100% Tailwind CSS:** Todos los estilos, interfaces y componentes deben construirse utilizando utilidades de Tailwind.
2. **"Copy/Paste" Controlado:** El diseño a utilizar será proporcionado por el usuario (generalmente mockups de interfaces). Yo me encargaré de reproducir fielmente la maqueta visual usando Tailwind UI/Componentes "desde cero" (ensamblaje manual de utilidades CSS).
3. **Responsive Design:**
   - La sección `/mobile` debe ser Mobile-First estricta (centrada en usabilidad con pulgar, fuentes grandes, `min-h-screen`).
   - La sección `/admin` será primariamente Web Desktop (optimizado para visualización de grandes datos, tablas densas y dashboards amplios).

## 📡 Manejo de Datos y Estado
- **Server-Side Rendering (SSR) y Server Components (RSC):** Utilizados intensamente en el área `/admin` (Dashboards, listas de tareas pesadas) para reducir la carga de Javascript en el cliente, obteniendo datos directo con Prisma.
- **Client Components (`"use client"`):** Reservado para interactividad (Formularios, calendarios interactivos, escáner de QR o tablas con estado complejo de filtrado) y donde usemos `Zustand`.
- **Integridad:** Las llamadas de mutación de datos al backend (cambios de estatus, creaciones, consumos de inventario) serán fuertemente validadas en el servidor y opcionalmente optimísticas en el cliente vía React Server Actions.
