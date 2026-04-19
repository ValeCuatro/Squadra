# Especificación de Producto: Squadra (Sistema de Gestión de Mantenimiento)

## 1. Visión General
Squadra es una plataforma integral para la gestión de mantenimiento, inventario y personal en instalaciones (con enfoque adaptable a predios deportivos). Consta de dos interfaces principales:
- **Web App (Desktop):** Panel de administración para despachadores y gerentes de instalaciones.
- **Mobile App:** Interfaz para los técnicos de campo que ejecutan las tareas.

## 2. Roles de Usuario
- **Administrador:** Acceso total a dashboards, asignación de tareas, reportes globales, gestión de inventario y supervisión de staff.
- **Técnico de Campo (Field Worker):** Acceso a sus tareas diarias, actualización de inventario, consulta de equipos y gestión de su perfil/certificaciones.

## 3. Módulos y Funcionalidades Core

### 3.1. Gestión de Tareas (Tasks)
- **Creación y Asignación (Admin):** Crear tareas definiendo título, ubicación, duración estimada, insumos requeridos, equipamiento necesario, fecha/hora y responsable.
- **Visualización (Admin):** Vista de calendario (semanal/mensual) y línea de tiempo diaria por empleado (Gantt-style) para ver la carga de trabajo.
- **Ejecución (Mobile):** Lista de tareas del día, progreso general (%), alertas, prioridades activas y registro de tareas completadas. Cambio de estado a "Completado".

### 3.2. Gestión de Inventario (Inventory)
- **Monitoreo (Ambos):** Catálogo de SKUs (ej. Cloro, Cera para pisos, Redes). Niveles de stock en tiempo real.
- **Alertas (Ambos):** Alertas automáticas de stock bajo y umbrales críticos.
- **Operaciones Móviles:** Escaneo de Código de Barras/QR, registro rápido de reabastecimiento (Quick Restock) y actualización en bloque.
- **Gestión Admin:** Libro mayor de inventario (Ledger) con ajustes manuales (+/-), visualización de tendencias de consumo (gráficos de líneas) y órdenes de compra pendientes.

### 3.3. Gestión de Equipamiento (Equipment / Assets)
- **Seguimiento en tiempo real:** Inventario de herramientas y vehículos (ej. Cortacésped, Taladros, Generadores).
- **Estados:** Disponible, En Uso (con usuario asignado y hora), Reservado.
- **Ubicación:** Registro de la bahía o zona donde está almacenado el equipo.

### 3.4. Personal y Perfiles (Staff / Profile)
- **Perfil Móvil:** Estado actual (On/Off Duty), conteo histórico de tareas completadas, visualización de certificaciones (ej. OSHA 30) y próximas renovaciones (vencimientos).
- **Capacidad de Recursos (Admin):** Matriz de capacidad que calcula las horas asignadas vs. la capacidad operativa del turno (ej. carga al 75%, 92%).

### 3.5. Reportes y Dashboard (Reports - Solo Admin)
- **Métricas Clave:** Tasa de finalización, Tiempo medio de reparación (MTTR), Costos de insumos vs. Presupuesto.
- **Análisis:** Gráficos de volumen de actividad diaria y tasa de utilización del personal.
- **Detección de Anomalías:** Alertas del sistema sobre desviaciones (ej. uso excesivo de agua en una zona, picos de eficiencia).