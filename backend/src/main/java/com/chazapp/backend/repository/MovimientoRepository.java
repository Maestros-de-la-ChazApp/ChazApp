package com.chazapp.backend.repository;

import com.chazapp.backend.entity.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovimientoRepository
        extends JpaRepository<Movimiento, Integer> {

    Optional<Movimiento> findTopByIdChazaOrderByFechaHoraDesc(
            Integer idChaza
    );
}