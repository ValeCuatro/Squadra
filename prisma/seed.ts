import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando el seeding de la base de datos...');

  // 1. Crear Usuarios por defecto
  const admin = await prisma.user.upsert({
    where: { email: 'admin@squadra.com' },
    update: {},
    create: {
      name: 'Admin Squadra',
      email: 'admin@squadra.com',
      role: 'ADMIN',
      status: 'ON_DUTY',
    },
  });

  const operario = await prisma.user.upsert({
    where: { email: 'operario@squadra.com' },
    update: {},
    create: {
      name: 'Operario Squadra',
      email: 'operario@squadra.com',
      role: 'FIELD_WORKER',
      status: 'OFF_DUTY',
    },
  });

  console.log('✅ Usuarios de prueba creados');

  // 2. Limpiar áreas viejas (opcional pero bueno para el seed repetitivo)
  try {
    await prisma.subArea.deleteMany({});
    await prisma.area.deleteMany({});
  } catch (error) {
    console.log('⚠️ No se pudieron limpiar las áreas por dependencias. Omitiendo limpieza...');
  }

  // 3. Crear Áreas y Subáreas de prueba (Club Malvín mock)
  const existingArea = await prisma.area.findFirst();
  if (!existingArea) {
  const piso1 = await prisma.area.create({
    data: {
      name: 'Piso 1',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
      responsibleId: admin.id,
      subAreas: {
        create: [
          { name: 'Oficina de Socios' },
          { name: 'Sala de Espera' },
          { name: 'Baños Principales' }
        ]
      }
    }
  });

  const gimnasio = await prisma.area.create({
    data: {
      name: 'Gimnasio Principal',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80',
      responsibleId: operario.id,
      subAreas: {
        create: [
          { name: 'Sala de Musculación' },
          { name: 'Cancha de Básquetbol' },
          { name: 'Sector de Cardio' }
        ]
      }
    }
  });

  const exteriores = await prisma.area.create({
    data: {
      name: 'Exteriores y Piscinas',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80',
      responsibleId: admin.id,
      subAreas: {
        create: [
          { name: 'Piscina Abierta' },
          { name: 'Canchas de Tenis' },
          { name: 'Barbacoas' }
        ]
      }
    }
  });

    console.log('✅ Áreas y Sub-áreas creadas con éxito');
  }

  // 4. Inventario
  const inventoryItem = await prisma.inventoryItem.findFirst();
  if (!inventoryItem) {
    await prisma.inventoryItem.createMany({
      data: [
        { name: 'Cera 5L', category: 'Limpieza', currentStock: 10, minStock: 2, unit: 'L' },
        { name: 'Cloro', category: 'Piscinas', currentStock: 50, minStock: 10, unit: 'kg' },
        { name: 'Tornillos 2"', category: 'Mantenimiento', currentStock: 200, minStock: 50, unit: 'u' },
        { name: 'Lamparita LED 12W', category: 'Eléctrico', currentStock: 15, minStock: 5, unit: 'u' },
      ]
    });
    console.log('✅ Inventario base creado');
  }

  // 5. Equipamiento
  const equipment = await prisma.equipment.findFirst();
  if (!equipment) {
    await prisma.equipment.createMany({
      data: [
        { name: 'Taladro Percutor Bosch', status: 'AVAILABLE' },
        { name: 'Soldadora Inverter', status: 'AVAILABLE' },
        { name: 'Escalera de Aluminio 5m', status: 'AVAILABLE' },
        { name: 'Cortadora de Césped', status: 'AVAILABLE' },
        { name: 'Hidrolavadora Karcher', status: 'AVAILABLE' }
      ]
    });
    console.log('✅ Equipamiento base creado');
  }

  // 6. Tickets y Transacciones para Dashboard
  const ticketCount = await prisma.ticket.count();
  if (ticketCount === 0 && existingArea) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);

    await prisma.ticket.create({
      data: {
        title: 'Reparar luminaria del vestuario',
        description: 'Parpadea la luz principal.',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        areaId: existingArea.id,
        assigneeId: operario.id,
        createdAt: pastDate,
        updatedAt: new Date(pastDate.getTime() + 1000 * 60 * 60 * 4), // Resuelto en 4 horas
      }
    });

    const pastDate2 = new Date();
    pastDate2.setDate(pastDate2.getDate() - 2);

    const ticket2 = await prisma.ticket.create({
      data: {
        title: 'Fuga de agua en lavamanos',
        description: 'Pierde agua por debajo.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        areaId: existingArea.id,
        assigneeId: operario.id,
        createdAt: pastDate2,
      }
    });

    const todayDate = new Date();

    await prisma.ticket.create({
      data: {
        title: 'Limpieza profunda sector pesas',
        description: 'Requiere limpieza mensual',
        priority: 'LOW',
        status: 'PENDING',
        areaId: existingArea.id,
        createdAt: todayDate,
      }
    });

    // Añadir transacciones de inventario
    const cera = await prisma.inventoryItem.findFirst({ where: { name: 'Cera 5L' } });
    const tornillos = await prisma.inventoryItem.findFirst({ where: { name: 'Tornillos 2"' } });

    if (cera && tornillos) {
      // Consumos pasados
      for (let i = 1; i <= 5; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        
        await prisma.inventoryTransaction.create({
          data: {
            itemId: tornillos.id,
            userId: operario.id,
            ticketId: ticket2.id,
            type: 'OUT',
            quantity: Math.floor(Math.random() * 20) + 5, // 5 a 25 tornillos diarios
            date: d
          }
        });

        await prisma.inventoryTransaction.create({
          data: {
            itemId: cera.id,
            userId: operario.id,
            type: 'OUT',
            quantity: 1, // 1 litro
            date: d
          }
        });
      }
      
      // Stock bajo a propósito
      await prisma.inventoryItem.update({
        where: { id: cera.id },
        data: { currentStock: 1 } // Por debajo del minStock (2)
      });
    }

    console.log('✅ Tickets y Transacciones de prueba creadas para el Dashboard');
  }

  console.log('🚀 Seeding finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end(); // close pg pool to allow process to exit cleanly
    await prisma.$disconnect();
  });
