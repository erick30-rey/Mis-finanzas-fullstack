package com.misfinanzas.mis_finanzas_api.service.impl;

import com.misfinanzas.mis_finanzas_api.dto.auth.LoginRequest;
import com.misfinanzas.mis_finanzas_api.dto.auth.LoginResponse;
import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import com.misfinanzas.mis_finanzas_api.exception.ResourceNotFoundException;
import com.misfinanzas.mis_finanzas_api.repository.UsuarioRepository;
import com.misfinanzas.mis_finanzas_api.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.misfinanzas.mis_finanzas_api.security.JwtService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Credenciales incorrectas"));

        if (!usuario.getActivo()) {
            throw new ResourceNotFoundException("Usuario inactivo");
        }

        if (!passwordEncoder.matches(request.getPassword(),
                usuario.getPasswordHash())) {

            throw new ResourceNotFoundException("Credenciales incorrectas");
        }

        String token = jwtService.generateToken(usuario.getCorreo());

        return new LoginResponse(token);
    }

}
