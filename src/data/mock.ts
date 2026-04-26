// ============================================
// MOCK DATA — Club Malvín Mantenimiento MVP
// ============================================

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'supervisor' | 'operario';
  avatar?: string;
  email?: string;
  phone?: string;
  area?: string;
}

export interface Area {
  id: string;
  name: string;
  image: string;
  responsible: User;
  subAreas: SubArea[];
}

export interface SubArea {
  id: string;
  name: string;
  areaId: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'pendiente' | 'en_proceso' | 'resuelto';
  priority: 'baja' | 'media' | 'alta' | 'urgente';
  area: string;
  subArea: string;
  assignee: User;
  createdAt: string;
  updatedAt: string;
  photos: string[];
  comments: { user: string; text: string; date: string }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  lastUpdated: string;
}

export interface PoolMeasurement {
  id: string;
  poolId: string;
  poolName: string;
  ph: number;
  temperature: number;
  chlorine: number;
  date: string;
  chemicals: { product: string; quantity: number; unit: string }[];
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  target: string;
  date: string;
}

// --- Users ---
export const currentUser: User = {
  id: 'u1',
  name: 'Carlos Rodríguez',
  role: 'supervisor',
  email: 'carlos.rodriguez@clubmalvin.uy',
  phone: '+598 99 123 456',
  area: 'Piscinas',
};

export const users: User[] = [
  currentUser,
  { id: 'u2', name: 'María López', role: 'operario', email: 'maria@clubmalvin.uy', phone: '+598 99 234 567', area: 'Vestuarios' },
  { id: 'u3', name: 'Juan Pérez', role: 'operario', email: 'juan@clubmalvin.uy', phone: '+598 99 345 678', area: 'Gimnasio' },
  { id: 'u4', name: 'Ana Fernández', role: 'admin', email: 'ana@clubmalvin.uy', phone: '+598 99 456 789', area: 'Administración' },
  { id: 'u5', name: 'Diego Martínez', role: 'operario', email: 'diego@clubmalvin.uy', phone: '+598 99 567 890', area: 'Canchas' },
];

// --- Areas & SubAreas ---
export const areas: Area[] = [
  {
    id: 'a1',
    name: 'Piscinas',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=250&fit=crop',
    responsible: users[0],
    subAreas: [
      { id: 's1', name: 'Piscina Olímpica', areaId: 'a1' },
      { id: 's2', name: 'Piscina Recreativa', areaId: 'a1' },
      { id: 's3', name: 'Planta Potabilizadora', areaId: 'a1' },
    ],
  },
  {
    id: 'a2',
    name: 'Canchas',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=250&fit=crop',
    responsible: users[3],
    subAreas: [
      { id: 's4', name: 'Cancha de Fútbol', areaId: 'a2' },
      { id: 's5', name: 'Cancha de Tenis', areaId: 'a2' },
      { id: 's6', name: 'Cancha de Básquet', areaId: 'a2' },
    ],
  },
  {
    id: 'a3',
    name: 'Vestuarios',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=250&fit=crop',
    responsible: users[1],
    subAreas: [
      { id: 's7', name: 'Vestuario Hombres', areaId: 'a3' },
      { id: 's8', name: 'Vestuario Mujeres', areaId: 'a3' },
      { id: 's9', name: 'Duchas', areaId: 'a3' },
    ],
  },
  {
    id: 'a4',
    name: 'Gimnasio',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop',
    responsible: users[2],
    subAreas: [
      { id: 's10', name: 'Sala de Musculación', areaId: 'a4' },
      { id: 's11', name: 'Sala Aeróbica', areaId: 'a4' },
    ],
  },
  {
    id: 'a5',
    name: 'Áreas Comunes',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop',
    responsible: users[4],
    subAreas: [
      { id: 's12', name: 'Recepción', areaId: 'a5' },
      { id: 's13', name: 'Cafetería', areaId: 'a5' },
      { id: 's14', name: 'Estacionamiento', areaId: 'a5' },
    ],
  },
];

