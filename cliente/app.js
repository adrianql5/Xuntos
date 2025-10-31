// ==========================================
// XUNTOS - Aplicación de colaboración entre estudantes (CLIENTE CON AUTH)
// ==========================================

// ==========================================
// 1. CONFIGURACIÓN E ESTADO DA APLICACIÓN
// ==========================================

// URL base da API
const API_URL = 'http://localhost:3000/api';

// Usuario actual que iniciou sesión
let usuarioActual = null;
let authToken = null;

// Cache local dos datos (sincronizado co servidor)
const Cache = {
    usuarios: [],
    mensaxes: []
};

// Vista actual que se está mostrando
let vistaActual = 'login';
let usuarioVisualizandoId = null;
let chatAbertoCon = null;

// ==========================================
// 2. XESTIÓN DE TEMA (CLARO/OSCURO)
// ==========================================

/**
 * Aplicar tema (claro ou oscuro)
 */
function aplicarTema(tema) {
    if (tema === 'oscuro') {
        document.body.classList.add('tema-oscuro');
        document.getElementById('btn-toggle-tema').textContent = '☀️';
    } else {
        document.body.classList.remove('tema-oscuro');
        document.getElementById('btn-toggle-tema').textContent = '🌙';
    }
    localStorage.setItem('xuntos_tema', tema);
}

/**
 * Alternar entre tema claro e oscuro
 */
function toggleTema() {
    const temaActual = localStorage.getItem('xuntos_tema') || 'claro';
    const novoTema = temaActual === 'claro' ? 'oscuro' : 'claro';
    aplicarTema(novoTema);
}

/**
 * Cargar tema gardado
 */
function cargarTema() {
    const tema = localStorage.getItem('xuntos_tema') || 'claro';
    aplicarTema(tema);
}

// ==========================================
// 3. XESTIÓN DE AUTENTICACIÓN
// ==========================================

/**
 * Gardar token no localStorage
 */
function gardarToken(token) {
    authToken = token;
    localStorage.setItem('xuntos_token', token);
}

/**
 * Obter token do localStorage
 */
function obterToken() {
    if (!authToken) {
        authToken = localStorage.getItem('xuntos_token');
    }
    return authToken;
}

/**
 * Eliminar token
 */
function eliminarToken() {
    authToken = null;
    localStorage.removeItem('xuntos_token');
}

/**
 * Obter headers con autenticación
 */
function obterHeadersAuth() {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = obterToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Manejar erros de autenticación
 */
function manejarErroAuth(response) {
    if (response.status === 401 || response.status === 403) {
        // Token inválido ou expirado
        eliminarToken();
        usuarioActual = null;
        mostrarVista('login');
        mostrarErro('login', 'A túa sesión caducou. Por favor, inicia sesión de novo.');
        return true;
    }
    return false;
}

/**
 * Login
 */
async function fazerLogin(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao iniciar sesión');
        }

        // Gardar token e usuario
        gardarToken(data.token);
        usuarioActual = data.usuario;

        // Ir á aplicación
        actualizarCabeceira();
        mostrarVista('lista-usuarios');
        await renderizarListaUsuarios();

        return true;

    } catch (error) {
        console.error('Erro no login:', error);
        mostrarErro('login', error.message);
        return false;
    }
}

/**
 * Rexistro
 */
async function fazerRexistro(nome, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao crear conta');
        }

        // Gardar token e usuario
        gardarToken(data.token);
        usuarioActual = data.usuario;

        // Ir á aplicación
        actualizarCabeceira();
        mostrarVista('lista-usuarios');
        await renderizarListaUsuarios();

        return true;

    } catch (error) {
        console.error('Erro no rexistro:', error);
        mostrarErro('rexistro', error.message);
        return false;
    }
}

/**
 * Pechar sesión
 */
function pecharSesion() {
    eliminarToken();
    usuarioActual = null;
    Cache.usuarios = [];
    Cache.mensaxes = [];

    document.getElementById('main-nav').style.display = 'none';
    document.querySelector('.usuario-actual').style.display = 'none';

    mostrarVista('login');
}

/**
 * Verificar sesión ao cargar
 */
async function verificarSesion() {
    const token = obterToken();

    if (!token) {
        mostrarVista('login');
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: obterHeadersAuth()
        });

        if (!response.ok) {
            throw new Error('Sesión inválida');
        }

        usuarioActual = await response.json();
        actualizarCabeceira();
        mostrarVista('lista-usuarios');
        await renderizarListaUsuarios();

        return true;

    } catch (error) {
        console.error('Erro ao verificar sesión:', error);
        eliminarToken();
        mostrarVista('login');
        return false;
    }
}

