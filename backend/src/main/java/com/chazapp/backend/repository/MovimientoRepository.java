package com.chazapp.backend.repository;

import com.chazapp.backend.entity.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimientoRepository
        extends JpaRepository<Movimiento, Integer> {

}