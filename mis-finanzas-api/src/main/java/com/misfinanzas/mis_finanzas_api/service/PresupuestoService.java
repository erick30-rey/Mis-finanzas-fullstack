package com.misfinanzas.mis_finanzas_api.service;

import com.misfinanzas.mis_finanzas_api.dto.presupuesto.PresupuestoRequest;
import com.misfinanzas.mis_finanzas_api.dto.presupuesto.PresupuestoResponse;

import java.util.List;

public interface PresupuestoService {

    List<PresupuestoResponse> obtenerTodos();

    PresupuestoResponse obtenerPorId(Integer id);

    PresupuestoResponse guardar(PresupuestoRequest request);

    PresupuestoResponse actualizar(Integer id,
                                   PresupuestoRequest request);

    void eliminar(Integer id);

}
