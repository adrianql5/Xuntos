// ==========================================
// SERVIDOR BACKEND - XUNTOS (con PostgreSQL e Autenticación)
// ==========================================

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_default';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('../cliente'));

// ==========================================
// MIDDLEWARE DE AUTENTICACIÓN
// ==========================================

/**
 * Middleware para verificar o token JWT
 */
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ erro: 'Token non proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, usuario) => {
        if (err) {
            return res.status(403).json({ erro: 'Token inválido ou expirado' });
        }

        req.usuario = usuario; // { id, email, nome }
        next();
    });
}

// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================

/**
 * Rexistro de novo usuario
 */
app.post('/api/auth/registro', async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        // Validacións
        if (!nome || !email || !password) {
            return res.status(400).json({ erro: 'Nome, email e contraseña son obrigatorios' });
        }

        if (password.length < 6) {
            return res.status(400).json({ erro: 'A contraseña debe ter polo menos 6 caracteres' });
        }

        // Verificar se o email xa existe
        const usuarioExistente = await db.obterUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ erro: 'Este email xa está rexistrado' });
        }

        // Hash da contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
        const novoUsuario = await db.crearUsuario(nome, email, passwordHash);

        // Xerar token JWT
        const token = jwt.sign(
            { id: novoUsuario.id, email: novoUsuario.email, nome: novoUsuario.nome },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            mensaxe: 'Usuario creado correctamente',
            token,
            usuario: novoUsuario
        });

    } catch (error) {
        console.error('Erro no rexistro:', error);
        res.status(500).json({ erro: 'Erro ao crear usuario' });
    }
});

/**
 * Login de usuario
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validacións
        if (!email || !password) {
            return res.status(400).json({ erro: 'Email e contraseña son obrigatorios' });
        }

        // Buscar usuario
        const usuario = await db.obterUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou contraseña incorrectos' });
        }

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValido) {
            return res.status(401).json({ erro: 'Email ou contraseña incorrectos' });
        }

        // Obter datos completos do usuario
        const usuarioCompleto = await db.obterUsuarioPorId(usuario.id);

        // Xerar token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, nome: usuario.nome },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            mensaxe: 'Login exitoso',
            token,
            usuario: usuarioCompleto
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ erro: 'Erro ao iniciar sesión' });
    }
});

/**
 * Verificar token e obter usuario actual
 */
app.get('/api/auth/me', autenticarToken, async (req, res) => {
    try {
        const usuario = await db.obterUsuarioPorId(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuario non atopado' });
        }

        res.json(usuario);

    } catch (error) {
        console.error('Erro ao obter usuario:', error);
        res.status(500).json({ erro: 'Erro ao obter datos do usuario' });
    }
});

// ==========================================
// RUTAS API - USUARIOS
// ==========================================

/**
 * Obter todos os usuarios (require autenticación)
 */
app.get('/api/usuarios', autenticarToken, async (req, res) => {
    try {
        const usuarios = await db.obterTodosUsuarios();

        // Para cada usuario, obter os seus apuntes
        const usuariosConApuntes = await Promise.all(
            usuarios.map(async (usuario) => {
                const apuntes = await db.obterApuntesUsuario(usuario.id);
                return { ...usuario, apuntes };
            })
        );

        res.json(usuariosConApuntes);

    } catch (error) {
        console.error('Erro ao obter usuarios:', error);
        res.status(500).json({ erro: 'Erro ao obter usuarios' });
    }
});

/**
 * Obter un usuario por ID
 */
app.get('/api/usuarios/:id', autenticarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const usuario = await db.obterUsuarioPorId(id);

        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ erro: 'Usuario non atopado' });
        }

    } catch (error) {
        console.error('Erro ao obter usuario:', error);
        res.status(500).json({ erro: 'Erro ao obter usuario' });
    }
});

/**
 * Actualizar un usuario (só pode actualizar o seu propio perfil)
 */
app.put('/api/usuarios/:id', autenticarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Verificar que o usuario só pode actualizar o seu propio perfil
        if (req.usuario.id !== id) {
            return res.status(403).json({ erro: 'Non tes permisos para actualizar este perfil' });
        }

        const { nome, descricion, asignaturas } = req.body;

        const usuarioActualizado = await db.actualizarUsuario(id, {
            nome,
            descricion,
            asignaturas
        });

        if (usuarioActualizado) {
            res.json(usuarioActualizado);
        } else {
            res.status(404).json({ erro: 'Usuario non atopado' });
        }

    } catch (error) {
        console.error('Erro ao actualizar usuario:', error);
        res.status(500).json({ erro: 'Erro ao actualizar usuario' });
    }
});

// ==========================================
// RUTAS API - APUNTES
// ==========================================

/**
 * Obter apuntes dun usuario
 */
app.get('/api/usuarios/:id/apuntes', autenticarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const apuntes = await db.obterApuntesUsuario(id);
        res.json(apuntes);

    } catch (error) {
        console.error('Erro ao obter apuntes:', error);
        res.status(500).json({ erro: 'Erro ao obter apuntes' });
    }
});

/**
 * Engadir un apunte a un usuario
 */
