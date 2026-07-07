package com.misfinanzas.mis_finanzas_api.dto.transaccion;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class TransaccionResponse {

    private Integer idTransaccion;
    private Integer idCuenta;
    private String nombreCuenta;
    private Integer idCategoria;
    private String nombreCategoria;
    private String tipoCategoria;
    private String titulo;
    private String descripcion;
    private BigDecimal monto;
    private OffsetDateTime fechaTransaccion;

    public TransaccionResponse() {
    }

    public Integer getIdTransaccion() {
        return idTransaccion;
    }

    public void setIdTransaccion(Integer idTransaccion) {
        this.idTransaccion = idTransaccion;
    }

    public Integer getIdCuenta() {
        return idCuenta;
    }

    public void setIdCuenta(Integer idCuenta) {
        this.idCuenta = idCuenta;
    }

    public String getNombreCuenta() {
        return nombreCuenta;
    }

    public void setNombreCuenta(String nombreCuenta) {
        this.nombreCuenta = nombreCuenta;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public void setNombreCategoria(String nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
    }

    public String getTipoCategoria() {
        return tipoCategoria;
    }

    public void setTipoCategoria(String tipoCategoria) {
        this.tipoCategoria = tipoCategoria;
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