// ==========================================
// 4. FUNCIÓNS DE API CON AUTENTICACIÓN
// ==========================================

/**
 * Carga todos os usuarios desde o servidor
 */
async function cargarUsuarios() {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            headers: obterHeadersAuth()
        });

        if (manejarErroAuth(response)) return [];
        if (!response.ok) throw new Error('Erro ao cargar usuarios');

        Cache.usuarios = await response.json();
        return Cache.usuarios;
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

/**
 * Actualiza un usuario no servidor
 */
async function actualizarUsuarioAPI(usuario) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
            method: 'PUT',
            headers: obterHeadersAuth(),
            body: JSON.stringify(usuario)
        });

        if (manejarErroAuth(response)) return null;
        if (!response.ok) throw new Error('Erro ao actualizar usuario');

        const usuarioActualizado = await response.json();

        const index = Cache.usuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
            Cache.usuarios[index] = usuarioActualizado;
        }

        return usuarioActualizado;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao gardar os cambios');
        return null;
    }
}

/**
 * Engade un apunte a un usuario
 */
async function engadirApunteAPI(usuarioId, apunte) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${usuarioId}/apuntes`, {
            method: 'POST',
            headers: obterHeadersAuth(),
            body: JSON.stringify(apunte)
        });

        if (manejarErroAuth(response)) return null;
        if (!response.ok) throw new Error('Erro ao engadir apunte');

        const novoApunte = await response.json();

        const usuario = Cache.usuarios.find(u => u.id === usuarioId);
        if (usuario) {
            usuario.apuntes.push(novoApunte);
        }

        return novoApunte;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao engadir apunte');
        return null;
    }
}

/**
 * Elimina un apunte dun usuario
 */
async function eliminarApunteAPI(usuarioId, apunteId) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${usuarioId}/apuntes/${apunteId}`, {
            method: 'DELETE',
            headers: obterHeadersAuth()
        });

        if (manejarErroAuth(response)) return false;
        if (!response.ok) throw new Error('Erro ao eliminar apunte');

        const usuario = Cache.usuarios.find(u => u.id === usuarioId);
        if (usuario) {
            usuario.apuntes = usuario.apuntes.filter(a => a.id !== apunteId);
        }

        return true;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao eliminar apunte');
        return false;
    }
}

/**
 * Envía unha mensaxe ao servidor
 */
async function enviarMensaxeAPI(para, texto) {
    try {
        const response = await fetch(`${API_URL}/mensaxes`, {
            method: 'POST',
            headers: obterHeadersAuth(),
            body: JSON.stringify({ para, texto })
        });

        if (manejarErroAuth(response)) return null;
        if (!response.ok) throw new Error('Erro ao enviar mensaxe');

        const novaMensaxe = await response.json();
        Cache.mensaxes.push(novaMensaxe);
        return novaMensaxe;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar mensaxe');
        return null;
    }
}

/**
 * Obtén mensaxes entre dous usuarios desde o servidor
 */
