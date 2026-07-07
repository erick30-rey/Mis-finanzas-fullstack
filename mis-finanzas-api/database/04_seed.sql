
/*
===============================================================================
 PROYECTO : Mis Finanzas
 BASE DE DATOS : mis_finanzas_db
 ARCHIVO : 04_seed.sql

 DESCRIPCIÓN:
 Inserta los datos iniciales del sistema.

 Contiene:
 - Categorías predeterminadas de ingresos.
 - Categorías predeterminadas de gastos.

 NOTA:
 Las categorías del sistema tienen id_usuario = NULL.
===============================================================================
*/

-- ============================================================================
-- CATEGORÍAS PREDETERMINADAS - INGRESOS
-- ============================================================================

INSERT INTO categorias (
    id_usuario,
    nombre,
    tipo,
    icono
)
VALUES
(NULL, 'Salario', 'Ingreso', 'work'),
(NULL, 'Freelance', 'Ingreso', 'computer'),
(NULL, 'Inversiones', 'Ingreso', 'trending_up'),
(NULL, 'Bonificación', 'Ingreso', 'redeem'),
(NULL, 'Otros Ingresos', 'Ingreso', 'payments');



-- ============================================================================
-- CATEGORÍAS PREDETERMINADAS - GASTOS
-- ============================================================================

INSERT INTO categorias (
    id_usuario,
    nombre,
    tipo,
    icono
)
VALUES
(NULL, 'Alimentación', 'Gasto', 'restaurant'),
(NULL, 'Transporte', 'Gasto', 'directions_car'),
(NULL, 'Vivienda', 'Gasto', 'home'),
(NULL, 'Servicios', 'Gasto', 'lightbulb'),
(NULL, 'Salud', 'Gasto', 'local_hospital'),
(NULL, 'Educación', 'Gasto', 'school'),
(NULL, 'Entretenimiento', 'Gasto', 'movie'),
(NULL, 'Compras', 'Gasto', 'shopping_cart'),
(NULL, 'Suscripciones', 'Gasto', 'subscriptions'),
(NULL, 'Ahorro', 'Gasto', 'savings'),
(NULL, 'Otros Gastos', 'Gasto', 'payments');