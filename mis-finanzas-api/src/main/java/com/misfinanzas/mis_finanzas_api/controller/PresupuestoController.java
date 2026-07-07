package com.misfinanzas.mis_finanzas_api.controller;

import com.misfinanzas.mis_finanzas_api.dto.presupuesto.PresupuestoRequest;
import com.misfinanzas.mis_finanzas_api.dto.presupuesto.PresupuestoResponse;
import com.misfinanzas.mis_finanzas_api.service.PresupuestoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Presupuestos",
        description = "Administración de presupuestos por categoría."
)
@RestController
@RequestMapping("/api/presupuestos")
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    public PresupuestoController(PresupuestoService presupuestoService) {
        this.presupuestoService = presupuestoService;
    }
    @Operation(summary = "Obtener todos los presupuestos")
    @GetMapping
    public ResponseEntity<List<PresupuestoResponse>> obtenerTodos() {
        return ResponseEntity.ok(presupuestoService.obtenerTodos());
    }
    @Operation(summary = "Obtener un presupuesto por ID")
    @GetMapping("/{id}")
    public ResponseEntity<PresupuestoResponse> obtenerPorId(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                presupuestoService.obtenerPorId(id));
    }
    @Operation(summary = "Crear un presupuesto")
    @PostMapping
    public ResponseEntity<PresupuestoResponse> guardar(
            @Valid @RequestBody PresupuestoRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(presupuestoService.guardar(request));
    }
    @Operation(summary = "Actualizar un presupuesto")
    @PutMapping("/{id}")
    public ResponseEntity<PresupuestoResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody PresupuestoRequest request) {

        return ResponseEntity.ok(
                presupuestoService.actualizar(id, request));
    }
    @Operation(summary = "Eliminar un presupuesto")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        presupuestoService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}