# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Xuntos** is a full-stack web application written entirely in Galician that enables students to collaborate by sharing profiles, notes, and chatting with each other. The application features JWT authentication, PostgreSQL database persistence, profile photos, and light/dark theme support.

## Technology Stack

### Backend
- Node.js with Express
- PostgreSQL database with pg connection pool
- bcrypt for password hashing (10 rounds)
- JWT (jsonwebtoken) for authentication (7-day token validity)
- CORS middleware for development
- RESTful API architecture with protected routes

### Frontend
- Pure vanilla JavaScript (ES6+) with async/await
- HTML5 with semantic structure
- CSS3 with responsive design and dark mode
- Fetch API for server communication
- localStorage for JWT token and theme persistence
- All content and UI in Galician language

## Running the Application

### Database Setup

**First time setup:**
```bash
cd servidor
npm install
npm run init-db

# If postgres has a different password:
node init-db.js --postgres-password YOUR_PASSWORD
```

**Reset database (drops and recreates):**
```bash
npm run reset-db -- --postgres-password YOUR_PASSWORD
```

**Migrate existing database (add photo support):**
```bash
npm run migrate
```

### Start Server

```bash
cd servidor
npm start
# Server runs on http://localhost:3000
```

### Demo Credentials

Five users with full profiles and photos:
- Email: maria@xuntos.gal, carlos@xuntos.gal, laura@xuntos.gal, david@xuntos.gal, ana@xuntos.gal
- Password: demo123 (all users)

### Multiple Sessions

Open multiple browser windows/tabs and log in with different users to test chat functionality on the same machine.

## Architecture & Code Structure

### Directory Organization

```
Proyecto/
├── cliente/              # Frontend application
│   ├── index.html       # Complete app markup with auth views
│   ├── app.js          # Client logic (999 lines, 10 sections)
│   └── styles.css      # Responsive styles + dark theme
├── servidor/            # Backend application
│   ├── server.js       # Express server & protected API routes
│   ├── database.js     # PostgreSQL data access layer
│   ├── schema.sql      # Database schema (4 tables)
│   ├── seed.sql        # Demo data with initial content
│   ├── init-db.js      # Database initialization script
│   ├── migrate-add-foto.js  # Migration for photo support
│   ├── .env            # Database and JWT configuration
│   └── package.json    # Server dependencies
├── fotos/               # Profile photos directory
├── README.md           # User documentation
└── NOVAS_FUNCIONALIDADES.md  # Recent features documentation
```

## Database Architecture

### PostgreSQL Schema

**Tables:**
1. `usuarios` - User profiles with authentication
   - id, nome, email, password_hash, descricion, foto_perfil, timestamps
2. `usuario_asignaturas` - User subjects (many-to-many)
   - id, usuario_id, asignatura
3. `apuntes` - User notes/files
   - id, usuario_id, nome, tipo, contido, nome_arquivo, timestamps
4. `mensaxes` - Chat messages
   - id, de, para, texto, timestamp

**Key Features:**
- Foreign keys with CASCADE delete
- Indexes for performance optimization
- Triggers for automatic timestamp updates
- Unique constraints on email and user-subject pairs

### Data Access Layer (database.js)

All database operations go through the connection pool with prepared statements:

**User Functions:**
- `obterTodosUsuarios()` - Get all users with subjects (JOIN query)
- `obterUsuarioPorId(id)` - Get user with subjects and notes
- `obterUsuarioPorEmail(email)` - For authentication
- `crearUsuario(nome, email, passwordHash, descricion)`
- `actualizarUsuario(id, {nome, descricion, foto_perfil, asignaturas})` - Transaction

**Notes Functions:**
- `obterApuntesUsuario(usuarioId)`
- `crearApunte(usuarioId, {nome, tipo, contido, nomeArquivo})`
- `eliminarApunte(usuarioId, apunteId)`

**Message Functions:**
- `obterTodasMensaxes()`
- `obterMensaxesEntre(usuario1Id, usuario2Id)` - Ordered by timestamp
- `obterConversasUsuario(usuarioId)` - Get active conversations
- `crearMensaxe(de, para, texto, timestamp)`

## Authentication Flow

### Registration (POST /api/auth/registro)
1. Validate input (nome, email, password ≥6 chars)
2. Check email uniqueness
3. Hash password with bcrypt
4. Insert user into database
5. Generate JWT token
6. Return token + user object (without password_hash)

### Login (POST /api/auth/login)
1. Find user by email
2. Compare password with bcrypt
3. Generate JWT token
4. Return token + user object

### Protected Routes
All routes except `/api/auth/*` require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

Middleware `autenticarToken()` verifies token and attaches user to request.

