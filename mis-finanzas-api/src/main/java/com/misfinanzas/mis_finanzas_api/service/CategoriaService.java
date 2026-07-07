package com.misfinanzas.mis_finanzas_api.service;

import com.misfinanzas.mis_finanzas_api.dto.categoria.CategoriaRequest;
import com.misfinanzas.mis_finanzas_api.dto.categoria.CategoriaResponse;

import java.util.List;

public interface CategoriaService {

    List<CategoriaResponse> obtenerTodas();

    CategoriaResponse obtenerPorId(Integer id);

    CategoriaResponse guardar(CategoriaRequest request);

    CategoriaResponse actualizar(Integer id,
                                 CategoriaRequest request);

    void eliminar(Integer id);

}
