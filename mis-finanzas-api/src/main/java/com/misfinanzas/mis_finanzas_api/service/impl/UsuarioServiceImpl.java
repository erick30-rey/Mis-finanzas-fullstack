package com.misfinanzas.mis_finanzas_api.service.impl;

import com.misfinanzas.mis_finanzas_api.exception.ResourceNotFoundException;
import com.misfinanzas.mis_finanzas_api.entity.Usuario;
import com.misfinanzas.mis_finanzas_api.repository.UsuarioRepository;
import com.misfinanzas.mis_finanzas_api.service.UsuarioService;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findByActivoTrue();
    }

    @Override
    public Usuario obtenerPorId(Integer id) {

        return usuarioRepository.findByIdUsuarioAndActivoTrue(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado"));

    }
    @Override
    public Usuario guardar(Usuario usuario) {
        usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario actualizar(Integer id, Usuario usuario) {

        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        usuarioExistente.setNombre(usuario.getNombre());
        usuarioExistente.setApellido(usuario.getApellido());
        usuarioExistente.setCorreo(usuario.getCorreo());
        usuarioExistente.setPasswordHash(usuario.getPasswordHash());
        usuarioExistente.setActivo(usuario.getActivo());

        return usuarioRepository.save(usuarioExistente);
    }

    @Override
    public void eliminar(Integer id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado"));

        usuario.setActivo(false);

        usuarioRepository.save(usuario);

    }

}