// --- Tickets ---
export const tickets: Ticket[] = [
  {
    id: 't1',
    title: 'Filtro de piscina obstruido',
    description: 'El filtro principal de la piscina olímpica presenta obstrucción. Se requiere limpieza o reemplazo urgente.',
    status: 'pendiente',
    priority: 'urgente',
    area: 'Piscinas',
    subArea: 'Piscina Olímpica',
    assignee: users[0],
    createdAt: '2026-02-27T08:00:00',
    updatedAt: '2026-02-27T08:00:00',
    photos: [],
    comments: [
      { user: 'Carlos Rodríguez', text: 'Revisar con urgencia, se detectó baja presión.', date: '2026-02-27T08:15:00' },
    ],
  },
  {
    id: 't2',
    title: 'Luz fundida en vestuario',
    description: 'Tubo fluorescente fundido en vestuario hombres, zona de duchas.',
    status: 'en_proceso',
    priority: 'media',
    area: 'Vestuarios',
    subArea: 'Vestuario Hombres',
    assignee: users[2],
    createdAt: '2026-02-26T14:30:00',
    updatedAt: '2026-02-27T09:00:00',
    photos: [],
    comments: [],
  },
  {
    id: 't3',
    title: 'Reparar red de tenis',
    description: 'La red de la cancha 2 está rota en la esquina inferior derecha.',
    status: 'resuelto',
    priority: 'baja',
    area: 'Canchas',
    subArea: 'Cancha de Tenis',
    assignee: users[4],
    createdAt: '2026-02-25T10:00:00',
    updatedAt: '2026-02-26T16:00:00',
    photos: [],
    comments: [
      { user: 'Diego Martínez', text: 'Red reemplazada completamente.', date: '2026-02-26T16:00:00' },
    ],
  },
  {
    id: 't4',
    title: 'Goteo en grifo de cafetería',
    description: 'Grifo del fregadero de la cafetería gotea constantemente.',
    status: 'pendiente',
    priority: 'alta',
    area: 'Áreas Comunes',
    subArea: 'Cafetería',
    assignee: users[0],
    createdAt: '2026-02-27T07:00:00',
    updatedAt: '2026-02-27T07:00:00',
    photos: [],
    comments: [],
  },
  {
    id: 't5',
    title: 'Mantenimiento cinta de correr',
    description: 'La cinta #3 necesita lubricación y ajuste de banda.',
    status: 'en_proceso',
    priority: 'media',
    area: 'Gimnasio',
    subArea: 'Sala de Musculación',
    assignee: users[2],
    createdAt: '2026-02-26T11:00:00',
    updatedAt: '2026-02-27T10:00:00',
    photos: [],
    comments: [
      { user: 'Juan Pérez', text: 'Esperando repuesto de banda.', date: '2026-02-27T10:00:00' },
    ],
  },
];

// --- Inventory ---
export const inventory: InventoryItem[] = [
  { id: 'i1', name: 'Cloro granulado', category: 'Piscinas', currentStock: 8, minStock: 10, unit: 'kg', lastUpdated: '2026-02-27' },
  { id: 'i2', name: 'Sal industrial', category: 'Piscinas', currentStock: 45, minStock: 20, unit: 'kg', lastUpdated: '2026-02-26' },
  { id: 'i3', name: 'Tubos fluorescentes', category: 'Electricidad', currentStock: 12, minStock: 5, unit: 'unidades', lastUpdated: '2026-02-25' },
  { id: 'i4', name: 'Detergente industrial', category: 'Limpieza', currentStock: 3, minStock: 5, unit: 'litros', lastUpdated: '2026-02-27' },
  { id: 'i5', name: 'Filtros de piscina', category: 'Piscinas', currentStock: 2, minStock: 3, unit: 'unidades', lastUpdated: '2026-02-24' },
  { id: 'i6', name: 'Pintura antideslizante', category: 'Mantenimiento', currentStock: 15, minStock: 5, unit: 'litros', lastUpdated: '2026-02-23' },
  { id: 'i7', name: 'Alguicida', category: 'Piscinas', currentStock: 6, minStock: 4, unit: 'litros', lastUpdated: '2026-02-27' },
  { id: 'i8', name: 'Jabón líquido', category: 'Limpieza', currentStock: 1, minStock: 8, unit: 'litros', lastUpdated: '2026-02-27' },
];

