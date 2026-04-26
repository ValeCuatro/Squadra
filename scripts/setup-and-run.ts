import { execSync } from 'child_process';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

async function createDatabaseIfNotExists() {
  const dbUrlString = process.env.DATABASE_URL;
  if (!dbUrlString) {
    throw new Error('DATABASE_URL no está definido en el archivo .env');
  }

  const parsedUrl = new URL(dbUrlString);
  const targetDbName = parsedUrl.pathname.replace('/', '');
  
  // Conectarse a la base de datos por defecto 'postgres' para poder crear la nuestra
  parsedUrl.pathname = '/postgres';
  const defaultDbUrl = parsedUrl.toString();

  const client = new Client({ connectionString: defaultDbUrl });
  
  try {
    await client.connect();
    
    // Verificar si la base de datos ya existe
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${targetDbName}'`);
    
    if (res.rowCount === 0) {
      console.log(`🛠️ La base de datos '${targetDbName}' no existe. Creándola...`);
      await client.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`✅ Base de datos '${targetDbName}' creada con éxito.`);
    } else {
      console.log(`✅ La base de datos '${targetDbName}' ya existe.`);
    }
  } catch (err) {
    console.error('❌ Error al verificar/crear la base de datos. Verifica que PostgreSQL esté corriendo y las credenciales en .env sean correctas.');
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function run() {
  console.log('🔄 Iniciando el entorno de desarrollo Squadra...');

  await createDatabaseIfNotExists();

  try {
    console.log('🏗️ Sincronizando Schema de Prisma con la Base de Datos...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

    console.log('🌱 Ejecutando Seeding Automático (Datos maestros)...');
    execSync('npx prisma db seed', { stdio: 'inherit' });

    console.log('🚀 Entorno de base de datos listo. Iniciando frontend (Vite)...');
    execSync('npm run dev', { stdio: 'inherit' });

  } catch (error) {
    console.error('❌ Error durante la preparación de Prisma o Vite:', error);
    process.exit(1);
  }
}

run();