async function obterMensaxesEntreAPI(usuario1Id, usuario2Id) {
    try {
        const response = await fetch(`${API_URL}/mensaxes/${usuario1Id}/${usuario2Id}`, {
            headers: obterHeadersAuth()
        });

        if (manejarErroAuth(response)) return [];
        if (!response.ok) throw new Error('Erro ao cargar mensaxes');

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

/**
 * Obter conversas dun usuario
 */
async function obterConversasUsuario(usuarioId) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${usuarioId}/conversas`, {
            headers: obterHeadersAuth()
        });

        if (manejarErroAuth(response)) return [];
        if (!response.ok) throw new Error('Erro ao cargar conversas');

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

// ==========================================
// 5. FUNCIÓNS DE UI
// ==========================================

/**
 * Mostra unha vista e oculta todas as demais
 */
function mostrarVista(nomeVista) {
    document.querySelectorAll('.vista').forEach(vista => {
        vista.classList.add('oculto');
    });

    const vista = document.getElementById(`vista-${nomeVista}`);
    if (vista) {
        vista.classList.remove('oculto');
        vistaActual = nomeVista;
    }
}

/**
 * Actualiza a cabeceira coa información do usuario actual
 */
function actualizarCabeceira() {
    const nomeUsuarioElement = document.getElementById('nome-usuario-actual');
    const fotoUsuarioElement = document.getElementById('foto-usuario-actual');

    if (usuarioActual) {
        nomeUsuarioElement.textContent = usuarioActual.nome;

        // Mostrar foto de perfil se existe
        if (usuarioActual.foto_perfil) {
            fotoUsuarioElement.src = usuarioActual.foto_perfil;
            fotoUsuarioElement.alt = usuarioActual.nome;
            fotoUsuarioElement.style.display = 'block';
        } else {
            fotoUsuarioElement.style.display = 'none';
        }

        document.getElementById('main-nav').style.display = 'flex';
        document.querySelector('.usuario-actual').style.display = 'flex';
    } else {
        nomeUsuarioElement.textContent = '';
        fotoUsuarioElement.style.display = 'none';
        document.getElementById('main-nav').style.display = 'none';
        document.querySelector('.usuario-actual').style.display = 'none';
    }
}

/**
 * Mostrar mensaxe de erro
 */
function mostrarErro(vista, mensaxe) {
    const erroElement = document.getElementById(`${vista}-erro`);
    if (erroElement) {
        erroElement.textContent = mensaxe;
        erroElement.classList.remove('oculto');
    }
}

/**
 * Ocultar mensaxe de erro
 */
function ocultarErro(vista) {
    const erroElement = document.getElementById(`${vista}-erro`);
    if (erroElement) {
        erroElement.classList.add('oculto');
    }
}

// ==========================================
// 6. LISTA DE USUARIOS
// ==========================================

/**
 * Renderiza a lista de todos os usuarios (excepto o actual)
 */
async function renderizarListaUsuarios() {
    await cargarUsuarios();

    const container = document.getElementById('lista-usuarios');
    container.innerHTML = '';

    Cache.usuarios.forEach(usuario => {
        if (usuario.id === usuarioActual.id) return;

        const card = document.createElement('div');
        card.className = 'usuario-card';

        const descricionPreview = usuario.descricion
            ? usuario.descricion.substring(0, 80) + (usuario.descricion.length > 80 ? '...' : '')
            : 'Sen descrición';

        const fotoSrc = usuario.foto_perfil ||
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23667eea" font-size="32" font-family="Arial">👤</text></svg>';

        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <img src="${fotoSrc}" alt="${usuario.nome}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #667eea;">
                <h3 style="margin: 0;">${usuario.nome}</h3>
            </div>
            <p>${descricionPreview}</p>
            <p style="margin-top: 10px; color: #667eea; font-size: 0.85rem;">
                📚 ${usuario.asignaturas.length} asignaturas
            </p>
        `;

        card.onclick = () => mostrarPerfilUsuario(usuario.id);
        container.appendChild(card);
    });
}

// ==========================================
// 7. PERFIL DO USUARIO ACTUAL
// ==========================================

function mostrarMeuPerfil() {
    mostrarVista('meu-perfil');
    document.getElementById('perfil-visualizacion').classList.remove('oculto');
    document.getElementById('perfil-edicion').classList.add('oculto');
    renderizarMeuPerfil();
}

function renderizarMeuPerfil() {
    document.getElementById('perfil-nome').textContent = usuarioActual.nome;

    // Mostrar foto de perfil
    const fotoElement = document.getElementById('perfil-foto');
    if (usuarioActual.foto_perfil) {
        fotoElement.src = usuarioActual.foto_perfil;
        fotoElement.alt = usuarioActual.nome;
    } else {
        fotoElement.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23667eea" font-size="48" font-family="Arial">👤</text></svg>';
        fotoElement.alt = 'Sen foto';
    }

    const descricionElement = document.getElementById('perfil-descricion');
    if (usuarioActual.descricion) {
        descricionElement.textContent = usuarioActual.descricion;
        descricionElement.classList.remove('texto-placeholder');
    } else {
        descricionElement.textContent = 'Non hai descrición aínda...';
        descricionElement.classList.add('texto-placeholder');
    }

    const asignaturasContainer = document.getElementById('perfil-asignaturas');
    if (usuarioActual.asignaturas.length > 0) {
        asignaturasContainer.innerHTML = '';
        usuarioActual.asignaturas.forEach(asignatura => {
            const tag = document.createElement('span');
            tag.className = 'asignatura-tag';
            tag.textContent = asignatura;
            asignaturasContainer.appendChild(tag);
        });
    } else {
        asignaturasContainer.innerHTML = '<p class="texto-placeholder">Non hai asignaturas aínda...</p>';
    }

    const apuntesContainer = document.getElementById('perfil-apuntes');
    if (usuarioActual.apuntes.length > 0) {
        apuntesContainer.innerHTML = '';
        usuarioActual.apuntes.forEach(apunte => {
            apuntesContainer.appendChild(crearElementoApunte(apunte, false));
        });
    } else {
        apuntesContainer.innerHTML = '<p class="texto-placeholder">Non hai apuntes aínda...</p>';
    }
}

