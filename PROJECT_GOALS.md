# 🏊 Squadra — App de Gestión de Mantenimiento

## Objetivo
PWA mobile-first para gestionar el mantenimiento integral de instalaciones. Diseño ultra-minimalista premium.

## Tech Stack
- **Frontend:** React + Vite + TypeScript + Tailwind CSS + Shadcn UI
- **Animaciones:** Framer Motion
- **Charts:** Recharts
- **Backend (planificado):** PostgreSQL (Supabase/Drizzle)

## Módulos

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| Dashboard | ✅ MVP | Resumen, tareas urgentes, actividad reciente |
| Tickets | ✅ MVP | CRUD, filtros por estado, prioridad, asignación |
| Áreas | ✅ MVP | Áreas y sub-áreas jerárquicas con CRUD |
| Inventario | ✅ MVP | Stock con alertas, filtros por categoría |
| Mediciones | 🏗️ Refactor | Módulos dinámicos (Piscinas, Calderas, etc.) |
| Auth | 🔲 Pendiente | Login, roles (Admin, Supervisor, Operario) |
| Calendario | 🔲 Pendiente | Vista diaria de rutinas |
| Escáner QR | 🔲 Pendiente | Lectura de QR en instalaciones |
| Admin Panel | 🔲 Pendiente | Gestión de usuarios y permisos |

## Diagrama de Entidades (futuro)

```
Users ──── Roles
  │
  ├── Tickets ──── Areas ──── SubAreas
  │     └── TicketPhotos
  │     └── TicketComments
  │     └── TicketHistory
  │
  ├── InventoryItems ──── Categories
  │     └── StockMovements
  │
  └── PoolMeasurements ──── Pools
        └── ChemicalRecords
```

## Colores Corporativos
- Primario: #004b93 (Azul Malvín)
- Fondo: #ffffff
- Cards: #f7f7f7
- Acento: Celeste claro

## Notas de Arquitectura
- Datos mock hardcodeados en `src/data/mock.ts`
- Sin persistencia por ahora (todo en estado local)
- Preparado para migrar a Supabase (interfaces TypeScript definidas)
- PWA configurada con manifest.json
