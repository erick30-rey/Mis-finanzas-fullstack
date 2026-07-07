package com.misfinanzas.mis_finanzas_api.controller;

import com.misfinanzas.mis_finanzas_api.service.UsuarioService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import jakarta.validation.Valid;
import com.misfinanzas.mis_finanzas_api.dto.usuario.UsuarioRequest;
import com.misfinanzas.mis_finanzas_api.dto.usuario.UsuarioResponse;
import com.misfinanzas.mis_finanzas_api.mapper.UsuarioMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(
        name = "Usuarios",
        description = "Operaciones relacionadas con la gestión de usuarios."
)
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioMapper usuarioMapper;

    public UsuarioController(
            UsuarioService usuarioService,
            UsuarioMapper usuarioMapper) {

        this.usuarioService = usuarioService;
        this.usuarioMapper = usuarioMapper;
    }
    @Operation(
            summary = "Obtener todos los usuarios"
    )
    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> obtenerTodos() {List<UsuarioResponse> usuarios = usuarioService.obtenerTodos()
            .stream()
            .map(usuarioMapper::toResponse)
            .toList();

        return ResponseEntity.ok(usuarios);
  }
    @Operation(
            summary = "Obtener un usuario por ID"
    )
  @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obtenerPorId(@PathVariable Integer id) {

        Usuario usuario = usuarioService.obtenerPorId(id);

        UsuarioResponse response = usuarioMapper.toResponse(usuario);

        return ResponseEntity.ok(response);
    }
    @Operation(
            summary = "Registrar un nuevo usuario"
    )
    @PostMapping
    public ResponseEntity<UsuarioResponse> guardar(
            @Valid @RequestBody UsuarioRequest request) {

        Usuario usuario = usuarioMapper.toEntity(request);

        Usuario usuarioGuardado = usuarioService.guardar(usuario);

        UsuarioResponse response = usuarioMapper.toResponse(usuarioGuardado);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @Operation(
            summary = "Actualizar un usuario"
    )
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioRequest request) {

        Usuario usuario = usuarioMapper.toEntity(request);

        Usuario usuarioActualizado = usuarioService.actualizar(id, usuario);

        UsuarioResponse response = usuarioMapper.toResponse(usuarioActualizado);

        return ResponseEntity.ok(response);
    }
    @Operation(
            summary = "Eliminar un usuario"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        usuarioService.eliminar(id);

        return ResponseEntity.noContent().build();

    }
}
