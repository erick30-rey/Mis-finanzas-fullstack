package com.misfinanzas.mis_finanzas_api.mapper;

import com.misfinanzas.mis_finanzas_api.dto.presupuesto.PresupuestoRequest;
import com.misfinanzas.mis_finanzas_api.dto.presupuesto.PresupuestoResponse;
import com.misfinanzas.mis_finanzas_api.entity.Presupuesto;
import org.springframework.stereotype.Component;

@Component
public class PresupuestoMapper {

    public Presupuesto toEntity(PresupuestoRequest request) {

        Presupuesto presupuesto = new Presupuesto();

        presupuesto.setMontoLimite(request.getMontoLimite());
        presupuesto.setFechaInicio(request.getFechaInicio());
        presupuesto.setFechaFin(request.getFechaFin());

        return presupuesto;
    }

    public PresupuestoResponse toResponse(Presupuesto presupuesto) {

        PresupuestoResponse response = new PresupuestoResponse();

        response.setIdPresupuesto(presupuesto.getIdPresupuesto());

        response.setIdCategoria(
                presupuesto.getCategoria().getIdCategoria());

        response.setNombreCategoria(
                presupuesto.getCategoria().getNombre());

        response.setTipoCategoria(
                presupuesto.getCategoria().getTipo());

        response.setMontoLimite(
                presupuesto.getMontoLimite());

        response.setFechaInicio(
                presupuesto.getFechaInicio());

        response.setFechaFin(
                presupuesto.getFechaFin());

        response.setActivo(
                presupuesto.getActivo());

        return response;
    }

}
