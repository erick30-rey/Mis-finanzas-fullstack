package com.misfinanzas.mis_finanzas_api.service;

import com.misfinanzas.mis_finanzas_api.entity.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    List<Usuario> obtenerTodos();

    Usuario obtenerPorId(Integer id);

    Usuario guardar(Usuario usuario);

    Usuario actualizar(Integer id, Usuario usuario);

    void eliminar(Integer id);

}
