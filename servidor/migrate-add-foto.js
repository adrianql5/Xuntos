// ==========================================
// MIGRACIÓN: Engadir campo foto_perfil
// ==========================================

const { Client } = require('pg');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'xuntos_db';
const DB_USER = process.env.DB_USER || 'xuntos_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'xuntos_password';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

async function migrar() {
    console.log('==========================================');
    console.log('   MIGRACIÓN: Engadir foto_perfil');
    console.log('==========================================\n');

    const client = new Client({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    });

    try {
        await client.connect();
        console.log('✅ Conectado á base de datos\n');

        // Verificar se a columna xa existe
        const checkColumn = await client.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name='usuarios' AND column_name='foto_perfil'
        `);

        if (checkColumn.rowCount > 0) {
            console.log('ℹ️  A columna foto_perfil xa existe. Non se necesita migración.\n');
        } else {
            console.log('📝 Engadindo columna foto_perfil á tabla usuarios...');
            await client.query(`
                ALTER TABLE usuarios ADD COLUMN foto_perfil TEXT;
            `);
            console.log('✅ Columna engadida correctamente\n');
        }

        console.log('==========================================');
        console.log('   ✅ MIGRACIÓN COMPLETADA');
        console.log('==========================================\n');

        await client.end();
    } catch (error) {
        console.error('❌ Erro durante a migración:', error.message);
        process.exit(1);
    }
}

migrar();
