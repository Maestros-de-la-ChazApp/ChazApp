package com.chazapp.backend.repository;

import com.chazapp.backend.entity.Situacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SituacionRepository
        extends JpaRepository<Situacion, Integer> {

}