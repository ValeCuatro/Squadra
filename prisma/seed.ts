import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando Seeding automático...');

  // 1. Usuarios
  const admin = await prisma.user.upsert({
    where: { email: 'admin@squadra.com' },
    update: {},
    create: {
      name: 'Admin Principal',
      email: 'admin@squadra.com',
      role: 'ADMIN',
    },
  });

  const worker = await prisma.user.upsert({
    where: { email: 'operario@squadra.com' },
    update: {},
    create: {
      name: 'Técnico de Campo',
      email: 'operario@squadra.com',
      role: 'FIELD_WORKER',
    },
  });
  console.log('✅ Usuarios creados/verificados');

  // 2. Módulos de Medición (Para Issue #9)
  const poolsModule = await prisma.measurementModule.findFirst({
    where: { name: 'Piscinas' }
  });

  if (!poolsModule) {
    await prisma.measurementModule.create({
      data: {
        name: 'Piscinas',
        description: 'Módulo de control de piscinas',
        parameters: {
          create: [
            { name: 'pH', type: 'NUMBER', minHealthy: 7.2, maxHealthy: 7.6 },
            { name: 'Cloro', type: 'NUMBER', minHealthy: 1.0, maxHealthy: 3.0, unit: 'ppm' },
            { name: 'Temperatura', type: 'NUMBER', minHealthy: 25.0, maxHealthy: 28.0, unit: '°C' }
          ]
        }
      }
    });
    console.log('✅ Módulo de Piscinas creado con parámetros base');
  }

  // 3. Áreas base
  const area = await prisma.area.findFirst();
  if (!area) {
    await prisma.area.create({
      data: {
        name: 'Sede Principal',
        responsibleId: admin.id,
        subAreas: {
          create: [
            { name: 'Entrada' },
            { name: 'Gimnasio' },
            { name: 'Vestuarios' }
          ]
        }
      }
    });
    console.log('✅ Área base creada');
  }

  console.log('🚀 Seeding finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
