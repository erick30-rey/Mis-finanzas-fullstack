package com.misfinanzas.mis_finanzas_api.repository;

import com.misfinanzas.mis_finanzas_api.entity.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PresupuestoRepository extends JpaRepository<Presupuesto, Integer> {

    @Query("""
            SELECT p
            FROM Presupuesto p
            WHERE p.usuario.idUsuario = :idUsuario
            AND p.activo = true
            ORDER BY p.fechaInicio DESC
            """)
    List<Presupuesto> obtenerTodos(Integer idUsuario);

    @Query("""
            SELECT p
            FROM Presupuesto p
            WHERE p.idPresupuesto = :idPresupuesto
            AND p.usuario.idUsuario = :idUsuario
            AND p.activo = true
            """)
    Optional<Presupuesto> obtenerPorId(Integer idPresupuesto,
                                       Integer idUsuario);

    boolean existsByUsuarioIdUsuarioAndCategoriaIdCategoriaAndFechaInicioAndFechaFin(
            Integer idUsuario,
            Integer idCategoria,
            LocalDate fechaInicio,
            LocalDate fechaFin
    );

}
