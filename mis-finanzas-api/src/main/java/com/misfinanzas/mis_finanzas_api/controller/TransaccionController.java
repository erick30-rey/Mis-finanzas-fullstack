package com.misfinanzas.mis_finanzas_api.controller;

import com.misfinanzas.mis_finanzas_api.dto.transaccion.TransaccionRequest;
import com.misfinanzas.mis_finanzas_api.dto.transaccion.TransaccionResponse;
import com.misfinanzas.mis_finanzas_api.service.TransaccionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Transacciones",
        description = "Gestión de ingresos y gastos del usuario."
)
@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

    private final TransaccionService transaccionService;

    public TransaccionController(TransaccionService transaccionService) {
        this.transaccionService = transaccionService;
    }
    @Operation(summary = "Obtener todas las transacciones")
    @GetMapping
    public ResponseEntity<List<TransaccionResponse>> obtenerTodas() {
        return ResponseEntity.ok(transaccionService.obtenerTodas());
    }
    @Operation(summary = "Obtener una transacción por ID")
    @GetMapping("/{id}")
    public ResponseEntity<TransaccionResponse> obtenerPorId(
            @PathVariable Integer id) {

        return ResponseEntity.ok(transaccionService.obtenerPorId(id));
    }
    @Operation(summary = "Registrar una transacción")
    @PostMapping
    public ResponseEntity<TransaccionResponse> guardar(
            @Valid @RequestBody TransaccionRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transaccionService.guardar(request));
    }
    @Operation(summary = "Actualizar una transacción")
    @PutMapping("/{id}")
    public ResponseEntity<TransaccionResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody TransaccionRequest request) {

        return ResponseEntity.ok(
                transaccionService.actualizar(id, request));
    }
    @Operation(summary = "Eliminar una transacción")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        transaccionService.eliminar(id);

        return ResponseEntity.noContent().build();
    }

}
