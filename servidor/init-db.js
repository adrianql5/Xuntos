// ==========================================
// SCRIPT DE INICIALIZACIÓN DA BASE DE DATOS
// ==========================================

const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Converte unha imaxe a base64
 */
function convertirImaxeABase64(rutaImaxe) {
    try {
        const imaxe = fs.readFileSync(rutaImaxe);
        const extension = path.extname(rutaImaxe).toLowerCase();
        let mimeType = 'image/jpeg';

        if (extension === '.png') mimeType = 'image/png';
        else if (extension === '.webp') mimeType = 'image/webp';
        else if (extension === '.gif') mimeType = 'image/gif';

        return `data:${mimeType};base64,${imaxe.toString('base64')}`;
    } catch (error) {
        console.warn(`⚠️  Non se puido cargar a imaxe ${rutaImaxe}: ${error.message}`);
        return null;
    }
}

const DB_NAME = process.env.DB_NAME || 'xuntos_db';
const DB_USER = process.env.DB_USER || 'xuntos_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'contraseña_user';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

// Contraseña por defecto para usuarios de demostración
const DEMO_PASSWORD = 'demo123';

async function inicializarBaseDatos() {
    console.log('==========================================');
    console.log('   INICIALIZACIÓN DA BASE DE DATOS');
    console.log('==========================================\n');

    // Cliente para conectar como superusuario
    const adminClient = new Client({
        host: DB_HOST,
        port: DB_PORT,
        user: 'postgres', // Usuario por defecto de PostgreSQL
        password: process.argv.includes('--postgres-password')
            ? process.argv[process.argv.indexOf('--postgres-password') + 1]
            : 'postgres',
        database: 'postgres'
    });

    try {
        await adminClient.connect();
        console.log('✅ Conectado a PostgreSQL como superusuario\n');

        // Verificar se o usuario existe, se non crealo
        const userCheck = await adminClient.query(
            `SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'`
        );

        if (userCheck.rowCount === 0) {
            console.log(`📝 Creando usuario ${DB_USER}...`);
            await adminClient.query(
                `CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}'`
            );
            console.log('✅ Usuario creado\n');
        } else {
            console.log(`ℹ️  O usuario ${DB_USER} xa existe`);
            console.log(`🔄 Actualizando contraseña para ${DB_USER}...`);
            await adminClient.query(
                `ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}'`
            );
            console.log('✅ Contraseña actualizada\n');
        }

        // Verificar se a base de datos existe
        const dbCheck = await adminClient.query(
            `SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`
        );

        if (dbCheck.rowCount === 0) {
            console.log(`📝 Creando base de datos ${DB_NAME}...`);
            await adminClient.query(`CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}`);
            console.log('✅ Base de datos creada\n');
        } else {
            console.log(`ℹ️  A base de datos ${DB_NAME} xa existe\n`);

            // Se especificamos --reset, borrar e recrear
            if (process.argv.includes('--reset')) {
                console.log('🔄 Modo RESET: Eliminando base de datos existente...');
                await adminClient.query(`DROP DATABASE ${DB_NAME}`);
                console.log(`📝 Recreando base de datos ${DB_NAME}...`);
                await adminClient.query(`CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}`);
                console.log('✅ Base de datos recreada\n');
            }
        }

        await adminClient.end();

        // Agora conectar á nova base de datos
        const dbClient = new Client({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        });

        await dbClient.connect();
        console.log(`✅ Conectado á base de datos ${DB_NAME}\n`);

        // Executar schema.sql
        console.log('📝 Creando esquema da base de datos...');
        const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await dbClient.query(schemaSQL);
        console.log('✅ Esquema creado correctamente\n');

        // Insertar datos de demostración con contraseñas hasheadas
        console.log('📝 Insertando datos de demostración...');

        // Hash da contraseña de demostración
        const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

        // Rutas ás fotos reais
        const carpetaFotos = path.join(__dirname, '..', 'fotos');

        console.log('📸 Cargando fotos desde:', carpetaFotos);

        // Cargar fotos reais da carpeta /fotos
        const foto1 = convertirImaxeABase64(path.join(carpetaFotos, 'rihanna.jpg'));
        const foto2 = convertirImaxeABase64(path.join(carpetaFotos, 'brad-pitt-atractivo-RwjJEjBgeiJYHhxSlxO9ELK-1200x840@diario_abc.webp'));
        const foto3 = convertirImaxeABase64(path.join(carpetaFotos, 'ser-mas-atractivo-persona-atractiva.webp'));

        // Avatares SVG para usuarios sen foto na carpeta
        const avatarSVG4 = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#43e97b;stop-opacity:1" /><stop offset="100%" style="stop-color:#38f9d7;stop-opacity:1" /></linearGradient></defs><rect width="200" height="200" fill="url(#g4)"/><text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="white" font-size="80" font-family="Arial" font-weight="bold">DS</text></svg>').toString('base64');
        const avatarSVG5 = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fa709a;stop-opacity:1" /><stop offset="100%" style="stop-color:#fee140;stop-opacity:1" /></linearGradient></defs><rect width="200" height="200" fill="url(#g5)"/><text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="white" font-size="80" font-family="Arial" font-weight="bold">AM</text></svg>').toString('base64');

        const fotos = [
            foto1 || avatarSVG4,  // María
            foto2 || avatarSVG4,  // Carlos
            foto3 || avatarSVG4,  // Laura
            avatarSVG4,           // David
            avatarSVG5            // Ana
        ];

        console.log('✅ Fotos cargadas:', fotos.map((f, i) => f ? `Usuario ${i+1}: OK` : `Usuario ${i+1}: FALLO`).join(', '));

        // Usuarios
        const usuarios = [
            {
                nome: 'María González',
                email: 'maria@xuntos.gal',
                descricion: 'Estudo enxeñería informática no segundo ano. Apaixoada pola programación web e o deseño. Adoro compartir coñecemento e axudar aos compañeiros!',
                foto: fotos[0]
            },
            {
                nome: 'Carlos Pérez',
                email: 'carlos@xuntos.gal',
                descricion: 'Estudante de matemáticas no terceiro ano. Apaixonado pola estatística, ciencia de datos e machine learning. Sempre disposto a resolver problemas complexos!',
                foto: fotos[1]
            },
            {
                nome: 'Laura Fernández',
                email: 'laura@xuntos.gal',
                descricion: 'Estudante de física fascinada polas leis do universo. Especializada en mecánica, termodinámica e física experimental. Encántame compartir a beleza da física!',
                foto: fotos[2]
            },
            {
                nome: 'David Silva',
                email: 'david@xuntos.gal',
                descricion: 'Estudante de filosofía e literatura galega. Interesado na historia, cultura e pensamento crítico. Amante dos libros e do debate intelectual.',
                foto: fotos[3]
            },
            {
                nome: 'Ana Martínez',
                email: 'ana@xuntos.gal',
                descricion: 'Estudante de bioloxía e ciencias ambientais. Preocupada polo medio ambiente e a conservación. Investigo a biodiversidade de Galicia.',
                foto: fotos[4]
            }
        ];

        for (const usuario of usuarios) {
            await dbClient.query(
                'INSERT INTO usuarios (nome, email, password_hash, descricion, foto_perfil) VALUES ($1, $2, $3, $4, $5)',
                [usuario.nome, usuario.email, passwordHash, usuario.descricion, usuario.foto]
            );
        }

        console.log('✅ Usuarios insertados\n');

        // Leer e executar seed.sql (saltando as liñas de INSERT de usuarios que xa insertamos)
        console.log('📝 Insertando asignaturas, apuntes e mensaxes...');
        let seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

        // Eliminar a sección de INSERT de usuarios do seed.sql
        seedSQL = seedSQL.replace(/-- Usuarios de demostración[\s\S]*?;/m, '');

        await dbClient.query(seedSQL);
        console.log('✅ Datos de demostración insertados correctamente\n');

        // Estatísticas
        const stats = await dbClient.query(`
            SELECT
                (SELECT COUNT(*) FROM usuarios) as usuarios,
                (SELECT COUNT(*) FROM apuntes) as apuntes,
                (SELECT COUNT(*) FROM mensaxes) as mensaxes,
                (SELECT COUNT(*) FROM usuario_asignaturas) as asignaturas
        `);

        console.log('==========================================');
        console.log('   ✅ INICIALIZACIÓN COMPLETADA');
        console.log('==========================================\n');
        console.log('📊 Estatísticas:');
        console.log(`   👥 ${stats.rows[0].usuarios} usuarios`);
        console.log(`   📚 ${stats.rows[0].apuntes} apuntes`);
        console.log(`   💬 ${stats.rows[0].mensaxes} mensaxes`);
        console.log(`   📖 ${stats.rows[0].asignaturas} asignaturas\n`);

        console.log('🔐 Credenciais de acceso:');
        console.log('   Email: maria@xuntos.gal (ou calquera outro usuario)');
        console.log(`   Contraseña: ${DEMO_PASSWORD}\n`);

        console.log('📡 Para iniciar o servidor: npm start\n');

        await dbClient.end();

    } catch (error) {
        console.error('❌ Erro durante a inicialización:', error.message);
        console.error('\n💡 Asegúrate de que:');
        console.error('   1. PostgreSQL está instalado e en execución');
        console.error('   2. Tes acceso como usuario postgres');
        console.error('   3. A configuración en .env é correcta');
        console.error('\n   Se necesitas especificar a contraseña de postgres:');
        console.error('   node init-db.js --postgres-password TUA_CONTRASEÑA\n');
        process.exit(1);
    }
}

// Executar
inicializarBaseDatos();
