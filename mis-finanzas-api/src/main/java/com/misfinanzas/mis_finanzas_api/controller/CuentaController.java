package com.misfinanzas.mis_finanzas_api.controller;

import com.misfinanzas.mis_finanzas_api.dto.cuenta.CuentaRequest;
import com.misfinanzas.mis_finanzas_api.dto.cuenta.CuentaResponse;
import com.misfinanzas.mis_finanzas_api.service.CuentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Cuentas",
        description = "Administración de cuentas financieras del usuario autenticado."
)
@RestController
@RequestMapping("/api/cuentas")
public class CuentaController {

    private final CuentaService cuentaService;

    public CuentaController(CuentaService cuentaService) {
        this.cuentaService = cuentaService;
    }

    @Operation(summary = "Obtener todas las cuentas")
    @GetMapping
    public ResponseEntity<List<CuentaResponse>> obtenerTodas() {

        return ResponseEntity.ok(cuentaService.obtenerTodas());

    }
    @Operation(summary = "Obtener una cuenta por ID")
    @GetMapping("/{id}")
    public ResponseEntity<CuentaResponse> obtenerPorId(@PathVariable Integer id) {

        return ResponseEntity.ok(cuentaService.obtenerPorId(id));

    }
    @Operation(summary = "Crear una nueva cuenta")
    @PostMapping
    public ResponseEntity<CuentaResponse> guardar(
            @Valid @RequestBody CuentaRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cuentaService.guardar(request));

    }
    @Operation(summary = "Actualizar una cuenta")
    @PutMapping("/{id}")
    public ResponseEntity<CuentaResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody CuentaRequest request) {

        return ResponseEntity.ok(
                cuentaService.actualizar(id, request));

    }
    @Operation(summary = "Eliminar una cuenta")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        cuentaService.eliminar(id);

        return ResponseEntity.noContent().build();

    }

}
