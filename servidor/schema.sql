-- ==========================================
-- ESQUEMA DE BASE DE DATOS PARA XUNTOS
-- ==========================================

-- Eliminar tablas se existen (para recrear)
DROP TABLE IF EXISTS mensaxes CASCADE;
DROP TABLE IF EXISTS apuntes CASCADE;
DROP TABLE IF EXISTS usuario_asignaturas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    descricion TEXT DEFAULT '',
    foto_perfil TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asignaturas por usuario
CREATE TABLE usuario_asignaturas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    asignatura VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, asignatura)
);

-- Tabla de apuntes
CREATE TABLE apuntes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('texto', 'arquivo')),
    contido TEXT NOT NULL,
    nome_arquivo VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensaxes
CREATE TABLE mensaxes (
    id SERIAL PRIMARY KEY,
    de INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    para INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mellor rendemento
CREATE INDEX idx_usuario_asignaturas_usuario ON usuario_asignaturas(usuario_id);
CREATE INDEX idx_apuntes_usuario ON apuntes(usuario_id);
CREATE INDEX idx_mensaxes_de ON mensaxes(de);
CREATE INDEX idx_mensaxes_para ON mensaxes(para);
CREATE INDEX idx_mensaxes_timestamp ON mensaxes(timestamp);

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar timestamp en usuarios
CREATE TRIGGER trigger_actualizar_usuarios
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- Trigger para actualizar timestamp en apuntes
CREATE TRIGGER trigger_actualizar_apuntes
    BEFORE UPDATE ON apuntes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();
