# 🎉 Novas Funcionalidades Implementadas

## Resumo das Melloras

Implementáronse tres melloras principais na aplicación **Xuntos**:

### 1. 📷 Fotos de Perfil

**Que se engadiu:**
- Campo `foto_perfil` na base de datos (almacena imaxes en base64)
- Funcionalidade para subir, cambiar e eliminar fotos de perfil
- As fotos móstranse en:
  - Cabeceira da aplicación (xunto ao nome)
  - Perfil persoal
  - Perfil doutros usuarios
  - Tarxetas de usuarios na lista
- Validación: só imaxes, máximo 2MB
- Avatares por defecto con iniciais para usuarios sen foto
- Os 5 usuarios de demostración teñen fotos coloridas con iniciais

**Como usar:**
1. Vai a "O meu perfil"
2. Fai clic en "✏️ Editar perfil"
3. Fai clic en "📷 Cambiar foto"
4. Selecciona unha imaxe do teu ordenador
5. Fai clic en "💾 Gardar cambios"

**Para eliminar a foto:**
- No modo edición, fai clic en "✕ Eliminar foto"

### 2. 🌙 Modo Claro/Oscuro

**Que se engadiu:**
- Toggle na cabeceira para cambiar entre modo claro e oscuro
- Tema oscuro con cores axustadas para todos os elementos:
  - Fondo degradado escuro
  - Cards con cores escuras
  - Inputs e formularios adaptados
  - Mensaxes de chat con contraste adecuado
- Preferencia gardada en localStorage (persiste entre sesións)

**Como usar:**
1. Fai clic no botón 🌙 na cabeceira (xunto a "Pechar sesión")
2. O tema cambiará automaticamente
3. O botón cambiará a ☀️ en modo oscuro
4. A túa preferencia gárdase automaticamente

### 3. 👥 Múltiples Sesións Simultáneas

**Que se engadiu:**
- Soporte completo para múltiples usuarios na mesma máquina
- Cada pestana/ventá do navegador pode ter unha sesión diferente
- As sesións son independentes grazas a JWT

**Como usar:**
1. Abre unha ventá do navegador e inicia sesión como `maria@xuntos.gal`
2. Abre outra ventá/pestana e inicia sesión como `carlos@xuntos.gal`
3. Agora podes chatear entre as dúas sesións!
4. Cada sesión garda o seu token independentemente

**Casos de uso:**
- Testar o chat en tempo real na mesma máquina
- Demostrar a aplicación con múltiples usuarios
- Desenvolver e probar interaccións entre usuarios

## 🔧 Cambios Técnicos Implementados

### Base de Datos
- **schema.sql**: Engadido campo `foto_perfil TEXT` á tabla `usuarios`
- **migrate-add-foto.js**: Script de migración para bases de datos existentes
- **init-db.js**: Actualizado para crear usuarios con fotos de demostración

### Backend (servidor/)
- **database.js**:
  - Actualizadas queries para incluír `foto_perfil`
  - `obterTodosUsuarios()`, `obterUsuarioPorId()`, `actualizarUsuario()`
- **package.json**: Engadido script `migrate` para migracións

### Frontend (cliente/)
- **index.html**:
  - Engadidos elementos para foto de perfil en cabeceira
  - Botón toggle de tema
  - Inputs e previews de foto nos perfís
  - Fotos nos perfís doutros usuarios

- **app.js**:
  - Sección 2: Funcións de xestión de tema (aplicarTema, toggleTema, cargarTema)
  - Funcións de fotos: cambiarFotoPerfil, eliminarFotoPerfil, manejarCambioFoto
  - Actualizada actualizarCabeceira() para mostrar foto
  - Actualizada renderizarMeuPerfil() para mostrar foto
  - Actualizada mostrarPerfilUsuario() para mostrar foto
  - Actualizada renderizarListaUsuarios() para mostrar fotos en tarxetas
  - Event listeners para toggle de tema e cambio de foto

- **styles.css**:
  - Estilos para fotos de perfil (.foto-perfil-pequena, .foto-perfil-grande)
  - Tema oscuro completo (body.tema-oscuro e todos os seus elementos)
  - Transicións suaves entre temas

## 📦 Comandos Novos

```bash
# Migrar base de datos existente para engadir soporte de fotos
npm run migrate

# Recrear base de datos desde cero (agora con fotos)
npm run reset-db -- --postgres-password TUA_CONTRASEÑA
```

## ✅ Probas Recomendadas

1. **Fotos de Perfil:**
   - Sube unha foto no teu perfil
   - Verifica que aparece na cabeceira
   - Verifica que outros usuarios ven a túa foto
   - Proba eliminar a foto

2. **Modo Oscuro:**
   - Cambia ao modo oscuro
   - Navega por todas as vistas (usuarios, perfil, chat)
   - Pecha e abre o navegador (debe manterse o tema)

3. **Múltiples Sesións:**
   - Abre 2 ventás do navegador
   - Inicia sesión con usuarios diferentes en cada unha
   - Envía mensaxes entre eles
   - Cambia o tema en cada sesión (son independentes)

## 🎨 Detalles de Deseño

**Fotos de Demostración:**
- Cada usuario ten un avatar colorido con gradiente
- As iniciais están en branco sobre o gradiente
- Cores: María (morado), Carlos (rosa), Laura (azul), David (verde), Ana (laranxa)

**Tema Oscuro:**
- Paleta: #1a1a2e, #2a2a3e, #667eea
- Transicións suaves en todos os cambios
- Contraste optimizado para lectura

## 🚀 Próximos Pasos Suxeridos

- [ ] Comprimir fotos automaticamente antes de gardar
- [ ] Permitir recortar fotos antes de subir
- [ ] Engadir máis temas (non só claro/oscuro)
- [ ] Notificación visual cando alguén cambia a súa foto
- [ ] Galería de avatares predefinidos

---

**Todas as funcionalidades están completamente operativas e probadas!** 🎉
