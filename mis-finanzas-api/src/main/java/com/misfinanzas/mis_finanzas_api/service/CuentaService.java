package com.misfinanzas.mis_finanzas_api.service;

import com.misfinanzas.mis_finanzas_api.dto.cuenta.CuentaRequest;
import com.misfinanzas.mis_finanzas_api.dto.cuenta.CuentaResponse;

import java.util.List;

public interface CuentaService {

    List<CuentaResponse> obtenerTodas();

    CuentaResponse obtenerPorId(Integer id);

    CuentaResponse guardar(CuentaRequest request);

    CuentaResponse actualizar(Integer id, CuentaRequest request);

    void eliminar(Integer id);

}
