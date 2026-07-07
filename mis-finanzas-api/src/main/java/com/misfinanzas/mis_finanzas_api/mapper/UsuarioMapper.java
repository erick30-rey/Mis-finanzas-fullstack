package com.misfinanzas.mis_finanzas_api.mapper;

import org.springframework.stereotype.Component;
import com.misfinanzas.mis_finanzas_api.dto.usuario.UsuarioRequest;
import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import com.misfinanzas.mis_finanzas_api.dto.usuario.UsuarioResponse;

@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRequest request) {

        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setCorreo(request.getCorreo());
        usuario.setPasswordHash(request.getPassword());
        usuario.setActivo(true);

        return usuario;
    }
    public UsuarioResponse toResponse(Usuario usuario) {

        UsuarioResponse response = new UsuarioResponse();

        response.setIdUsuario(usuario.getIdUsuario());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setCorreo(usuario.getCorreo());
        response.setActivo(usuario.getActivo());

        return response;
    }
}
