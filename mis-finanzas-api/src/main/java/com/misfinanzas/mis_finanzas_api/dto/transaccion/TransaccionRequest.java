package com.misfinanzas.mis_finanzas_api.dto.transaccion;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class TransaccionRequest {

    @NotNull(message = "La cuenta es obligatoria")
    private Integer idCuenta;

    @NotNull(message = "La categoría es obligatoria")
    private Integer idCategoria;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 100)
    private String titulo;

    private String descripcion;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor que cero")
    private BigDecimal monto;

    @NotNull(message = "La fecha es obligatoria")
    private OffsetDateTime fechaTransaccion;

    public TransaccionRequest() {
    }

    public Integer getIdCuenta() {
        return idCuenta;
    }

    public void setIdCuenta(Integer idCuenta) {
        this.idCuenta = idCuenta;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public OffsetDateTime getFechaTransaccion() {
        return fechaTransaccion;
    }

    public void setFechaTransaccion(OffsetDateTime fechaTransaccion) {
        this.fechaTransaccion = fechaTransaccion;
    }

}