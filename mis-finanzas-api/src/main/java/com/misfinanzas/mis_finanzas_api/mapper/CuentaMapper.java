package com.misfinanzas.mis_finanzas_api.mapper;

import com.misfinanzas.mis_finanzas_api.dto.cuenta.CuentaRequest;
import com.misfinanzas.mis_finanzas_api.dto.cuenta.CuentaResponse;
import com.misfinanzas.mis_finanzas_api.entity.Cuenta;
import org.springframework.stereotype.Component;

@Component
public class CuentaMapper {

    public Cuenta toEntity(CuentaRequest request) {

        Cuenta cuenta = new Cuenta();

        cuenta.setNombre(request.getNombre());
        cuenta.setTipo(request.getTipo());
        cuenta.setMoneda(request.getMoneda());

        return cuenta;
    }

    public CuentaResponse toResponse(Cuenta cuenta) {

        CuentaResponse response = new CuentaResponse();

        response.setIdCuenta(cuenta.getIdCuenta());
        response.setNombre(cuenta.getNombre());
        response.setTipo(cuenta.getTipo());
        response.setMoneda(cuenta.getMoneda());
        response.setActivo(cuenta.getActivo());

        return response;
    }

}
