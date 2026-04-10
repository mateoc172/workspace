-- ============================================================
--  Sistema escolar - PostgreSQL
--  Basado en el diagrama ER
-- ============================================================
 
CREATE DATABASE sistema_escolar;
 
\c sistema_escolar;
 
-- ------------------------------------------------------------
-- Tabla: padres
-- ------------------------------------------------------------
CREATE TABLE padres (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL,
    contrasena  VARCHAR(8)   NOT NULL
);
 
-- ------------------------------------------------------------
-- Tabla: estudiantes
-- ------------------------------------------------------------
CREATE TABLE estudiantes (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL,
    contrasena  VARCHAR(8)   NOT NULL,
    id_padre    INT,
    CONSTRAINT fk_estudiante_padre
        FOREIGN KEY (id_padre)
        REFERENCES padres (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
 
-- ------------------------------------------------------------
-- Tabla: directivos
-- ------------------------------------------------------------
CREATE TABLE directivos (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL,
    contrasena  VARCHAR(8)   NOT NULL
);
 
-- ------------------------------------------------------------
-- Tabla: registro
-- Registra cada jornada de servicio de un estudiante
-- supervisada por un directivo.
-- ------------------------------------------------------------
CREATE TABLE registro (
    id                          SERIAL PRIMARY KEY,
    hora_de_inicio              VARCHAR(5)   NOT NULL,  -- formato HH:MM
    hora_de_termino             VARCHAR(5)   NOT NULL,  -- formato HH:MM
    actividades_desarrolladas   TEXT         NOT NULL,
    total_de_horas_acumuladas   SMALLINT     NOT NULL DEFAULT 0,
    total_de_horas_por_dia      SMALLINT     NOT NULL DEFAULT 0,
    fecha_de_servicio_prestado  DATE         NOT NULL DEFAULT CURRENT_DATE,
    id_directivo                INT          NOT NULL,
    id_estudiante               INT          NOT NULL,
    CONSTRAINT fk_registro_directivo
        FOREIGN KEY (id_directivo)
        REFERENCES directivos (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_registro_estudiante
        FOREIGN KEY (id_estudiante)
        REFERENCES estudiantes (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
 
-- ------------------------------------------------------------
-- Tabla: reporte_final
-- Un reporte por estudiante al finalizar el servicio.
-- ------------------------------------------------------------
CREATE TABLE reporte_final (
    id                      SERIAL PRIMARY KEY,
    total_de_horas_cumplidas INT      NOT NULL DEFAULT 0,
    aprobacion              BOOLEAN  NOT NULL DEFAULT FALSE,
    id_estudiante           INT      NOT NULL UNIQUE,   -- 1 reporte por estudiante
    CONSTRAINT fk_reporte_estudiante
        FOREIGN KEY (id_estudiante)
        REFERENCES estudiantes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
 
-- ============================================================
-- Índices para mejorar consultas frecuentes
-- ============================================================
CREATE INDEX idx_registro_estudiante  ON registro (id_estudiante);
CREATE INDEX idx_registro_directivo   ON registro (id_directivo);
CREATE INDEX idx_registro_fecha       ON registro (fecha_de_servicio_prestado);
CREATE INDEX idx_estudiantes_padre    ON estudiantes (id_padre);
 
