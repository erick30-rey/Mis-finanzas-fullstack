package com.misfinanzas.mis_finanzas_api.service;

import com.misfinanzas.mis_finanzas_api.dto.transaccion.TransaccionRequest;
import com.misfinanzas.mis_finanzas_api.dto.transaccion.TransaccionResponse;

import java.util.List;

public interface TransaccionService {

    List<TransaccionResponse> obtenerTodas();

    TransaccionResponse obtenerPorId(Integer id);

    TransaccionResponse guardar(TransaccionRequest request);

    TransaccionResponse actualizar(Integer id,
                                   TransaccionRequest request);

    void eliminar(Integer id);

}
