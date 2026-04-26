
# 🏊 Club Malvín — App de Gestión de Mantenimiento (MVP)

## Visión General
PWA mobile-first ultra minimalista para la gestión de mantenimiento del Club Malvín. Tipografía fina (Inter), colores corporativos (#004b93 azul, #ffffff blanco, #f7f7f7 gris claro), sin negritas innecesarias, espaciado generoso. Datos mock hardcodeados, sin backend por ahora. Logo desde la URL proporcionada.

---

## 1. Diseño Base y Layout Mobile-First
- **Bottom Navigation Bar** (mobile): 5 tabs con iconos Lucide — Dashboard, Tickets, Áreas, Inventario, Piscinas
- **Header minimal**: logo Club Malvín + nombre del usuario mock + avatar
- **Esquema de colores** aplicado al design system (CSS variables): primario #004b93, fondo #fff, cards #f7f7f7
- **Tipografía Inter** con pesos ligeros (300-400), tamaños pequeños y elegantes
- **PWA config**: manifest.json, meta tags, iconos para instalación en móvil

## 2. Dashboard Principal
- Saludo personalizado con fecha actual
- **Tarjetas resumen**: tickets pendientes, en proceso, resueltos (con números animados)
- **Tareas urgentes**: lista compacta con badge de prioridad y sub-área
- **Actividad reciente**: timeline minimalista de últimas acciones
- Skeleton loaders para simular carga premium

## 3. Sistema de Tickets de Mantenimiento
- **Lista de tickets** con filtros por estado (Pendiente/En Proceso/Resuelto) via tabs
- **Creación de ticket**: formulario con selector de área → sub-área, descripción, prioridad, asignación de operario mock, adjuntar foto (UI only)
- **Detalle de ticket**: vista con historial de cambios de estado, fotos adjuntas, comentarios
- **Cambio de estado** con swipe o botón, animaciones suaves
- Badge de colores por estado y prioridad

## 4. Gestión de Áreas y Sub-áreas
- **Lista de áreas** en cards con imagen, título y responsable asignado
- **Vista de sub-áreas** al tocar un área (navegación jerárquica)
- **CRUD completo** (crear, editar, eliminar) con modales/sheets desde abajo
- Datos mock: Piscinas, Canchas, Vestuarios, Gimnasio, etc.

## 5. Control de Inventario y Stock
- **Lista de productos** con nombre, cantidad actual, mínimo, categoría
- **Alertas visuales** cuando un producto está por debajo del mínimo (badge rojo)
- **Sección especial "Planta Potabilizadora"**: registro de ingreso de sal y cloro con fecha
- Formulario de entrada/salida de stock
- Filtros por categoría

## 6. Mediciones de Piscinas
- **Registro de medición**: formulario con campos para pH, temperatura, nivel de cloro
- **Selector de piscina** (mock: Piscina Olímpica, Piscina Recreativa, etc.)
- **Historial de mediciones** en tabla compacta con indicadores de color (verde/amarillo/rojo según rango)
- Registro de químicos agregados: qué producto, cantidad, fecha/hora
- Mini gráfico de tendencia (recharts) para los últimos 7 días de pH y cloro

## 7. Archivo PROJECT_GOALS.md
- Documentación del proyecto con diagrama de entidades (Users, Roles, Areas, SubAreas, Tickets, Inventory, PoolMeasurements)
- Lista de módulos y estado de implementación
- Notas de arquitectura para futuro backend con Supabase

## Detalles de UX Premium
- Transiciones suaves entre páginas
- Pull-to-refresh visual (simulado)
- Micro-animaciones en botones y cards
- Sombras sutiles (shadow-sm), bordes redondeados (rounded-xl)
- Esqueletos de carga en toda la app
- Empty states con ilustraciones minimalistas
- Toda la interfaz en español
