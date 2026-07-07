package com.misfinanzas.mis_finanzas_api.service.impl;

import com.misfinanzas.mis_finanzas_api.dto.recordatorio.RecordatorioRequest;
import com.misfinanzas.mis_finanzas_api.dto.recordatorio.RecordatorioResponse;
import com.misfinanzas.mis_finanzas_api.entity.Categoria;
import com.misfinanzas.mis_finanzas_api.entity.Recordatorio;
import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import com.misfinanzas.mis_finanzas_api.exception.ResourceNotFoundException;
import com.misfinanzas.mis_finanzas_api.mapper.RecordatorioMapper;
import com.misfinanzas.mis_finanzas_api.repository.CategoriaRepository;
import com.misfinanzas.mis_finanzas_api.repository.RecordatorioRepository;
import com.misfinanzas.mis_finanzas_api.service.RecordatorioService;
import com.misfinanzas.mis_finanzas_api.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import com.misfinanzas.mis_finanzas_api.exception.BusinessException;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class RecordatorioServiceImpl implements RecordatorioService {

    private final RecordatorioRepository recordatorioRepository;
    private final CategoriaRepository categoriaRepository;
    private final RecordatorioMapper recordatorioMapper;
    private final SecurityUtils securityUtils;

    public RecordatorioServiceImpl(
            RecordatorioRepository recordatorioRepository,
            CategoriaRepository categoriaRepository,
            RecordatorioMapper recordatorioMapper,
            SecurityUtils securityUtils) {

        this.recordatorioRepository = recordatorioRepository;
        this.categoriaRepository = categoriaRepository;
        this.recordatorioMapper = recordatorioMapper;
        this.securityUtils = securityUtils;
    }

    @Override
    public List<RecordatorioResponse> obtenerTodos() {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        return recordatorioRepository
                .obtenerTodos(usuario.getIdUsuario())
                .stream()
                .map(recordatorioMapper::toResponse)
                .toList();

    }

    @Override
    public RecordatorioResponse obtenerPorId(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Recordatorio recordatorio = recordatorioRepository
                .obtenerPorId(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recordatorio no encontrado"));

        return recordatorioMapper.toResponse(recordatorio);

    }

    @Override
    public RecordatorioResponse guardar(RecordatorioRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Categoria categoria = null;

        if (request.getIdCategoria() != null) {

            categoria = categoriaRepository
                    .obtenerCategoria(
                            request.getIdCategoria(),
                            usuario.getIdUsuario())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Categoría no encontrada"));

            if (!categoria.getActivo()) {
                throw new BusinessException("La categoría está inactiva");
            }

        }

        Recordatorio recordatorio = recordatorioMapper.toEntity(request);

        recordatorio.setUsuario(usuario);
        recordatorio.setCategoria(categoria);
        recordatorio.setActivo(true);
        recordatorio.setFechaCreacion(OffsetDateTime.now());
        recordatorio.setFechaActualizacion(OffsetDateTime.now());

        recordatorio = recordatorioRepository.save(recordatorio);

        return recordatorioMapper.toResponse(recordatorio);

    }
    @Override
    public RecordatorioResponse actualizar(Integer id,
                                           RecordatorioRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Recordatorio recordatorio = recordatorioRepository
                .obtenerPorId(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recordatorio no encontrado"));

        Categoria categoria = null;

        if (request.getIdCategoria() != null) {

            categoria = categoriaRepository
                    .obtenerCategoria(
                            request.getIdCategoria(),
                            usuario.getIdUsuario())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Categoría no encontrada"));

            if (!categoria.getActivo()) {
                throw new BusinessException("La categoría está inactiva");
            }

        }

        recordatorio.setCategoria(categoria);
        recordatorio.setTitulo(request.getTitulo());
        recordatorio.setDescripcion(request.getDescripcion());
        recordatorio.setMonto(request.getMonto());
        recordatorio.setFechaRecordatorio(request.getFechaRecordatorio());
        recordatorio.setEstado(request.getEstado());
        recordatorio.setFechaActualizacion(OffsetDateTime.now());

        recordatorio = recordatorioRepository.save(recordatorio);

        return recordatorioMapper.toResponse(recordatorio);

    }

    @Override
    public void eliminar(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Recordatorio recordatorio = recordatorioRepository
                .obtenerPorId(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recordatorio no encontrado"));

        recordatorio.setActivo(false);
        recordatorio.setFechaActualizacion(OffsetDateTime.now());

        recordatorioRepository.save(recordatorio);

    }

}