### Permission Validation
User can only edit their own profile:
```javascript
if (usuarioAutenticado.id !== parseInt(req.params.id)) {
    return res.status(403).json({erro: 'Non tes permisos...'});
}
```

## Frontend Architecture (cliente/app.js)

The client code is organized into 10 sections:

1. **Configuration & State** (lines 1-26) - API_URL, current user, token, cache
2. **Theme Management** (lines 28-60) - Light/dark mode with localStorage
3. **Authentication** (lines 62-241) - Login, register, logout, session verification
4. **API Functions** (lines 243-411) - All fetch calls with JWT headers
5. **UI Helpers** (lines 413-467) - View switching, header updates, error display
6. **User List** (lines 469-522) - Display all users with photos
7. **Current User Profile** (lines 524-810) - View/edit profile, photo management
8. **Other User Profile** (lines 820-883) - View other profiles
9. **Chat System** (lines 885-952) - Messaging functionality
10. **Initialization** (lines 971-1120) - Event listeners setup, theme loading

### Authentication State Management

**Token Storage:**
```javascript
function gardarToken(token) {
    authToken = token;
    localStorage.setItem('xuntos_token', token);
}
```

**Session Verification:**
On page load, `verificarSesion()` checks for existing token and validates with server. If valid, user proceeds to app; if invalid/missing, shows login screen.

**Token Expiration:**
All API calls use `manejarErroAuth()` to detect 401/403 responses, clear token, and redirect to login.

## API Endpoints

### Authentication (Public)
- `POST /api/auth/registro` - Register new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user (requires token)

### Users (Protected)
- `GET /api/usuarios` - Get all users
- `GET /api/usuarios/:id` - Get user by ID
- `PUT /api/usuarios/:id` - Update user (own profile only)

### Notes (Protected)
- `GET /api/usuarios/:id/apuntes` - Get user's notes
- `POST /api/usuarios/:id/apuntes` - Add note (own profile only)
- `DELETE /api/usuarios/:userId/apuntes/:apunteId` - Delete note (own only)

### Messages (Protected)
- `GET /api/mensaxes/:usuario1Id/:usuario2Id` - Get conversation
- `GET /api/usuarios/:id/conversas` - Get user's conversations
- `POST /api/mensaxes` - Send message

## Key Features

### Profile Photos

**Storage:**
- Photos stored as base64 data URLs in `foto_perfil` TEXT column
- Validation: images only, max 2MB (client-side)
- Demo users have real photos from `/fotos` directory or SVG avatars

**Upload Flow:**
1. User clicks "📷 Cambiar foto" in edit mode
2. FileReader converts image to base64 data URL
3. Stored in `usuarioActual.foto_perfil`
4. Sent to server on profile save
5. Database updates via `actualizarUsuario()`

**Display:**
- Header (small circle, 35px)
- Profile pages (large circle, 120px)
- User list cards (60px)
- Default SVG avatar with emoji if no photo

### Dark Mode

**Implementation:**
- Toggle button in header (🌙/☀️)
- CSS class `.tema-oscuro` on body element
- Complete theme with all UI components styled
- Preference saved in localStorage: `xuntos_tema`
- Loaded on app initialization

**CSS Structure:**
```css
body.tema-oscuro .element { /* dark styles */ }
```

### Photo Loading in init-db.js

Photos loaded from `/fotos` directory:
```javascript
function convertirImaxeABase64(rutaImaxe) {
    const imaxe = fs.readFileSync(rutaImaxe);
    const mimeType = /* detect from extension */;
    return `data:${mimeType};base64,${imaxe.toString('base64')}`;
}
```

First 3 users get real photos, others get SVG avatars with gradients and initials.

## Data Structures

### User Object (from database)
```javascript
{
  id: number,
  nome: string,
  email: string,
  descricion: string,
  foto_perfil: string | null,  // base64 data URL
  asignaturas: string[],       // from JOIN
  apuntes: [
    {
      id: number,
      nome: string,
      tipo: 'texto' | 'arquivo',
      contido: string,
      nome_arquivo?: string,
      creado_en: timestamp
    }
  ],
  creado_en: timestamp
}
```

### Message Object
```javascript
{
  id: number,
  de: number,        // from user ID
  para: number,      // to user ID
  texto: string,
  timestamp: bigint  // Unix timestamp in milliseconds
}
```

### JWT Token Payload
```javascript
{
  id: number,       // user ID
  email: string,
  nome: string,
  iat: number,      // issued at
  exp: number       // expires (7 days)
}
```

## Development Guidelines

### Backend Development

