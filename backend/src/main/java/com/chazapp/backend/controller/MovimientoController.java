package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Movimiento;
import com.chazapp.backend.repository.MovimientoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos")

public class MovimientoController {

    @Autowired
    private MovimientoRepository repository;

    @GetMapping
    public List<Movimiento> getAllMovimientos() {
        return repository.findAll();
    }
}