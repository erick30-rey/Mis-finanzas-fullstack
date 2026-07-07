/*
===============================================================================
 PROYECTO : Mis Finanzas
 BASE DE DATOS : mis_finanzas_db
 ARCHIVO : schema_v2.sql
 VERSIÓN : 2.0

 DESCRIPCIÓN:
 Este archivo contiene la estructura completa de la base de datos del sistema
 de gestión de finanzas personales.

 Incluye:
 - Creación de tablas
 - Claves primarias
 - Claves foráneas
 - Restricciones (CHECK, UNIQUE)
 - Índices

 AUTORES:
 - Erick Reynoso
 - (Agregar nombres de los demás integrantes)

 FECHA:
 - (Agregar la fecha de entrega)

===============================================================================
*/

/*
===============================================================================
 CONVENCIONES

 PK  : id_tabla
 FK  : id_tabla_referenciada
 fk_ : Foreign Keys
 chk_: Check Constraints
 uq_ : Unique Constraints
 idx_: Índices

 Todas las fechas utilizan TIMESTAMPTZ.
===============================================================================
*/

/*
===============================================================================
POLÍTICA DE ELIMINACIÓN DE DATOS

Esta base de datos implementa Soft Delete para las entidades principales.

En lugar de eliminar registros mediante DELETE,
la aplicación actualizará el campo:

    activo = FALSE

Esto permite conservar el historial de información y evita
la pérdida accidental de datos financieros.

Los comandos DELETE solo deben utilizarse para tareas
administrativas excepcionales.
===============================================================================
*/

-- ==========================================
-- TABLA: USUARIOS
-- Almacena la información de los usuarios
-- ==========================================

CREATE TABLE usuarios (

    id_usuario INTEGER
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    nombre VARCHAR(100)
        NOT NULL,

    apellido VARCHAR(100)
        NOT NULL,

    correo VARCHAR(255)
        NOT NULL,

    password_hash TEXT
        NOT NULL,

    activo BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    fecha_registro TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_usuarios_correo
        UNIQUE (correo),

    CONSTRAINT chk_usuarios_correo_no_vacio
        CHECK (TRIM(correo) <> '')

);

-- ============================================================================
-- TABLA: categorias
-- Almacena las categorías utilizadas para clasificar las transacciones.
-- Puede contener categorías predeterminadas del sistema o personalizadas
-- creadas por cada usuario.
-- ============================================================================

CREATE TABLE categorias (

    id_categoria INTEGER
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    id_usuario INTEGER,

    nombre VARCHAR(100)
        NOT NULL,

    tipo VARCHAR(20)
        NOT NULL,

    icono VARCHAR(100),

    activo BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    fecha_creacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_categorias_tipo
        CHECK (tipo IN ('Ingreso', 'Gasto')),

    CONSTRAINT chk_categorias_nombre_no_vacio
        CHECK (TRIM(nombre) <> ''),

    CONSTRAINT fk_categorias_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE

);

-- ============================================================================
-- TABLA: cuentas
-- Almacena las cuentas financieras pertenecientes a cada usuario.
-- No almacena el saldo; este se calcula a partir de las transacciones.
-- ============================================================================

CREATE TABLE cuentas (

    id_cuenta INTEGER
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    id_usuario INTEGER
        NOT NULL,

    nombre VARCHAR(100)
        NOT NULL,

    tipo VARCHAR(20)
        NOT NULL,

    moneda CHAR(3)
        NOT NULL
        DEFAULT 'DOP',

    activo BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    fecha_creacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_cuentas_nombre_no_vacio
        CHECK (TRIM(nombre) <> ''),

    CONSTRAINT chk_cuentas_tipo
        CHECK (
            tipo IN (
                'Banco',
                'Efectivo',
                'Tarjeta',
                'Ahorros'
            )
        ),

    CONSTRAINT chk_cuentas_moneda
        CHECK (
            moneda IN (
                'DOP',
                'USD',
                'EUR'
            )
        ),

    CONSTRAINT uq_cuentas_usuario_nombre
        UNIQUE (
            id_usuario,
            nombre
        ),

    CONSTRAINT fk_cuentas_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE

);

-- ============================================================================
-- TABLA: transacciones
-- Almacena todos los movimientos financieros realizados por los usuarios.
-- El tipo de movimiento (Ingreso o Gasto) se obtiene a través de la categoría.
-- ============================================================================

CREATE TABLE transacciones (

    id_transaccion INTEGER
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    id_cuenta INTEGER
        NOT NULL,

    id_categoria INTEGER
        NOT NULL,

    titulo VARCHAR(100)
        NOT NULL,

    descripcion TEXT,

    monto NUMERIC(12,2)
        NOT NULL,

    fecha_transaccion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    fecha_creacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_transacciones_titulo_no_vacio
        CHECK (TRIM(titulo) <> ''),

    CONSTRAINT chk_transacciones_descripcion
        CHECK (
            descripcion IS NULL
            OR TRIM(descripcion) <> ''
        ),

    CONSTRAINT chk_transacciones_monto
        CHECK (monto > 0),

    CONSTRAINT fk_transacciones_cuenta
        FOREIGN KEY (id_cuenta)
        REFERENCES cuentas(id_cuenta)
        ON DELETE RESTRICT,

    CONSTRAINT fk_transacciones_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON DELETE RESTRICT

);

-- ============================================================================
-- TABLA: presupuestos
-- Almacena los límites de gasto establecidos por los usuarios para una
-- categoría durante un período determinado.
-- ============================================================================

CREATE TABLE presupuestos (

    id_presupuesto INTEGER
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    id_usuario INTEGER
        NOT NULL,

    id_categoria INTEGER
        NOT NULL,

    monto_limite NUMERIC(12,2)
        NOT NULL,

    fecha_inicio DATE
        NOT NULL,

    fecha_fin DATE
        NOT NULL,

    activo BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    fecha_creacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_presupuestos_monto
        CHECK (monto_limite > 0),

    CONSTRAINT chk_presupuestos_fechas
        CHECK (fecha_fin >= fecha_inicio),

    CONSTRAINT uq_presupuestos_usuario_categoria_periodo
        UNIQUE (
            id_usuario,
            id_categoria,
            fecha_inicio,
            fecha_fin
        ),

    CONSTRAINT fk_presupuestos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_presupuestos_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON DELETE RESTRICT

);

-- ============================================================================
-- TABLA: recordatorios
-- Almacena recordatorios creados por los usuarios para pagos o eventos
-- financieros futuros.
-- ============================================================================

CREATE TABLE recordatorios (

    id_recordatorio INTEGER
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    id_usuario INTEGER
        NOT NULL,

    id_categoria INTEGER,

    titulo VARCHAR(100)
        NOT NULL,

    descripcion TEXT,

    monto NUMERIC(12,2),

    fecha_recordatorio DATE
        NOT NULL,

    estado VARCHAR(20)
        NOT NULL
        DEFAULT 'Pendiente',

    activo BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    fecha_creacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_recordatorios_titulo
        CHECK (TRIM(titulo) <> ''),

    CONSTRAINT chk_recordatorios_descripcion
        CHECK (
            descripcion IS NULL
            OR TRIM(descripcion) <> ''
        ),

    CONSTRAINT chk_recordatorios_monto
        CHECK (
            monto IS NULL
            OR monto > 0
        ),

    CONSTRAINT chk_recordatorios_estado
        CHECK (
            estado IN (
                'Pendiente',
                'Completado',
                'Cancelado'
            )
        ),

    CONSTRAINT fk_recordatorios_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_recordatorios_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON DELETE SET NULL

);