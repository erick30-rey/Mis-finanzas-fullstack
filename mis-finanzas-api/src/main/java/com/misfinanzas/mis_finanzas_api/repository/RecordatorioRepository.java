package com.misfinanzas.mis_finanzas_api.repository;

import com.misfinanzas.mis_finanzas_api.entity.Recordatorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RecordatorioRepository
        extends JpaRepository<Recordatorio, Integer> {

    @Query("""
            SELECT r
            FROM Recordatorio r
            WHERE r.usuario.idUsuario = :idUsuario
            AND r.activo = true
            ORDER BY r.fechaRecordatorio
            """)
    List<Recordatorio> obtenerTodos(Integer idUsuario);

    @Query("""
            SELECT r
            FROM Recordatorio r
            WHERE r.idRecordatorio = :idRecordatorio
            AND r.usuario.idUsuario = :idUsuario
            AND r.activo = true
            """)
    Optional<Recordatorio> obtenerPorId(
            Integer idRecordatorio,
            Integer idUsuario);

}
