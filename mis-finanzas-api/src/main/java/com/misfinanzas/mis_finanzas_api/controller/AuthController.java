package com.misfinanzas.mis_finanzas_api.controller;

import com.misfinanzas.mis_finanzas_api.dto.auth.LoginRequest;
import com.misfinanzas.mis_finanzas_api.dto.auth.LoginResponse;
import com.misfinanzas.mis_finanzas_api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(
        name = "Autenticación",
        description = "Operaciones relacionadas con la autenticación mediante JWT."
)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(
            summary = "Iniciar sesión",
            description = """
                Autentica un usuario mediante su correo y contraseña.
                Si las credenciales son válidas, devuelve un token JWT que
                debe enviarse en el encabezado Authorization para acceder
                a los endpoints protegidos.
                """
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));

    }

}
