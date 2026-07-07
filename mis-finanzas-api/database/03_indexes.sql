
/*
===============================================================================
 PROYECTO : Mis Finanzas
 BASE DE DATOS : mis_finanzas_db
 ARCHIVO : indexes.sql

 DESCRIPCIÓN:
 Índices para optimizar el rendimiento de las consultas más frecuentes.
===============================================================================
*/

-- ============================================================================
-- TABLA: categorias
-- ============================================================================

-- Índice para acelerar consultas por usuario
CREATE INDEX idx_categorias_usuario
ON categorias(id_usuario);

-- Evita que un usuario tenga dos categorías con el mismo nombre
CREATE UNIQUE INDEX uq_categorias_usuario_nombre
ON categorias(id_usuario, nombre)
WHERE id_usuario IS NOT NULL;

-- Evita categorías predeterminadas duplicadas
CREATE UNIQUE INDEX uq_categorias_sistema_nombre
ON categorias(nombre)
WHERE id_usuario IS NULL;

-- ============================================================================
-- TABLA: cuentas
-- ============================================================================

CREATE INDEX idx_cuentas_usuario
ON cuentas(id_usuario);

-- ============================================================================
-- TABLA: transacciones
-- ============================================================================

CREATE INDEX idx_transacciones_categoria
ON transacciones(id_categoria);

CREATE INDEX idx_transacciones_cuenta_fecha
ON transacciones(id_cuenta, fecha_transaccion DESC);

-- ============================================================================
-- TABLA: presupuestos
-- ============================================================================

CREATE INDEX idx_presupuestos_usuario
ON presupuestos(id_usuario);

-- ============================================================================
-- TABLA: recordatorios
-- ============================================================================

CREATE INDEX idx_recordatorios_usuario
ON recordatorios(id_usuario);

CREATE INDEX idx_recordatorios_fecha
ON recordatorios(fecha_recordatorio);

