package com.chazapp.backend.repository;

import com.chazapp.backend.entity.Chaza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChazaRepository
        extends JpaRepository<Chaza, Integer> {

    @Query("""
        SELECT COUNT(c) > 0
        FROM Chaza c
        WHERE c.id_chacero = :idChacero
    """)
    boolean existsChazaByChacero(Integer idChacero);
}