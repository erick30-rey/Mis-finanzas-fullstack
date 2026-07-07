package com.misfinanzas.mis_finanzas_api.service.impl;

import com.misfinanzas.mis_finanzas_api.dto.presupuesto.PresupuestoRequest;
import com.misfinanzas.mis_finanzas_api.dto.presupuesto.PresupuestoResponse;
import com.misfinanzas.mis_finanzas_api.entity.Categoria;
import com.misfinanzas.mis_finanzas_api.entity.Presupuesto;
import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import com.misfinanzas.mis_finanzas_api.exception.ResourceNotFoundException;
import com.misfinanzas.mis_finanzas_api.mapper.PresupuestoMapper;
import com.misfinanzas.mis_finanzas_api.repository.CategoriaRepository;
import com.misfinanzas.mis_finanzas_api.repository.PresupuestoRepository;
import com.misfinanzas.mis_finanzas_api.service.PresupuestoService;
import com.misfinanzas.mis_finanzas_api.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import com.misfinanzas.mis_finanzas_api.exception.BusinessException;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class PresupuestoServiceImpl implements PresupuestoService {

    private final PresupuestoRepository presupuestoRepository;
    private final CategoriaRepository categoriaRepository;
    private final PresupuestoMapper presupuestoMapper;
    private final SecurityUtils securityUtils;

    public PresupuestoServiceImpl(
            PresupuestoRepository presupuestoRepository,
            CategoriaRepository categoriaRepository,
            PresupuestoMapper presupuestoMapper,
            SecurityUtils securityUtils) {

        this.presupuestoRepository = presupuestoRepository;
        this.categoriaRepository = categoriaRepository;
        this.presupuestoMapper = presupuestoMapper;
        this.securityUtils = securityUtils;
    }

    @Override
    public List<PresupuestoResponse> obtenerTodos() {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        return presupuestoRepository
                .obtenerTodos(usuario.getIdUsuario())
                .stream()
                .map(presupuestoMapper::toResponse)
                .toList();
    }

    @Override
    public PresupuestoResponse obtenerPorId(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Presupuesto presupuesto = presupuestoRepository
                .obtenerPorId(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Presupuesto no encontrado"));

        return presupuestoMapper.toResponse(presupuesto);
    }

    @Override
    public PresupuestoResponse guardar(PresupuestoRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Categoria categoria = categoriaRepository
                .obtenerCategoria(
                        request.getIdCategoria(),
                        usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoría no encontrada"));

        if (!categoria.getActivo()) {
            throw new BusinessException("La categoría está inactiva");
        }

        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new BusinessException(
                    "La fecha fin no puede ser anterior a la fecha inicio");
        }

        boolean existe = presupuestoRepository
                .existsByUsuarioIdUsuarioAndCategoriaIdCategoriaAndFechaInicioAndFechaFin(
                        usuario.getIdUsuario(),
                        categoria.getIdCategoria(),
                        request.getFechaInicio(),
                        request.getFechaFin());

        if (existe) {
            throw new BusinessException(
                    "Ya existe un presupuesto para ese período");
        }

        Presupuesto presupuesto = presupuestoMapper.toEntity(request);

        presupuesto.setUsuario(usuario);
        presupuesto.setCategoria(categoria);
        presupuesto.setActivo(true);
        presupuesto.setFechaCreacion(OffsetDateTime.now());
        presupuesto.setFechaActualizacion(OffsetDateTime.now());

        presupuesto = presupuestoRepository.save(presupuesto);

        return presupuestoMapper.toResponse(presupuesto);
    }
    @Override
    public PresupuestoResponse actualizar(Integer id,
                                          PresupuestoRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Presupuesto presupuesto = presupuestoRepository
                .obtenerPorId(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Presupuesto no encontrado"));

        Categoria categoria = categoriaRepository
                .obtenerCategoria(
                        request.getIdCategoria(),
                        usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoría no encontrada"));

        if (!categoria.getActivo()) {
            throw new BusinessException("La categoría está inactiva");
        }

        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new BusinessException(
                    "La fecha fin no puede ser anterior a la fecha inicio");
        }

        boolean existe = presupuestoRepository
                .existsByUsuarioIdUsuarioAndCategoriaIdCategoriaAndFechaInicioAndFechaFin(
                        usuario.getIdUsuario(),
                        categoria.getIdCategoria(),
                        request.getFechaInicio(),
                        request.getFechaFin());

        if (existe
                && !(presupuesto.getCategoria().getIdCategoria().equals(request.getIdCategoria())
                && presupuesto.getFechaInicio().equals(request.getFechaInicio())
                && presupuesto.getFechaFin().equals(request.getFechaFin()))) {

            throw new BusinessException(
                    "Ya existe un presupuesto para ese período");
        }

        presupuesto.setCategoria(categoria);
        presupuesto.setMontoLimite(request.getMontoLimite());
        presupuesto.setFechaInicio(request.getFechaInicio());
        presupuesto.setFechaFin(request.getFechaFin());
        presupuesto.setFechaActualizacion(OffsetDateTime.now());

        presupuesto = presupuestoRepository.save(presupuesto);

        return presupuestoMapper.toResponse(presupuesto);

    }

    @Override
    public void eliminar(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Presupuesto presupuesto = presupuestoRepository
                .obtenerPorId(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Presupuesto no encontrado"));

        presupuesto.setActivo(false);
        presupuesto.setFechaActualizacion(OffsetDateTime.now());

        presupuestoRepository.save(presupuesto);

    }

}