package com.chazapp.backend.repository;

import com.chazapp.backend.entity.Chacero;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChaceroRepository
        extends JpaRepository<Chacero, Integer> {

    Optional<Chacero> findByCedula(String cedula);

    Optional<Chacero> findByCorreoInstitucional(String correoInstitucional);

}