**Adding Protected Routes:**
```javascript
router.put('/usuarios/:id', autenticarToken, async (req, res) => {
    const usuarioAutenticado = req.usuario; // from JWT

    // Validate permissions
    if (usuarioAutenticado.id !== parseInt(req.params.id)) {
        return res.status(403).json({erro: 'Non tes permisos'});
    }

    // Process request
});
```

**Database Transactions:**
For operations updating multiple tables, use client transactions:
```javascript
const client = await pool.connect();
try {
    await client.query('BEGIN');
    // multiple queries
    await client.query('COMMIT');
} catch (error) {
    await client.query('ROLLBACK');
    throw error;
} finally {
    client.release();
}
```

**Password Handling:**
- Never return `password_hash` in responses
- Always use bcrypt.compare() for verification
- Hash with bcrypt.hash(password, 10) before storing

### Frontend Development

**API Calls with Authentication:**
```javascript
async function someAPICall() {
    try {
        const response = await fetch(`${API_URL}/endpoint`, {
            method: 'POST',
            headers: obterHeadersAuth(), // includes JWT
            body: JSON.stringify(data)
        });

        if (manejarErroAuth(response)) return null;
        if (!response.ok) throw new Error('Error');

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erro:', error);
        alert('User-friendly error in Galician');
        return null;
    }
}
```

**Photo Handling:**
```javascript
// Upload
const reader = new FileReader();
reader.onload = (e) => {
    usuarioActual.foto_perfil = e.target.result; // base64
    // update preview
};
reader.readAsDataURL(file);

// Display with fallback
const fotoSrc = usuario.foto_perfil || 'data:image/svg+xml,...';
imgElement.src = fotoSrc;
```

**Theme Management:**
```javascript
function aplicarTema(tema) {
    if (tema === 'oscuro') {
        document.body.classList.add('tema-oscuro');
    } else {
        document.body.classList.remove('tema-oscuro');
    }
    localStorage.setItem('xuntos_tema', tema);
}
```

### Database Migrations

When adding new columns:
1. Create migration script (see `migrate-add-foto.js`)
2. Check if column exists before adding
3. Add to package.json scripts
4. Update schema.sql for fresh installs
5. Update init-db.js if demo data needs it

### Environment Variables (.env)

Required configuration:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=xuntos_db
DB_USER=xuntos_user
DB_PASSWORD=your_password
PORT=3000
JWT_SECRET=your_long_secret_key
NODE_ENV=development
```

## Common Development Tasks

### Add New Profile Field

1. Update `schema.sql`: `ALTER TABLE usuarios ADD COLUMN campo TEXT;`
2. Run migration or reset database
3. Update `database.js`: add field to queries (obterTodosUsuarios, actualizarUsuario)
4. Update `index.html`: add input in edit form
5. Update `app.js`:
   - Display in renderizarMeuPerfil()
   - Capture in gardarPerfil()
6. Update `init-db.js`: add to demo users

### Add New API Endpoint

1. Add route in `server.js` with `autenticarToken` middleware
2. Validate permissions if needed
3. Call database function
4. Add API function in `app.js` (section 4) with `obterHeadersAuth()`
5. Call from UI function

### Debug Authentication Issues

1. Check browser localStorage for `xuntos_token`
2. Decode JWT at jwt.io to verify payload
3. Check server logs for token verification errors
4. Verify .env has correct JWT_SECRET
5. Check token expiration (iat vs exp)

### Test Multiple Sessions

1. Open first browser window, login as maria@xuntos.gal
2. Open second window (new window, not tab), login as carlos@xuntos.gal
3. Each has independent JWT in localStorage
4. Test chat between the two

## Security Considerations

**Implemented:**
- Password hashing with bcrypt (never store plain text)
- JWT authentication on all protected routes
- Permission checks (users can only edit own profile)
- SQL injection prevention (prepared statements)
- CORS configured for development

**Not Implemented (production TODO):**
- HTTPS enforcement
- Rate limiting
- Input sanitization for XSS
- CSRF protection
- Secure JWT_SECRET rotation
- Token refresh mechanism
- Account lockout after failed attempts

## File Size Limits

- Profile photos: 2MB max (client-side validation)
- Note files: No server-side limit (be cautious with large uploads)
- Base64 encoding increases size by ~33%

## Galician Language Convention

All user-facing text, variable names, and function names use Galician:
- Functions: `gardarPerfil()`, `actualizarCabeceira()`, `enviarMensaxe()`
- Variables: `usuarioActual`, `mensaxe`, `descricion`
- HTML: button text, labels, placeholders
- Error messages: always in Galician

English used only for:
- Comments explaining technical concepts
- This documentation file
- External library APIs