// --- Pool Measurements ---
export const poolMeasurements: PoolMeasurement[] = [
  { id: 'pm1', poolId: 'p1', poolName: 'Piscina Olímpica', ph: 7.2, temperature: 26, chlorine: 1.5, date: '2026-02-27T08:00:00', chemicals: [{ product: 'Cloro granulado', quantity: 0.5, unit: 'kg' }] },
  { id: 'pm2', poolId: 'p1', poolName: 'Piscina Olímpica', ph: 7.4, temperature: 25.5, chlorine: 1.2, date: '2026-02-26T08:00:00', chemicals: [] },
  { id: 'pm3', poolId: 'p1', poolName: 'Piscina Olímpica', ph: 7.1, temperature: 26.2, chlorine: 1.8, date: '2026-02-25T08:00:00', chemicals: [{ product: 'Alguicida', quantity: 0.3, unit: 'litros' }] },
  { id: 'pm4', poolId: 'p1', poolName: 'Piscina Olímpica', ph: 7.6, temperature: 25.8, chlorine: 1.0, date: '2026-02-24T08:00:00', chemicals: [{ product: 'Cloro granulado', quantity: 1, unit: 'kg' }] },
  { id: 'pm5', poolId: 'p1', poolName: 'Piscina Olímpica', ph: 7.3, temperature: 26.1, chlorine: 1.4, date: '2026-02-23T08:00:00', chemicals: [] },
  { id: 'pm6', poolId: 'p1', poolName: 'Piscina Olímpica', ph: 7.5, temperature: 25.9, chlorine: 1.3, date: '2026-02-22T08:00:00', chemicals: [] },
  { id: 'pm7', poolId: 'p1', poolName: 'Piscina Olímpica', ph: 7.0, temperature: 26.3, chlorine: 1.6, date: '2026-02-21T08:00:00', chemicals: [{ product: 'Cloro granulado', quantity: 0.8, unit: 'kg' }] },
  { id: 'pm8', poolId: 'p2', poolName: 'Piscina Recreativa', ph: 7.3, temperature: 28, chlorine: 1.4, date: '2026-02-27T08:30:00', chemicals: [] },
  { id: 'pm9', poolId: 'p2', poolName: 'Piscina Recreativa', ph: 7.5, temperature: 27.5, chlorine: 1.1, date: '2026-02-26T08:30:00', chemicals: [{ product: 'Cloro granulado', quantity: 0.3, unit: 'kg' }] },
  { id: 'pm10', poolId: 'p2', poolName: 'Piscina Recreativa', ph: 7.2, temperature: 28.1, chlorine: 1.5, date: '2026-02-25T08:30:00', chemicals: [] },
  { id: 'pm11', poolId: 'p2', poolName: 'Piscina Recreativa', ph: 7.4, temperature: 27.8, chlorine: 1.3, date: '2026-02-24T08:30:00', chemicals: [] },
  { id: 'pm12', poolId: 'p2', poolName: 'Piscina Recreativa', ph: 7.6, temperature: 28.2, chlorine: 0.9, date: '2026-02-23T08:30:00', chemicals: [{ product: 'Alguicida', quantity: 0.2, unit: 'litros' }] },
  { id: 'pm13', poolId: 'p2', poolName: 'Piscina Recreativa', ph: 7.1, temperature: 27.6, chlorine: 1.7, date: '2026-02-22T08:30:00', chemicals: [] },
  { id: 'pm14', poolId: 'p2', poolName: 'Piscina Recreativa', ph: 7.3, temperature: 28.0, chlorine: 1.2, date: '2026-02-21T08:30:00', chemicals: [] },
];

export const pools = [
  { id: 'p1', name: 'Piscina Olímpica' },
  { id: 'p2', name: 'Piscina Recreativa' },
  { id: 'p3', name: 'Piscina Infantil' },
];

// --- Activity Feed ---
export const recentActivity: ActivityItem[] = [
  { id: 'act1', action: 'Ticket creado', user: 'Carlos Rodríguez', target: 'Filtro de piscina obstruido', date: '2026-02-27T08:00:00' },
  { id: 'act2', action: 'Estado cambiado a En Proceso', user: 'Juan Pérez', target: 'Mantenimiento cinta de correr', date: '2026-02-27T10:00:00' },
  { id: 'act3', action: 'Medición registrada', user: 'María López', target: 'Piscina Olímpica — pH 7.2', date: '2026-02-27T08:00:00' },
  { id: 'act4', action: 'Stock bajo mínimo', user: 'Sistema', target: 'Cloro granulado (8/10 kg)', date: '2026-02-27T07:30:00' },
  { id: 'act5', action: 'Ticket resuelto', user: 'Diego Martínez', target: 'Reparar red de tenis', date: '2026-02-26T16:00:00' },
];
