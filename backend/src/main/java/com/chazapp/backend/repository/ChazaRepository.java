package com.chazapp.backend.repository;

import com.chazapp.backend.entity.Chaza;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChazaRepository
        extends JpaRepository<Chaza, Integer> {

}