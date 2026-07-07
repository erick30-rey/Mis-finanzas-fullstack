package com.misfinanzas.mis_finanzas_api.controller;

import com.misfinanzas.mis_finanzas_api.dto.recordatorio.RecordatorioRequest;
import com.misfinanzas.mis_finanzas_api.dto.recordatorio.RecordatorioResponse;
import com.misfinanzas.mis_finanzas_api.service.RecordatorioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Recordatorios",
        description = "Gestión de recordatorios financieros."
)
@RestController
@RequestMapping("/api/recordatorios")
public class RecordatorioController {

    private final RecordatorioService recordatorioService;

    public RecordatorioController(RecordatorioService recordatorioService) {
        this.recordatorioService = recordatorioService;
    }
    @Operation(summary = "Obtener todos los recordatorios")
    @GetMapping
    public ResponseEntity<List<RecordatorioResponse>> obtenerTodos() {
        return ResponseEntity.ok(recordatorioService.obtenerTodos());
    }
    @Operation(summary = "Obtener un recordatorio por ID")
    @GetMapping("/{id}")
    public ResponseEntity<RecordatorioResponse> obtenerPorId(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                recordatorioService.obtenerPorId(id));
    }
    @Operation(summary = "Crear un recordatorio")
    @PostMapping
    public ResponseEntity<RecordatorioResponse> guardar(
            @Valid @RequestBody RecordatorioRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recordatorioService.guardar(request));
    }
    @Operation(summary = "Actualizar un recordatorio")
    @PutMapping("/{id}")
    public ResponseEntity<RecordatorioResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody RecordatorioRequest request) {

        return ResponseEntity.ok(
                recordatorioService.actualizar(id, request));
    }
    @Operation(summary = "Eliminar un recordatorio")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        recordatorioService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}
