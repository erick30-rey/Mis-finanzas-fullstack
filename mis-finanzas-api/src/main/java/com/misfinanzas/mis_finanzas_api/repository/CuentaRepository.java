package com.misfinanzas.mis_finanzas_api.repository;

import com.misfinanzas.mis_finanzas_api.entity.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CuentaRepository extends JpaRepository<Cuenta, Integer> {

    List<Cuenta> findByUsuarioIdUsuarioAndActivoTrue(Integer idUsuario);

    Optional<Cuenta> findByIdCuentaAndUsuarioIdUsuarioAndActivoTrue(
            Integer idCuenta,
            Integer idUsuario
    );

    boolean existsByUsuarioIdUsuarioAndNombre(Integer idUsuario, String nombre);

}
