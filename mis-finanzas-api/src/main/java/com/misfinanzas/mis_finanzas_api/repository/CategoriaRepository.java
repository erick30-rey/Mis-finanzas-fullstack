package com.misfinanzas.mis_finanzas_api.repository;

import com.misfinanzas.mis_finanzas_api.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    @Query("""
            SELECT c
            FROM Categoria c
            WHERE c.activo = true
            AND (
                c.usuario IS NULL
                OR c.usuario.idUsuario = :idUsuario
            )
            ORDER BY c.nombre
            """)
    List<Categoria> obtenerCategoriasDisponibles(Integer idUsuario);

    @Query("""
            SELECT c
            FROM Categoria c
            WHERE c.idCategoria = :idCategoria
            AND c.activo = true
            AND (
                c.usuario IS NULL
                OR c.usuario.idUsuario = :idUsuario
            )
            """)
    Optional<Categoria> obtenerCategoria(Integer idCategoria,
                                         Integer idUsuario);

    boolean existsByUsuarioIdUsuarioAndNombre(Integer idUsuario,
                                              String nombre);

}
