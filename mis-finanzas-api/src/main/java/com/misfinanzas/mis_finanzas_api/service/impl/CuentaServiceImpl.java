package com.misfinanzas.mis_finanzas_api.service.impl;
import com.misfinanzas.mis_finanzas_api.exception.BusinessException;

import com.misfinanzas.mis_finanzas_api.dto.cuenta.CuentaRequest;
import com.misfinanzas.mis_finanzas_api.dto.cuenta.CuentaResponse;
import com.misfinanzas.mis_finanzas_api.entity.Cuenta;
import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import com.misfinanzas.mis_finanzas_api.exception.ResourceNotFoundException;
import com.misfinanzas.mis_finanzas_api.mapper.CuentaMapper;
import com.misfinanzas.mis_finanzas_api.repository.CuentaRepository;
import com.misfinanzas.mis_finanzas_api.service.CuentaService;
import com.misfinanzas.mis_finanzas_api.utils.SecurityUtils;
import com.misfinanzas.mis_finanzas_api.repository.TransaccionRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class CuentaServiceImpl implements CuentaService {

    private final CuentaRepository cuentaRepository;
    private final CuentaMapper cuentaMapper;
    private final SecurityUtils securityUtils;
    private final TransaccionRepository transaccionRepository;

    public CuentaServiceImpl(CuentaRepository cuentaRepository,
                             CuentaMapper cuentaMapper,
                             SecurityUtils securityUtils, TransaccionRepository transaccionRepository) {

        this.cuentaRepository = cuentaRepository;
        this.cuentaMapper = cuentaMapper;
        this.securityUtils = securityUtils;
        this.transaccionRepository = transaccionRepository;
    }

    @Override
    public List<CuentaResponse> obtenerTodas() {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        return cuentaRepository
                .findByUsuarioIdUsuarioAndActivoTrue(usuario.getIdUsuario())
                .stream()
                .map(cuentaMapper::toResponse)
                .toList();
    }

    @Override
    public CuentaResponse obtenerPorId(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Cuenta cuenta = cuentaRepository
                .findByIdCuentaAndUsuarioIdUsuarioAndActivoTrue(
                        id,
                        usuario.getIdUsuario()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cuenta no encontrada"));

        return cuentaMapper.toResponse(cuenta);
    }

    @Override
    public CuentaResponse guardar(CuentaRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        if (cuentaRepository.existsByUsuarioIdUsuarioAndNombre(
                usuario.getIdUsuario(),
                request.getNombre())) {

            throw new BusinessException(
                    "Ya existe una cuenta con ese nombre");
        }

        Cuenta cuenta = cuentaMapper.toEntity(request);

        cuenta.setUsuario(usuario);
        cuenta.setActivo(true);
        cuenta.setFechaCreacion(OffsetDateTime.now());
        cuenta.setFechaActualizacion(OffsetDateTime.now());

        cuenta = cuentaRepository.save(cuenta);

        return cuentaMapper.toResponse(cuenta);

    }

    @Override
    public CuentaResponse actualizar(Integer id,
                                     CuentaRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Cuenta cuenta = cuentaRepository
                .findByIdCuentaAndUsuarioIdUsuarioAndActivoTrue(
                        id,
                        usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cuenta no encontrada"));

        cuenta.setNombre(request.getNombre());
        cuenta.setTipo(request.getTipo());
        cuenta.setMoneda(request.getMoneda());
        cuenta.setFechaActualizacion(OffsetDateTime.now());

        cuenta = cuentaRepository.save(cuenta);

        return cuentaMapper.toResponse(cuenta);

    }

    @Override
    public void eliminar(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Cuenta cuenta = cuentaRepository
                .findByIdCuentaAndUsuarioIdUsuarioAndActivoTrue(
                        id,
                        usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cuenta no encontrada"));

        if (transaccionRepository.existsByCuentaIdCuenta(cuenta.getIdCuenta())) {
            throw new BusinessException(
                    "No puedes eliminar una cuenta que tiene transacciones asociadas."
            );
        }

        cuenta.setActivo(false);
        cuenta.setFechaActualizacion(OffsetDateTime.now());

        cuentaRepository.save(cuenta);
    }

}
