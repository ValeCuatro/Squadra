# SKILL_DB: Esquema de Base de Datos (Prisma)

Este skill define el esquema estricto de la base de datos relacional para el proyecto Squadra, utilizando PostgreSQL y Prisma ORM, basado en las especificaciones del negocio (`SPECS.md`).

## 📚 Entidades y Relaciones

### 1. User (Usuario / Personal)
- Administra roles (Administrador y Técnico de Campo).
- Estado actual de trabajo (`ON_DUTY`, `OFF_DUTY`).
- Relaciones: Sus tareas asignadas, logs de uso de inventario, equipos asignados, y certificaciones.

### 2. Task (Tarea de Mantenimiento)
- Registro de tareas a realizar.
- Campos: `id`, `title`, `description`, `location`, `estimatedMinutes`, `scheduledAt`, `status` (`PENDING`, `IN_PROGRESS`, `COMPLETED`), `completedAt`.
- Relaciones: `assigneeId` (User), Lista de `TaskInventoryRequirement` (Insumos), Lista de `TaskEquipmentRequirement` (Equipamiento).

### 3. InventoryItem (Inventario / Insumo)
- Catálogo de insumos fungibles (ej. Cloro, Cera).
- Campos: `id`, `sku` (único), `name`, `unit` (ej. Litros, Unidades), `currentStock`, `minimumStock` (para alertas), `barcode`.

### 4. InventoryTransaction (Ledger de Inventario)
- Historial exhaustivo de movimientos para auditoría y reportes.
- Campos: `id`, `itemId` (InventoryItem), `userId` (User, quién ajustó/consumió), `type` (`CONSUMPTION`, `RESTOCK`, `MANUAL_ADJUSTMENT`), `quantity` (puede ser negativo para consumo), `createdAt`.
- Relación opcional: `taskId` (si el consumo fue durante una tarea).

### 5. Equipment (Equipamiento / Activo Fijo)
- Activos rastreables que no se consumen (ej. Cortacésped).
- Campos: `id`, `name`, `type`, `status` (`AVAILABLE`, `IN_USE`, `RESERVED`, `MAINTENANCE`), `storageLocation`.
- Relación: `currentUserId` (Técnico que lo tiene actualmente).

### 6. EquipmentLog (Registro de Equipamiento)
- Trazabilidad de uso temporal de los activos.
- Campos: `id`, `equipmentId`, `userId`, `action` (`CHECK_OUT`, `RETURN`), `timestamp`.

### 7. Certification (Certificación del Personal)
- Regulaciones y normativas del staff.
- Campos: `id`, `userId`, `name` (ej. OSHA 30), `issuedAt`, `expiresAt`.

## ⚙️ Directivas de Implementación (Prisma)
- **Tipos de Datos Correctos:** Usar `DateTime` para fechas, `Int` para duraciones en minutos y cantidades unitarias, autoincremento o UUID para los IDs.
- **Enums:** Todo estado debe estar respaldado por un `enum` de PostgreSQL.
- **Integridad Referencial:** `onDelete: Restrict` o `Cascade` según corresponda para no perder historial vital (por ejemplo, nunca borrar `InventoryTransaction` aunque se elimine un `User` o `Task`, idealmente usar *Soft Deletes* donde sea pertinente).
- **Semillas (Seed):** Deberemos crear un archivo `seed.ts` para popular el catálogo inicial, usuarios y tareas de prueba.
