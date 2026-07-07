package com.misfinanzas.mis_finanzas_api.repository;

import com.misfinanzas.mis_finanzas_api.entity.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TransaccionRepository extends JpaRepository<Transaccion, Integer> {

    @Query("""
            SELECT t
            FROM Transaccion t
            WHERE t.cuenta.usuario.idUsuario = :idUsuario
            ORDER BY t.fechaTransaccion DESC
            """)
    List<Transaccion> obtenerTodas(Integer idUsuario);

    @Query("""
            SELECT t
            FROM Transaccion t
            WHERE t.idTransaccion = :idTransaccion
            AND t.cuenta.usuario.idUsuario = :idUsuario
            """)
    Optional<Transaccion> obtenerPorId(Integer idTransaccion,
                                       Integer idUsuario);
    boolean existsByCuentaIdCuenta(Integer idCuenta);
}
