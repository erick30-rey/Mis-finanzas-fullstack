/*
===============================================================================
 PROYECTO : Mis Finanzas
 BASE DE DATOS : mis_finanzas_db
 ARCHIVO : triggers.sql

 DESCRIPCIÓN:
 Este archivo contiene los triggers utilizados por la base de datos.

 Actualmente implementa:
 - Actualización automática de la columna fecha_actualizacion
   antes de cada UPDATE.
===============================================================================
*/

/*
===============================================================================
FUNCIÓN: actualizar_fecha_actualizacion
Actualiza automáticamente la columna fecha_actualizacion
antes de cada UPDATE.
===============================================================================
*/

CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS
$$
BEGIN

    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: usuarios
-- Actualiza automáticamente la fecha_actualizacion.
-- ============================================================================

CREATE TRIGGER trg_usuarios_fecha_actualizacion
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- ============================================================================
-- TRIGGER: categorias
-- Actualiza automáticamente la fecha_actualizacion.
-- ============================================================================

CREATE TRIGGER trg_categorias_fecha_actualizacion
BEFORE UPDATE ON categorias
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- ============================================================================
-- TRIGGER: cuentas
-- Actualiza automáticamente la fecha_actualizacion.
-- ============================================================================

CREATE TRIGGER trg_cuentas_fecha_actualizacion
BEFORE UPDATE ON cuentas
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- ============================================================================
-- TRIGGER: transacciones
-- Actualiza automáticamente la fecha_actualizacion.
-- ============================================================================

CREATE TRIGGER trg_transacciones_fecha_actualizacion
BEFORE UPDATE ON transacciones
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- ============================================================================
-- TRIGGER: presupuestos
-- Actualiza automáticamente la fecha_actualizacion.
-- ============================================================================

CREATE TRIGGER trg_presupuestos_fecha_actualizacion
BEFORE UPDATE ON presupuestos
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- ============================================================================
-- TRIGGER: recordatorios
-- Actualiza automáticamente la fecha_actualizacion.
-- ============================================================================

CREATE TRIGGER trg_recordatorios_fecha_actualizacion
BEFORE UPDATE ON recordatorios
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();