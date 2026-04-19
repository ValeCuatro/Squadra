# SKILL_BACKEND: Lógica Base del Servidor y Start-up

Este skill define el comportamiento de backend (rutas API y Server Actions) en la aplicación, haciendo especial foco en la inicialización (start-up).

## 🚀 Lógica de Arranque (Startup) y Auto-Gestión

La plataforma está diseñada para ser completamente auto-mantenida en entornos sin un administrador activo supervisando creaciones manuales.
En el archivo de inicialización de la app (ej. usando de *trigger* un `instrumentation.ts` en Next.js, un script _postinstall_ o un endpoint principal global de `health` en Server Components):
- **Verificación Estructural:** La aplicación va a verificar que la Base de Datos sea alcanzable y validada por `prisma`.
- **Ejecución Automática de Migraciones / Push:** Asegurar que si hay nuevas estructuras, el backend actualice el motor en consecuencia (idealmente en entornos acotados de desarrollo o inicio).
- **Seeding Automático Obligatorio:** Si las tablas críticas (ej. Usuarios `ADMIN`, Roles, Categorías Maestras de Inventario) se encuentran vacías, el backend correrá automáticamente un seed (`Prisma.createMany` o script `seed.ts` referenciado) aprovisionando registros básicos predeterminados para que el frontend no colapse mostrándose vacío y la app sea 100% usable recién iniciada.

## 🧱 Server Actions y Endpoints (`/api`)
- Preferiremos **Server Actions** al tratar con Next.js App Router para las operaciones atómicas directas con DB (como validación central de un alta y su posterior `revalidatePath()`).
- Zod regirá todos los esquemas antes de ejecutar cualquier sentencia de Prisma en el server.
