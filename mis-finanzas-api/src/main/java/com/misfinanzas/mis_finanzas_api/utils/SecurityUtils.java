package com.misfinanzas.mis_finanzas_api.utils;

import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import com.misfinanzas.mis_finanzas_api.exception.ResourceNotFoundException;
import com.misfinanzas.mis_finanzas_api.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private final UsuarioRepository usuarioRepository;

    public SecurityUtils(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario getUsuarioAutenticado() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String correo = authentication.getName();

        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado"));
    }

}