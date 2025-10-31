# 🚀 GUÍA DE INSTALACIÓN - XUNTOS CON POSTGRESQL

Esta guía explica paso a paso como instalar e configurar a aplicación Xuntos con PostgreSQL e autenticación.

## 📋 Requisitos Previos

1. **Node.js** (versión 14 ou superior)
   ```bash
   node --version
   ```

2. **PostgreSQL** (versión 12 ou superior)
   ```bash
   psql --version
   ```

## 🔧 Paso 1: Instalar PostgreSQL

### En Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### En macOS (con Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

### En Windows:
Descarga e instala desde: https://www.postgresql.org/download/windows/

## 🔑 Paso 2: Configurar PostgreSQL

Por defecto, PostgreSQL crea un usuario `postgres`. Configura a súa contraseña:

```bash
sudo -u postgres psql
```

Dentro de PostgreSQL:
```sql
ALTER USER postgres WITH PASSWORD 'postgres';
\q
```

## 📦 Paso 3: Instalar Dependencias do Servidor

```bash
cd servidor
npm install
```

Isto instalará:
- express
- cors
- pg (cliente PostgreSQL)
- bcrypt (para hash de contraseñas)
- jsonwebtoken (JWT)
- dotenv (variables de entorno)

## ⚙️ Paso 4: Configurar Variables de Entorno

O arquivo `.env` xa está creado con valores por defecto. Se queres modificalo:

```bash
cd servidor
nano .env
```

Valores por defecto:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=xuntos_db
DB_USER=xuntos_user
DB_PASSWORD=xuntos_password
PORT=3000
JWT_SECRET=xuntos_secret_key_2024_galicia_estudantes_colaboracion_seguridade
NODE_ENV=development
```

## 🗄️ Paso 5: Inicializar a Base de Datos

Este script creará:
- O usuario `xuntos_user` en PostgreSQL
- A base de datos `xuntos_db`
- Todas as tablas (usuarios, asignaturas, apuntes, mensaxes)
- Datos de demostración (5 usuarios con perfís completos)

```bash
cd servidor
npm run init-db
```

Se tes unha contraseña diferente para o usuario `postgres`:
```bash
node init-db.js --postgres-password TUA_CONTRASEÑA
```

Para recrear a base de datos desde cero:
```bash
npm run reset-db
```

## 🚀 Paso 6: Iniciar o Servidor

```bash
cd servidor
npm start
```

Deberías ver:
```
==========================================
   🚀 SERVIDOR XUNTOS
==========================================

📡 Servidor escoitando no porto 3000
🌐 Cliente: http://localhost:3000
📡 API: http://localhost:3000/api

✅ Conexión á base de datos PostgreSQL establecida

📊 Datos na base de datos:
   👥 5 usuarios
   📚 9 apuntes
   💬 18 mensaxes

🔐 Credenciais de acceso:
   Email: maria@xuntos.gal
   Contraseña: demo123

==========================================
```

## 🌐 Paso 7: Acceder á Aplicación

Abre o navegador e vai a: **http://localhost:3000**

## 👤 Usuarios de Demostración

Todos os usuarios teñen a mesma contraseña: **demo123**

1. **maria@xuntos.gal** - María González (Enxeñería Informática)
2. **carlos@xuntos.gal** - Carlos Pérez (Matemáticas)
3. **laura@xuntos.gal** - Laura Fernández (Física)
4. **david@xuntos.gal** - David Silva (Filosofía)
5. **ana@xuntos.gal** - Ana Martínez (Bioloxía)

## 🔍 Verificar a Instalación

### Comprobar que PostgreSQL está en execución:
```bash
sudo systemctl status postgresql
```

### Conectar á base de datos:
```bash
psql -h localhost -U xuntos_user -d xuntos_db
```
Contraseña: `xuntos_password`

### Ver usuarios creados:
```sql
SELECT id, nome, email FROM usuarios;
```

### Ver mensaxes:
```sql
SELECT COUNT(*) FROM mensaxes;
```

Sair de psql:
```sql
\q
```

## ⚠️ Solución de Problemas

### Erro: "PostgreSQL non está instalado"
```bash
# Ubuntu/Debian
sudo apt install postgresql

# macOS
brew install postgresql@15
```

### Erro: "role 'postgres' does not exist"
```bash
sudo -u postgres createuser postgres
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### Erro: "FATAL: Peer authentication failed"
Edita o arquivo de configuración de PostgreSQL:
```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Cambia esta liña:
```
local   all             all                                     peer
```

Por:
```
local   all             all                                     md5
```

Reinicia PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Erro: "port 3000 already in use"
Cambia o porto en `.env`:
```
PORT=3001
```

### Erro de conexión no cliente
1. Verifica que o servidor está en execución
2. Abre a consola do navegador (F12) para ver erros
3. Verifica que a URL da API é correcta

## 🧹 Limpeza e Mantemento

### Reiniciar a base de datos:
```bash
cd servidor
npm run reset-db
```

### Ver logs do servidor:
Os logs aparecen na consola onde executaches `npm start`

### Backup da base de datos:
```bash
pg_dump -h localhost -U xuntos_user xuntos_db > backup.sql
```

### Restaurar backup:
```bash
psql -h localhost -U xuntos_user xuntos_db < backup.sql
```

## 📚 Próximos Pasos

Unha vez instalado correctamente:

1. ✅ Proba o sistema de login
2. ✅ Crea un novo usuario desde o rexistro
3. ✅ Explora os perfís dos usuarios existentes
4. ✅ Envía mensaxes entre usuarios
5. ✅ Engade apuntes ao teu perfil

## 💡 Notas Importantes

- Os datos persisten na base de datos PostgreSQL
- As contraseñas están hasheadas con bcrypt
- Os tokens JWT caducan aos 7 días
- A aplicación usa porto 3000 por defecto
- PostgreSQL usa porto 5432 por defecto

---

**¿Tes problemas?** Revisa os logs do servidor e da consola do navegador para máis información.