app.post('/api/usuarios/:id/apuntes', autenticarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Verificar que o usuario só pode engadir apuntes ao seu propio perfil
        if (req.usuario.id !== id) {
            return res.status(403).json({ erro: 'Non podes engadir apuntes a outros usuarios' });
        }

        const { nome, tipo, contido, nomeArquivo } = req.body;

        if (!nome || !tipo || !contido) {
            return res.status(400).json({ erro: 'Faltan datos obrigatorios' });
        }

        const novoApunte = await db.crearApunte(id, {
            nome,
            tipo,
            contido,
            nomeArquivo
        });

        res.status(201).json(novoApunte);

    } catch (error) {
        console.error('Erro ao engadir apunte:', error);
        res.status(500).json({ erro: 'Erro ao engadir apunte' });
    }
});

/**
 * Eliminar un apunte
 */
app.delete('/api/usuarios/:userId/apuntes/:apunteId', autenticarToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const apunteId = parseInt(req.params.apunteId);

        // Verificar que o usuario só pode eliminar os seus propios apuntes
        if (req.usuario.id !== userId) {
            return res.status(403).json({ erro: 'Non podes eliminar apuntes doutros usuarios' });
        }

        const eliminado = await db.eliminarApunte(userId, apunteId);

        if (eliminado) {
            res.json({ mensaxe: 'Apunte eliminado correctamente' });
        } else {
            res.status(404).json({ erro: 'Apunte non atopado' });
        }

    } catch (error) {
        console.error('Erro ao eliminar apunte:', error);
        res.status(500).json({ erro: 'Erro ao eliminar apunte' });
    }
});

// ==========================================
// RUTAS API - MENSAXES
// ==========================================

/**
 * Obter mensaxes entre dous usuarios
 */
app.get('/api/mensaxes/:usuario1Id/:usuario2Id', autenticarToken, async (req, res) => {
    try {
        const id1 = parseInt(req.params.usuario1Id);
        const id2 = parseInt(req.params.usuario2Id);

        // Verificar que o usuario autenticado é un dos dous
        if (req.usuario.id !== id1 && req.usuario.id !== id2) {
            return res.status(403).json({ erro: 'Non tes permisos para ver estas mensaxes' });
        }

        const mensaxes = await db.obterMensaxesEntre(id1, id2);
        res.json(mensaxes);

    } catch (error) {
        console.error('Erro ao obter mensaxes:', error);
        res.status(500).json({ erro: 'Erro ao obter mensaxes' });
    }
});

/**
 * Obter conversas dun usuario
 */
app.get('/api/usuarios/:id/conversas', autenticarToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Verificar que o usuario pode ver as súas propias conversas
        if (req.usuario.id !== userId) {
            return res.status(403).json({ erro: 'Non tes permisos para ver estas conversas' });
        }

        const conversas = await db.obterConversasUsuario(userId);
        res.json(conversas);

    } catch (error) {
        console.error('Erro ao obter conversas:', error);
        res.status(500).json({ erro: 'Erro ao obter conversas' });
    }
});

/**
 * Enviar unha nova mensaxe
 */
app.post('/api/mensaxes', autenticarToken, async (req, res) => {
    try {
        const { para, texto } = req.body;
        const de = req.usuario.id; // O usuario autenticado é o remitente

        if (!para || !texto || texto.trim() === '') {
            return res.status(400).json({ erro: 'Faltan datos obrigatorios' });
        }

        const novaMensaxe = await db.crearMensaxe(de, parseInt(para), texto.trim(), Date.now());

        res.status(201).json(novaMensaxe);

    } catch (error) {
        console.error('Erro ao enviar mensaxe:', error);
        res.status(500).json({ erro: 'Erro ao enviar mensaxe' });
    }
});

// ==========================================
// RUTA RAÍZ E MANEXO DE ERROS
// ==========================================

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../cliente' });
});

// Manexo de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ erro: 'Algo foi mal no servidor!' });
});

// ==========================================
// INICIO DO SERVIDOR
// ==========================================

app.listen(PORT, async () => {
    console.log('==========================================');
    console.log('   🚀 SERVIDOR XUNTOS');
    console.log('==========================================\n');
    console.log(`📡 Servidor escoitando no porto ${PORT}`);
    console.log(`🌐 Cliente: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api\n`);

    try {
        // Probar conexión á base de datos
        const result = await db.pool.query('SELECT NOW()');
        console.log('✅ Conexión á base de datos PostgreSQL establecida');

        // Obter estatísticas
        const stats = await db.pool.query(`
            SELECT
                (SELECT COUNT(*) FROM usuarios) as usuarios,
                (SELECT COUNT(*) FROM apuntes) as apuntes,
                (SELECT COUNT(*) FROM mensaxes) as mensaxes
        `);

        console.log('\n📊 Datos na base de datos:');
        console.log(`   👥 ${stats.rows[0].usuarios} usuarios`);
        console.log(`   📚 ${stats.rows[0].apuntes} apuntes`);
        console.log(`   💬 ${stats.rows[0].mensaxes} mensaxes`);

        console.log('\n🔐 Credenciais de acceso:');
        console.log('   Email: maria@xuntos.gal');
        console.log('   Contraseña: demo123');
        console.log('\n==========================================\n');

    } catch (error) {
        console.error('\n❌ Erro ao conectar coa base de datos:', error.message);
        console.error('💡 Execute primeiro: npm run init-db\n');
    }
});
