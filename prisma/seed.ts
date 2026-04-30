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
  await prisma.subArea.deleteMany({});
  await prisma.area.deleteMany({});

  // 3. Crear Áreas y Subáreas de prueba (Club Malvín mock)
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
  console.log('Seed completado.');
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
