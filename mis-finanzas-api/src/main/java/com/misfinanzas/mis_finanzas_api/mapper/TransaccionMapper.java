package com.misfinanzas.mis_finanzas_api.mapper;

import com.misfinanzas.mis_finanzas_api.dto.transaccion.TransaccionRequest;
import com.misfinanzas.mis_finanzas_api.dto.transaccion.TransaccionResponse;
import com.misfinanzas.mis_finanzas_api.entity.Transaccion;
import org.springframework.stereotype.Component;

@Component
public class TransaccionMapper {

    public Transaccion toEntity(TransaccionRequest request) {

        Transaccion transaccion = new Transaccion();

        transaccion.setTitulo(request.getTitulo());
        transaccion.setDescripcion(request.getDescripcion());
        transaccion.setMonto(request.getMonto());
        transaccion.setFechaTransaccion(request.getFechaTransaccion());

        return transaccion;

    }

    public TransaccionResponse toResponse(Transaccion transaccion) {

        TransaccionResponse response = new TransaccionResponse();

        response.setIdTransaccion(transaccion.getIdTransaccion());

        response.setIdCuenta(transaccion.getCuenta().getIdCuenta());
        response.setNombreCuenta(transaccion.getCuenta().getNombre());

        response.setIdCategoria(transaccion.getCategoria().getIdCategoria());
        response.setNombreCategoria(transaccion.getCategoria().getNombre());
        response.setTipoCategoria(transaccion.getCategoria().getTipo());

        response.setTitulo(transaccion.getTitulo());
        response.setDescripcion(transaccion.getDescripcion());
        response.setMonto(transaccion.getMonto());
        response.setFechaTransaccion(transaccion.getFechaTransaccion());

        return response;

    }

}
