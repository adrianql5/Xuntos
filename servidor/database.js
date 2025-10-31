// ==========================================
// CAPA DE ACCESO A DATOS - POSTGRESQL
// ==========================================

const { Pool } = require('pg');
require('dotenv').config();

// Configuración do pool de conexións
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'xuntos_db',
    user: process.env.DB_USER || 'xuntos_user',
    password: process.env.DB_PASSWORD || 'xuntos_password',
    max: 20, // Máximo de conexións no pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Evento de erro do pool
pool.on('error', (err) => {
    console.error('❌ Erro inesperado no cliente da base de datos:', err);
});

// ==========================================
// FUNCIÓNS DE USUARIOS
// ==========================================

/**
 * Obter todos os usuarios (sen o password_hash)
 */
async function obterTodosUsuarios() {
    const query = `
        SELECT
            u.id,
            u.nome,
            u.email,
            u.descricion,
            u.foto_perfil,
            u.creado_en,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object('asignatura', ua.asignatura)
                ) FILTER (WHERE ua.asignatura IS NOT NULL),
                '[]'
            ) as asignaturas
        FROM usuarios u
        LEFT JOIN usuario_asignaturas ua ON u.id = ua.usuario_id
        GROUP BY u.id
        ORDER BY u.id
    `;

    const result = await pool.query(query);

    // Transformar as asignaturas de obxectos a array de strings
    return result.rows.map(user => ({
        ...user,
        asignaturas: user.asignaturas.map(a => a.asignatura)
    }));
}

/**
 * Obter un usuario por ID (con asignaturas e apuntes)
 */
async function obterUsuarioPorId(id) {
    const query = `
        SELECT
            u.id,
            u.nome,
            u.email,
            u.descricion,
            u.foto_perfil,
            u.creado_en
        FROM usuarios u
        WHERE u.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
        return null;
    }

    const usuario = result.rows[0];

    // Obter asignaturas
    usuario.asignaturas = await obterAsignaturasUsuario(id);

    // Obter apuntes
    usuario.apuntes = await obterApuntesUsuario(id);

    return usuario;
}

/**
 * Obter un usuario por email
 */
async function obterUsuarioPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
}

/**
 * Crear un novo usuario
 */
async function crearUsuario(nome, email, passwordHash, descricion = '') {
    const query = `
        INSERT INTO usuarios (nome, email, password_hash, descricion)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nome, email, descricion, foto_perfil, creado_en
    `;

    const result = await pool.query(query, [nome, email, passwordHash, descricion]);
    const usuario = result.rows[0];
    usuario.asignaturas = [];
    usuario.apuntes = [];

    return usuario;
}

/**
 * Actualizar un usuario
 */
async function actualizarUsuario(id, { nome, descricion, foto_perfil, asignaturas }) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Actualizar datos básicos
        if (nome !== undefined || descricion !== undefined || foto_perfil !== undefined) {
            const updates = [];
            const values = [];
            let paramCount = 1;

            if (nome !== undefined) {
                updates.push(`nome = $${paramCount++}`);
                values.push(nome);
            }

            if (descricion !== undefined) {
                updates.push(`descricion = $${paramCount++}`);
                values.push(descricion);
            }

            if (foto_perfil !== undefined) {
                updates.push(`foto_perfil = $${paramCount++}`);
                values.push(foto_perfil);
            }

            values.push(id);

            const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${paramCount}`;
            await client.query(query, values);
        }

        // Actualizar asignaturas se están presentes
        if (asignaturas !== undefined) {
            // Eliminar asignaturas existentes
            await client.query('DELETE FROM usuario_asignaturas WHERE usuario_id = $1', [id]);

            // Insertar novas asignaturas
            if (asignaturas.length > 0) {
                for (const asignatura of asignaturas) {
                    await client.query(
                        'INSERT INTO usuario_asignaturas (usuario_id, asignatura) VALUES ($1, $2)',
                        [id, asignatura]
                    );
                }
            }
        }

        await client.query('COMMIT');

        // Obter usuario actualizado
        return await obterUsuarioPorId(id);

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// ==========================================
// FUNCIÓNS DE ASIGNATURAS
// ==========================================

/**
 * Obter asignaturas dun usuario
 */
async function obterAsignaturasUsuario(usuarioId) {
    const query = 'SELECT asignatura FROM usuario_asignaturas WHERE usuario_id = $1 ORDER BY asignatura';
    const result = await pool.query(query, [usuarioId]);
    return result.rows.map(row => row.asignatura);
}

// ==========================================
// FUNCIÓNS DE APUNTES
// ==========================================

