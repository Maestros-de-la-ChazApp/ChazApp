package com.chazapp.backend.repository;

import com.chazapp.backend.entity.TrabajadorChaza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TrabajadorChazaRepository
        extends JpaRepository<TrabajadorChaza, Integer> {

    @Query("""
        SELECT t
        FROM TrabajadorChaza t
        WHERE t.id_chacero = :idChacero
    """)
    Optional<TrabajadorChaza> findByIdChacero(
            Integer idChacero
    );
}