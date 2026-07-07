package com.misfinanzas.mis_finanzas_api.service.impl;

import com.misfinanzas.mis_finanzas_api.dto.transaccion.TransaccionRequest;
import com.misfinanzas.mis_finanzas_api.dto.transaccion.TransaccionResponse;
import com.misfinanzas.mis_finanzas_api.entity.Categoria;
import com.misfinanzas.mis_finanzas_api.entity.Cuenta;
import com.misfinanzas.mis_finanzas_api.entity.Transaccion;
import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import com.misfinanzas.mis_finanzas_api.exception.ResourceNotFoundException;
import com.misfinanzas.mis_finanzas_api.mapper.TransaccionMapper;
import com.misfinanzas.mis_finanzas_api.repository.CategoriaRepository;
import com.misfinanzas.mis_finanzas_api.repository.CuentaRepository;
import com.misfinanzas.mis_finanzas_api.repository.TransaccionRepository;
import com.misfinanzas.mis_finanzas_api.service.TransaccionService;
import com.misfinanzas.mis_finanzas_api.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import com.misfinanzas.mis_finanzas_api.exception.BusinessException;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class TransaccionServiceImpl implements TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final CuentaRepository cuentaRepository;
    private final CategoriaRepository categoriaRepository;
    private final TransaccionMapper transaccionMapper;
    private final SecurityUtils securityUtils;

    public TransaccionServiceImpl(
            TransaccionRepository transaccionRepository,
            CuentaRepository cuentaRepository,
            CategoriaRepository categoriaRepository,
            TransaccionMapper transaccionMapper,
            SecurityUtils securityUtils) {

        this.transaccionRepository = transaccionRepository;
        this.cuentaRepository = cuentaRepository;
        this.categoriaRepository = categoriaRepository;
        this.transaccionMapper = transaccionMapper;
        this.securityUtils = securityUtils;
    }

    @Override
    public List<TransaccionResponse> obtenerTodas() {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        return transaccionRepository
                .obtenerTodas(usuario.getIdUsuario())
                .stream()
                .map(transaccionMapper::toResponse)
                .toList();

    }

    @Override
    public TransaccionResponse obtenerPorId(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Transaccion transaccion = transaccionRepository
                .obtenerPorId(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Transacción no encontrada"));

        return transaccionMapper.toResponse(transaccion);

    }

    @Override
    public TransaccionResponse guardar(TransaccionRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Cuenta cuenta = cuentaRepository
                .findByIdCuentaAndUsuarioIdUsuarioAndActivoTrue(
                        request.getIdCuenta(),
                        usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cuenta no encontrada"));

        Categoria categoria = categoriaRepository
                .obtenerCategoria(
                        request.getIdCategoria(),
                        usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoría no encontrada"));

        if (!categoria.getActivo()) {
            throw new BusinessException("La categoría está inactiva");
        }

        Transaccion transaccion = transaccionMapper.toEntity(request);

        transaccion.setCuenta(cuenta);
        transaccion.setCategoria(categoria);

        transaccion.setFechaCreacion(OffsetDateTime.now());
        transaccion.setFechaActualizacion(OffsetDateTime.now());

        transaccion = transaccionRepository.save(transaccion);

        return transaccionMapper.toResponse(transaccion);

    }
    @Override
    public TransaccionResponse actualizar(Integer id,
                                          TransaccionRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Transaccion transaccion = transaccionRepository
                .obtenerPorId(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Transacción no encontrada"));

        Cuenta cuenta = cuentaRepository
                .findByIdCuentaAndUsuarioIdUsuarioAndActivoTrue(
                        request.getIdCuenta(),
                        usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cuenta no encontrada"));

        Categoria categoria = categoriaRepository
                .obtenerCategoria(
                        request.getIdCategoria(),
                        usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoría no encontrada"));

        if (!categoria.getActivo()) {
            throw new BusinessException("La categoría está inactiva");
        }

        transaccion.setCuenta(cuenta);
        transaccion.setCategoria(categoria);
        transaccion.setTitulo(request.getTitulo());
        transaccion.setDescripcion(request.getDescripcion());
        transaccion.setMonto(request.getMonto());
        transaccion.setFechaTransaccion(request.getFechaTransaccion());
        transaccion.setFechaActualizacion(OffsetDateTime.now());

        transaccion = transaccionRepository.save(transaccion);

        return transaccionMapper.toResponse(transaccion);

    }

    @Override
    public void eliminar(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Transaccion transaccion = transaccionRepository
                .obtenerPorId(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Transacción no encontrada"));

        transaccionRepository.delete(transaccion);

    }

}