/**
 * Obter apuntes dun usuario
 */
async function obterApuntesUsuario(usuarioId) {
    const query = `
        SELECT id, nome, tipo, contido, nome_arquivo as "nomeArquivo", creado_en
        FROM apuntes
        WHERE usuario_id = $1
        ORDER BY creado_en DESC
    `;

    const result = await pool.query(query, [usuarioId]);
    return result.rows;
}

/**
 * Crear un novo apunte
 */
async function crearApunte(usuarioId, { nome, tipo, contido, nomeArquivo }) {
    const query = `
        INSERT INTO apuntes (usuario_id, nome, tipo, contido, nome_arquivo)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, nome, tipo, contido, nome_arquivo as "nomeArquivo", creado_en
    `;

    const result = await pool.query(query, [usuarioId, nome, tipo, contido, nomeArquivo || null]);
    return result.rows[0];
}

/**
 * Eliminar un apunte
 */
async function eliminarApunte(usuarioId, apunteId) {
    const query = 'DELETE FROM apuntes WHERE id = $1 AND usuario_id = $2 RETURNING id';
    const result = await pool.query(query, [apunteId, usuarioId]);
    return result.rowCount > 0;
}

// ==========================================
// FUNCIÓNS DE MENSAXES
// ==========================================

/**
 * Obter todas as mensaxes
 */
async function obterTodasMensaxes() {
    const query = 'SELECT id, de, para, texto, timestamp FROM mensaxes ORDER BY timestamp';
    const result = await pool.query(query);
    return result.rows;
}

/**
 * Obter mensaxes entre dous usuarios
 */
async function obterMensaxesEntre(usuario1Id, usuario2Id) {
    const query = `
        SELECT id, de, para, texto, timestamp
        FROM mensaxes
        WHERE (de = $1 AND para = $2) OR (de = $2 AND para = $1)
        ORDER BY timestamp
    `;

    const result = await pool.query(query, [usuario1Id, usuario2Id]);
    return result.rows;
}

/**
 * Obter conversas dun usuario
 */
async function obterConversasUsuario(usuarioId) {
    const query = `
        WITH ultimas_mensaxes AS (
            SELECT
                CASE
                    WHEN de = $1 THEN para
                    ELSE de
                END as outro_usuario_id,
                texto,
                timestamp,
                ROW_NUMBER() OVER (
                    PARTITION BY CASE WHEN de = $1 THEN para ELSE de END
                    ORDER BY timestamp DESC
                ) as rn
            FROM mensaxes
            WHERE de = $1 OR para = $1
        )
        SELECT
            u.id,
            u.nome,
            u.email,
            u.descricion,
            um.texto as ultima_mensaxe_texto,
            um.timestamp as ultima_mensaxe_timestamp,
            (SELECT COUNT(*) FROM mensaxes WHERE (de = $1 AND para = u.id) OR (de = u.id AND para = $1)) as numero_mensaxes
        FROM ultimas_mensaxes um
        JOIN usuarios u ON u.id = um.outro_usuario_id
        WHERE um.rn = 1
        ORDER BY um.timestamp DESC
    `;

    const result = await pool.query(query, [usuarioId]);
    return result.rows.map(row => ({
        usuario: {
            id: row.id,
            nome: row.nome,
            email: row.email,
            descricion: row.descricion
        },
        ultimaMensaxe: {
            texto: row.ultima_mensaxe_texto,
            timestamp: row.ultima_mensaxe_timestamp
        },
        numeroMensaxes: parseInt(row.numero_mensaxes)
    }));
}

/**
 * Crear unha nova mensaxe
 */
async function crearMensaxe(de, para, texto, timestamp) {
    const query = `
        INSERT INTO mensaxes (de, para, texto, timestamp)
        VALUES ($1, $2, $3, $4)
        RETURNING id, de, para, texto, timestamp
    `;

    const result = await pool.query(query, [de, para, texto, timestamp]);
    return result.rows[0];
}

// ==========================================
// EXPORTAR FUNCIÓNS
// ==========================================

module.exports = {
    pool,

    // Usuarios
    obterTodosUsuarios,
    obterUsuarioPorId,
    obterUsuarioPorEmail,
    crearUsuario,
    actualizarUsuario,

    // Asignaturas
    obterAsignaturasUsuario,

    // Apuntes
    obterApuntesUsuario,
    crearApunte,
    eliminarApunte,

    // Mensaxes
    obterTodasMensaxes,
    obterMensaxesEntre,
    obterConversasUsuario,
    crearMensaxe
};