function mostrarEdicionPerfil() {
    document.getElementById('perfil-visualizacion').classList.add('oculto');
    document.getElementById('perfil-edicion').classList.remove('oculto');

    // Mostrar foto de perfil no preview
    const fotoPreview = document.getElementById('edit-foto-preview');
    if (usuarioActual.foto_perfil) {
        fotoPreview.src = usuarioActual.foto_perfil;
        fotoPreview.alt = usuarioActual.nome;
    } else {
        fotoPreview.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23667eea" font-size="48" font-family="Arial">👤</text></svg>';
        fotoPreview.alt = 'Sen foto';
    }

    document.getElementById('edit-descricion').value = usuarioActual.descricion;
    renderizarAsignaturasEdicion();
    renderizarApuntesEdicion();
}

function renderizarAsignaturasEdicion() {
    const container = document.getElementById('lista-asignaturas-edicion');
    container.innerHTML = '';

    usuarioActual.asignaturas.forEach((asignatura, index) => {
        const tag = document.createElement('span');
        tag.className = 'asignatura-tag editable';
        tag.innerHTML = `
            ${asignatura}
            <button class="btn-eliminar-tag" onclick="eliminarAsignatura(${index})">×</button>
        `;
        container.appendChild(tag);
    });
}

function engadirAsignatura() {
    const input = document.getElementById('nova-asignatura');
    const asignatura = input.value.trim();

    if (asignatura === '') {
        alert('Por favor, introduce un nome de asignatura');
        return;
    }

    if (usuarioActual.asignaturas.includes(asignatura)) {
        alert('Esta asignatura xa está na lista');
        return;
    }

    usuarioActual.asignaturas.push(asignatura);
    input.value = '';
    renderizarAsignaturasEdicion();
}

function eliminarAsignatura(index) {
    usuarioActual.asignaturas.splice(index, 1);
    renderizarAsignaturasEdicion();
}

function renderizarApuntesEdicion() {
    const container = document.getElementById('lista-apuntes-edicion');
    container.innerHTML = '';

    usuarioActual.apuntes.forEach(apunte => {
        container.appendChild(crearElementoApunte(apunte, true));
    });
}

function crearElementoApunte(apunte, modoEdicion) {
    const div = document.createElement('div');
    div.className = 'apunte-item';

    const tipoTexto = apunte.tipo === 'texto' ? '📝 Texto' : '📎 Arquivo';

    div.innerHTML = `
        <div class="apunte-info">
            <div class="apunte-nome">${apunte.nome}</div>
            <div class="apunte-tipo">${tipoTexto}</div>
        </div>
        <div class="apunte-accions">
            ${apunte.tipo === 'texto'
                ? `<button onclick="verApunteTexto(${apunte.id})">Ver</button>`
                : `<button onclick="descargarApunte(${apunte.id})">Descargar</button>`}
            ${modoEdicion ? `<button class="btn-eliminar" onclick="eliminarApunte(${apunte.id})">Eliminar</button>` : ''}
        </div>
    `;

    return div;
}

async function engadirApunteTexto() {
    const nomeInput = document.getElementById('nome-apunte');
    const nome = nomeInput.value.trim();

    if (nome === '') {
        alert('Por favor, introduce un nome para o apunte');
        return;
    }

    const contido = prompt('Escribe o contido do apunte:');
    if (contido === null || contido.trim() === '') {
        return;
    }

    const novoApunte = await engadirApunteAPI(usuarioActual.id, {
        nome: nome,
        tipo: 'texto',
        contido: contido
    });

    if (novoApunte) {
        nomeInput.value = '';
        renderizarApuntesEdicion();
    }
}

