package com.misfinanzas.mis_finanzas_api.mapper;

import com.misfinanzas.mis_finanzas_api.dto.categoria.CategoriaRequest;
import com.misfinanzas.mis_finanzas_api.dto.categoria.CategoriaResponse;
import com.misfinanzas.mis_finanzas_api.entity.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public Categoria toEntity(CategoriaRequest request) {

        Categoria categoria = new Categoria();

        categoria.setNombre(request.getNombre());
        categoria.setTipo(request.getTipo());
        categoria.setIcono(request.getIcono());

        return categoria;

    }

    public CategoriaResponse toResponse(Categoria categoria) {

        CategoriaResponse response = new CategoriaResponse();

        response.setIdCategoria(categoria.getIdCategoria());
        response.setNombre(categoria.getNombre());
        response.setTipo(categoria.getTipo());
        response.setIcono(categoria.getIcono());
        response.setActivo(categoria.getActivo());

        return response;

    }

}
