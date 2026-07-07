package com.misfinanzas.mis_finanzas_api.service.impl;

import com.misfinanzas.mis_finanzas_api.dto.categoria.CategoriaRequest;
import com.misfinanzas.mis_finanzas_api.dto.categoria.CategoriaResponse;
import com.misfinanzas.mis_finanzas_api.entity.Categoria;
import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import com.misfinanzas.mis_finanzas_api.exception.ResourceNotFoundException;
import com.misfinanzas.mis_finanzas_api.mapper.CategoriaMapper;
import com.misfinanzas.mis_finanzas_api.repository.CategoriaRepository;
import com.misfinanzas.mis_finanzas_api.service.CategoriaService;
import com.misfinanzas.mis_finanzas_api.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import com.misfinanzas.mis_finanzas_api.exception.BusinessException;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;
    private final SecurityUtils securityUtils;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository,
                                CategoriaMapper categoriaMapper,
                                SecurityUtils securityUtils) {

        this.categoriaRepository = categoriaRepository;
        this.categoriaMapper = categoriaMapper;
        this.securityUtils = securityUtils;
    }

    @Override
    public List<CategoriaResponse> obtenerTodas() {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        return categoriaRepository
                .obtenerCategoriasDisponibles(usuario.getIdUsuario())
                .stream()
                .map(categoriaMapper::toResponse)
                .toList();

    }

    @Override
    public CategoriaResponse obtenerPorId(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Categoria categoria = categoriaRepository
                .obtenerCategoria(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoría no encontrada"));

        return categoriaMapper.toResponse(categoria);

    }

    @Override
    public CategoriaResponse guardar(CategoriaRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        if (categoriaRepository.existsByUsuarioIdUsuarioAndNombre(
                usuario.getIdUsuario(),
                request.getNombre())) {

            throw new BusinessException(
                    "Ya existe una categoría con ese nombre");

        }

        Categoria categoria = categoriaMapper.toEntity(request);

        categoria.setUsuario(usuario);
        categoria.setActivo(true);
        categoria.setFechaCreacion(OffsetDateTime.now());
        categoria.setFechaActualizacion(OffsetDateTime.now());

        categoria = categoriaRepository.save(categoria);

        return categoriaMapper.toResponse(categoria);

    }

    @Override
    public CategoriaResponse actualizar(Integer id,
                                        CategoriaRequest request) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Categoria categoria = categoriaRepository
                .obtenerCategoria(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoría no encontrada"));

        if (categoria.getUsuario() == null) {
            throw new BusinessException(
                    "No puedes modificar una categoría del sistema");
        }

        categoria.setNombre(request.getNombre());
        categoria.setTipo(request.getTipo());
        categoria.setIcono(request.getIcono());
        categoria.setFechaActualizacion(OffsetDateTime.now());

        categoria = categoriaRepository.save(categoria);

        return categoriaMapper.toResponse(categoria);

    }

    @Override
    public void eliminar(Integer id) {

        Usuario usuario = securityUtils.getUsuarioAutenticado();

        Categoria categoria = categoriaRepository
                .obtenerCategoria(id, usuario.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoría no encontrada"));

        if (categoria.getUsuario() == null) {
            throw new BusinessException(
                    "No puedes eliminar una categoría del sistema");
        }

        categoria.setActivo(false);
        categoria.setFechaActualizacion(OffsetDateTime.now());

        categoriaRepository.save(categoria);

    }

}
