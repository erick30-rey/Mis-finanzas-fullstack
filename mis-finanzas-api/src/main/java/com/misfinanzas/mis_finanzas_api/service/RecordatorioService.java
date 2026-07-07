package com.misfinanzas.mis_finanzas_api.service;

import com.misfinanzas.mis_finanzas_api.dto.recordatorio.RecordatorioRequest;
import com.misfinanzas.mis_finanzas_api.dto.recordatorio.RecordatorioResponse;

import java.util.List;

public interface RecordatorioService {

    List<RecordatorioResponse> obtenerTodos();

    RecordatorioResponse obtenerPorId(Integer id);

    RecordatorioResponse guardar(RecordatorioRequest request);

    RecordatorioResponse actualizar(Integer id,
                                    RecordatorioRequest request);

    void eliminar(Integer id);

}