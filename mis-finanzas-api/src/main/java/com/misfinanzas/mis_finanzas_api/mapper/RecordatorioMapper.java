package com.misfinanzas.mis_finanzas_api.mapper;

import com.misfinanzas.mis_finanzas_api.dto.recordatorio.RecordatorioRequest;
import com.misfinanzas.mis_finanzas_api.dto.recordatorio.RecordatorioResponse;
import com.misfinanzas.mis_finanzas_api.entity.Recordatorio;
import org.springframework.stereotype.Component;

@Component
public class RecordatorioMapper {

    public Recordatorio toEntity(RecordatorioRequest request) {

        Recordatorio recordatorio = new Recordatorio();

        recordatorio.setTitulo(request.getTitulo());
        recordatorio.setDescripcion(request.getDescripcion());
        recordatorio.setMonto(request.getMonto());
        recordatorio.setFechaRecordatorio(request.getFechaRecordatorio());
        recordatorio.setEstado(request.getEstado());

        return recordatorio;
    }

    public RecordatorioResponse toResponse(Recordatorio recordatorio) {

        RecordatorioResponse response = new RecordatorioResponse();

        response.setIdRecordatorio(recordatorio.getIdRecordatorio());

        if (recordatorio.getCategoria() != null) {

            response.setIdCategoria(
                    recordatorio.getCategoria().getIdCategoria());

            response.setNombreCategoria(
                    recordatorio.getCategoria().getNombre());

        }

        response.setTitulo(recordatorio.getTitulo());
        response.setDescripcion(recordatorio.getDescripcion());
        response.setMonto(recordatorio.getMonto());
        response.setFechaRecordatorio(recordatorio.getFechaRecordatorio());
        response.setEstado(recordatorio.getEstado());
        response.setActivo(recordatorio.getActivo());

        return response;
    }

}
