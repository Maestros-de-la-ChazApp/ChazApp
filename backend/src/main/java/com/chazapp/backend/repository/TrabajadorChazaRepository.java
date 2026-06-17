package com.chazapp.backend.repository;

import com.chazapp.backend.entity.TrabajadorChaza;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrabajadorChazaRepository
        extends JpaRepository<TrabajadorChaza, Integer> {
}