package com.misfinanzas.mis_finanzas_api.controller;

import com.misfinanzas.mis_finanzas_api.dto.categoria.CategoriaRequest;
import com.misfinanzas.mis_finanzas_api.dto.categoria.CategoriaResponse;
import com.misfinanzas.mis_finanzas_api.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Categorías",
        description = "Gestión de categorías del sistema y categorías personalizadas."
)
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @Operation(summary = "Obtener todas las categorías")
    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> obtenerTodas() {

        return ResponseEntity.ok(categoriaService.obtenerTodas());

    }
    @Operation(summary = "Obtener una categoría por ID")
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> obtenerPorId(
            @PathVariable Integer id) {

        return ResponseEntity.ok(categoriaService.obtenerPorId(id));

    }
    @Operation(summary = "Crear una categoría")
    @PostMapping
    public ResponseEntity<CategoriaResponse> guardar(
            @Valid @RequestBody CategoriaRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(categoriaService.guardar(request));

    }
    @Operation(summary = "Actualizar una categoría")
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody CategoriaRequest request) {

        return ResponseEntity.ok(
                categoriaService.actualizar(id, request));

    }
    @Operation(summary = "Eliminar una categoría")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        categoriaService.eliminar(id);

        return ResponseEntity.noContent().build();

    }

}