async function engadirApunteArquivo() {
    const nomeInput = document.getElementById('nome-apunte');
    const nome = nomeInput.value.trim();

    if (nome === '') {
        alert('Por favor, introduce un nome para o apunte');
        return;
    }

    const inputArquivo = document.getElementById('input-arquivo-apunte');
    inputArquivo.click();

    inputArquivo.onchange = async () => {
        const arquivo = inputArquivo.files[0];
        if (!arquivo) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const novoApunte = await engadirApunteAPI(usuarioActual.id, {
                nome: nome,
                tipo: 'arquivo',
                nomeArquivo: arquivo.name,
                contido: e.target.result
            });

            if (novoApunte) {
                nomeInput.value = '';
                inputArquivo.value = '';
                renderizarApuntesEdicion();
            }
        };

        reader.readAsDataURL(arquivo);
    };
}

async function eliminarApunte(apunteId) {
    if (!confirm('Estás seguro de que queres eliminar este apunte?')) {
        return;
    }

    const eliminado = await eliminarApunteAPI(usuarioActual.id, apunteId);
    if (eliminado) {
        renderizarApuntesEdicion();
    }
}

function verApunteTexto(apunteId) {
    const usuario = vistaActual === 'meu-perfil' ? usuarioActual : obterUsuarioPorId(usuarioVisualizandoId);
    const apunte = usuario.apuntes.find(a => a.id === apunteId);

    if (!apunte) return;

    document.getElementById('modal-apunte-titulo').textContent = apunte.nome;
    document.getElementById('modal-apunte-contido').textContent = apunte.contido;
    document.getElementById('modal-apunte').classList.remove('oculto');
}

function descargarApunte(apunteId) {
    const usuario = vistaActual === 'meu-perfil' ? usuarioActual : obterUsuarioPorId(usuarioVisualizandoId);
    const apunte = usuario.apuntes.find(a => a.id === apunteId);

    if (!apunte || apunte.tipo !== 'arquivo') return;

    const link = document.createElement('a');
    link.href = apunte.contido;
    link.download = apunte.nomeArquivo;
    link.click();
}

function cambiarFotoPerfil() {
    const inputFoto = document.getElementById('input-foto-perfil');
    inputFoto.click();
}

function eliminarFotoPerfil() {
    usuarioActual.foto_perfil = null;
    const fotoPreview = document.getElementById('edit-foto-preview');
    fotoPreview.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23667eea" font-size="48" font-family="Arial">👤</text></svg>';
    fotoPreview.alt = 'Sen foto';
}

