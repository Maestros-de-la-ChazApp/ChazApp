package com.chazapp.backend.repository;

import com.chazapp.backend.entity.Chaza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ChazaRepository
        extends JpaRepository<Chaza, Integer> {

    @Query("""
        SELECT COUNT(c) > 0
        FROM Chaza c
        WHERE c.id_chacero = :idChacero
    """)
    boolean existsChazaByChacero(Integer idChacero);

    @Query("""
        SELECT c
        FROM Chaza c
        JOIN Chacero ch ON ch.id_chacero = c.id_chacero
        WHERE ch.correoInstitucional = :correo
    """)
    Optional<Chaza> findByCorreoPropietario(String correo);

    @Query("""
        SELECT c
        FROM Chaza c
        WHERE c.id_chacero = :idChacero
    """)
    Optional<Chaza> findByIdChacero(
            Integer idChacero
    );
}