function manejarCambioFoto(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    // Verificar que sexa unha imaxe
    if (!arquivo.type.startsWith('image/')) {
        alert('Por favor, selecciona unha imaxe válida');
        return;
    }

    // Verificar tamaño (máximo 2MB)
    if (arquivo.size > 2 * 1024 * 1024) {
        alert('A imaxe é demasiado grande. Máximo 2MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        usuarioActual.foto_perfil = e.target.result;
        const fotoPreview = document.getElementById('edit-foto-preview');
        fotoPreview.src = e.target.result;
        fotoPreview.alt = usuarioActual.nome;
    };
    reader.readAsDataURL(arquivo);
}

async function gardarPerfil() {
    usuarioActual.descricion = document.getElementById('edit-descricion').value.trim();

    const actualizado = await actualizarUsuarioAPI(usuarioActual);

    if (actualizado) {
        usuarioActual = actualizado;
        document.getElementById('perfil-visualizacion').classList.remove('oculto');
        document.getElementById('perfil-edicion').classList.add('oculto');
        renderizarMeuPerfil();
        actualizarCabeceira();
    }
}

async function cancelarEdicion() {
    await cargarUsuarios();
    usuarioActual = Cache.usuarios.find(u => u.id === usuarioActual.id);

    document.getElementById('perfil-visualizacion').classList.remove('oculto');
    document.getElementById('perfil-edicion').classList.add('oculto');
}

// ==========================================
// 8. PERFIL DOUTRO USUARIO
// ==========================================

function mostrarPerfilUsuario(usuarioId) {
    const usuario = obterUsuarioPorId(usuarioId);
    if (!usuario) return;

    usuarioVisualizandoId = usuarioId;
    mostrarVista('perfil-usuario');

    document.getElementById('outro-perfil-nome').textContent = usuario.nome;

    // Mostrar foto de perfil
    const fotoElement = document.getElementById('outro-perfil-foto');
    if (usuario.foto_perfil) {
        fotoElement.src = usuario.foto_perfil;
        fotoElement.alt = usuario.nome;
    } else {
        fotoElement.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23667eea" font-size="48" font-family="Arial">👤</text></svg>';
        fotoElement.alt = 'Sen foto';
    }

    const descricionElement = document.getElementById('outro-perfil-descricion');
    if (usuario.descricion) {
        descricionElement.textContent = usuario.descricion;
        descricionElement.classList.remove('texto-placeholder');
    } else {
        descricionElement.textContent = 'Sen descrición';
        descricionElement.classList.add('texto-placeholder');
    }

    const asignaturasContainer = document.getElementById('outro-perfil-asignaturas');
    if (usuario.asignaturas.length > 0) {
        asignaturasContainer.innerHTML = '';
        usuario.asignaturas.forEach(asignatura => {
            const tag = document.createElement('span');
            tag.className = 'asignatura-tag';
            tag.textContent = asignatura;
            asignaturasContainer.appendChild(tag);
        });
    } else {
        asignaturasContainer.innerHTML = '<p class="texto-placeholder">Sen asignaturas</p>';
    }

    const apuntesContainer = document.getElementById('outro-perfil-apuntes');
    if (usuario.apuntes.length > 0) {
        apuntesContainer.innerHTML = '';
        usuario.apuntes.forEach(apunte => {
            apuntesContainer.appendChild(crearElementoApunte(apunte, false));
        });
    } else {
        apuntesContainer.innerHTML = '<p class="texto-placeholder">Sen apuntes</p>';
    }
}

function obterUsuarioPorId(id) {
    return Cache.usuarios.find(u => u.id === id);
}

// ==========================================
// 9. SISTEMA DE CHAT
// ==========================================

async function iniciarChat(usuarioId) {
    chatAbertoCon = usuarioId;
    mostrarVista('chat');
    await renderizarChat();
}

async function renderizarChat() {
    const usuario = obterUsuarioPorId(chatAbertoCon);
    if (!usuario) return;

    document.getElementById('chat-nome-usuario').textContent = usuario.nome;

    const mensaxes = await obterMensaxesEntreAPI(usuarioActual.id, chatAbertoCon);

    const container = document.getElementById('chat-mensaxes');
    container.innerHTML = '';

    mensaxes.forEach(mensaxe => {
        const div = document.createElement('div');
        const ePropia = mensaxe.de === usuarioActual.id;
        div.className = `mensaxe ${ePropia ? 'mensaxe-propia' : 'mensaxe-outra'}`;

        const data = new Date(mensaxe.timestamp);
        const horaFormateada = `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;

        div.innerHTML = `
            <div>${mensaxe.texto}</div>
            <div class="mensaxe-timestamp">${horaFormateada}</div>
        `;

        container.appendChild(div);
    });

    container.scrollTop = container.scrollHeight;
    document.getElementById('chat-input').focus();
}

async function enviarMensaxe() {
    const input = document.getElementById('chat-input');
    const texto = input.value.trim();

    if (texto === '') return;

    const enviado = await enviarMensaxeAPI(chatAbertoCon, texto);

    if (enviado) {
        input.value = '';
        await renderizarChat();
    }
}

async function mostrarConversas() {
    mostrarVista('conversas');
    await renderizarConversas();
}

async function renderizarConversas() {
    const conversas = await obterConversasUsuario(usuarioActual.id);

    const container = document.getElementById('lista-conversas');

    if (conversas.length === 0) {
        container.innerHTML = '<p class="texto-placeholder">Non tes conversas aínda. Visita o perfil dun usuario e inicia un chat!</p>';
        return;
    }

    container.innerHTML = '';

    conversas.forEach(conversa => {
        const div = document.createElement('div');
        div.className = 'conversa-item';
        div.onclick = () => iniciarChat(conversa.usuario.id);

        const previewTexto = conversa.ultimaMensaxe.texto.substring(0, 50) +
            (conversa.ultimaMensaxe.texto.length > 50 ? '...' : '');

        div.innerHTML = `
            <div>
                <div class="conversa-nome">${conversa.usuario.nome}</div>
                <div class="conversa-preview">${previewTexto}</div>
            </div>
        `;

        container.appendChild(div);
    });
}

// ==========================================
// 10. INICIALIZACIÓN E EVENT LISTENERS
// ==========================================

async function inicializar() {
    // Cargar tema gardado
    cargarTema();

    // Verificar sesión existente
    const sesionActiva = await verificarSesion();

    // Event listener do toggle de tema
    document.getElementById('btn-toggle-tema').addEventListener('click', toggleTema);

    // Event listeners de login
    document.getElementById('btn-login').addEventListener('click', async () => {
        ocultarErro('login');
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            mostrarErro('login', 'Por favor, completa todos os campos');
            return;
        }

        await fazerLogin(email, password);
    });

    // Enter no login
    ['login-email', 'login-password'].forEach(id => {
        document.getElementById(id).addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                document.getElementById('btn-login').click();
            }
        });
    });

    // Link para rexistro
    document.getElementById('link-rexistro').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarVista('rexistro');
    });

    // Event listeners de rexistro
    document.getElementById('btn-rexistro').addEventListener('click', async () => {
        ocultarErro('rexistro');
        const nome = document.getElementById('rexistro-nome').value.trim();
        const email = document.getElementById('rexistro-email').value.trim();
        const password = document.getElementById('rexistro-password').value;
        const passwordConfirm = document.getElementById('rexistro-password-confirm').value;

        if (!nome || !email || !password || !passwordConfirm) {
            mostrarErro('rexistro', 'Por favor, completa todos os campos');
            return;
        }

        if (password.length < 6) {
            mostrarErro('rexistro', 'A contraseña debe ter polo menos 6 caracteres');
            return;
        }

        if (password !== passwordConfirm) {
            mostrarErro('rexistro', 'As contraseñas non coinciden');
            return;
        }

        await fazerRexistro(nome, email, password);
    });

    // Link para login
    document.getElementById('link-login').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarVista('login');
    });

    // Botón de pechar sesión
    document.getElementById('btn-pechar-sesion').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que queres pechar sesión?')) {
            pecharSesion();
        }
    });

    // Navegación principal
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const vista = btn.dataset.view;
            if (vista === 'lista-usuarios') {
                mostrarVista('lista-usuarios');
                await renderizarListaUsuarios();
            } else if (vista === 'meu-perfil') {
                mostrarMeuPerfil();
            } else if (vista === 'conversas') {
                await mostrarConversas();
            }
        });
    });

    // Botóns do perfil
    document.getElementById('btn-editar-perfil').addEventListener('click', mostrarEdicionPerfil);
    document.getElementById('btn-gardar-perfil').addEventListener('click', gardarPerfil);
    document.getElementById('btn-cancelar-edicion').addEventListener('click', cancelarEdicion);

    // Botóns de foto de perfil
    document.getElementById('btn-cambiar-foto').addEventListener('click', cambiarFotoPerfil);
    document.getElementById('btn-eliminar-foto').addEventListener('click', eliminarFotoPerfil);
    document.getElementById('input-foto-perfil').addEventListener('change', manejarCambioFoto);

    // Botóns de asignaturas
    document.getElementById('btn-engadir-asignatura').addEventListener('click', engadirAsignatura);
    document.getElementById('nova-asignatura').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') engadirAsignatura();
    });

    // Botóns de apuntes
    document.getElementById('btn-engadir-apunte-texto').addEventListener('click', engadirApunteTexto);
    document.getElementById('btn-engadir-apunte-arquivo').addEventListener('click', engadirApunteArquivo);

    // Botón de iniciar chat
    document.getElementById('btn-iniciar-chat').addEventListener('click', async () => {
        await iniciarChat(usuarioVisualizandoId);
    });

    // Botóns de volver
    document.querySelectorAll('.btn-volver').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (vistaActual === 'perfil-usuario') {
                mostrarVista('lista-usuarios');
                await renderizarListaUsuarios();
            } else if (vistaActual === 'chat') {
                await mostrarConversas();
            }
        });
    });

    // Chat
    document.getElementById('btn-enviar-mensaxe').addEventListener('click', enviarMensaxe);
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensaxe();
    });

    // Modal de apuntes
    document.querySelector('.btn-pechar-modal').addEventListener('click', () => {
        document.getElementById('modal-apunte').classList.add('oculto');
    });

    document.getElementById('modal-apunte').addEventListener('click', (e) => {
        if (e.target.id === 'modal-apunte') {
            document.getElementById('modal-apunte').classList.add('oculto');
        }
    });

    console.log('✅ Aplicación Xuntos (con autenticación) inicializada correctamente');
}

// Iniciar a aplicación cando se cargue o DOM
document.addEventListener('DOMContentLoaded', inicializar);
